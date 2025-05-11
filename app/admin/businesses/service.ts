import { Business, BusinessFormValues, CreateBusinessResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://82.180.133.39/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const BusinessService = {
  async getBusinesses(): Promise<Business[]> {
    const url = `${API_URL}/businesses`;
    const headers = getAuthHeaders();
    const response = await fetch(url, {
      headers,
    });
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
    if (!response.ok) throw new Error(data?.message || 'No se pudieron cargar los negocios.');
    return data;
  },

  async createBusiness(formData: BusinessFormValues): Promise<Business> {
    const response = await fetch(`${API_URL}/businesses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'No se pudo crear el negocio.');
    return data;
  },

  async updateBusiness(id: number, formData: BusinessFormValues): Promise<Business> {
    const response = await fetch(`${API_URL}/businesses/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'No se pudo actualizar el negocio.');
    return data;
  },

  async deleteBusiness(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/businesses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'No se pudo eliminar el negocio.');
    }
  },
}; 