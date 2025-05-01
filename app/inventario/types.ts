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
  price: number
  stock: number
  purchasePrice: number
  barCode: string
  category: number
  supplier: number
  description: string
}

export interface ProductResponse extends Product {
  message: string
} 