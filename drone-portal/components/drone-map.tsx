"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Layers, Satellite } from "lucide-react"

interface DroneMapProps {
  showHeatmap?: boolean
}

interface LeafletModule {
  default: any
  map: any
  tileLayer: any
  circleMarker: any
  circle: any
  Icon: any
  TileLayer: any
}

declare module "leaflet" {
  interface Map {
    _streetLayer?: any
    _satelliteLayer?: any
  }
}

const mockDrones = [
  {
    id: "D001",
    name: "Drone 1 (Alpha)",
    lat: 40.7128,
    lng: -74.006,
    status: "active",
    battery: 85,
    mission: "Environmental Survey",
    altitude: 120,
  },
  {
    id: "D002",
    name: "Drone 2 (Beta)",
    lat: 40.7589,
    lng: -73.9851,
    status: "charging",
    battery: 23,
    mission: "Standby",
    altitude: 0,
  },
  {
    id: "D003",
    name: "Drone 3 (Gamma)",
    lat: 40.7505,
    lng: -73.9934,
    status: "active",
    battery: 67,
    mission: "Traffic Monitoring",
    altitude: 150,
  },
  {
    id: "D004",
    name: "Drone 4 (Delta)",
    lat: 40.7282,
    lng: -73.7949,
    status: "maintenance",
    battery: 0,
    mission: "Maintenance",
    altitude: 0,
  },
  {
    id: "D005",
    name: "Drone 5 (Echo)",
    lat: 40.7614,
    lng: -73.9776,
    status: "active",
    battery: 92,
    mission: "Security Patrol",
    altitude: 100,
  },
  {
    id: "D006",
    name: "Drone 6 (Foxtrot)",
    lat: 40.7831,
    lng: -73.9712,
    status: "returning",
    battery: 45,
    mission: "Package Delivery",
    altitude: 80,
  },
]

const mockHeatmapData = [
  { area: "Zone A - Financial District", voc: 15, color: "bg-green-500", lat: 40.7128, lng: -74.006, size: 800 },
  { area: "Zone B - Times Square", voc: 28, color: "bg-yellow-500", lat: 40.7589, lng: -73.9851, size: 1200 },
  { area: "Zone C - Central Park", voc: 42, color: "bg-red-500", lat: 40.7505, lng: -73.9934, size: 1500 },
  { area: "Zone D - JFK Airport", voc: 8, color: "bg-green-400", lat: 40.7282, lng: -73.7949, size: 2000 },
  { area: "Zone E - Brooklyn Bridge", voc: 35, color: "bg-orange-500", lat: 40.7061, lng: -73.9969, size: 600 },
  { area: "Zone F - Statue of Liberty", voc: 12, color: "bg-green-300", lat: 40.6892, lng: -74.0445, size: 400 },
]

