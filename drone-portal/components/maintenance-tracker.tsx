"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Wrench, AlertTriangle, CheckCircle, Clock, Plus, Settings, Zap, Cog } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const maintenanceSchedule = [
  {
    id: "M001",
    drone: "DR-001 Falcon Alpha",
    type: "Routine Inspection",
    dueDate: "2024-01-20",
    priority: "Medium",
    status: "Scheduled",
    progress: 0,
    assignedTo: "Tech Team A",
    estimatedHours: 2,
    description: "Monthly routine inspection and diagnostics",
  },
  {
    id: "M002",
    drone: "DR-003 Hawk Gamma",
    type: "Battery Replacement",
    dueDate: "2024-01-18",
    priority: "High",
    status: "In Progress",
    progress: 65,
    assignedTo: "Tech Team B",
    estimatedHours: 4,
    description: "Replace aging battery pack",
  },
  {
    id: "M003",
    drone: "DR-005 Owl Epsilon",
    type: "Propeller Service",
    dueDate: "2024-01-15",
    priority: "Critical",
    status: "Overdue",
    progress: 0,
    assignedTo: "Tech Team A",
    estimatedHours: 3,
    description: "Propeller blade replacement and balancing",
  },
  {
    id: "M004",
    drone: "DR-002 Eagle Beta",
    type: "Software Update",
    dueDate: "2024-01-25",
    priority: "Low",
    status: "Completed",
    progress: 100,
    assignedTo: "Tech Team C",
    estimatedHours: 1,
    description: "Firmware update to latest version",
  },
]

const droneList = [
  "DR-001 Falcon Alpha",
  "DR-002 Eagle Beta",
  "DR-003 Hawk Gamma",
  "DR-004 Raven Delta",
  "DR-005 Owl Epsilon",
  "DR-006 Swift Zeta",
]

const maintenanceTypes = [
  "Routine Inspection",
  "Battery Replacement",
  "Propeller Service",
  "Software Update",
  "Camera Calibration",
  "GPS Calibration",
  "Motor Service",
  "Frame Repair",
  "Sensor Cleaning",
  "Emergency Repair",
]

const techTeams = ["Tech Team A", "Tech Team B", "Tech Team C", "External Contractor"]

export function MaintenanceTracker() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [tasks, setTasks] = useState(maintenanceSchedule)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    drone: "",
    type: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: "",
    estimatedHours: 1,
    description: "",
  })
  const { toast } = useToast()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
      case "Overdue":
        return "bg-destructive text-destructive-foreground"
      case "In Progress":
        return "bg-blue-500 text-white"
      case "Scheduled":
        return "bg-primary text-primary-foreground"
      case "Completed":
        return "bg-green-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Overdue":
        return <AlertTriangle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Scheduled":
        return <CalendarDays className="h-4 w-4" />
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, progress: newStatus === "Completed" ? 100 : task.progress }
          : task,
      ),
    )
    toast({
      title: "Task Updated",
      description: `Maintenance task ${taskId} status updated to ${newStatus}`,
    })
  }

  const overdueCount = tasks.filter((t) => t.status === "Overdue").length
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length
  const scheduledCount = tasks.filter((t) => t.status === "Scheduled").length
  const completedCount = tasks.filter((t) => t.status === "Completed").length

  const scheduleNewTask = () => {
    if (!newTask.drone || !newTask.type || !newTask.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const taskId = `M${String(tasks.length + 1).padStart(3, "0")}`
    const scheduledTask = {
      id: taskId,
      ...newTask,
      status: "Scheduled",
      progress: 0,
    }

    setTasks([...tasks, scheduledTask])
    setNewTask({
      drone: "",
      type: "",
      dueDate: "",
      priority: "Medium",
      assignedTo: "",
      estimatedHours: 1,
      description: "",
    })
    setIsScheduleDialogOpen(false)

    toast({
      title: "Task Scheduled",
      description: `Maintenance task ${taskId} has been scheduled successfully`,
    })
  }

  const rescheduleTask = (taskId: string, newDate: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, dueDate: newDate } : task)))
    toast({
      title: "Task Rescheduled",
      description: `Task ${taskId} has been rescheduled to ${newDate}`,
    })
  }

  const assignTask = (taskId: string, assignee: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, assignedTo: assignee } : task)))
    toast({
      title: "Task Assigned",
      description: `Task ${taskId} has been assigned to ${assignee}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-destructive">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Currently being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Scheduled</span>
            </div>
            <div className="text-2xl font-bold">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground">Upcoming tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Maintenance Schedule & Task Management</CardTitle>
                  <CardDescription>Schedule, assign, and track maintenance tasks</CardDescription>
                </div>
                <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule Maintenance Task</DialogTitle>
                      <DialogDescription>Create a new maintenance task with scheduling details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="drone">Drone *</Label>
                        <Select
                          value={newTask.drone}
                          onValueChange={(value) => setNewTask({ ...newTask, drone: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select drone" />
                          </SelectTrigger>
                          <SelectContent>
                            {droneList.map((drone) => (
                              <SelectItem key={drone} value={drone}>
                                {drone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Maintenance Type *</Label>
                        <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select maintenance type" />
                          </SelectTrigger>
                          <SelectContent>
                            {maintenanceTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date *</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={newTask.priority}
                            onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="assignedTo">Assign To</Label>
                          <Select
                            value={newTask.assignedTo}
                            onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                            <SelectContent>
                              {techTeams.map((team) => (
                                <SelectItem key={team} value={team}>
                                  {team}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="estimatedHours">Est. Hours</Label>
                          <Input
                            id="estimatedHours"
                            type="number"
                            min="1"
                            max="24"
                            value={newTask.estimatedHours}
                            onChange={(e) =>
                              setNewTask({ ...newTask, estimatedHours: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Task description and notes..."
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={scheduleNewTask} className="flex-1">
                          <CalendarDays className="h-4 w-4 mr-2" />
                          Schedule Task
                        </Button>
                        <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Drone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-mono">{task.id}</TableCell>
                      <TableCell className="font-medium">{task.drone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {task.type === "Battery Replacement" && <Zap className="h-4 w-4" />}
                          {task.type === "Software Update" && <Settings className="h-4 w-4" />}
                          {task.type === "Propeller Service" && <Cog className="h-4 w-4" />}
                          <span>{task.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.assignedTo}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)} variant="outline">
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={task.progress} className="w-16" />
                          <span className="text-xs">{task.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {task.status === "Scheduled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateTaskStatus(task.id, "In Progress")}
                            >
                              Start
                            </Button>
                          )}
                          {task.status === "In Progress" && (
                            <Button size="sm" onClick={() => updateTaskStatus(task.id, "Completed")}>
                              Complete
                            </Button>
                          )}
                          {task.status !== "Completed" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newDate = prompt("Enter new due date (YYYY-MM-DD):", task.dueDate)
                                if (newDate) rescheduleTask(task.id, newDate)
                              }}
                            >
                              Reschedule
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Calendar</CardTitle>
            <CardDescription>View scheduled maintenance dates and quick actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Upcoming This Week</h4>
              {tasks
                .filter((t) => t.status !== "Completed")
                .slice(0, 3)
                .map((task) => (
                  <div key={task.id} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                      <div className="font-medium">{task.type}</div>
                      <div className="text-xs text-muted-foreground">{task.drone}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.dueDate}
                    </Badge>
                  </div>
                ))}
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsScheduleDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast({ title: "Export", description: "Maintenance report exported" })}
                >
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
