import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { EmployeeFormValues } from "./types"

interface EmployeeFormProps {
  formData: EmployeeFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof EmployeeFormValues, value: any) => void
  showPasswordFields?: boolean
  setShowPasswordFields?: (show: boolean) => void
  isEdit?: boolean
}

export function EmployeeForm({ formData, errors, updateField, showPasswordFields, setShowPasswordFields, isEdit }: EmployeeFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-name" : "name"} className="text-right">
          Nombre
        </Label>
        <div className="col-span-3 space-y-2">
          <Input
            id={isEdit ? "edit-name" : "name"}
            className={errors.name?.length ? "border-red-500" : ""}
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Ingrese el nombre completo"
          />
          {errors.name?.length > 0 && (
            <p className="text-sm text-red-500">{errors.name.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-userName" : "userName"} className="text-right">
          Usuario
        </Label>
        <div className="col-span-3 space-y-2">
          <Input
            id={isEdit ? "edit-userName" : "userName"}
            className={errors.userName?.length ? "border-red-500" : ""}
            value={formData.userName}
            onChange={(e) => updateField('userName', e.target.value)}
            placeholder="Ingrese el nombre de usuario"
          />
          {errors.userName?.length > 0 && (
            <p className="text-sm text-red-500">{errors.userName.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-role" : "role"} className="text-right">
          Rol
        </Label>
        <div className="col-span-3">
          <Select
            value={formData.role}
            onValueChange={(value) => updateField('role', value)}
          >
            <SelectTrigger className={errors.role?.length ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cajero">Cajero</SelectItem>
              <SelectItem value="Admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
          {errors.role?.length > 0 && (
            <p className="text-sm text-red-500 mt-2">{errors.role.join(", ")}</p>
          )}
        </div>
      </div>
      {isEdit ? (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Contraseña
            </Label>
            <div className="col-span-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordFields && setShowPasswordFields(!showPasswordFields)}
              >
                {showPasswordFields ? "Cancelar cambio de contraseña" : "Cambiar contraseña"}
              </Button>
            </div>
          </div>
          {showPasswordFields && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-password" className="text-right">
                Nueva Contraseña
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-password"
                  type="password"
                  className={errors.password?.length ? "border-red-500" : ""}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Ingrese la nueva contraseña"
                />
                {errors.password?.length > 0 && (
                  <p className="text-sm text-red-500">{errors.password.join(", ")}</p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Contraseña
          </Label>
          <div className="col-span-3 space-y-2">
            <Input
              id="password"
              type="password"
              className={errors.password?.length ? "border-red-500" : ""}
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Ingrese la contraseña"
            />
            {errors.password?.length > 0 && (
              <p className="text-sm text-red-500">{errors.password.join(", ")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 