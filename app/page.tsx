"use client"
import { Navbar } from "@/components/navbar"
import { AudioUpload } from "@/components/audio-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import {
  AudioWaveformIcon as Waveform,
  Bird,
  Leaf,
  Music,
  BarChart3,
  Zap,
  Users,
  Globe,
  TrendingUp,
  ArrowRight,
  Play,
  Star,
  BookOpen,
  FileAudio,
  Brain,
  Database,
  Mic,
  Volume2,
  Info,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const features = [
  {
    icon: Waveform,
    title: "Análisis Espectral Avanzado",
    description: "Convierte tus audios en representaciones visuales detalladas con tecnología de vanguardia.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Bird,
    title: "Identificación de Especies IA",
    description: "Inteligencia artificial entrenada para identificar más de 15,000 especies de aves.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: BarChart3,
    title: "Segmentación Automática",
    description: "Segmentación inteligente de paisajes sonoros para análisis detallado de ecosistemas.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Zap,
    title: "Procesamiento Rápido",
    description: "Análisis en tiempo real con resultados en menos de 30 segundos.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
]

const stats = [
  { label: "Especies Identificadas", value: "15,000+", icon: Bird },
  { label: "Audios Procesados", value: "500K+", icon: Music },
  { label: "Investigadores Activos", value: "2,500+", icon: Users },
  { label: "Países Participantes", value: "45+", icon: Globe },
]

const testimonials = [
  {
    name: "Dr. María González",
    role: "Bióloga Marina, Universidad Nacional",
    content:
      "EcoAcústica ha revolucionado nuestra investigación. La precisión en la identificación de especies es excepcional.",
    rating: 5,
  },
  {
    name: "Carlos Mendoza",
    role: "Investigador de Biodiversidad",
    content: "La interfaz es intuitiva y los resultados son increíblemente detallados. Una herramienta indispensable.",
    rating: 5,
  },
]

export default function HomePage() {
  const { isAuthenticated, audioHistory } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              Tecnología de Vanguardia en Ecoacústica
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-green-800 via-blue-700 to-emerald-800 bg-clip-text mb-8 leading-tight">
              Descubre la Biodiversidad
              <br />
              <span className="text-5xl md:text-6xl">a través del Sonido</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-10">
              Plataforma avanzada para el análisis de paisajes sonoros mediante inteligencia artificial. Convierte tus
              grabaciones en espectrogramas y descubre la vida que te rodea.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <>
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Comenzar Análisis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Ver Demo
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-green-700 font-medium mb-4">
                    ¡Bienvenido de vuelta! Tienes {audioHistory.length} análisis en tu historial.
                  </p>
                  <Link href="/history">
                    <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      Ver Mi Historial
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <Icon className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* What is Ecoacoustics Section - MOVIDO ANTES DE LA SECCIÓN DE AUDIO */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Info className="h-4 w-4" />
              Ciencia Innovadora
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">¿Qué es la Ecoacústica?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Descubre cómo el estudio de los paisajes sonoros nos ayuda a entender y proteger la biodiversidad
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  La <strong className="text-green-700">ecoacústica</strong> es una disciplina científica emergente que
                  estudia los paisajes sonoros naturales y su relación con la biodiversidad y la salud de los
                  ecosistemas.
                </p>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Aplicaciones Principales:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Monitoreo de biodiversidad sin intervención directa</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Detección de cambios en ecosistemas a lo largo del tiempo</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Identificación de especies por vocalizaciones únicas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Evaluación del impacto de actividades humanas</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Waveform className="h-4 w-4" />
                      Biofonía
                    </h4>
                    <p className="text-sm text-blue-700">Sonidos producidos por organismos vivos</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Geofonía
                    </h4>
                    <p className="text-sm text-green-700">Sonidos naturales no biológicos (viento, lluvia)</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Antropofonía
                    </h4>
                    <p className="text-sm text-purple-700">Sonidos producidos por actividades humanas</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Análisis Espectral
                    </h4>
                    <p className="text-sm text-yellow-700">Visualización de frecuencias sonoras en el tiempo</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/instructions">
                  <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Aprender más sobre Ecoacústica
                  </Button>
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Espectrograma de aves"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-800">Espectrograma en tiempo real</p>
                  <p className="text-xs text-gray-600">Análisis de frecuencias 0-8 kHz</p>
                </div>
              </div>

              {/* Overlay con información técnica */}
              <div className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-xl p-4 max-w-xs border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Tecnología IA</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Nuestros algoritmos analizan más de 200 características acústicas para identificar especies con una
                  precisión del 94.2%
                </p>
              </div>
            </div>
          </div>

          {/* Información adicional sobre paisajes sonoros */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Grabación de Campo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Técnicas especializadas para capturar paisajes sonoros de alta calidad en diversos ecosistemas,
                  minimizando interferencias y ruido ambiental.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Análisis Acústico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Procesamiento de señales para extraer patrones, frecuencias y características temporales que permiten
                  identificar especies y evaluar la salud del ecosistema.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Biblioteca Sonora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Extensa colección de grabaciones de referencia con más de 15,000 especies catalogadas, permitiendo
                  comparaciones precisas para identificación.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Audio Upload Section - AHORA DESPUÉS DE LA SECCIÓN DE ECOACÚSTICA */}
      {isAuthenticated && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <FileAudio className="h-4 w-4" />
                Análisis de Audio
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Sube tu Grabación</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Convierte tus grabaciones de campo en espectrogramas detallados y descubre las especies presentes en tu
                paisaje sonoro
              </p>
            </div>
            <AudioUpload />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Tecnologías Avanzadas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Utilizamos las últimas innovaciones en inteligencia artificial y procesamiento de señales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl text-gray-800 group-hover:text-green-700 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Lo que dicen los Investigadores</h2>
            <p className="text-xl text-gray-600">Testimonios de científicos que confían en nuestra plataforma</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-green-600 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Comienza tu Investigación Ecoacústica</h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
              Únete a la comunidad científica que está revolucionando el monitoreo de biodiversidad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-green-700 hover:text-green-800 bg-white hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  Iniciar Sesión Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/instructions">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
                >
                  Ver Guía Completa
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
