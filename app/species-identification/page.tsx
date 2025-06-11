"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { LocationMap } from "@/components/location-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import {
  Upload,
  Bird,
  ImageIcon,
  CheckCircle,
  Play,
  Pause,
  Download,
  Clock,
  BarChart3,
  Zap,
  Eye,
  ArrowRight,
  AudioWaveformIcon as Waveform,
  Brain,
  Database,
  Mic,
  FileAudio,
  Leaf,
  Globe,
  TrendingUp,
  Users,
  BookOpen,
  Lightbulb,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

const SPECIES_DATA = [
  {
    name: "Turdus migratorius",
    commonName: "Petirrojo Americano",
    confidence: 94.5,
    description: "Ave migratoria común en América del Norte, conocida por su pecho rojizo distintivo.",
    habitat: "Bosques, parques urbanos, jardines",
    frequency: "2-8 kHz",
    timeDetected: ["00:15", "01:23", "02:45"],
    image: "/placeholder.svg?height=200&width=300",
    characteristics: [
      "Canto melodioso al amanecer",
      "Llamadas de alarma agudas",
      "Frecuencias dominantes entre 2-4 kHz",
    ],
  },
  {
    name: "Cardinalidae cardinalis",
    commonName: "Cardenal Rojo",
    confidence: 87.2,
    description: "Ave canora con dimorfismo sexual marcado, el macho presenta plumaje rojo brillante.",
    habitat: "Bosques densos, matorrales",
    frequency: "1.5-6 kHz",
    timeDetected: ["00:45", "02:10"],
    image: "/placeholder.svg?height=200&width=300",
    characteristics: [
      "Silbidos claros y fuertes",
      "Repetición de frases musicales",
      "Variaciones estacionales en el canto",
    ],
  },
  {
    name: "Corvus corax",
    commonName: "Cuervo Común",
    confidence: 76.8,
    description: "Ave inteligente de gran tamaño, conocida por su capacidad de imitación vocal.",
    habitat: "Montañas, bosques, áreas urbanas",
    frequency: "0.5-4 kHz",
    timeDetected: ["01:30"],
    image: "/placeholder.svg?height=200&width=300",
    characteristics: ["Graznidos profundos y roncos", "Capacidad de imitación", "Comunicación compleja en grupos"],
  },
]

export default function SpeciesIdentificationPage() {
  const { isAuthenticated, getAudioRecord } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const audioId = searchParams.get("audio")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<typeof SPECIES_DATA | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentAudioRecord, setCurrentAudioRecord] = useState<any>(null)
  const [playingSpecies, setPlayingSpecies] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (audioId && isAuthenticated) {
      const record = getAudioRecord(audioId)
      if (record) {
        setCurrentAudioRecord(record)
        if (record.analysisResults && record.analysisResults.length > 0) {
          setResults(SPECIES_DATA)
        }
      }
    }
  }, [audioId, isAuthenticated, getAudioRecord])

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const handleFileUpload = async (file: File) => {
    const isAudio = file.type.startsWith("audio/")
    const isImage = file.type.startsWith("image/")

    if (!isAudio && !isImage) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de audio o imagen (espectrograma).",
        variant: "destructive",
      })
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "El archivo es demasiado grande. Máximo 50MB.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    setIsProcessing(true)
    setUploadProgress(0)
    setResults(null)

    // Simular proceso de análisis
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setResults(SPECIES_DATA)
            setIsProcessing(false)
            toast({
              title: "¡Análisis Completado!",
              description: "Se han identificado posibles especies en tu grabación.",
            })
          }, 1000)
          return 100
        }
        return prev + 3
      })
    }, 100)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const playSpeciesExample = (speciesName: string) => {
    if (playingSpecies === speciesName) {
      setPlayingSpecies(null)
    } else {
      setPlayingSpecies(speciesName)
      setTimeout(() => setPlayingSpecies(null), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section con información educativa */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf className="h-4 w-4" />
            Tecnología de Vanguardia en Ecoacústica
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-green-800 via-blue-700 to-emerald-800 bg-clip-text mb-6 leading-tight">
            Identificación de Especies
            <br />
            <span className="text-3xl md:text-4xl">por Inteligencia Artificial</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
            Descubre la biodiversidad oculta en tus grabaciones mediante análisis avanzado de paisajes sonoros. Nuestra
            IA identifica especies con precisión científica.
          </p>
        </div>

        {/* Información sobre Ecoacústica - MOVIDO AL INICIO */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800 flex items-center gap-3">
                  <BookOpen className="h-6 w-6" />
                  ¿Qué es la Ecoacústica?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  La <strong className="text-green-700">ecoacústica</strong> es una disciplina científica que estudia
                  los paisajes sonoros naturales y su relación con la biodiversidad y salud de los ecosistemas.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Monitoreo no invasivo de biodiversidad</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Detección de cambios ecosistémicos</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Identificación por vocalizaciones únicas</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Evaluación de impacto ambiental</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800 flex items-center gap-3">
                  <Brain className="h-6 w-6" />
                  Tecnología de IA Avanzada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-blue-800">15,000+</p>
                    <p className="text-sm text-blue-600">Especies en BD</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-800">94.2%</p>
                    <p className="text-sm text-green-600">Precisión</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Nuestro modelo combina redes neuronales convolucionales con análisis espectral para identificar
                  patrones únicos en las vocalizaciones de aves.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-800 flex items-center gap-3">
                  <Globe className="h-6 w-6" />
                  Paisajes Sonoros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Los <strong className="text-purple-700">paisajes sonoros</strong> son el conjunto de todos los sonidos
                  presentes en un ambiente, incluyendo sonidos biológicos, geofísicos y antropogénicos.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Bird className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-800">Biofonía</p>
                      <p className="text-sm text-purple-600">Sonidos de organismos vivos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Waveform className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Geofonía</p>
                      <p className="text-sm text-blue-600">Sonidos naturales no biológicos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-800">Antropofonía</p>
                      <p className="text-sm text-orange-600">Sonidos de actividad humana</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=300&width=500"
                alt="Espectrograma ejemplo"
                width={500}
                height={300}
                className="rounded-2xl shadow-xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm font-medium text-gray-800">Espectrograma en tiempo real</p>
                <p className="text-xs text-gray-600">Análisis de frecuencias 0-8 kHz</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información del audio cargado desde historial */}
        {currentAudioRecord && (
          <Card className="mb-8 shadow-xl border-0 bg-gradient-to-r from-blue-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Eye className="h-5 w-5" />
                Analizando: {currentAudioRecord.fileName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Fecha:</strong> {new Date(currentAudioRecord.uploadDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Duración:</strong> {Math.round(currentAudioRecord.duration)}s
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Tamaño:</strong> {(currentAudioRecord.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {currentAudioRecord.location && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Ubicación:</strong> {currentAudioRecord.location.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Ecosistema:</strong> {currentAudioRecord.location.ecosystem}
                    </p>
                    {currentAudioRecord.location.temperature && (
                      <p className="text-sm text-gray-600">
                        <strong>Temperatura:</strong> {currentAudioRecord.location.temperature}°C
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Etiquetas:</strong>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {currentAudioRecord.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {currentAudioRecord.spectrogramUrl && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-3">Espectrograma</h4>
                  <div className="border-2 border-blue-200 rounded-lg overflow-hidden">
                    <Image
                      src={currentAudioRecord.spectrogramUrl || "/placeholder.svg"}
                      alt="Espectrograma del audio"
                      width={800}
                      height={300}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* INTERFAZ DE SUBIDA MEJORADA */}
        {!currentAudioRecord && (
          <Card className="mb-12 shadow-2xl border-0 bg-gradient-to-br from-white via-green-50 to-blue-50">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl text-green-800 flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Upload className="h-8 w-8 text-green-600" />
                </div>
                Subir Audio para Análisis
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Arrastra tu archivo o haz clic para seleccionar. Acepta audio (MP3, WAV, FLAC) o espectrogramas (PNG,
                JPG)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Zona de arrastre mejorada */}
              <div
                className={`relative border-3 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer ${
                  isDragOver
                    ? "border-green-400 bg-green-50 scale-105"
                    : "border-green-300 hover:border-green-400 hover:bg-green-50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById("species-file")?.click()}
              >
                <input
                  id="species-file"
                  type="file"
                  accept="audio/*,image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  disabled={isProcessing}
                />

                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div
                      className={`p-6 rounded-full transition-all duration-300 ${
                        isDragOver ? "bg-green-200 scale-110" : "bg-green-100"
                      }`}
                    >
                      <FileAudio
                        className={`h-16 w-16 transition-colors duration-300 ${
                          isDragOver ? "text-green-700" : "text-green-600"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      {isDragOver ? "¡Suelta tu archivo aquí!" : "Arrastra tu archivo aquí"}
                    </h3>
                    <p className="text-lg text-gray-600 mb-4">o haz clic para seleccionar desde tu dispositivo</p>

                    <div className="flex justify-center">
                      <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={isProcessing}
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        Seleccionar Archivo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Indicadores de formato */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mic className="h-4 w-4" />
                      <span>MP3, WAV, FLAC</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      <span>PNG, JPG</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="h-4 w-4" />
                      <span>Máx. 50MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del archivo seleccionado */}
              {selectedFile && (
                <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileAudio className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-800 text-lg">{selectedFile.name}</p>
                          <p className="text-blue-600">
                            {selectedFile.type.startsWith("audio/") ? "Archivo de Audio" : "Imagen de Espectrograma"} •{" "}
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">✓ Archivo válido</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Progreso de procesamiento mejorado */}
              {isProcessing && (
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-2xl font-bold text-green-800">Analizando con IA...</span>
                      </div>

                      <Progress value={uploadProgress} className="h-4" />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Subiendo", icon: Upload, threshold: 25 },
                          { label: "Espectrograma", icon: BarChart3, threshold: 50 },
                          { label: "Analizando", icon: Brain, threshold: 75 },
                          { label: "Identificando", icon: Bird, threshold: 100 },
                        ].map((step, index) => {
                          const Icon = step.icon
                          const isActive = uploadProgress >= step.threshold - 25 && uploadProgress < step.threshold
                          const isCompleted = uploadProgress >= step.threshold

                          return (
                            <div
                              key={index}
                              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                                isActive
                                  ? "bg-green-100 border-2 border-green-300 scale-105"
                                  : isCompleted
                                    ? "bg-blue-100 border-2 border-blue-300"
                                    : "bg-gray-100 border-2 border-gray-200"
                              }`}
                            >
                              <Icon
                                className={`h-6 w-6 ${
                                  isActive
                                    ? "text-green-600 animate-pulse"
                                    : isCompleted
                                      ? "text-blue-600"
                                      : "text-gray-400"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  isActive ? "text-green-800" : isCompleted ? "text-blue-800" : "text-gray-500"
                                }`}
                              >
                                {step.label}
                              </span>
                              {isCompleted && <CheckCircle className="h-4 w-4 text-blue-600" />}
                            </div>
                          )
                        })}
                      </div>

                      <p className="text-lg text-gray-600">
                        {uploadProgress < 25
                          ? "Procesando archivo de audio..."
                          : uploadProgress < 50
                            ? "Generando representación visual..."
                            : uploadProgress < 75
                              ? "Extrayendo características acústicas..."
                              : "Comparando con base de datos de especies..."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Consejos mientras se procesa */}
              {isProcessing && (
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-6 w-6 text-yellow-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-2">💡 Mientras esperas...</h4>
                        <p className="text-yellow-700 text-sm">
                          Nuestro algoritmo está analizando más de 200 características acústicas diferentes, incluyendo
                          frecuencia fundamental, armónicos, modulación temporal y patrones espectrales únicos de cada
                          especie.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Section - MANTENIDO IGUAL */}
        {results && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h2 className="text-3xl font-bold text-green-800">Resultados de Identificación</h2>
                  <p className="text-gray-600">Especies detectadas con alta confianza</p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/history")}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                Ver en Historial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Mapa de ubicación si está disponible */}
            {currentAudioRecord?.location && (
              <div className="mb-8">
                <LocationMap location={currentAudioRecord.location} height="350px" />
              </div>
            )}

            <div className="grid gap-8">
              {results.map((species, index) => (
                <Card key={index} className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-4 gap-8">
                      <div className="lg:col-span-1">
                        <div className="relative group">
                          <Image
                            src={species.image || "/placeholder.svg"}
                            alt={species.commonName}
                            width={300}
                            height={200}
                            className="w-full rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                        </div>
                      </div>

                      <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-3xl font-bold text-green-800 mb-2">{species.commonName}</h3>
                            <p className="text-xl italic text-gray-600 mb-4">{species.name}</p>
                          </div>
                          <Badge
                            variant={
                              species.confidence > 90 ? "default" : species.confidence > 80 ? "secondary" : "outline"
                            }
                            className="text-xl px-4 py-2"
                          >
                            {species.confidence}% confianza
                          </Badge>
                        </div>

                        <p className="text-gray-700 leading-relaxed text-lg">{species.description}</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-green-700 flex items-center gap-2 text-lg">
                              <Bird className="h-5 w-5" />
                              Hábitat
                            </h4>
                            <p className="text-gray-600">{species.habitat}</p>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-green-700 flex items-center gap-2 text-lg">
                              <BarChart3 className="h-5 w-5" />
                              Rango de Frecuencia
                            </h4>
                            <p className="text-gray-600">{species.frequency}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-green-700 flex items-center gap-2 text-lg">
                            <Clock className="h-5 w-5" />
                            Momentos Detectados
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {species.timeDetected.map((time, timeIndex) => (
                              <Badge key={timeIndex} variant="outline" className="text-sm px-3 py-1">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-green-700 flex items-center gap-2 text-lg">
                            <Zap className="h-5 w-5" />
                            Características Acústicas
                          </h4>
                          <ul className="list-disc list-inside text-gray-600 space-y-2">
                            {species.characteristics.map((char, charIndex) => (
                              <li key={charIndex} className="text-base">
                                {char}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-4 pt-6">
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => playSpeciesExample(species.name)}
                            className="flex items-center gap-2"
                          >
                            {playingSpecies === species.name ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                            {playingSpecies === species.name ? "Pausar" : "Escuchar"} Ejemplo
                          </Button>
                          <Button variant="outline" size="lg" className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Ver Espectrograma
                          </Button>
                          <Button variant="outline" size="lg" className="flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Descargar Reporte
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-blue-800 mb-6">Información del Análisis</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <p className="flex justify-between">
                      <strong>Modelo utilizado:</strong> <span>CNN + ML Híbrido v2.1</span>
                    </p>
                    <p className="flex justify-between">
                      <strong>Base de datos:</strong> <span>15,000+ especies</span>
                    </p>
                    <p className="flex justify-between">
                      <strong>Algoritmo:</strong> <span>Análisis espectral + Deep Learning</span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="flex justify-between">
                      <strong>Tiempo de procesamiento:</strong> <span>12.3 segundos</span>
                    </p>
                    <p className="flex justify-between">
                      <strong>Región de análisis:</strong> <span>América del Norte</span>
                    </p>
                    <p className="flex justify-between">
                      <strong>Precisión promedio:</strong> <span>94.2%</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
