import { Sale, Employee, SaleDetail, Product } from './types'
import { API_URL } from '../../lib/utils'

interface ApiSale {
  id: number
  dateSale: string
  total: string
  isDeleted: boolean
  saleDetails: Array<{
    id: number
    quantity: number
    unitPrice: number
    product: {
      id: number
      name: string
      price: string
    }
  }>
  user: {
    id: number
    name: string
  }
}

const mapApiSaleToSale = (apiSale: ApiSale): Sale => {
  return {
    id: apiSale.id,
    date: apiSale.dateSale,
    total: parseFloat(apiSale.total),
    status: apiSale.isDeleted ? 'cancelled' : 'completed',
    employeeId: apiSale.user.id,
    details: apiSale.saleDetails.map(detail => ({
      id: detail.id,
      saleId: apiSale.id,
      productId: detail.product.id,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
      product: {
        ...detail.product,
        price: parseFloat(detail.product.price)
      }
    })),
    customer: apiSale.user.name,
    paymentMethod: 'cash' 
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

export const SalesService = {
  async getSales(): Promise<Sale[]> {
    try {
      const response = await fetch(`${API_URL}/sales/find-all-by-business`, {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
        }
        const errorData = await response.json()
        throw new Error(errorData.message || 'No se pudieron cargar las ventas')
      }

      const data: ApiSale[] = await response.json()
      return data.map(mapApiSaleToSale)
    } catch (error) {
      console.error('Error al obtener ventas:', error)
      throw error
    }
  },

  async getSaleDetails(saleId: number): Promise<SaleDetail[]> {
    try {
      const response = await fetch(`${API_URL}/sales/${saleId}`, {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
        }
        const errorData = await response.json()
        throw new Error(errorData.message || 'No se pudieron cargar los detalles de la venta')
      }

      const data: ApiSale = await response.json()
      const sale = mapApiSaleToSale(data)
      return sale.details || []
    } catch (error) {
      console.error('Error al obtener detalles de venta:', error)
      throw error
    }
  },

  async getProduct(productId: number): Promise<Product> {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
        }
        throw new Error(data.message || 'No se pudo cargar el producto')
      }
      
      return data
    } catch (error) {
      console.error('Error al obtener producto:', error)
      throw error
    }
  },

  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await fetch(`${API_URL}/employees`, {
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente')
        }
        throw new Error(data.message || 'No se pudieron cargar los empleados')
      }
      
      return data
    } catch (error) {
      console.error('Error al obtener empleados:', error)
      throw error
    }
  },

  async createSale(saleData: any): Promise<any> {
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(saleData),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'No se pudo crear la venta')
    }
    return data
  }
} 