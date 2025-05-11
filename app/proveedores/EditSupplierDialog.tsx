import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SupplierForm } from "./SupplierForm"
import { SupplierFormValues } from "./types"

interface EditSupplierDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  formData: SupplierFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof SupplierFormValues, value: any) => void
  isLoading: boolean
  onSubmit: () => void
  resetForm: () => void
}

export function EditSupplierDialog({ open, setOpen, formData, errors, updateField, isLoading, onSubmit, resetForm }: EditSupplierDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Proveedor</DialogTitle>
          <DialogDescription>Actualiza la información del proveedor.</DialogDescription>
        </DialogHeader>
        <SupplierForm
          formData={formData}
          errors={errors}
          updateField={updateField}
          isEdit
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