"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search} from "lucide-react"
import { motion } from "framer-motion"
import { Employee } from "./types"
import { useEmployees, useEmployeeForm } from "./hooks"
import { EmployeeTable } from "./EmployeeTable"
import { AddEmployeeDialog } from "./AddEmployeeDialog"
import { EditEmployeeDialog } from "./EditEmployeeDialog"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EmployeeService } from "./service"

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [passwordEmployee, setPasswordEmployee] = useState<Employee | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const { toast } = useToast()

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
    }
  }

  const handleEditEmployee = async () => {
    if (!isEditEmployeeValid()) return;

    try {
      const original = employees.find(emp => emp.id === currentEmployeeId)
      await updateEmployee(currentEmployeeId!, { ...editEmployee, role: original?.role })
      setIsEditDialogOpen(false)
      setCurrentEmployeeId(null)
      resetEditForm()
      setShowPasswordFields(false)
    } catch {
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id)
    } catch {
    }
  }

  const openEditDialog = (employee: Employee) => {
    setCurrentEmployeeId(employee.id)
    updateEditEmployee('name', employee.name)
    updateEditEmployee('userName', employee.userName)
    setShowPasswordFields(false)
    setIsEditDialogOpen(true)
  }

  const handleAskDeleteEmployee = (id: string) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDeleteEmployee = async () => {
    if (deletingId) {
      await handleDeleteEmployee(deletingId)
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  const handleChangePassword = (employee: Employee) => {
    setPasswordEmployee(employee)
    setIsPasswordDialogOpen(true)
    setNewPassword("")
  }

  const handleConfirmChangePassword = async () => {
    if (!passwordEmployee || !newPassword) return
    setIsChangingPassword(true)
    try {
      await EmployeeService.changeEmployeePassword(passwordEmployee.id, newPassword)
      toast({
        title: "Contraseña actualizada",
        description: `La contraseña de ${passwordEmployee.name} fue cambiada exitosamente.`,
      })
      setIsPasswordDialogOpen(false)
      setPasswordEmployee(null)
      setNewPassword("")
    } catch (error: any) {
      toast({
        title: "Error al cambiar contraseña",
        description: error.message || "Ocurrió un error al cambiar la contraseña.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
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
            handleDeleteEmployee={handleAskDeleteEmployee}
            handleChangePassword={handleChangePassword}
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

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDeleteEmployee}
        title="¿Eliminar empleado?"
        description="Esta acción eliminará el empleado permanentemente."
        confirmText="Eliminar empleado"
      />

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
            <DialogDescription>
              Ingresa una nueva contraseña segura para este empleado. Debe contener mayúsculas, minúsculas y un número.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); handleConfirmChangePassword(); }}>
            <div className="space-y-4">
              <p>Empleado: <b>{passwordEmployee?.name}</b></p>
              <Input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setIsPasswordDialogOpen(false)} disabled={isChangingPassword}>Cancelar</Button>
              <Button type="submit" disabled={isChangingPassword || !newPassword}>
                {isChangingPassword ? "Cambiando..." : "Cambiar contraseña"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
