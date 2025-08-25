"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Search, UserPlus, Edit, Trash2, Shield, Eye, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialUsers = [
  { id: 1, name: "John Smith", email: "john@company.com", role: "Admin", status: "Active", lastLogin: "2 hours ago" },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "Operator",
    status: "Active",
    lastLogin: "1 day ago",
  },
  { id: 3, name: "Mike Chen", email: "mike@company.com", role: "Viewer", status: "Active", lastLogin: "3 hours ago" },
  {
    id: 4,
    name: "Lisa Brown",
    email: "lisa@company.com",
    role: "Operator",
    status: "Inactive",
    lastLogin: "1 week ago",
  },
  { id: 5, name: "David Wilson", email: "david@company.com", role: "Admin", status: "Active", lastLogin: "30 min ago" },
]

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(initialUsers)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Viewer",
    status: "Active",
  })
  const { toast } = useToast()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-primary text-primary-foreground"
      case "Operator":
        return "bg-accent text-accent-foreground"
      case "Viewer":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
  }

  const handleAddUser = () => {
    const userId = Math.max(...users.map((u) => u.id)) + 1
    const user = {
      id: userId,
      ...newUser,
      lastLogin: "Never",
    }
    setUsers([...users, user])
    setNewUser({ name: "", email: "", role: "Viewer", status: "Active" })
    setIsAddDialogOpen(false)
    toast({
      title: "User Added",
      description: `${user.name} has been added to the system.`,
    })
  }

  const handleEditUser = () => {
    setUsers(users.map((user) => (user.id === selectedUser.id ? { ...selectedUser, lastLogin: "Just updated" } : user)))
    setIsEditDialogOpen(false)
    toast({
      title: "User Updated",
      description: `${selectedUser.name} has been updated.`,
    })
  }

  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "User Removed",
      description: `${selectedUser.name} has been removed from the system.`,
      variant: "destructive",
    })
  }

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Name,Email,Role,Status,Last Login\n" +
      users
        .map((user) => `${user.id},${user.name},${user.email},${user.role},${user.status},${user.lastLogin}`)
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "user_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "User data has been exported to CSV.",
    })
  }

  const handleResetPassword = (user: any) => {
    toast({
      title: "Password Reset",
      description: `Password reset email sent to ${user.email}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user access and permissions ({filteredUsers.length} users)</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Add a new user to the system</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., john@company.com"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Operator">Operator</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>
                    Add User
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Operator">Operator</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/abstract-geometric-shapes.png?height=32&width=32&query=${user.name}`} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "User Details",
                          description: `Viewing profile for ${user.name}`,
                        })
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser({ ...user })}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>Update user information</DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="edit-name"
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-role" className="text-right">
                                Role
                              </Label>
                              <Select
                                value={selectedUser.role}
                                onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="Operator">Operator</SelectItem>
                                  <SelectItem value="Viewer">Viewer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-status" className="text-right">
                                Status
                              </Label>
                              <Select
                                value={selectedUser.status}
                                onValueChange={(value) => setSelectedUser({ ...selectedUser, status: value })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleEditUser}>Update User</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => handleResetPassword(user)}>
                      <Shield className="h-3 w-3" />
                    </Button>
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete User</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove {selectedUser?.name} from the system? This action cannot be
                            undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteUser}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <UserPlus className="h-8 w-8 mx-auto mb-2" />
            <p>No users found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
