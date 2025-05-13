export interface Product {
  id: number
  name: string
  price: number
  stock: number
  purchasePrice: number
  barCode: string
  category: {
    id: number
    name: string
  }
  supplier: {
    id: number
    name: string
  }
  description: string
}

export interface ProductFormValues {
  name: string
  price: string | number
  stock: string | number
  purchasePrice: string | number
  barCode: string
  category: string | number
  supplier: string | number
  description: string
  concept?: string
  expCategory?: string
  method?: string
  total?: string | number
}

export interface ProductResponse extends Product {
  message: string
} 