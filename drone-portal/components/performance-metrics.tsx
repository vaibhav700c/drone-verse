"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Zap, Fuel, Target, Download } from "lucide-react"

const efficiencyData = [
  { day: "Mon", efficiency: 87, fuel: 45, missions: 12, flightTime: 8.5, distance: 245 },
  { day: "Tue", efficiency: 92, fuel: 38, missions: 15, flightTime: 9.2, distance: 312 },
  { day: "Wed", efficiency: 85, fuel: 52, missions: 10, flightTime: 7.8, distance: 198 },
  { day: "Thu", efficiency: 94, fuel: 35, missions: 18, flightTime: 10.1, distance: 387 },
  { day: "Fri", efficiency: 89, fuel: 42, missions: 14, flightTime: 8.9, distance: 276 },
  { day: "Sat", efficiency: 91, fuel: 40, missions: 16, flightTime: 9.5, distance: 298 },
  { day: "Sun", efficiency: 88, fuel: 47, missions: 11, flightTime: 8.2, distance: 234 },
]

const missionData = [
  { name: "Successful", value: 85, color: "#10b981" },
  { name: "Partial", value: 12, color: "#f59e0b" },
  { name: "Failed", value: 3, color: "#ef4444" },
]

const chartConfig = {
  efficiency: { label: "Efficiency %", color: "hsl(142, 76%, 36%)" },
  fuel: { label: "Fuel Usage", color: "hsl(217, 91%, 60%)" },
  missions: { label: "Missions", color: "hsl(262, 83%, 58%)" },
}

export function PerformanceMetrics() {
  const [activeMetric, setActiveMetric] = useState("efficiency")
  const [realTimeData, setRealTimeData] = useState({
    activeDrones: 4,
    totalFlightTime: 62.2,
    avgSpeed: 45.8,
    weatherCondition: "Clear",
    windSpeed: 12,
    temperature: 22,
  })
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refreshData = () => {
    setRealTimeData((prev) => ({
      ...prev,
      activeDrones: Math.floor(Math.random() * 2) + 3,
      totalFlightTime: prev.totalFlightTime + Math.random() * 0.5,
      avgSpeed: 45 + Math.random() * 10,
      windSpeed: 10 + Math.random() * 8,
    }))
    setLastUpdated(new Date())
  }

  const exportData = () => {
    const csv = [
      ["Day", "Efficiency %", "Fuel Usage", "Missions", "Flight Time", "Distance"],
      ...efficiencyData.map((item) => [
        item.day,
        item.efficiency,
        item.fuel,
        item.missions,
        item.flightTime,
        item.distance,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "performance-metrics.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>Real-time fleet performance and efficiency metrics</CardDescription>
          </div>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <span>
                Active Drones: <strong>{realTimeData.activeDrones}</strong>
              </span>
              <span>
                Weather: <strong>{realTimeData.weatherCondition}</strong>
              </span>
              <span>
                Wind: <strong>{realTimeData.windSpeed} km/h</strong>
              </span>
              <span>
                Temp: <strong>{realTimeData.temperature}°C</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Updated: {lastUpdated.toLocaleTimeString()}</span>
              <Button variant="outline" size="sm" onClick={refreshData}>
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">Avg Efficiency</span>
                </div>
                <div className="text-2xl font-bold">89.4%</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600">+2.3%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Flight Time: {realTimeData.totalFlightTime.toFixed(1)}h
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Fuel Usage</span>
                </div>
                <div className="text-2xl font-bold">42.7L</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingDown className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600">-5.2%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Efficiency: 2.8L/100km</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Mission Success</span>
                </div>
                <div className="text-2xl font-bold">85%</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600">+1.8%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Avg Time: 2.4h</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Avg Speed</span>
                </div>
                <div className="text-2xl font-bold">{realTimeData.avgSpeed.toFixed(1)} km/h</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600">+4.2%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Total: 1,950km</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeMetric} onValueChange={setActiveMetric}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="efficiency">Efficiency Trends</TabsTrigger>
              <TabsTrigger value="fuel">Fuel Analysis</TabsTrigger>
              <TabsTrigger value="missions">Mission Success</TabsTrigger>
            </TabsList>

            <TabsContent value="efficiency" className="mt-6">
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                    <XAxis dataKey="day" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={3}
                      dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="fuel" className="mt-6">
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                    <XAxis dataKey="day" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="fuel" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="missions" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={missionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {missionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="space-y-4">
                  {missionData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <Badge variant="outline">{item.value}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
