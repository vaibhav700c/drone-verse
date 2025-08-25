"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Plus, Play, Pause, Trash2, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialTasks = [
  {
    id: "TSK-001",
    name: "Pipeline Inspection Route A",
    drone: "DR-001",
    type: "Inspection",
    status: "Scheduled",
    startTime: "2024-01-16 09:00",
    duration: "2 hours",
    location: "Pipeline Section A-C",
    priority: "High",
  },
  {
    id: "TSK-002",
    name: "VOC Monitoring Zone B",
    drone: "DR-003",
    type: "Monitoring",
    status: "In Progress",
    startTime: "2024-01-15 14:30",
    duration: "4 hours",
    location: "Industrial Zone B",
    priority: "Medium",
  },
  {
    id: "TSK-003",
    name: "Perimeter Security Patrol",
    drone: "DR-002",
    type: "Security",
    status: "Completed",
    startTime: "2024-01-15 06:00",
    duration: "1 hour",
    location: "Facility Perimeter",
    priority: "Low",
  },
]

export function TaskScheduler() {
  const [tasks, setTasks] = useState(initialTasks)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    name: "",
    drone: "",
    type: "Inspection",
    startTime: "",
    duration: "",
    location: "",
    priority: "Medium",
    description: "",
  })
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-500 text-white"
      case "In Progress":
        return "bg-yellow-500 text-white"
      case "Completed":
        return "bg-green-500 text-white"
      case "Cancelled":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive text-destructive-foreground"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-green-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const handleAddTask = () => {
    const taskId = `TSK-${String(tasks.length + 1).padStart(3, "0")}`
    const task = {
      id: taskId,
      ...newTask,
      status: "Scheduled",
    }
    setTasks([...tasks, task])
    setNewTask({
      name: "",
      drone: "",
      type: "Inspection",
      startTime: "",
      duration: "",
      location: "",
      priority: "Medium",
      description: "",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Task Scheduled",
      description: `${task.name} has been scheduled for ${task.drone}`,
    })
  }

  const handleStartTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "In Progress" } : task)))
    toast({
      title: "Task Started",
      description: "Task execution has begun",
    })
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "Completed" } : task)))
    toast({
      title: "Task Completed",
      description: "Task has been marked as completed",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Scheduler</CardTitle>
            <CardDescription>Schedule and manage drone missions ({tasks.length} tasks)</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Task</DialogTitle>
                <DialogDescription>Create a new mission for your drone fleet</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-name">Task Name</Label>
                    <Input
                      id="task-name"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      placeholder="e.g., Pipeline Inspection"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-drone">Assign Drone</Label>
                    <Select value={newTask.drone} onValueChange={(value) => setNewTask({ ...newTask, drone: value })}>
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
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-type">Task Type</Label>
                    <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inspection">Inspection</SelectItem>
                        <SelectItem value="Monitoring">Monitoring</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Survey">Survey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-duration">Duration</Label>
                    <Input
                      id="task-duration"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                      placeholder="e.g., 2 hours"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-start">Start Time</Label>
                    <Input
                      id="task-start"
                      type="datetime-local"
                      value={newTask.startTime}
                      onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-location">Location</Label>
                    <Input
                      id="task-location"
                      value={newTask.location}
                      onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                      placeholder="e.g., Pipeline Section A"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Additional task details and instructions..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTask} disabled={!newTask.name || !newTask.drone || !newTask.startTime}>
                  Schedule Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{task.name}</h3>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {task.status === "Scheduled" && (
                    <Button size="sm" onClick={() => handleStartTask(task.id)}>
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  )}
                  {task.status === "In Progress" && (
                    <Button size="sm" onClick={() => handleCompleteTask(task.id)}>
                      <Pause className="h-3 w-3 mr-1" />
                      Complete
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {task.startTime}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {task.duration}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {task.location}
                </div>
                <div className="font-mono">Drone: {task.drone}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
