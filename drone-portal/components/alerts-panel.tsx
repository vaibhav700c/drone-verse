"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, Clock, X, Search, Filter, Download, Bell, BellOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialAlerts = [
  {
    id: 1,
    type: "Critical",
    message: "Drone DR-003 detected gas leak at Pipeline Section C",
    time: "2 minutes ago",
    status: "Active",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: 2,
    type: "Warning",
    message: "Low battery warning for Drone DR-004 (23% remaining)",
    time: "5 minutes ago",
    status: "Active",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 3,
    type: "Info",
    message: "Scheduled maintenance completed for Drone DR-002",
    time: "1 hour ago",
    status: "Resolved",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 4,
    type: "Critical",
    message: "Communication lost with Drone DR-001",
    time: "2 hours ago",
    status: "Resolved",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 5,
    type: "Warning",
    message: "High VOC levels detected in Sector B-2",
    time: "3 hours ago",
    status: "In Progress",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
]

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const { toast } = useToast()

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || alert.type === typeFilter
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "Warning":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Info":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "Critical":
        return "bg-destructive text-destructive-foreground"
      case "Warning":
        return "bg-yellow-500 text-white"
      case "Info":
        return "bg-green-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-destructive text-destructive-foreground"
      case "In Progress":
        return "bg-blue-500 text-white"
      case "Resolved":
        return "bg-green-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const handleAcknowledge = (alertId: number) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "In Progress" } : alert)))
    toast({
      title: "Alert Acknowledged",
      description: "Alert has been acknowledged and marked as in progress.",
    })
  }

  const handleResolve = (alertId: number) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "Resolved" } : alert)))
    toast({
      title: "Alert Resolved",
      description: "Alert has been marked as resolved.",
    })
  }

  const handleDismiss = (alertId: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId))
    toast({
      title: "Alert Dismissed",
      description: "Alert has been removed from the list.",
    })
  }

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Type,Message,Status,Time\n" +
      filteredAlerts
        .map((alert) => `${alert.id},${alert.type},"${alert.message}",${alert.status},${alert.time}`)
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "alerts_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "Alert data has been exported to CSV.",
    })
  }

  const handleClearAll = () => {
    setAlerts(alerts.filter((alert) => alert.status === "Active"))
    toast({
      title: "Alerts Cleared",
      description: "All resolved and in-progress alerts have been cleared.",
    })
  }

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
    toast({
      title: notificationsEnabled ? "Notifications Disabled" : "Notifications Enabled",
      description: `Alert notifications have been ${notificationsEnabled ? "disabled" : "enabled"}.`,
    })
  }

  const criticalCount = alerts.filter((a) => a.type === "Critical" && a.status === "Active").length
  const warningCount = alerts.filter((a) => a.type === "Warning" && a.status === "Active").length
  const resolvedToday = alerts.filter((a) => a.status === "Resolved").length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alert Center</CardTitle>
              <CardDescription>
                Monitor and manage system alerts and notifications ({filteredAlerts.length} alerts)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={toggleNotifications}>
                {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleClearAll}>
                Clear Resolved
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getAlertColor(alert.type)}>{alert.type}</Badge>
                    <Badge variant="outline" className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <div className="flex gap-2">
                  {alert.status === "Active" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)}>
                        Acknowledge
                      </Button>
                      <Button size="sm" onClick={() => handleResolve(alert.id)}>
                        Resolve
                      </Button>
                    </>
                  )}
                  {alert.status === "In Progress" && (
                    <Button size="sm" onClick={() => handleResolve(alert.id)}>
                      Resolve
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleDismiss(alert.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {filteredAlerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>No alerts found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Statistics</CardTitle>
          <CardDescription>Overview of alert activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
              <div className="text-sm text-muted-foreground">Critical Alerts</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-500">{resolvedToday}</div>
              <div className="text-sm text-muted-foreground">Resolved Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
