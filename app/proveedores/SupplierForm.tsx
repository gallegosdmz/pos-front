import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SupplierFormValues } from "./types"

interface SupplierFormProps {
  formData: SupplierFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof SupplierFormValues, value: any) => void
  isEdit?: boolean
}

export function SupplierForm({ formData, errors, updateField, isEdit }: SupplierFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-name" : "name"} className="text-right">
          Empresa
        </Label>
        <div className="col-span-3 space-y-2">
          <Input
            id={isEdit ? "edit-name" : "name"}
            className={errors.name?.length ? "border-red-500" : ""}
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Nombre de la empresa"
          />
          {errors.name?.length > 0 && (
            <p className="text-sm text-red-500">{errors.name.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-contact" : "contact"} className="text-right">
          Contacto
        </Label>
        <div className="col-span-3 space-y-2">
          <Input
            id={isEdit ? "edit-contact" : "contact"}
            className={errors.contact?.length ? "border-red-500" : ""}
            value={formData.contact}
            onChange={(e) => updateField('contact', e.target.value)}
            placeholder="Nombre del contacto"
          />
          {errors.contact?.length > 0 && (
            <p className="text-sm text-red-500">{errors.contact.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-phone" : "phone"} className="text-right">
          Teléfono
        </Label>
        <div className="col-span-3 space-y-2">
          <Input
            id={isEdit ? "edit-phone" : "phone"}
            className={errors.phone?.length ? "border-red-500" : ""}
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="Número de teléfono"
          />
          {errors.phone?.length > 0 && (
            <p className="text-sm text-red-500">{errors.phone.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-email" : "email"} className="text-right">
          Email
        </Label>
        <div className="col-span-3 space-y-2">
          <Input
            id={isEdit ? "edit-email" : "email"}
            type="email"
            className={errors.email?.length ? "border-red-500" : ""}
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="Correo electrónico"
          />
          {errors.email?.length > 0 && (
            <p className="text-sm text-red-500">{errors.email.join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  )
} 