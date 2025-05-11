import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ExpenseForm } from "./ExpenseForm"
import { ExpenseFormValues } from "./types"

interface AddExpenseDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  formData: ExpenseFormValues
  updateField: (field: keyof ExpenseFormValues, value: any) => void
  isLoading: boolean
  onSubmit: () => void
  resetForm: () => void
}

export function AddExpenseDialog({ open, setOpen, formData, updateField, isLoading, onSubmit, resetForm }: AddExpenseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Gasto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
          <DialogDescription>Ingresa la información del nuevo gasto.</DialogDescription>
        </DialogHeader>
        <ExpenseForm
          formData={formData}
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