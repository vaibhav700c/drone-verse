"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Search, AlertTriangle, Plus, Eye, Edit, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialReports = [
  {
    id: "RPT-001",
    date: "2024-01-15",
    drone: "DR-001",
    type: "Corrosion",
    severity: "High",
    location: "Pipeline Section A",
    status: "Reviewed",
    inspector: "John Smith",
    description: "Significant corrosion detected on pipeline joint",
    images: 3,
    priority: "High",
  },
  {
    id: "RPT-002",
    date: "2024-01-14",
    drone: "DR-003",
    type: "Crack",
    severity: "Medium",
    location: "Tank B-2",
    status: "Pending",
    inspector: "Sarah Johnson",
    description: "Minor crack observed on tank surface",
    images: 2,
    priority: "Medium",
  },
  {
    id: "RPT-003",
    date: "2024-01-14",
    drone: "DR-002",
    type: "Leak",
    severity: "Critical",
    location: "Valve Station C",
    status: "Action Required",
    inspector: "Mike Davis",
    description: "Active leak detected at valve connection",
    images: 5,
    priority: "Critical",
  },
  {
    id: "RPT-004",
    date: "2024-01-13",
    drone: "DR-004",
    type: "Overheating",
    severity: "Low",
    location: "Compressor D-1",
    status: "Resolved",
    inspector: "Lisa Chen",
    description: "Temperature anomaly resolved after maintenance",
    images: 1,
    priority: "Low",
  },
  {
    id: "RPT-005",
    date: "2024-01-12",
    drone: "DR-005",
    type: "Corrosion",
    severity: "Medium",
    location: "Pipeline Section B",
    status: "In Progress",
    inspector: "Tom Wilson",
    description: "Moderate corrosion requiring monitoring",
    images: 4,
    priority: "Medium",
  },
]

