export interface Category {
  id: number
  name: string
}

export interface CategoryFormValues {
  name: string
}

export interface CategoryResponse extends Category {
  message: string
} 