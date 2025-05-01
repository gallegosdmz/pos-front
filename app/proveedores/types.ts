export interface Supplier {
  id: number
  name: string
  contact: string
  phone: string
  email: string
  isDeleted?: boolean
}

export interface SupplierFormValues {
  name: string
  contact: string
  phone: string
  email: string
}

export interface SupplierResponse extends Supplier {
  message: string
} 