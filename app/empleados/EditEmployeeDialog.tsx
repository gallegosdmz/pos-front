import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EmployeeForm } from "./EmployeeForm"
import { EmployeeFormValues } from "./types"

interface EditEmployeeDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  formData: EmployeeFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof EmployeeFormValues, value: any) => void
  isValid: () => boolean
  isLoading: boolean
  onSubmit: () => void
  resetForm: () => void
  showPasswordFields: boolean
  setShowPasswordFields: (show: boolean) => void
}

export function EditEmployeeDialog({ open, setOpen, formData, errors, updateField, isValid, isLoading, onSubmit, resetForm, showPasswordFields, setShowPasswordFields }: EditEmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Empleado</DialogTitle>
          <DialogDescription>Actualiza la información del empleado.</DialogDescription>
        </DialogHeader>
        <EmployeeForm
          formData={formData}
          errors={errors}
          updateField={updateField}
          showPasswordFields={showPasswordFields}
          setShowPasswordFields={setShowPasswordFields}
          isEdit
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setOpen(false)
            setShowPasswordFields(false)
            resetForm()
          }}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 