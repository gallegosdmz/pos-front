import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CategoryForm } from "./CategoryForm"
import { CategoryFormValues } from "./types"

interface AddCategoryDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  formData: CategoryFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof CategoryFormValues, value: any) => void
  isLoading: boolean
  onSubmit: () => void
  resetForm: () => void
}

export function AddCategoryDialog({ open, setOpen, formData, errors, updateField, isLoading, onSubmit, resetForm }: AddCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Categoría
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nueva Categoría</DialogTitle>
          <DialogDescription>Ingresa el nombre de la nueva categoría.</DialogDescription>
        </DialogHeader>
        <CategoryForm
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