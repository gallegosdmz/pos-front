import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExpenseFormValues } from "./types"

interface ExpenseFormProps {
  formData: ExpenseFormValues
  updateField: (field: keyof ExpenseFormValues, value: any) => void
}

export function ExpenseForm({ formData, updateField }: ExpenseFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="concept" className="text-right">
          Concepto
        </Label>
        <Input
          id="concept"
          className="col-span-3"
          value={formData.concept}
          onChange={(e) => updateField('concept', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="total" className="text-right">
          Total
        </Label>
        <Input
          id="total"
          type="number"
          className="col-span-3"
          value={formData.total}
          onChange={(e) => updateField('total', Number(e.target.value))}
        />
      </div>
    </div>
  )
} 