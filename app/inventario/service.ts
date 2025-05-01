import { Product, ProductFormValues, ProductResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const ProductService = {
  async getProducts(): Promise<Product[]> {
    console.log('Obteniendo productos del API')
    const response = await fetch(`${API_URL}/products`, {
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    console.log('Respuesta getProducts:', data)
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para ver los productos. Contacta al administrador')
      }
      throw new Error(data.message || 'No se pudieron cargar los productos. Por favor, intenta de nuevo')
    }
    
    return data
  },

  async createProduct(productData: ProductFormValues): Promise<ProductResponse> {
    console.log('Service - Enviando datos al API:', {
      url: `${API_URL}/products`,
      method: 'POST',
      headers: getAuthHeaders(),
      data: productData
    })

    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    })
    
    const data = await response.json()
    console.log('Service - Respuesta del API:', {
      status: response.status,
      data
    })
    
    if (!response.ok) {
      console.error('Service - Error en la respuesta:', {
        status: response.status,
        data
      })
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para crear productos. Contacta al administrador')
      }
      if (response.status === 400) {
        const errorMessage = typeof data.message === 'string' 
          ? data.message 
          : Array.isArray(data.message) 
            ? data.message.join(', ') 
            : 'Datos inválidos. Verifica la información ingresada'
        throw new Error(errorMessage)
      }
      throw new Error(data.message || 'No se pudo crear el producto. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Producto creado exitosamente' }
  },

  async updateProduct(id: number, productData: ProductFormValues): Promise<ProductResponse> {
    console.log('Service - Enviando datos al API:', {
      url: `${API_URL}/products/${id}`,
      method: 'PATCH',
      headers: getAuthHeaders(),
      data: productData
    })

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    })
    
    const data = await response.json()
    console.log('Service - Respuesta del API:', {
      status: response.status,
      data
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para actualizar productos. Contacta al administrador')
      }
      if (response.status === 400) {
        throw new Error(data.message || 'Datos inválidos. Verifica la información ingresada')
      }
      if (response.status === 404) {
        throw new Error('El producto que intentas actualizar no existe')
      }
      throw new Error(data.message || 'No se pudo actualizar el producto. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Producto actualizado exitosamente' }
  },

  async deleteProduct(id: number): Promise<ProductResponse> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para eliminar productos. Contacta al administrador')
      }
      if (response.status === 404) {
        throw new Error('El producto que intentas eliminar no existe')
      }
      throw new Error(data.message || 'No se pudo eliminar el producto. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Producto eliminado exitosamente' }
  }
} 