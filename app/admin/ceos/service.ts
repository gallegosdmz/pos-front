import { Ceo, CeoFormValues } from './types';
import { Business } from '../businesses/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://82.180.133.39/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const CeoService = {
  async getCeos(): Promise<Ceo[]> {
    const response = await fetch(`${API_URL}/administrators`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'No se pudieron cargar los CEOs.');
    return data;
  },

  async createCeo(formData: CeoFormValues): Promise<Ceo> {
    const body = {
      name: formData.name,
      userName: formData.userName,
      password: formData.password,
      role: 'ceo',
      businessId: formData.businessId,
    };
    console.log('Enviando al backend (crear CEO):', body);
    const response = await fetch(`${API_URL}/administrators`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log('Respuesta del backend (crear CEO):', data);
    if (!response.ok) throw new Error(data.message || 'No se pudo crear el CEO.');
    return data;
  },

  async deleteCeo(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/administrators/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'No se pudo eliminar el CEO.');
    }
  },

  async getBusinesses(): Promise<Business[]> {
    const response = await fetch(`${API_URL}/businesses`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    console.log('Respuesta de /businesses:', data);
    if (!response.ok) throw new Error(data.message || 'No se pudieron cargar los negocios.');
    return data;
  },

  async editCeo(id: number, formData: Partial<CeoFormValues>): Promise<Ceo> {
    const body = {
      ...formData,
      role: 'ceo',
    };
    console.log('Enviando al backend (editar CEO):', body);
    const response = await fetch(`${API_URL}/administrators/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log('Respuesta del backend (editar CEO):', data);
    if (!response.ok) throw new Error(data.message || 'No se pudo editar el CEO.');
    return data;
  },
}; 