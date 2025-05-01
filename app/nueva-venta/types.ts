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

export interface SaleItem {
  product: number
  quantity: number
  unitPrice: number
}

export interface CreateSaleDto {
  dateSale: Date
  total: number
  details: SaleItem[]
}

export interface SaleResponse {
  id: number
  dateSale: Date
  total: number
  details: SaleItem[]
  message?: string
} 