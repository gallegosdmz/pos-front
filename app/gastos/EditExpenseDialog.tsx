import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExpenseForm } from "./ExpenseForm"
import { ExpenseFormValues } from "./types"

interface EditExpenseDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  formData: ExpenseFormValues
  updateField: (field: keyof ExpenseFormValues, value: any) => void
  isLoading: boolean
  onSubmit: () => void
  resetForm: () => void
}

export function EditExpenseDialog({ open, setOpen, formData, updateField, isLoading, onSubmit, resetForm }: EditExpenseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Gasto</DialogTitle>
          <DialogDescription>Modifica la información del gasto.</DialogDescription>
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
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 