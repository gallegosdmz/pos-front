import { Supplier, SupplierFormValues, SupplierResponse } from './types'

const API_URL = '/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const SupplierService = {
  async getSuppliers(): Promise<Supplier[]> {
    const response = await fetch(`${API_URL}/suppliers`, {
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para ver los proveedores. Contacta al administrador')
      }
      throw new Error(data.message || 'No se pudieron cargar los proveedores. Por favor, intenta de nuevo')
    }
    
    return data
  },

  async createSupplier(supplierData: SupplierFormValues): Promise<SupplierResponse> {
    const response = await fetch(`${API_URL}/suppliers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(supplierData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para crear proveedores. Contacta al administrador')
      }
      if (response.status === 400) {
        const errorMessage = typeof data.message === 'string' 
          ? data.message 
          : Array.isArray(data.message) 
            ? data.message.join(', ') 
            : 'Datos inválidos. Verifica la información ingresada'
        throw new Error(errorMessage)
      }
      throw new Error(data.message || 'No se pudo crear el proveedor. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Proveedor creado exitosamente' }
  },

  async updateSupplier(id: string, supplierData: SupplierFormValues): Promise<SupplierResponse> {
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(supplierData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para actualizar proveedores. Contacta al administrador')
      }
      if (response.status === 400) {
        throw new Error(data.message || 'Datos inválidos. Verifica la información ingresada')
      }
      if (response.status === 404) {
        throw new Error('El proveedor que intentas actualizar no existe')
      }
      throw new Error(data.message || 'No se pudo actualizar el proveedor. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Proveedor actualizado exitosamente' }
  },

  async deleteSupplier(id: string): Promise<SupplierResponse> {
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para eliminar proveedores. Contacta al administrador')
      }
      if (response.status === 404) {
        throw new Error('El proveedor que intentas eliminar no existe')
      }
      throw new Error(data.message || 'No se pudo eliminar el proveedor. Por favor, intenta de nuevo')
    }
    
    return { ...data, message: 'Proveedor eliminado exitosamente' }
  }
} 