import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { EmployeeForm } from "./EmployeeForm"
import { EmployeeFormValues } from "./types"

interface AddEmployeeDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  formData: EmployeeFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof EmployeeFormValues, value: any) => void
  isValid: () => boolean
  isLoading: boolean
  onSubmit: () => void
  resetForm: () => void
}

export function AddEmployeeDialog({ open, setOpen, formData, errors, updateField, isValid, isLoading, onSubmit, resetForm }: AddEmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <EmployeeForm
          formData={formData}
          errors={errors}
          updateField={updateField}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 