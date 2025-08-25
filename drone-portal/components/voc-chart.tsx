"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, Download } from "lucide-react"

const hourlyData = [
  { time: "00:00", voc: 12, threshold: 20 },
  { time: "04:00", voc: 8, threshold: 20 },
  { time: "08:00", voc: 15, threshold: 20 },
  { time: "12:00", voc: 22, threshold: 20 },
  { time: "16:00", voc: 18, threshold: 20 },
  { time: "20:00", voc: 14, threshold: 20 },
  { time: "24:00", voc: 10, threshold: 20 },
]

const dailyData = [
  { time: "Mon", voc: 15, threshold: 20 },
  { time: "Tue", voc: 18, threshold: 20 },
  { time: "Wed", voc: 22, threshold: 20 },
  { time: "Thu", voc: 16, threshold: 20 },
  { time: "Fri", voc: 19, threshold: 20 },
  { time: "Sat", voc: 12, threshold: 20 },
  { time: "Sun", voc: 14, threshold: 20 },
]

const weeklyData = [
  { time: "Week 1", voc: 16, threshold: 20 },
  { time: "Week 2", voc: 18, threshold: 20 },
  { time: "Week 3", voc: 21, threshold: 20 },
  { time: "Week 4", voc: 17, threshold: 20 },
]

const chartConfig = {
  voc: {
    label: "VOC Levels (PPM)",
    color: "hsl(142, 76%, 36%)", // Using explicit emerald color instead of CSS variable
  },
  threshold: {
    label: "Threshold",
    color: "hsl(0, 84%, 60%)", // Red color for threshold line
  },
}

export function VOCChart() {
  const [timeRange, setTimeRange] = useState<"hourly" | "daily" | "weekly">("hourly")
  const [chartType, setChartType] = useState<"line" | "area">("line")

  const getCurrentData = () => {
    switch (timeRange) {
      case "daily":
        return dailyData
      case "weekly":
        return weeklyData
      default:
        return hourlyData
    }
  }

  const data = getCurrentData()
  const currentVOC = data[data.length - 1]?.voc || 0
  const previousVOC = data[data.length - 2]?.voc || 0
  const trend = currentVOC > previousVOC ? "up" : "down"
  const trendPercentage = previousVOC ? Math.abs(((currentVOC - previousVOC) / previousVOC) * 100).toFixed(1) : 0

  const exportData = () => {
    const csv = [["Time", "VOC Level (PPM)", "Threshold"], ...data.map((item) => [item.time, item.voc, item.threshold])]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `voc-data-${timeRange}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">VOC Levels Trend</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant={chartType === "line" ? "default" : "outline"} size="sm" onClick={() => setChartType("line")}>
            Line
          </Button>
          <Button variant={chartType === "area" ? "default" : "outline"} size="sm" onClick={() => setChartType("area")}>
            Area
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              <span className="text-2xl font-bold">{currentVOC} PPM</span>
              <Badge variant={trend === "up" ? "destructive" : "default"} className="flex items-center gap-1">
                {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trendPercentage}%
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant={timeRange === "hourly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("hourly")}
            >
              24H
            </Button>
            <Button
              variant={timeRange === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("daily")}
            >
              7D
            </Button>
            <Button
              variant={timeRange === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("weekly")}
            >
              4W
            </Button>
          </div>
        </div>

        <div className="w-full h-64 mt-4">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                  <XAxis dataKey="time" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    label={{ value: "PPM", angle: -90, position: "insideLeft" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="voc"
                    stroke="hsl(142, 76%, 36%)"
                    fill="hsl(142, 76%, 36%)"
                    fillOpacity={0.2}
                    strokeWidth={3}
                  />
                  <ReferenceLine
                    y={20}
                    stroke="hsl(0, 84%, 60%)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ value: "Threshold", position: "topRight" }}
                  />
                </AreaChart>
              ) : (
                <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                  <XAxis dataKey="time" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    label={{ value: "PPM", angle: -90, position: "insideLeft" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="voc"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "hsl(142, 76%, 36%)", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="threshold"
                    stroke="hsl(0, 84%, 60%)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
