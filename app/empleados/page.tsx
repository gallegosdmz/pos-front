"use client"

import { useEffect, useState } from "react"
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
import { motion } from "framer-motion"
import { Employee } from "./types"
import { useEmployees, useEmployeeForm } from "./hooks"

const ROLES = {
  Admin: 'Administrador',
  Cajero: 'Cajero'
} as const

export default function EmployeesPage() {
  const {
    employees,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  } = useEmployees()

  const {
    formData: newEmployee,
    updateField: updateNewEmployee,
    resetForm: resetNewEmployeeForm,
    errors: newEmployeeErrors,
    isValid: isNewEmployeeValid
  } = useEmployeeForm()

  const {
    formData: editEmployee,
    updateField: updateEditEmployee,
    resetForm: resetEditForm,
    errors: editEmployeeErrors,
    isValid: isEditEmployeeValid
  } = useEmployeeForm()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null)
  const [showPasswordFields, setShowPasswordFields] = useState(false)

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const handleAddEmployee = async () => {
    if (!isNewEmployeeValid()) return;
    
    try {
      await createEmployee(newEmployee)
      setIsAddDialogOpen(false)
      resetNewEmployeeForm()
    } catch {
      // Error ya manejado por el hook
    }
  }

  const handleEditEmployee = async () => {
    if (!isEditEmployeeValid()) return;

    try {
      await updateEmployee(currentEmployeeId!, editEmployee)
      setIsEditDialogOpen(false)
      setCurrentEmployeeId(null)
      resetEditForm()
      setShowPasswordFields(false)
    } catch {
      // Error ya manejado por el hook
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id)
    } catch {
      // Error ya manejado por el hook
    }
  }

  const openEditDialog = (employee: Employee) => {
    setCurrentEmployeeId(employee.id)
    updateEditEmployee('name', employee.name)
    updateEditEmployee('userName', employee.userName)
    updateEditEmployee('role', employee.role)
    setShowPasswordFields(false)
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
                <div className="col-span-3 space-y-2">
                  <Input
                    id="name"
                    className={newEmployeeErrors.name?.length ? "border-red-500" : ""}
                    value={newEmployee.name}
                    onChange={(e) => updateNewEmployee('name', e.target.value)}
                    placeholder="Ingrese el nombre completo"
                  />
                  {newEmployeeErrors.name?.length > 0 && (
                    <p className="text-sm text-red-500">{newEmployeeErrors.name.join(", ")}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userName" className="text-right">
                  Usuario
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="userName"
                    className={newEmployeeErrors.userName?.length ? "border-red-500" : ""}
                    value={newEmployee.userName}
                    onChange={(e) => updateNewEmployee('userName', e.target.value)}
                    placeholder="Ingrese el nombre de usuario"
                  />
                  {newEmployeeErrors.userName?.length > 0 && (
                    <p className="text-sm text-red-500">{newEmployeeErrors.userName.join(", ")}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Contraseña
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="password"
                    type="password"
                    className={newEmployeeErrors.password?.length ? "border-red-500" : ""}
                    value={newEmployee.password}
                    onChange={(e) => updateNewEmployee('password', e.target.value)}
                    placeholder="Ingrese la contraseña"
                  />
                  {newEmployeeErrors.password?.length > 0 && (
                    <p className="text-sm text-red-500">{newEmployeeErrors.password.join(", ")}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rol
                </Label>
                <div className="col-span-3">
                  <Select
                    value={newEmployee.role}
                    onValueChange={(value) => updateNewEmployee('role', value)}
                  >
                    <SelectTrigger className={newEmployeeErrors.role?.length ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cajero">Cajero</SelectItem>
                      <SelectItem value="Admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  {newEmployeeErrors.role?.length > 0 && (
                    <p className="text-sm text-red-500 mt-2">{newEmployeeErrors.role.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEmployee} disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
          <CardDescription>Total de empleados: {employees.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {isLoading ? "Cargando..." : "No se encontraron empleados"}
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.userName}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <Badge variant={!employee.isDeleted ? "default" : "secondary"}>
                        {!employee.isDeleted ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(employee)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteEmployee(employee.id)}
                          disabled={isLoading}
                        >
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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nombre
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-name"
                  className={editEmployeeErrors.name?.length ? "border-red-500" : ""}
                  value={editEmployee.name}
                  onChange={(e) => updateEditEmployee('name', e.target.value)}
                  placeholder="Ingrese el nombre completo"
                />
                {editEmployeeErrors.name?.length > 0 && (
                  <p className="text-sm text-red-500">{editEmployeeErrors.name.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-userName" className="text-right">
                Usuario
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-userName"
                  className={editEmployeeErrors.userName?.length ? "border-red-500" : ""}
                  value={editEmployee.userName}
                  onChange={(e) => updateEditEmployee('userName', e.target.value)}
                  placeholder="Ingrese el nombre de usuario"
                />
                {editEmployeeErrors.userName?.length > 0 && (
                  <p className="text-sm text-red-500">{editEmployeeErrors.userName.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Rol
              </Label>
              <div className="col-span-3">
                <Select
                  value={editEmployee.role}
                  onValueChange={(value) => updateEditEmployee('role', value)}
                >
                  <SelectTrigger className={editEmployeeErrors.role?.length ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cajero">Cajero</SelectItem>
                    <SelectItem value="Admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                {editEmployeeErrors.role?.length > 0 && (
                  <p className="text-sm text-red-500 mt-2">{editEmployeeErrors.role.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Contraseña
              </Label>
              <div className="col-span-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                >
                  {showPasswordFields ? "Cancelar cambio de contraseña" : "Cambiar contraseña"}
                </Button>
              </div>
            </div>
            {showPasswordFields && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-password" className="text-right">
                  Nueva Contraseña
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="edit-password"
                    type="password"
                    className={editEmployeeErrors.password?.length ? "border-red-500" : ""}
                    value={editEmployee.password}
                    onChange={(e) => updateEditEmployee('password', e.target.value)}
                    placeholder="Ingrese la nueva contraseña"
                  />
                  {editEmployeeErrors.password?.length > 0 && (
                    <p className="text-sm text-red-500">{editEmployeeErrors.password.join(", ")}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setShowPasswordFields(false)
              resetEditForm()
            }}>
              Cancelar
            </Button>
            <Button onClick={handleEditEmployee} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
