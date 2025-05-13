export interface Expense {
  id: number
  concept: string
  expCategory: string
  method: string
  total: string | number
  createdAt?: string
  isDeleted?: boolean
}

export interface ExpenseFormValues {
  concept: string
  expCategory: string
  method: string
  total: string | number
}

export interface ExpenseResponse extends Expense {
  message: string
} 