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
import { EmployeeTable } from "./EmployeeTable"
import { AddEmployeeDialog } from "./AddEmployeeDialog"
import { EditEmployeeDialog } from "./EditEmployeeDialog"

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
        <AddEmployeeDialog
          open={isAddDialogOpen}
          setOpen={setIsAddDialogOpen}
          formData={newEmployee}
          errors={newEmployeeErrors}
          updateField={updateNewEmployee}
          isValid={isNewEmployeeValid}
          isLoading={isLoading}
          onSubmit={handleAddEmployee}
          resetForm={resetNewEmployeeForm}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
          <CardDescription>Total de empleados: {employees.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeTable
            employees={employees}
            isLoading={isLoading}
            openEditDialog={openEditDialog}
            handleDeleteEmployee={handleDeleteEmployee}
          />
        </CardContent>
      </Card>

      <EditEmployeeDialog
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
        formData={editEmployee}
        errors={editEmployeeErrors}
        updateField={updateEditEmployee}
        isValid={isEditEmployeeValid}
        isLoading={isLoading}
        onSubmit={handleEditEmployee}
        resetForm={resetEditForm}
        showPasswordFields={showPasswordFields}
        setShowPasswordFields={setShowPasswordFields}
      />
    </motion.div>
  )
}
