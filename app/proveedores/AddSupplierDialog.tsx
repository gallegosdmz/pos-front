import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { SupplierForm } from "./SupplierForm"
import { SupplierFormValues } from "./types"

interface AddSupplierDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  formData: SupplierFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof SupplierFormValues, value: any) => void
  isLoading: boolean
  onSubmit: () => void
  resetForm: () => void
}

export function AddSupplierDialog({ open, setOpen, formData, errors, updateField, isLoading, onSubmit, resetForm }: AddSupplierDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Building2 className="mr-2 h-4 w-4" />
          Agregar Proveedor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
          <DialogDescription>Ingresa la información del nuevo proveedor.</DialogDescription>
        </DialogHeader>
        <SupplierForm
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