export function DroneMap({ showHeatmap = false }: DroneMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets")
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [L, setL] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)
        }

        const leafletModule = (await import("leaflet")) as LeafletModule
        const leaflet = leafletModule.default || leafletModule

        // Fix default markers
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        setL(leaflet)
        setLeafletLoaded(true)
        return leaflet
      } catch (error) {
        console.error("Error loading Leaflet:", error)
        return null
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!mapRef.current || !L || isMapLoaded) return

    const initMap = async () => {
      try {
        const map = L.map(mapRef.current!, {
          center: [40.7128, -74.006],
          zoom: 11,
          zoomControl: true,
          preferCanvas: true,
        })

        const streetLayer = L.tileLayer(
          `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=iksCwGBudp3Ceg2mZH1t`,
          {
            attribution: "© MapTiler © OpenStreetMap contributors",
            maxZoom: 18,
          },
        )

        const satelliteLayer = L.tileLayer(
          `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=iksCwGBudp3Ceg2mZH1t`,
          {
            attribution: "© MapTiler © OpenStreetMap contributors",
            maxZoom: 18,
          },
        )

        // Add default layer
        if (mapStyle === "streets") {
          streetLayer.addTo(map)
        } else {
          satelliteLayer.addTo(map)
        }

        setTimeout(() => {
          map.invalidateSize()
        }, 100)

        if (!showHeatmap) {
          mockDrones.forEach((drone) => {
            const statusColor =
              drone.status === "active"
                ? "#10b981"
                : drone.status === "charging"
                  ? "#f59e0b"
                  : drone.status === "returning"
                    ? "#3b82f6"
                    : "#ef4444"

            const marker = L.circleMarker([drone.lat, drone.lng], {
              radius: 10,
              fillColor: statusColor,
              color: "#ffffff",
              weight: 3,
              opacity: 1,
              fillOpacity: 0.9,
            }).addTo(map)

            marker.bindPopup(`
              <div class="p-3 min-w-[200px]">
                <div class="font-bold text-lg mb-2">${drone.name}</div>
                <div class="space-y-1">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Status:</span>
                    <span class="text-sm font-medium capitalize">${drone.status}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Battery:</span>
                    <span class="text-sm font-medium">${drone.battery}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Mission:</span>
                    <span class="text-sm font-medium">${drone.mission}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Altitude:</span>
                    <span class="text-sm font-medium">${drone.altitude}m</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Coordinates:</span>
                    <span class="text-sm font-medium">${drone.lat.toFixed(4)}, ${drone.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            `)

            marker.on("click", () => {
              setSelectedDrone(drone.id)
            })
          })
        } else {
          mockHeatmapData.forEach((zone) => {
            const intensity = zone.voc > 30 ? 0.8 : zone.voc > 15 ? 0.6 : 0.4
            const color = zone.voc > 30 ? "#ef4444" : zone.voc > 15 ? "#f59e0b" : "#10b981"

            const circle = L.circle([zone.lat, zone.lng], {
              radius: zone.size,
              fillColor: color,
              color: color,
              weight: 2,
              opacity: 0.8,
              fillOpacity: intensity,
            }).addTo(map)

            circle.bindPopup(`
              <div class="p-3 min-w-[200px]">
                <div class="font-bold text-lg mb-2">${zone.area}</div>
                <div class="space-y-1">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">VOC Level:</span>
                    <span class="text-sm font-medium">${zone.voc} PPM</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Status:</span>
                    <span class="text-sm font-medium ${zone.voc > 30 ? "text-red-600" : zone.voc > 15 ? "text-yellow-600" : "text-green-600"}">
                      ${zone.voc > 30 ? "High Risk" : zone.voc > 15 ? "Moderate" : "Safe"}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Coverage:</span>
                    <span class="text-sm font-medium">${zone.size}m radius</span>
                  </div>
                </div>
              </div>
            `)

            circle.on("click", () => {
              setSelectedZone(zone.area)
            })
          })
        }

        leafletMapRef.current = map
        setIsMapLoaded(true)

        map._streetLayer = streetLayer
        map._satelliteLayer = satelliteLayer
      } catch (error) {
        console.error("Error initializing map:", error)
        setIsMapLoaded(false)
      }
    }

    initMap()

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
        setIsMapLoaded(false)
      }
    }
  }, [showHeatmap, L])

  useEffect(() => {
    if (!leafletMapRef.current || !L || !leafletMapRef.current._streetLayer || !leafletMapRef.current._satelliteLayer)
      return

    const map = leafletMapRef.current

    if (map._streetLayer && map._satelliteLayer) {
      // Remove current tile layer
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer)
        }
      })

      // Add new tile layer
      if (mapStyle === "streets") {
        map._streetLayer.addTo(map)
      } else {
        map._satelliteLayer.addTo(map)
      }
    }
  }, [mapStyle, L])

  if (!isMounted || typeof window === "undefined") {
    return (
      <div className="w-full h-80 rounded-lg relative overflow-hidden border bg-card">
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-sm text-muted-foreground">Loading map...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-80 rounded-lg relative overflow-hidden border bg-card">
      <div className="absolute top-2 right-2 z-[1000] flex gap-1">
        <Button
          variant={mapStyle === "streets" ? "default" : "outline"}
          size="sm"
          onClick={() => setMapStyle("streets")}
          className="h-8 px-2"
        >
          <Layers className="h-3 w-3" />
        </Button>
        <Button
          variant={mapStyle === "satellite" ? "default" : "outline"}
          size="sm"
          onClick={() => setMapStyle("satellite")}
          className="h-8 px-2"
        >
          <Satellite className="h-3 w-3" />
        </Button>
      </div>

      <div ref={mapRef} className="w-full h-full" style={{ minHeight: "320px" }} />

      {/* Loading state */}
      {(!isMapLoaded || !leafletLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-sm text-muted-foreground">
            {!leafletLoaded ? "Loading map library..." : "Initializing map..."}
          </div>
        </div>
      )}

      {/* Selection info overlay */}
      {(selectedDrone || selectedZone) && (
        <div className="absolute bottom-2 left-2 right-2 bg-card/95 backdrop-blur-sm border rounded p-3 z-[1000]">
          {selectedDrone && (
            <div className="space-y-1">
              <div className="text-sm font-medium">
                Selected: {mockDrones.find((d) => d.id === selectedDrone)?.name}
              </div>
              <div className="text-xs text-muted-foreground">
                Mission: {mockDrones.find((d) => d.id === selectedDrone)?.mission} | Battery:{" "}
                {mockDrones.find((d) => d.id === selectedDrone)?.battery}% | Status:{" "}
                {mockDrones.find((d) => d.id === selectedDrone)?.status}
              </div>
            </div>
          )}
          {selectedZone && (
            <div className="space-y-1">
              <div className="text-sm font-medium">Selected: {selectedZone}</div>
              <div className="text-xs text-muted-foreground">
                VOC: {mockHeatmapData.find((z) => z.area === selectedZone)?.voc} PPM | Status: {(() => {
                  const voc = mockHeatmapData.find((z) => z.area === selectedZone)?.voc || 0
                  return voc > 30 ? "High Risk" : voc > 15 ? "Moderate" : "Safe"
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
