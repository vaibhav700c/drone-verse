"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, Settings, User, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const notifications = [
  {
    id: 1,
    type: "alert",
    title: "Low Battery Warning",
    message: "Drone DR-004 battery at 23%",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Mission Completed",
    message: "Inspection of Sector A-1 completed successfully",
    time: "15 min ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Maintenance Scheduled",
    message: "DR-005 scheduled for maintenance tomorrow",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "alert",
    title: "VOC Levels High",
    message: "Elevated VOC detected in Zone B-2",
    time: "2 hours ago",
    read: true,
  },
]

export function NavigationHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [notificationList, setNotificationList] = useState(notifications)
  const { toast } = useToast()

  const unreadCount = notificationList.filter((n) => !n.read).length

  const handleSearch = (query: string) => {
    if (query.trim()) {
      toast({
        title: "Search Results",
        description: `Searching for "${query}" across drones, reports, and locations...`,
      })
      // In a real app, this would trigger actual search functionality
    }
  }

  const markAsRead = (id: number) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })))
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Zap className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          DroneOps Portal
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drones, reports, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchQuery)
              }
            }}
            className="pl-10 w-80"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notificationList.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
                {!notification.read && <div className="h-2 w-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
