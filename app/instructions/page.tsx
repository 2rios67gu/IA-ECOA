"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import {
  Upload,
  FileAudio,
  Settings,
  Play,
  Download,
  CheckCircle,
  AlertCircle,
  Info,
  Mic,
  Headphones,
  Clock,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const steps = [
  {
    id: 1,
    title: "Preparación del Equipo",
    icon: <Settings className="h-6 w-6" />,
    description: "Configura tu equipo de grabación para obtener la mejor calidad de audio",
    details: [
      "Utiliza una grabadora digital de alta calidad (mínimo 44.1 kHz, 16-bit)",
      "Usa un micrófono direccional para reducir ruido de fondo",
      "Verifica que tengas suficiente espacio de almacenamiento",
      "Carga completamente las baterías antes de salir al campo",
    ],
    tips: [
      "Los mejores momentos para grabar son al amanecer y atardecer",
      "Evita días con mucho viento o lluvia",
      "Lleva baterías de repuesto y tarjetas de memoria adicionales",
    ],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    title: "Grabación en Campo",
    icon: <Mic className="h-6 w-6" />,
    description: "Técnicas para realizar grabaciones de alta calidad en el ambiente natural",
    details: [
      "Mantén una distancia de 10-50 metros de la fuente sonora",
      "Graba en sesiones de 5-10 minutos para facilitar el análisis",
      "Documenta la ubicación, hora y condiciones climáticas",
      "Mantén silencio durante la grabación para evitar contaminación acústica",
    ],
    tips: [
      "Usa ropa que no haga ruido al moverse",
      "Apaga dispositivos electrónicos que puedan interferir",
      "Graba algunos minutos de 'silencio' para capturar el ruido de fondo",
    ],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    title: "Verificación de Calidad",
    icon: <Headphones className="h-6 w-6" />,
    description: "Revisa tus grabaciones antes de subirlas a la plataforma",
    details: [
      "Escucha las grabaciones con auriculares de calidad",
      "Verifica que no haya saturación o distorsión",
      "Confirma que las vocalizaciones sean claramente audibles",
      "Elimina secciones con ruido excesivo o interferencias",
    ],
    tips: [
      "Una buena grabación debe tener una relación señal-ruido &gt; 10 dB",
      "Las frecuencias de aves suelen estar entre 1-8 kHz",
      "Guarda copias de seguridad de tus mejores grabaciones",
    ],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    title: "Preparación del Archivo",
    icon: <FileAudio className="h-6 w-6" />,
    description: "Prepara tus archivos de audio para el análisis en la plataforma",
    details: [
      "Convierte a formato WAV o FLAC para mejor calidad",
      "Mantén la frecuencia de muestreo original (no reducir)",
      "Recorta el archivo para incluir solo las secciones relevantes",
      "Nombra el archivo con información descriptiva (fecha, ubicación, especie si es conocida)",
    ],
    tips: [
      "Tamaño máximo recomendado: 50 MB por archivo",
      "Duración óptima: 30 segundos a 5 minutos",
      "Evita comprimir el audio (MP3 de baja calidad)",
    ],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 5,
    title: "Subida a la Plataforma",
    icon: <Upload className="h-6 w-6" />,
    description: "Carga tu archivo en EcoAcústica para generar el espectrograma",
    details: [
      "Inicia sesión en tu cuenta de EcoAcústica",
      "Ve a la sección 'Subir Audio' en la página principal",
      "Selecciona tu archivo de audio preparado",
      "Espera a que se complete la carga y procesamiento",
    ],
    tips: [
      "Una conexión estable es importante para archivos grandes",
      "El procesamiento puede tomar 1-3 minutos dependiendo del tamaño",
      "Puedes subir múltiples archivos secuencialmente",
    ],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 6,
    title: "Análisis del Espectrograma",
    icon: <Play className="h-6 w-6" />,
    description: "Interpreta los resultados del espectrograma generado",
    details: [
      "El espectrograma muestra frecuencia (eje Y) vs tiempo (eje X)",
      "Los colores más intensos indican mayor energía acústica",
      "Busca patrones característicos de vocalizaciones de aves",
      "Identifica llamadas, cantos y otros sonidos del paisaje acústico",
    ],
    tips: [
      "Las aves pequeñas suelen tener frecuencias más altas (&gt;3 kHz)",
      "Los patrones repetitivos suelen indicar cantos territoriales",
      "Ruidos constantes horizontales pueden ser interferencias humanas",
    ],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 7,
    title: "Descarga y Documentación",
    icon: <Download className="h-6 w-6" />,
    description: "Guarda tus resultados y documenta tus hallazgos",
    details: [
      "Descarga el espectrograma en alta resolución",
      "Guarda los metadatos del análisis",
      "Documenta las especies identificadas",
      "Crea un registro de tus observaciones de campo",
    ],
    tips: [
      "Mantén un registro digital de todas tus grabaciones",
      "Incluye coordenadas GPS cuando sea posible",
      "Comparte tus hallazgos con la comunidad científica",
    ],
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default function InstructionsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Guía Paso a Paso</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Aprende cómo realizar grabaciones de campo de alta calidad y procesarlas en nuestra plataforma para obtener
            espectrogramas y análisis de especies.
          </p>
        </div>

        {/* Quick Tips Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-3">
              <Info className="h-6 w-6" />
              Consejos Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Mejor Horario</p>
                  <p className="text-sm text-gray-600">5:30-8:00 AM y 6:00-8:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileAudio className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Formato Ideal</p>
                  <p className="text-sm text-gray-600">WAV 44.1kHz 16-bit</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Tamaño Máximo</p>
                  <p className="text-sm text-gray-600">50 MB por archivo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={step.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    {step.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-green-800">
                      Paso {step.id}: {step.title}
                    </CardTitle>
                    <CardDescription className="text-lg">{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Instrucciones Detalladas
                      </h4>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Consejos Importantes
                      </h4>
                      <div className="space-y-2">
                        {step.tips.map((tip, idx) => (
                          <Badge key={idx} variant="secondary" className="mr-2 mb-2 p-2 text-sm">
                            {tip}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={`Ilustración del ${step.title}`}
                      width={400}
                      height={300}
                      className="w-full rounded-lg object-cover shadow-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Specifications */}
        <Card className="mt-12 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800">Especificaciones Técnicas Recomendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-3">Calidad de Audio</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Frecuencia de muestreo: 44.1 kHz o superior</li>
                  <li>• Resolución: 16-bit mínimo, 24-bit preferible</li>
                  <li>• Formato: WAV, FLAC (sin compresión)</li>
                  <li>• Relación señal-ruido: &gt;10 dB</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-700 mb-3">Equipo Recomendado</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Grabadora digital profesional</li>
                  <li>• Micrófono direccional</li>
                  <li>• Protector de viento (windscreen)</li>
                  <li>• Auriculares de monitoreo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-700 mb-3">Condiciones Ideales</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Viento: &lt;5 km/h</li>
                  <li>• Temperatura: 10-25°C</li>
                  <li>• Humedad: 40-70%</li>
                  <li>• Sin precipitación</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">¿Necesitas Ayuda Adicional?</h3>
            <p className="text-blue-700 mb-4">
              Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta técnica.
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                📧 soporte@ecoacustica.com
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                📱 +1 (555) 123-4567
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
