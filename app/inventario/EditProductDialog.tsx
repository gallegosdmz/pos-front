import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProductForm } from "./ProductForm"
import { ProductFormValues } from "./types"
import { Category } from "@/app/categorias/types"

interface EditProductDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  formData: ProductFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof ProductFormValues, value: any) => void
  categories: Category[]
  suppliers: { id: number, name: string }[]
  isLoading: boolean
  onSubmit: () => void
  resetForm: () => void
}

export function EditProductDialog({ open, setOpen, formData, errors, updateField, categories, suppliers, isLoading, onSubmit, resetForm }: EditProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>Modifica la información del producto.</DialogDescription>
        </DialogHeader>
        <ProductForm
          formData={formData}
          errors={errors}
          updateField={updateField}
          categories={categories}
          suppliers={suppliers}
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