import { Category, CategoryFormValues, CategoryResponse } from './types'
import { API_URL } from '../../lib/utils'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const CategoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categories`, {
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para ver las categorías. Contacta al administrador')
      }
      throw new Error(data.message || 'No se pudieron cargar las categorías. Por favor, intenta de nuevo')
    }
    
    return data
  },

  async createCategory(categoryData: CategoryFormValues): Promise<CategoryResponse> {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      console.log('Error al crear categoría:', {
        status: response.status,
        statusText: response.statusText,
        data,
        categoryData
      })
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para crear categorías. Contacta al administrador')
      }
      if (response.status === 400) {
        const errorMessage = typeof data.message === 'string' 
          ? data.message 
          : Array.isArray(data.message) 
            ? data.message.join(', ') 
            : 'Datos inválidos. Verifica la información ingresada'
        throw new Error(errorMessage)
      }
      throw new Error(data.message || 'No se pudo crear la categoría. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Categoría creada exitosamente' }
  },

  async updateCategory(id: string, categoryData: CategoryFormValues): Promise<CategoryResponse> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para actualizar categorías. Contacta al administrador')
      }
      if (response.status === 400) {
        throw new Error(data.message || 'Datos inválidos. Verifica la información ingresada')
      }
      if (response.status === 404) {
        throw new Error('La categoría que intentas actualizar no existe')
      }
      throw new Error(data.message || 'No se pudo actualizar la categoría. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Categoría actualizada exitosamente' }
  },

  async deleteCategory(id: string): Promise<CategoryResponse> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para eliminar categorías. Contacta al administrador')
      }
      if (response.status === 404) {
        throw new Error('La categoría que intentas eliminar no existe')
      }
      throw new Error(data.message || 'No se pudo eliminar la categoría. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Categoría eliminada exitosamente' }
  }
} 