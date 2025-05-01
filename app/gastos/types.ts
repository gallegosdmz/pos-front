export interface Expense {
  id: number
  concept: string
  total: string | number
  createdAt?: string
  isDeleted?: boolean
}

export interface ExpenseFormValues {
  concept: string
  total: number
}

export interface ExpenseResponse extends Expense {
  message: string
} 