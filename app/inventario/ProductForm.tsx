import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Product, ProductFormValues } from "./types"
import { Category } from "@/app/categorias/types"
import { Textarea } from "@/components/ui/textarea"

interface ProductFormProps {
  formData: ProductFormValues
  errors: { [key: string]: string[] }
  updateField: (field: keyof ProductFormValues, value: any) => void
  categories: Category[]
  suppliers: { id: number, name: string }[]
  isEdit?: boolean
}

export function ProductForm({ formData, errors, updateField, categories, suppliers, isEdit }: ProductFormProps) {
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
            placeholder="Nombre del producto"
          />
          {errors.name?.length > 0 && (
            <p className="text-sm text-red-500">{errors.name.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-barCode" : "barCode"} className="text-right">
          Código de barras
        </Label>
        <div className="col-span-3 space-y-2">
          <Input
            id={isEdit ? "edit-barCode" : "barCode"}
            className={errors.barCode?.length ? "border-red-500" : ""}
            value={formData.barCode}
            onChange={(e) => updateField('barCode', e.target.value)}
            placeholder="Código de barras"
          />
          {errors.barCode?.length > 0 && (
            <p className="text-sm text-red-500">{errors.barCode.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-category" : "category"} className="text-right">
          Categoría
        </Label>
        <div className="col-span-3">
          <Select
            value={String(formData.category)}
            onValueChange={(value) => updateField('category', Number(value))}
          >
            <SelectTrigger className={errors.category?.length ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category?.length > 0 && (
            <p className="text-sm text-red-500 mt-2">{errors.category.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-supplier" : "supplier"} className="text-right">
          Proveedor
        </Label>
        <div className="col-span-3">
          <Select
            value={String(formData.supplier)}
            onValueChange={(value) => updateField('supplier', Number(value))}
          >
            <SelectTrigger className={errors.supplier?.length ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar proveedor" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((sup) => (
                <SelectItem key={sup.id} value={String(sup.id)}>{sup.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.supplier?.length > 0 && (
            <p className="text-sm text-red-500 mt-2">{errors.supplier.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-price" : "price"} className="text-right">
          Precio
        </Label>
        <div className="col-span-3 space-y-2">
          <Input
            id={isEdit ? "edit-price" : "price"}
            type="number"
            className={errors.price?.length ? "border-red-500" : ""}
            value={formData.price}
            onChange={(e) => updateField('price', Number(e.target.value))}
            placeholder="Precio de venta"
          />
          {errors.price?.length > 0 && (
            <p className="text-sm text-red-500">{errors.price.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={isEdit ? "edit-stock" : "stock"} className="text-right">
          Stock
        </Label>
        <div className="col-span-3 space-y-2">
          <Input
            id={isEdit ? "edit-stock" : "stock"}
            type="number"
            className={errors.stock?.length ? "border-red-500" : ""}
            value={formData.stock}
            onChange={(e) => updateField('stock', Number(e.target.value))}
            placeholder="Cantidad en inventario"
          />
          {errors.stock?.length > 0 && (
            <p className="text-sm text-red-500">{errors.stock.join(", ")}</p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          rows={3}
          className="mt-1 block w-full"
          placeholder="Descripción del producto"
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description[0]}</p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="method" className="text-right">Método</Label>
        <div className="col-span-3">
          <Input
            id="method"
            value={formData.method || ""}
            onChange={e => updateField('method', e.target.value)}
            placeholder="Método de pago"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="total" className="text-right">Total</Label>
        <div className="col-span-3">
          <Input
            id="total"
            type="number"
            value={formData.total || ""}
            onChange={e => updateField('total', e.target.value)}
            placeholder="Total del gasto"
          />
        </div>
      </div>
    </div>
  )
} 