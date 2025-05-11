export interface Sale {
  id: number
  date: string | Date
  employeeId: number
  total: number
  status: 'completed' | 'cancelled'
  details?: SaleDetail[]
  customer?: string
  paymentMethod: string
}

export interface SaleDetail {
  id: number
  saleId: number
  productId: number
  quantity: number
  unitPrice: number
  product?: {
    id: number
    name: string
    price: number
  }
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  barCode: string
  stock: number
  category: number
  supplier: number
}

export interface SaleFilters {
  searchTerm: string
  status: string
  paymentMethod: string
  dateFrom?: Date
  dateTo?: Date
}

export interface Employee {
  id: number
  name: string
} 