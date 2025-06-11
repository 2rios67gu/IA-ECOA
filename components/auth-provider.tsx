"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AudioRecord {
  id: string
  fileName: string
  uploadDate: string
  spectrogramUrl: string
  audioUrl: string
  fileSize: number
  duration: number
  location?: {
    lat: number
    lng: number
    address: string
    ecosystem: string
    weather?: string
    temperature?: number
  }
  analysisResults?: {
    species: string
    commonName: string
    confidence: number
    frequency: string
    timeDetected: string[]
  }[]
  tags: string[]
  notes: string
  status: "processing" | "completed" | "error"
  processingSteps: {
    upload: boolean
    spectrogram: boolean
    analysis: boolean
    identification: boolean
  }
}

interface AuthContextType {
  isAuthenticated: boolean
  user: { name: string; email: string; id: string; role: string } | null
  audioHistory: AudioRecord[]
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  addAudioRecord: (record: AudioRecord) => void
  updateAudioRecord: (id: string, updates: Partial<AudioRecord>) => void
  deleteAudioRecord: (id: string) => void
  getAudioRecord: (id: string) => AudioRecord | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; id: string; role: string } | null>(null)
  const [audioHistory, setAudioHistory] = useState<AudioRecord[]>([])

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth")
    if (savedAuth) {
      const authData = JSON.parse(savedAuth)
      setIsAuthenticated(true)
      setUser(authData.user)

      // Cargar historial de audio del usuario
      const savedHistory = localStorage.getItem(`audioHistory_${authData.user.id}`)
      if (savedHistory) {
        setAudioHistory(JSON.parse(savedHistory))
      } else {
        // Generar datos de ejemplo para demostración
        generateSampleData(authData.user.id)
      }
    }
  }, [])

  const generateSampleData = (userId: string) => {
    const sampleData: AudioRecord[] = [
      {
        id: "sample_1",
        fileName: "bosque_amazonico_amanecer.wav",
        uploadDate: new Date(Date.now() - 86400000).toISOString(),
        spectrogramUrl: "/placeholder.svg?height=300&width=600",
        audioUrl: "/placeholder-audio.mp3",
        fileSize: 15728640,
        duration: 180,
        location: {
          lat: -3.4653,
          lng: -62.2159,
          address: "Reserva Nacional Pacaya-Samiria, Perú",
          ecosystem: "Bosque Tropical Húmedo",
          weather: "Parcialmente nublado",
          temperature: 26,
        },
        analysisResults: [
          {
            species: "Turdus migratorius",
            commonName: "Petirrojo Americano",
            confidence: 94.5,
            frequency: "2-8 kHz",
            timeDetected: ["00:15", "01:23", "02:45"],
          },
          {
            species: "Corvus corax",
            commonName: "Cuervo Común",
            confidence: 87.2,
            frequency: "0.5-4 kHz",
            timeDetected: ["00:45", "02:10"],
          },
        ],
        tags: ["amanecer", "bosque", "biodiversidad"],
        notes: "Grabación realizada durante el amanecer en la reserva. Se observó alta actividad de aves.",
        status: "completed",
        processingSteps: {
          upload: true,
          spectrogram: true,
          analysis: true,
          identification: true,
        },
      },
      {
        id: "sample_2",
        fileName: "parque_urbano_tarde.mp3",
        uploadDate: new Date(Date.now() - 172800000).toISOString(),
        spectrogramUrl: "/placeholder.svg?height=300&width=600",
        audioUrl: "/placeholder-audio.mp3",
        fileSize: 8388608,
        duration: 120,
        location: {
          lat: 19.4326,
          lng: -99.1332,
          address: "Parque Chapultepec, Ciudad de México",
          ecosystem: "Parque Urbano",
          weather: "Soleado",
          temperature: 22,
        },
        analysisResults: [
          {
            species: "Cardinalidae cardinalis",
            commonName: "Cardenal Rojo",
            confidence: 91.8,
            frequency: "1.5-6 kHz",
            timeDetected: ["00:30", "01:45"],
          },
        ],
        tags: ["urbano", "tarde", "parque"],
        notes: "Grabación en ambiente urbano con presencia de ruido de fondo moderado.",
        status: "completed",
        processingSteps: {
          upload: true,
          spectrogram: true,
          analysis: true,
          identification: true,
        },
      },
      {
        id: "sample_3",
        fileName: "costa_marina_noche.wav",
        uploadDate: new Date(Date.now() - 259200000).toISOString(),
        spectrogramUrl: "/placeholder.svg?height=300&width=600",
        audioUrl: "/placeholder-audio.mp3",
        fileSize: 25165824,
        duration: 300,
        location: {
          lat: 20.6296,
          lng: -87.0739,
          address: "Reserva de la Biosfera Sian Ka'an, Quintana Roo",
          ecosystem: "Manglar Costero",
          weather: "Despejado",
          temperature: 24,
        },
        analysisResults: [],
        tags: ["nocturno", "costa", "manglar"],
        notes: "Grabación nocturna en zona costera. Análisis en proceso.",
        status: "processing",
        processingSteps: {
          upload: true,
          spectrogram: true,
          analysis: false,
          identification: false,
        },
      },
    ]

    setAudioHistory(sampleData)
    localStorage.setItem(`audioHistory_${userId}`, JSON.stringify(sampleData))
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = [
      {
        email: "admin@ecoacustica.com",
        password: "password123",
        name: "Dr. María González",
        id: "user_1",
        role: "Administradora",
      },
      {
        email: "researcher@ecoacustica.com",
        password: "research123",
        name: "Dr. Carlos Mendoza",
        id: "user_2",
        role: "Investigador",
      },
      {
        email: "student@ecoacustica.com",
        password: "student123",
        name: "Ana Rodríguez",
        id: "user_3",
        role: "Estudiante",
      },
    ]

    const foundUser = users.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = { name: foundUser.name, email: foundUser.email, id: foundUser.id, role: foundUser.role }
      setIsAuthenticated(true)
      setUser(userData)
      localStorage.setItem("auth", JSON.stringify({ user: userData }))

      const savedHistory = localStorage.getItem(`audioHistory_${foundUser.id}`)
      if (savedHistory) {
        setAudioHistory(JSON.parse(savedHistory))
      } else {
        generateSampleData(foundUser.id)
      }

      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setAudioHistory([])
    localStorage.removeItem("auth")
  }

  const addAudioRecord = (record: AudioRecord) => {
    const newHistory = [record, ...audioHistory]
    setAudioHistory(newHistory)
    if (user) {
      localStorage.setItem(`audioHistory_${user.id}`, JSON.stringify(newHistory))
    }
  }

  const updateAudioRecord = (id: string, updates: Partial<AudioRecord>) => {
    const newHistory = audioHistory.map((record) => (record.id === id ? { ...record, ...updates } : record))
    setAudioHistory(newHistory)
    if (user) {
      localStorage.setItem(`audioHistory_${user.id}`, JSON.stringify(newHistory))
    }
  }

  const deleteAudioRecord = (id: string) => {
    const newHistory = audioHistory.filter((record) => record.id !== id)
    setAudioHistory(newHistory)
    if (user) {
      localStorage.setItem(`audioHistory_${user.id}`, JSON.stringify(newHistory))
    }
  }

  const getAudioRecord = (id: string) => {
    return audioHistory.find((record) => record.id === id)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        audioHistory,
        login,
        logout,
        addAudioRecord,
        updateAudioRecord,
        deleteAudioRecord,
        getAudioRecord,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
