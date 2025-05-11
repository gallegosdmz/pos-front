import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "./CategoryForm"
import { CategoryFormValues } from "./types"

interface EditCategoryDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  formData: CategoryFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof CategoryFormValues, value: any) => void
  isLoading: boolean
  onSubmit: () => void
  resetForm: () => void
}

export function EditCategoryDialog({ open, setOpen, formData, errors, updateField, isLoading, onSubmit, resetForm }: EditCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoría</DialogTitle>
          <DialogDescription>Modifica el nombre de la categoría.</DialogDescription>
        </DialogHeader>
        <CategoryForm
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
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 