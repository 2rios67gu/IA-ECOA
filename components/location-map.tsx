"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Thermometer, Cloud, Trees, Info } from "lucide-react"

interface LocationMapProps {
  location?: {
    lat: number
    lng: number
    address: string
    ecosystem: string
    weather?: string
    temperature?: number
  }
  onLocationSelect?: (location: any) => void
  interactive?: boolean
  height?: string
}

export function LocationMap({ location, onLocationSelect, interactive = false, height = "400px" }: LocationMapProps) {
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position)
          setIsLoadingLocation(false)
          if (onLocationSelect) {
            // Simular datos de ubicación
            onLocationSelect({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: "Ubicación actual",
              ecosystem: "Determinando...",
              weather: "Consultando...",
              temperature: null,
            })
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
        },
      )
    }
  }

  // Simular mapa con imagen placeholder
  const mapUrl = location
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=13&size=600x400&markers=color:red%7C${location.lat},${location.lng}&key=YOUR_API_KEY`
    : "/placeholder.svg?height=400&width=600&text=Mapa+de+Ubicación"

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <MapPin className="h-5 w-5" />
          Ubicación del Paisaje Acústico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mapa */}
        <div className="relative rounded-lg overflow-hidden border-2 border-green-200 bg-gray-100" style={{ height }}>
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `url('${mapUrl}')`,
              backgroundSize: "cover",
            }}
          >
            {/* Overlay con información */}
            {location && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-sm">Ubicación de Grabación</span>
                </div>
                <p className="text-xs text-gray-600">{location.address}</p>
              </div>
            )}

            {/* Marcador simulado */}
            {location && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Botón para obtener ubicación actual */}
          {interactive && (
            <div className="absolute bottom-4 right-4">
              <Button
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                size="sm"
              >
                {isLoadingLocation ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                {isLoadingLocation ? "Obteniendo..." : "Mi Ubicación"}
              </Button>
            </div>
          )}
        </div>

        {/* Información de ubicación */}
        {location && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Dirección</p>
                  <p className="text-xs text-gray-600">{location.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Trees className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Ecosistema</p>
                  <Badge variant="secondary" className="text-xs">
                    {location.ecosystem}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {location.weather && (
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Clima</p>
                    <p className="text-xs text-gray-600">{location.weather}</p>
                  </div>
                </div>
              )}

              {location.temperature && (
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="font-medium text-sm">Temperatura</p>
                    <p className="text-xs text-gray-600">{location.temperature}°C</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coordenadas */}
        {location && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-sm text-gray-700">Coordenadas</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500">Latitud:</span>
                <span className="ml-2 font-mono">{location.lat.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-gray-500">Longitud:</span>
                <span className="ml-2 font-mono">{location.lng.toFixed(6)}</span>
              </div>
            </div>
          </div>
        )}

        {!location && interactive && (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No hay ubicación seleccionada</p>
            <Button onClick={getCurrentLocation} disabled={isLoadingLocation} variant="outline">
              {isLoadingLocation ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
