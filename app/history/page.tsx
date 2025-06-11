"use client"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { LocationMap } from "@/components/location-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import {
  History,
  Search,
  Download,
  Trash2,
  Eye,
  FileAudio,
  BarChart3,
  Filter,
  SortAsc,
  SortDesc,
  MapPin,
  Tag,
  Play,
  Pause,
  Bird,
  Clock,
  Edit,
  Save,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function HistoryPage() {
  const { isAuthenticated, audioHistory, deleteAudioRecord, updateAudioRecord } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "processing" | "error">("all")
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)
  const [editingRecord, setEditingRecord] = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState("")
  const [editTags, setEditTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const filteredAndSortedHistory = audioHistory
    .filter((record) => {
      const matchesSearch =
        record.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        record.notes.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === "all" || record.status === filterStatus
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
          break
        case "name":
          comparison = a.fileName.localeCompare(b.fileName)
          break
        case "size":
          comparison = a.fileSize - b.fileSize
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

  const handleDelete = (id: string, fileName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${fileName}"?`)) {
      deleteAudioRecord(id)
      toast({
        title: "Archivo eliminado",
        description: `${fileName} ha sido eliminado de tu historial.`,
      })
    }
  }

  const startEditing = (record: any) => {
    setEditingRecord(record.id)
    setEditNotes(record.notes || "")
    setEditTags([...record.tags])
  }

  const saveEditing = () => {
    if (editingRecord) {
      updateAudioRecord(editingRecord, {
        notes: editNotes,
        tags: editTags,
      })
      setEditingRecord(null)
      toast({
        title: "Cambios guardados",
        description: "Los metadatos han sido actualizados correctamente.",
      })
    }
  }

  const cancelEditing = () => {
    setEditingRecord(null)
    setEditNotes("")
    setEditTags([])
    setNewTag("")
  }

  const addTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove))
  }

  const toggleAudioPlayback = (audioId: string) => {
    if (playingAudio === audioId) {
      setPlayingAudio(null)
    } else {
      setPlayingAudio(audioId)
      // Simular reproducción
      setTimeout(() => setPlayingAudio(null), 3000)
    }
  }

  const downloadSpectrogram = (spectrogramUrl: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = spectrogramUrl
    link.download = `espectrograma_${fileName.split(".")[0]}.png`
    link.click()
  }

  const exportData = () => {
    const dataStr = JSON.stringify(filteredAndSortedHistory, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "historial_ecoacustica.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Procesando</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Desconocido</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <History className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-green-800">Mi Historial de Análisis</h1>
                <p className="text-xl text-gray-700">Gestiona y revisa todos tus análisis de audio y espectrogramas</p>
              </div>
            </div>
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Datos
            </Button>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda Avanzada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, etiquetas o notas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "name" | "size")}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="date">Ordenar por fecha</option>
                <option value="name">Ordenar por nombre</option>
                <option value="size">Ordenar por tamaño</option>
              </select>

              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2"
              >
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                {sortOrder === "asc" ? "Ascendente" : "Descendente"}
              </Button>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todos los estados</option>
                <option value="completed">Completados</option>
                <option value="processing">Procesando</option>
                <option value="error">Con errores</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <FileAudio className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-800 mb-1">{audioHistory.length}</div>
              <div className="text-sm text-green-600">Total de Audios</div>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-800 mb-1">
                {audioHistory.filter((r) => r.status === "completed").length}
              </div>
              <div className="text-sm text-blue-600">Completados</div>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <Bird className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-800 mb-1">
                {audioHistory.reduce((total, record) => total + (record.analysisResults?.length || 0), 0)}
              </div>
              <div className="text-sm text-purple-600">Especies Detectadas</div>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-orange-800 mb-1">
                {audioHistory.filter((r) => r.location).length}
              </div>
              <div className="text-sm text-orange-600">Con Ubicación</div>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-red-800 mb-1">
                {Math.round(audioHistory.reduce((total, record) => total + record.duration, 0) / 60)}
              </div>
              <div className="text-sm text-red-600">Minutos Totales</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista del Historial */}
        {filteredAndSortedHistory.length === 0 ? (
          <Card className="text-center py-16 border-0 shadow-lg">
            <CardContent>
              <FileAudio className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm || filterStatus !== "all" ? "No se encontraron resultados" : "No tienes análisis aún"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Intenta ajustar tus filtros de búsqueda"
                  : "Comienza subiendo tu primer archivo de audio para análisis"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button onClick={() => router.push("/")} className="bg-green-600 hover:bg-green-700">
                  Subir Primer Audio
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedHistory.map((record) => (
              <Card key={record.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Header del registro */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileAudio className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{record.fileName}</h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(record.uploadDate), "dd/MM/yyyy HH:mm", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(record.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Información básica */}
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tamaño:</span>
                        <span className="ml-2 font-medium">{formatFileSize(record.fileSize)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duración:</span>
                        <span className="ml-2 font-medium">
                          {record.duration ? `${Math.round(record.duration)}s` : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Especies:</span>
                        <span className="ml-2 font-medium">{record.analysisResults?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ubicación:</span>
                        <span className="ml-2 font-medium">{record.location ? "Sí" : "No"}</span>
                      </div>
                    </div>

                    {/* Vista expandida */}
                    {selectedRecord === record.id && (
                      <div className="border-t pt-6 space-y-6">
                        <div className="grid lg:grid-cols-2 gap-6">
                          {/* Espectrograma y controles */}
                          <div className="space-y-4">
                            {record.spectrogramUrl && (
                              <div>
                                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                  <BarChart3 className="h-4 w-4" />
                                  Espectrograma
                                </h4>
                                <div className="border-2 border-green-200 rounded-lg overflow-hidden">
                                  <Image
                                    src={record.spectrogramUrl || "/placeholder.svg"}
                                    alt={`Espectrograma de ${record.fileName}`}
                                    width={400}
                                    height={200}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Controles de audio */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAudioPlayback(record.id)}
                                className="flex items-center gap-2"
                              >
                                {playingAudio === record.id ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                                {playingAudio === record.id ? "Pausar" : "Reproducir"}
                              </Button>

                              {record.spectrogramUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadSpectrogram(record.spectrogramUrl!, record.fileName)}
                                  className="flex items-center gap-2"
                                >
                                  <Download className="h-4 w-4" />
                                  Descargar
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/species-identification?audio=${record.id}`)}
                                className="flex items-center gap-2"
                              >
                                <Bird className="h-4 w-4" />
                                Analizar
                              </Button>
                            </div>
                          </div>

                          {/* Metadatos y ubicación */}
                          <div className="space-y-4">
                            {/* Etiquetas y notas */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                                  <Tag className="h-4 w-4" />
                                  Metadatos
                                </h4>
                                {editingRecord !== record.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEditing(record)}
                                    className="flex items-center gap-1"
                                  >
                                    <Edit className="h-3 w-3" />
                                    Editar
                                  </Button>
                                )}
                              </div>

                              {editingRecord === record.id ? (
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Etiquetas:</label>
                                    <div className="flex gap-2 mt-1">
                                      <Input
                                        placeholder="Nueva etiqueta..."
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                                        size="sm"
                                      />
                                      <Button onClick={addTag} size="sm" variant="outline">
                                        +
                                      </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {editTags.map((tag, index) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="cursor-pointer hover:bg-red-100"
                                          onClick={() => removeTag(tag)}
                                        >
                                          {tag} ×
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Notas:</label>
                                    <Textarea
                                      value={editNotes}
                                      onChange={(e) => setEditNotes(e.target.value)}
                                      rows={3}
                                      className="mt-1"
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button onClick={saveEditing} size="sm" className="flex items-center gap-1">
                                      <Save className="h-3 w-3" />
                                      Guardar
                                    </Button>
                                    <Button onClick={cancelEditing} size="sm" variant="outline">
                                      <X className="h-3 w-3" />
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-sm text-gray-500">Etiquetas:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {record.tags.length > 0 ? (
                                        record.tags.map((tag, index) => (
                                          <Badge key={index} variant="secondary">
                                            {tag}
                                          </Badge>
                                        ))
                                      ) : (
                                        <span className="text-sm text-gray-400">Sin etiquetas</span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Notas:</span>
                                    <p className="text-sm text-gray-700 mt-1">
                                      {record.notes || "Sin notas adicionales"}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Especies detectadas */}
                            {record.analysisResults && record.analysisResults.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                  <Bird className="h-4 w-4" />
                                  Especies Detectadas
                                </h4>
                                <div className="space-y-2">
                                  {record.analysisResults.map((species, index) => (
                                    <div key={index} className="bg-blue-50 p-3 rounded-lg">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-blue-800">{species.commonName}</span>
                                        <Badge variant="secondary">{species.confidence}%</Badge>
                                      </div>
                                      <p className="text-sm text-blue-600 italic">{species.species}</p>
                                      <p className="text-xs text-blue-500">
                                        Frecuencia: {species.frequency} | Detectado en:{" "}
                                        {species.timeDetected.join(", ")}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mapa de ubicación */}
                        {record.location && (
                          <div>
                            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Ubicación del Paisaje Acústico
                            </h4>
                            <LocationMap location={record.location} height="250px" />
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/species-identification?audio=${record.id}`)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Ver Análisis Completo
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                            onClick={() => handleDelete(record.id, record.fileName)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
