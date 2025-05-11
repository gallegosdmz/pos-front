import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategoryFormValues } from "./types"

interface CategoryFormProps {
  formData: CategoryFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof CategoryFormValues, value: any) => void
  isEdit?: boolean
}

export function CategoryForm({ formData, errors, updateField, isEdit }: CategoryFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-name" : "name"} className="text-right">
          Nombre de la categoría
        </Label>
        <div className="col-span-3 space-y-2">
          <Input
            id={isEdit ? "edit-name" : "name"}
            className={errors.name?.length ? "border-red-500" : ""}
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Nombre de la categoría"
          />
          {errors.name?.length > 0 && (
            <p className="text-sm text-red-500">{errors.name.join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  )
} 