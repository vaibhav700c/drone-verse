"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, AlertTriangle, Play, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialDrones = [
  {
    id: "DR-001",
    name: "Falcon Alpha",
    location: "Sector A-1",
    battery: 85,
    status: "Active",
    lastSeen: "2 min ago",
    altitude: "150ft",
    speed: "25 mph",
    mission: "Pipeline Inspection",
    flightTime: "2h 15m",
  },
  {
    id: "DR-002",
    name: "Eagle Beta",
    location: "Sector B-2",
    battery: 67,
    status: "Charging",
    lastSeen: "15 min ago",
    altitude: "0ft",
    speed: "0 mph",
    mission: "Standby",
    flightTime: "0h 0m",
  },
  {
    id: "DR-003",
    name: "Hawk Gamma",
    location: "Sector C-3",
    battery: 92,
    status: "Active",
    lastSeen: "1 min ago",
    altitude: "200ft",
    speed: "30 mph",
    mission: "VOC Monitoring",
    flightTime: "1h 45m",
  },
  {
    id: "DR-004",
    name: "Raven Delta",
    location: "Sector A-2",
    battery: 23,
    status: "Low Battery",
    lastSeen: "5 min ago",
    altitude: "50ft",
    speed: "15 mph",
    mission: "Returning to Base",
    flightTime: "3h 20m",
  },
  {
    id: "DR-005",
    name: "Owl Epsilon",
    location: "Sector D-1",
    battery: 78,
    status: "Maintenance",
    lastSeen: "1 hour ago",
    altitude: "0ft",
    speed: "0 mph",
    mission: "Scheduled Maintenance",
    flightTime: "0h 0m",
  },
]

