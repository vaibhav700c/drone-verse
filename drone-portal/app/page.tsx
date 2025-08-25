"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Battery,
  MapPin,
  AlertTriangle,
  Bone as Drone,
  Users,
  FileText,
  Settings,
  TrendingUp,
  Wrench,
} from "lucide-react"
import { useTheme } from "next-themes"
import { NavigationHeader } from "@/components/navigation-header"
import { DroneMap } from "@/components/drone-map"
import { VOCChart } from "@/components/voc-chart"
import { DroneTable } from "@/components/drone-table"
import { InspectionReports } from "@/components/inspection-reports"
import { UserManagement } from "@/components/user-management"
import { AlertsPanel } from "@/components/alerts-panel"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { MaintenanceTracker } from "@/components/maintenance-tracker"

export default function DashboardPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data
  const stats = {
    activeDrones: 12,
    totalFlightHours: 1247,
    alertsToday: 3,
    batteryAverage: 78,
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      {/* Navigation */}
      <div className="border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="drones" className="flex items-center gap-2">
              <Drone className="h-4 w-4" />
              Drones
            </TabsTrigger>
            <TabsTrigger value="inspections" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Inspections
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Heatmap
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Drones</CardTitle>
                  <Drone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.activeDrones}</div>
                  <p className="text-xs text-muted-foreground">+2 from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Flight Hours</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalFlightHours}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alerts Today</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.alertsToday}</div>
                  <p className="text-xs text-muted-foreground">2 critical, 1 warning</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Battery</CardTitle>
                  <Battery className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.batteryAverage}%</div>
                  <Progress value={stats.batteryAverage} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Charts and Map */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>VOC Levels Trend</CardTitle>
                  <CardDescription>Volatile Organic Compounds over time</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <VOCChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Drone Locations</CardTitle>
                  <CardDescription>Real-time drone positions and status</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 pb-0">
                    <DroneMap />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights Mock */}
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>Predictive analytics and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium">Predicted maintenance required for Drone-07</p>
                    <p className="text-sm text-muted-foreground">Estimated in 3 days based on flight patterns</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="h-2 w-2 bg-accent rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium">Optimal inspection route suggested</p>
                    <p className="text-sm text-muted-foreground">15% efficiency improvement detected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drones">
            <DroneTable />
          </TabsContent>

          <TabsContent value="inspections">
            <InspectionReports />
          </TabsContent>

          <TabsContent value="heatmap">
            <Card>
              <CardHeader>
                <CardTitle>VOC Heatmap</CardTitle>
                <CardDescription>Interactive heatmap showing VOC concentration levels</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 pb-0">
                  <DroneMap showHeatmap />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMetrics />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceTracker />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure your drone management portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Subscription Plan</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Free</CardTitle>
                        <CardDescription>Basic drone monitoring</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$0</div>
                        <p className="text-sm text-muted-foreground">per month</p>
                        <Badge variant="secondary" className="mt-2">
                          Current Plan
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Pro</CardTitle>
                        <CardDescription>Advanced analytics & AI</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$49</div>
                        <p className="text-sm text-muted-foreground">per month</p>
                        <Button className="mt-2 w-full">Upgrade</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Enterprise</CardTitle>
                        <CardDescription>Full fleet management</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$199</div>
                        <p className="text-sm text-muted-foreground">per month</p>
                        <Button className="mt-2 w-full">Contact Sales</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
