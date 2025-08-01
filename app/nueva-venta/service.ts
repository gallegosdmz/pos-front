import { Product, CreateSaleDto, SaleResponse } from './types'
import { API_URL } from '../../lib/utils'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const SaleService = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products/find-all-by-business`, {
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      throw new Error(data.message || 'No se pudieron cargar los productos')
    }
    
    return data
  },

  findProductById(products: Product[], codeOrId: string | number): Product | null {
    return (
      products.find(product => String(product.barCode) === String(codeOrId)) ||
      products.find(product => Number(product.id) === Number(codeOrId)) ||
      null
    );
  },

  async createSale(saleData: CreateSaleDto): Promise<SaleResponse> {
    console.log('Datos de venta a enviar:', {
      dateSale: saleData.dateSale,
      total: saleData.total,
      details: saleData.details
    })
    
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(saleData)
    })
    
    const data = await response.json()
    console.log('Respuesta del servidor:', data)
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
      }
      if (response.status === 400) {
        console.error('Error 400 - Detalles:', data)
        throw new Error(data.message || 'Datos de venta inválidos')
      }
      throw new Error(data.message || 'No se pudo procesar la venta')
    }
    
    return data
  }
} 