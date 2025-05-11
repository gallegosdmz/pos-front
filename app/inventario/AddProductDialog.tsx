import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProductForm } from "./ProductForm"
import { ProductFormValues } from "./types"
import { Category } from "@/app/categorias/types"

interface AddProductDialogProps {
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

export function AddProductDialog({ open, setOpen, formData, errors, updateField, categories, suppliers, isLoading, onSubmit, resetForm }: AddProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          <DialogDescription>Ingresa la información del nuevo producto.</DialogDescription>
        </DialogHeader>
        <ProductForm
          formData={formData}
          errors={errors}
          updateField={updateField}
          categories={categories}
          suppliers={suppliers}
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