export function InspectionReports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [reports, setReports] = useState(initialReports)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newReport, setNewReport] = useState({
    drone: "",
    type: "Corrosion",
    severity: "Medium",
    location: "",
    description: "",
    inspector: "",
    priority: "Medium",
  })
  const { toast } = useToast()

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || report.severity.toLowerCase() === severityFilter
    return matchesSearch && matchesSeverity
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-destructive text-destructive-foreground"
      case "High":
        return "bg-orange-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-green-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Action Required":
        return "bg-destructive text-destructive-foreground"
      case "Pending":
        return "bg-yellow-500 text-white"
      case "In Progress":
        return "bg-blue-500 text-white"
      case "Reviewed":
        return "bg-primary text-primary-foreground"
      case "Resolved":
        return "bg-green-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const handleDownloadReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Report ID,Date,Drone,Issue Type,Severity,Location,Status,Inspector,Priority,Images\n" +
      filteredReports
        .map(
          (report) =>
            `${report.id},${report.date},${report.drone},${report.type},${report.severity},${report.location},${report.status},${report.inspector},${report.priority},${report.images}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "inspection_reports.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "Inspection reports have been exported to CSV.",
    })
  }

  const handleAddReport = () => {
    const reportId = `RPT-${String(reports.length + 1).padStart(3, "0")}`
    const report = {
      id: reportId,
      date: new Date().toISOString().split("T")[0],
      ...newReport,
      status: "Pending",
      images: Math.floor(Math.random() * 5) + 1,
    }
    setReports([report, ...reports])
    setNewReport({
      drone: "",
      type: "Corrosion",
      severity: "Medium",
      location: "",
      description: "",
      inspector: "",
      priority: "Medium",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Report Created",
      description: `Inspection report ${reportId} has been created.`,
    })
  }

  const handleViewReport = (report: any) => {
    setSelectedReport(report)
    setIsViewDialogOpen(true)
  }

  const handleUpdateStatus = (reportId: string, newStatus: string) => {
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report)))
    toast({
      title: "Status Updated",
      description: `Report ${reportId} status changed to ${newStatus}`,
    })
  }

  const handleScheduleFollowUp = (reportId: string) => {
    toast({
      title: "Follow-up Scheduled",
      description: `Follow-up inspection scheduled for ${reportId}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inspection Reports</CardTitle>
            <CardDescription>Review and manage inspection findings ({filteredReports.length} reports)</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleDownloadReport}>
              <Download className="h-4 w-4" />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Inspection Report</DialogTitle>
                  <DialogDescription>Document a new inspection finding</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-drone">Drone</Label>
                      <Select
                        value={newReport.drone}
                        onValueChange={(value) => setNewReport({ ...newReport, drone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select drone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DR-001">DR-001 - Falcon Alpha</SelectItem>
                          <SelectItem value="DR-002">DR-002 - Eagle Beta</SelectItem>
                          <SelectItem value="DR-003">DR-003 - Hawk Gamma</SelectItem>
                          <SelectItem value="DR-004">DR-004 - Raven Delta</SelectItem>
                          <SelectItem value="DR-005">DR-005 - Owl Epsilon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-inspector">Inspector</Label>
                      <Input
                        id="report-inspector"
                        value={newReport.inspector}
                        onChange={(e) => setNewReport({ ...newReport, inspector: e.target.value })}
                        placeholder="Inspector name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Issue Type</Label>
                      <Select
                        value={newReport.type}
                        onValueChange={(value) => setNewReport({ ...newReport, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Corrosion">Corrosion</SelectItem>
                          <SelectItem value="Crack">Crack</SelectItem>
                          <SelectItem value="Leak">Leak</SelectItem>
                          <SelectItem value="Overheating">Overheating</SelectItem>
                          <SelectItem value="Structural">Structural</SelectItem>
                          <SelectItem value="Electrical">Electrical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-severity">Severity</Label>
                      <Select
                        value={newReport.severity}
                        onValueChange={(value) => setNewReport({ ...newReport, severity: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-priority">Priority</Label>
                      <Select
                        value={newReport.priority}
                        onValueChange={(value) => setNewReport({ ...newReport, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-location">Location</Label>
                    <Input
                      id="report-location"
                      value={newReport.location}
                      onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                      placeholder="e.g., Pipeline Section A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-description">Description</Label>
                    <Textarea
                      id="report-description"
                      value={newReport.description}
                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                      placeholder="Detailed description of the issue..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddReport}
                    disabled={!newReport.drone || !newReport.location || !newReport.inspector}
                  >
                    Create Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Drone</TableHead>
              <TableHead>Issue Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Inspector</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-mono">{report.id}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell className="font-mono">{report.drone}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(report.severity)}>{report.severity}</Badge>
                </TableCell>
                <TableCell>{report.location}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                </TableCell>
                <TableCell className="text-sm">{report.inspector}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleScheduleFollowUp(report.id)}>
                      <Calendar className="h-3 w-3" />
                    </Button>
                    <Select onValueChange={(value) => handleUpdateStatus(report.id, value)}>
                      <SelectTrigger className="w-24 h-8">
                        <Edit className="h-3 w-3" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Reviewed">Reviewed</SelectItem>
                        <SelectItem value="Action Required">Action Required</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>No reports found matching your criteria</p>
          </div>
        )}

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Inspection Report Details</DialogTitle>
              <DialogDescription>
                {selectedReport && `Report ${selectedReport.id} - ${selectedReport.date}`}
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Drone</Label>
                      <p className="font-mono">{selectedReport.drone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Inspector</Label>
                      <p>{selectedReport.inspector}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                      <p>{selectedReport.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Images Captured</Label>
                      <p>{selectedReport.images} images</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Issue Type</Label>
                      <p>{selectedReport.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Severity</Label>
                      <Badge className={getSeverityColor(selectedReport.severity)}>{selectedReport.severity}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge className={getStatusColor(selectedReport.status)}>{selectedReport.status}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                      <Badge className={getSeverityColor(selectedReport.priority)}>{selectedReport.priority}</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="mt-2 p-4 bg-muted rounded-lg">{selectedReport.description}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => selectedReport && handleScheduleFollowUp(selectedReport.id)}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
