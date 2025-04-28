"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Edit, Search, Trash2, UserPlus } from "lucide-react"
import { employees, type Employee, formatShortDate, generateId } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function EmployeesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [employeesList, setEmployeesList] = useState<Employee[]>(employees)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    position: "",
    email: "",
    phone: "",
    startDate: new Date().toISOString().split("T")[0],
    salary: 0,
    status: "active",
  })

  const filteredEmployees = employeesList.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = () => {
    const employee: Employee = {
      id: generateId("EMP"),
      name: newEmployee.name || "",
      position: newEmployee.position || "",
      email: newEmployee.email || "",
      phone: newEmployee.phone || "",
      startDate: newEmployee.startDate || new Date().toISOString().split("T")[0],
      salary: newEmployee.salary || 0,
      status: (newEmployee.status as "active" | "inactive") || "active",
      avatar: "/placeholder.svg?height=40&width=40",
    }

    setEmployeesList([...employeesList, employee])
    setIsAddDialogOpen(false)
    setNewEmployee({
      name: "",
      position: "",
      email: "",
      phone: "",
      startDate: new Date().toISOString().split("T")[0],
      salary: 0,
      status: "active",
    })

    toast({
      title: "Empleado agregado",
      description: `${employee.name} ha sido agregado correctamente.`,
    })
  }

  const handleEditEmployee = () => {
    if (!currentEmployee) return

    const updatedEmployees = employeesList.map((emp) => (emp.id === currentEmployee.id ? currentEmployee : emp))

    setEmployeesList(updatedEmployees)
    setIsEditDialogOpen(false)
    setCurrentEmployee(null)

    toast({
      title: "Empleado actualizado",
      description: `La información de ${currentEmployee.name} ha sido actualizada.`,
    })
  }

  const handleDeleteEmployee = (id: string) => {
    const employeeToDelete = employeesList.find((emp) => emp.id === id)
    if (!employeeToDelete) return

    const updatedEmployees = employeesList.filter((emp) => emp.id !== id)
    setEmployeesList(updatedEmployees)

    toast({
      title: "Empleado eliminado",
      description: `${employeeToDelete.name} ha sido eliminado correctamente.`,
      variant: "destructive",
    })
  }

  const openEditDialog = (employee: Employee) => {
    setCurrentEmployee({ ...employee })
    setIsEditDialogOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="animate-in"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
        <p className="text-muted-foreground">Administra la información de los empleados de tu negocio.</p>
      </div>

      <div className="flex items-center justify-between my-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar empleados..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Agregar Empleado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
              <DialogDescription>Ingresa la información del nuevo empleado.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Puesto
                </Label>
                <Input
                  id="position"
                  className="col-span-3"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  className="col-span-3"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Fecha Inicio
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  className="col-span-3"
                  value={newEmployee.startDate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, startDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="salary" className="text-right">
                  Salario
                </Label>
                <Input
                  id="salary"
                  type="number"
                  className="col-span-3"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Estado
                </Label>
                <Select
                  value={newEmployee.status}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, status: value as "active" | "inactive" })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEmployee}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
          <CardDescription>Total de empleados: {employeesList.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No se encontraron empleados
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{formatShortDate(employee.startDate)}</TableCell>
                    <TableCell>${employee.salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                        {employee.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(employee)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(employee.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para editar empleado */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>Actualiza la información del empleado.</DialogDescription>
          </DialogHeader>
          {currentEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={currentEmployee.name}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-position" className="text-right">
                  Puesto
                </Label>
                <Input
                  id="edit-position"
                  className="col-span-3"
                  value={currentEmployee.position}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, position: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  className="col-span-3"
                  value={currentEmployee.email}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="edit-phone"
                  className="col-span-3"
                  value={currentEmployee.phone}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-startDate" className="text-right">
                  Fecha Inicio
                </Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  className="col-span-3"
                  value={currentEmployee.startDate.split("T")[0]}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, startDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-salary" className="text-right">
                  Salario
                </Label>
                <Input
                  id="edit-salary"
                  type="number"
                  className="col-span-3"
                  value={currentEmployee.salary}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, salary: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Estado
                </Label>
                <Select
                  value={currentEmployee.status}
                  onValueChange={(value) =>
                    setCurrentEmployee({ ...currentEmployee, status: value as "active" | "inactive" })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditEmployee}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
