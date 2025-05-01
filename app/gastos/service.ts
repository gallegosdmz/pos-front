import { Expense, ExpenseFormValues, ExpenseResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const ExpenseService = {
  async getExpenses(): Promise<Expense[]> {
    const response = await fetch(`${API_URL}/expenses`, {
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para ver los gastos. Contacta al administrador')
      }
      throw new Error(data.message || 'No se pudieron cargar los gastos. Por favor, intenta de nuevo')
    }
    
    return data
  },

  async createExpense(expenseData: ExpenseFormValues): Promise<ExpenseResponse> {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para crear gastos. Contacta al administrador')
      }
      if (response.status === 400) {
        const errorMessage = typeof data.message === 'string' 
          ? data.message 
          : Array.isArray(data.message) 
            ? data.message.join(', ') 
            : 'Datos inválidos. Verifica la información ingresada'
        throw new Error(errorMessage)
      }
      throw new Error(data.message || 'No se pudo crear el gasto. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Gasto registrado exitosamente' }
  },

  async updateExpense(id: number, expenseData: ExpenseFormValues): Promise<ExpenseResponse> {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para actualizar gastos. Contacta al administrador')
      }
      if (response.status === 400) {
        throw new Error(data.message || 'Datos inválidos. Verifica la información ingresada')
      }
      if (response.status === 404) {
        throw new Error('El gasto que intentas actualizar no existe')
      }
      throw new Error(data.message || 'No se pudo actualizar el gasto. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Gasto actualizado exitosamente' }
  },

  async deleteExpense(id: number): Promise<ExpenseResponse> {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para eliminar gastos. Contacta al administrador')
      }
      if (response.status === 404) {
        throw new Error('El gasto que intentas eliminar no existe')
      }
      throw new Error(data.message || 'No se pudo eliminar el gasto. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Gasto eliminado exitosamente' }
  }
} 