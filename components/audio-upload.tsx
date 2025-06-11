"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { LocationMap } from "@/components/location-map"
import {
  Upload,
  FileAudio,
  Play,
  Pause,
  Download,
  Trash2,
  Eye,
  Volume2,
  Tag,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface AudioUploadProps {
  onUploadComplete?: (audioRecord: any) => void
}

export function AudioUpload({ onUploadComplete }: AudioUploadProps) {
  const { addAudioRecord } = useAuth()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<"upload" | "spectrogram" | "analysis" | "identification">("upload")
  const [currentAudio, setCurrentAudio] = useState<{
    file: File
    url: string
    spectrogramUrl?: string
    id?: string
    location?: any
    tags: string[]
    notes: string
  } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [newTag, setNewTag] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  const processingSteps = [
    { key: "upload", label: "Subiendo archivo", icon: Upload },
    { key: "spectrogram", label: "Generando espectrograma", icon: Eye },
    { key: "analysis", label: "Analizando audio", icon: Volume2 },
    { key: "identification", label: "Identificando especies", icon: CheckCircle },
  ]

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de audio válido.",
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

    const audioUrl = URL.createObjectURL(file)
    const audioId = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    setCurrentAudio({
      file,
      url: audioUrl,
      id: audioId,
      tags: [],
      notes: "",
    })

    setIsProcessing(true)
    setUploadProgress(0)
    setCurrentStep("upload")

    // Simular proceso de carga y análisis paso a paso
    let progress = 0
    const interval = setInterval(() => {
      progress += 2

      if (progress <= 25) {
        setCurrentStep("upload")
      } else if (progress <= 50) {
        setCurrentStep("spectrogram")
      } else if (progress <= 75) {
        setCurrentStep("analysis")
      } else {
        setCurrentStep("identification")
      }

      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          const spectrogramUrl = "/placeholder.svg?height=300&width=600"
          const audioRecord = {
            id: audioId,
            fileName: file.name,
            uploadDate: new Date().toISOString(),
            spectrogramUrl,
            audioUrl,
            fileSize: file.size,
            duration: 0,
            location: currentAudio?.location,
            analysisResults: [
              {
                species: "Turdus migratorius",
                commonName: "Petirrojo Americano",
                confidence: 94.5,
                frequency: "2-8 kHz",
                timeDetected: ["00:15", "01:23"],
              },
            ],
            tags: currentAudio?.tags || [],
            notes: currentAudio?.notes || "",
            status: "completed" as const,
            processingSteps: {
              upload: true,
              spectrogram: true,
              analysis: true,
              identification: true,
            },
          }

          setCurrentAudio((prev) => (prev ? { ...prev, spectrogramUrl } : null))
          addAudioRecord(audioRecord)
          setIsProcessing(false)

          if (onUploadComplete) {
            onUploadComplete(audioRecord)
          }

          toast({
            title: "¡Análisis Completado!",
            description: "El espectrograma y análisis han sido generados correctamente.",
          })
        }, 1000)
      }
    }, 100)
  }

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const addTag = () => {
    if (newTag.trim() && currentAudio && !currentAudio.tags.includes(newTag.trim())) {
      setCurrentAudio({
        ...currentAudio,
        tags: [...currentAudio.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (currentAudio) {
      setCurrentAudio({
        ...currentAudio,
        tags: currentAudio.tags.filter((tag) => tag !== tagToRemove),
      })
    }
  }

  const handleLocationSelect = (location: any) => {
    if (currentAudio) {
      setCurrentAudio({
        ...currentAudio,
        location,
      })
    }
  }

  const clearAudio = () => {
    if (currentAudio?.url) {
      URL.revokeObjectURL(currentAudio.url)
    }
    setCurrentAudio(null)
    setUploadProgress(0)
    setIsProcessing(false)
    setIsPlaying(false)
    setCurrentStep("upload")
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl text-green-800 flex items-center justify-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Upload className="h-8 w-8 text-green-600" />
            </div>
            Subir Audio para Análisis
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Sube tu grabación de audio y conviértela en un espectrograma para análisis completo
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!currentAudio && (
            <div className="space-y-4">
              <Label htmlFor="audio-file" className="text-lg font-medium text-gray-700">
                Seleccionar archivo de audio
              </Label>
              <div className="relative border-2 border-dashed border-green-300 rounded-lg p-8 hover:border-green-400 transition-colors">
                <Input
                  id="audio-file"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />
                <div className="text-center">
                  <FileAudio className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-green-700 mb-2">
                    Arrastra tu archivo aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-500">Formatos soportados: MP3, WAV, FLAC, M4A (máximo 50MB)</p>
                </div>
              </div>
            </div>
          )}

          {currentAudio && (
            <div className="space-y-6">
              {/* Información del archivo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileAudio className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">{currentAudio.file.name}</p>
                      <p className="text-sm text-blue-600">{(currentAudio.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAudio}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={togglePlayback} className="flex items-center gap-2">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? "Pausar" : "Reproducir"}
                  </Button>
                  <Volume2 className="h-4 w-4 text-gray-500" />
                </div>

                <audio ref={audioRef} src={currentAudio.url} onEnded={() => setIsPlaying(false)} className="hidden" />
              </div>

              {/* Metadatos */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tags */}
                <div className="space-y-3">
                  <Label className="text-lg font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Etiquetas
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Agregar etiqueta..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      className="flex-1"
                    />
                    <Button onClick={addTag} size="sm" variant="outline">
                      Agregar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentAudio.tags.map((tag, index) => (
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

                {/* Notas */}
                <div className="space-y-3">
                  <Label className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notas
                  </Label>
                  <Textarea
                    placeholder="Agregar notas sobre la grabación..."
                    value={currentAudio.notes}
                    onChange={(e) =>
                      setCurrentAudio({
                        ...currentAudio,
                        notes: e.target.value,
                      })
                    }
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Progreso de procesamiento */}
          {isProcessing && (
            <div className="space-y-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-medium text-green-800">Procesando audio...</span>
              </div>

              <Progress value={uploadProgress} className="h-3" />

              {/* Pasos de procesamiento */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {processingSteps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = step.key === currentStep
                  const isCompleted = uploadProgress > (index + 1) * 25

                  return (
                    <div
                      key={step.key}
                      className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-green-100 border border-green-300"
                          : isCompleted
                            ? "bg-blue-100 border border-blue-300"
                            : "bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? "text-green-600" : isCompleted ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isActive ? "text-green-800" : isCompleted ? "text-blue-800" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </span>
                      {isActive && <Clock className="h-3 w-3 text-green-600 animate-pulse ml-auto" />}
                      {isCompleted && <CheckCircle className="h-3 w-3 text-blue-600 ml-auto" />}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Espectrograma generado */}
          {currentAudio?.spectrogramUrl && !isProcessing && (
            <div className="space-y-4 bg-white border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Eye className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-lg font-medium text-green-800">Análisis Completado</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = currentAudio.spectrogramUrl!
                    link.download = `espectrograma_${currentAudio.file.name.split(".")[0]}.png`
                    link.click()
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Descargar
                </Button>
              </div>

              <div className="border-2 border-green-200 rounded-lg overflow-hidden">
                <Image
                  src={currentAudio.spectrogramUrl || "/placeholder.svg"}
                  alt="Espectrograma generado"
                  width={600}
                  height={300}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3">
                <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Ver Análisis Completo
                </Button>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => (window.location.href = "/species-identification")}
                >
                  Identificar Especies
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => (window.location.href = "/history")}
                >
                  Ver en Historial
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mapa de ubicación */}
      {currentAudio && (
        <LocationMap
          location={currentAudio.location}
          onLocationSelect={handleLocationSelect}
          interactive={true}
          height="300px"
        />
      )}
    </div>
  )
}