export function DroneTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [drones, setDrones] = useState(initialDrones)
  const [selectedDrone, setSelectedDrone] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [newDrone, setNewDrone] = useState({
    name: "",
    location: "",
    battery: 100,
    status: "Active",
    altitude: "0ft",
    speed: "0 mph",
    mission: "",
    flightTime: "0h 0m",
  })
  const { toast } = useToast()

  const filteredDrones = drones.filter((drone) => {
    const matchesSearch =
      drone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drone.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || drone.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-primary text-primary-foreground"
      case "Charging":
        return "bg-accent text-accent-foreground"
      case "Low Battery":
        return "bg-destructive text-destructive-foreground"
      case "Maintenance":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const handleAddDrone = () => {
    const droneId = `DR-${String(drones.length + 1).padStart(3, "0")}`
    const drone = {
      id: droneId,
      ...newDrone,
      lastSeen: "Just added",
    }
    setDrones([...drones, drone])
    setNewDrone({
      name: "",
      location: "",
      battery: 100,
      status: "Active",
      altitude: "0ft",
      speed: "0 mph",
      mission: "",
      flightTime: "0h 0m",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Drone Added",
      description: `${drone.name} has been added to the fleet.`,
    })
  }

  const handleEditDrone = () => {
    setDrones(
      drones.map((drone) => (drone.id === selectedDrone.id ? { ...selectedDrone, lastSeen: "Just updated" } : drone)),
    )
    setIsEditDialogOpen(false)
    toast({
      title: "Drone Updated",
      description: `${selectedDrone.name} has been updated.`,
    })
  }

  const handleDeleteDrone = () => {
    setDrones(drones.filter((drone) => drone.id !== selectedDrone.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "Drone Removed",
      description: `${selectedDrone.name} has been removed from the fleet.`,
      variant: "destructive",
    })
  }

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Name,Location,Battery,Status,Last Seen,Altitude,Speed,Mission,Flight Time\n" +
      drones
        .map(
          (drone) =>
            `${drone.id},${drone.name},${drone.location},${drone.battery}%,${drone.status},${drone.lastSeen},${drone.altitude},${drone.speed},${drone.mission},${drone.flightTime}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "drone_fleet_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "Drone data has been exported to CSV.",
    })
  }

  const handleReturnToBase = (droneId: string) => {
    setDrones((prev) =>
      prev.map((drone) =>
        drone.id === droneId
          ? { ...drone, status: "Returning", mission: "Return to Base", lastSeen: "Just now" }
          : drone,
      ),
    )
    toast({
      title: "Return Command Sent",
      description: `${droneId} is returning to base`,
    })
  }

  const handleEmergencyLand = (droneId: string) => {
    setDrones((prev) =>
      prev.map((drone) =>
        drone.id === droneId
          ? {
              ...drone,
              status: "Emergency Landing",
              mission: "Emergency Landing",
              speed: "0 mph",
              lastSeen: "Just now",
            }
          : drone,
      ),
    )
    toast({
      title: "Emergency Landing",
      description: `${droneId} executing emergency landing protocol`,
      variant: "destructive",
    })
  }

  const handleStartMission = (droneId: string) => {
    setDrones((prev) =>
      prev.map((drone) =>
        drone.id === droneId ? { ...drone, status: "Active", mission: "New Mission", lastSeen: "Just now" } : drone,
      ),
    )
    toast({
      title: "Mission Started",
      description: `${droneId} mission initiated`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Drone Fleet Management</CardTitle>
            <CardDescription>Monitor and manage your drone fleet ({drones.length} total)</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Charging">Charging</SelectItem>
                <SelectItem value="Low Battery">Low Battery</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Drone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Drone</DialogTitle>
                  <DialogDescription>Add a new drone to your fleet</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newDrone.name}
                      onChange={(e) => setNewDrone({ ...newDrone, name: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Phoenix Alpha"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={newDrone.location}
                      onChange={(e) => setNewDrone({ ...newDrone, location: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Sector E-1"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="battery" className="text-right">
                      Battery
                    </Label>
                    <Input
                      id="battery"
                      type="number"
                      min="0"
                      max="100"
                      value={newDrone.battery}
                      onChange={(e) => setNewDrone({ ...newDrone, battery: Number.parseInt(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={newDrone.status}
                      onValueChange={(value) => setNewDrone({ ...newDrone, status: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Charging">Charging</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="altitude" className="text-right">
                      Altitude
                    </Label>
                    <Input
                      id="altitude"
                      value={newDrone.altitude}
                      onChange={(e) => setNewDrone({ ...newDrone, altitude: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 150ft"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="speed" className="text-right">
                      Speed
                    </Label>
                    <Input
                      id="speed"
                      type="number"
                      min="0"
                      value={newDrone.speed}
                      onChange={(e) => setNewDrone({ ...newDrone, speed: Number.parseInt(e.target.value) })}
                      className="col-span-3"
                      placeholder="e.g., 25 mph"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mission" className="text-right">
                      Mission
                    </Label>
                    <Input
                      id="mission"
                      value={newDrone.mission}
                      onChange={(e) => setNewDrone({ ...newDrone, mission: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Pipeline Inspection"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="flightTime" className="text-right">
                      Flight Time
                    </Label>
                    <Input
                      id="flightTime"
                      value={newDrone.flightTime}
                      onChange={(e) => setNewDrone({ ...newDrone, flightTime: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 2h 15m"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddDrone} disabled={!newDrone.name || !newDrone.location}>
                    Add Drone
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
              placeholder="Search drones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredDrones.length} of {drones.length} drones
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drone ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mission</TableHead>
              <TableHead>Flight Data</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrones.map((drone) => (
              <TableRow key={drone.id}>
                <TableCell className="font-mono">{drone.id}</TableCell>
                <TableCell className="font-medium">{drone.name}</TableCell>
                <TableCell>{drone.location}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          drone.battery > 50 ? "bg-primary" : drone.battery > 25 ? "bg-yellow-500" : "bg-destructive"
                        }`}
                        style={{ width: `${drone.battery}%` }}
                      />
                    </div>
                    <span className="text-sm">{drone.battery}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(drone.status)}>{drone.status}</Badge>
                </TableCell>
                <TableCell className="text-sm">{drone.mission}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div>Alt: {drone.altitude}</div>
                  <div>Speed: {drone.speed}</div>
                  <div>Flight: {drone.flightTime}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartMission(drone.id)}
                      disabled={drone.status === "Maintenance" || drone.status === "Charging"}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReturnToBase(drone.id)}
                      disabled={drone.status !== "Active"}
                    >
                      <Home className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleEmergencyLand(drone.id)}
                      disabled={drone.status !== "Active"}
                    >
                      <AlertTriangle className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDrone(drone)
                        toast({
                          title: "Drone Details",
                          description: `Viewing details for ${drone.name} (${drone.id})`,
                        })
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDrone({ ...drone })}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Drone</DialogTitle>
                          <DialogDescription>Update drone information</DialogDescription>
                        </DialogHeader>
                        {selectedDrone && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="edit-name"
                                value={selectedDrone.name}
                                onChange={(e) => setSelectedDrone({ ...selectedDrone, name: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-location" className="text-right">
                                Location
                              </Label>
                              <Input
                                id="edit-location"
                                value={selectedDrone.location}
                                onChange={(e) => setSelectedDrone({ ...selectedDrone, location: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-battery" className="text-right">
                                Battery
                              </Label>
                              <Input
                                id="edit-battery"
                                type="number"
                                min="0"
                                max="100"
                                value={selectedDrone.battery}
                                onChange={(e) =>
                                  setSelectedDrone({ ...selectedDrone, battery: Number.parseInt(e.target.value) })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-status" className="text-right">
                                Status
                              </Label>
                              <Select
                                value={selectedDrone.status}
                                onValueChange={(value) => setSelectedDrone({ ...selectedDrone, status: value })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Charging">Charging</SelectItem>
                                  <SelectItem value="Low Battery">Low Battery</SelectItem>
                                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-altitude" className="text-right">
                                Altitude
                              </Label>
                              <Input
                                id="edit-altitude"
                                value={selectedDrone.altitude}
                                onChange={(e) => setSelectedDrone({ ...selectedDrone, altitude: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-speed" className="text-right">
                                Speed
                              </Label>
                              <Input
                                id="edit-speed"
                                type="number"
                                min="0"
                                value={selectedDrone.speed}
                                onChange={(e) =>
                                  setSelectedDrone({ ...selectedDrone, speed: Number.parseInt(e.target.value) })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-mission" className="text-right">
                                Mission
                              </Label>
                              <Input
                                id="edit-mission"
                                value={selectedDrone.mission}
                                onChange={(e) => setSelectedDrone({ ...selectedDrone, mission: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-flightTime" className="text-right">
                                Flight Time
                              </Label>
                              <Input
                                id="edit-flightTime"
                                value={selectedDrone.flightTime}
                                onChange={(e) => setSelectedDrone({ ...selectedDrone, flightTime: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleEditDrone}>Update Drone</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDrone(drone)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Drone</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove {selectedDrone?.name} from the fleet? This action cannot be
                            undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteDrone}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Drone
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredDrones.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>No drones found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
