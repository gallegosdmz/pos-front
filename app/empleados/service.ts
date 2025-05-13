import { Employee, EmployeeFormValues, EmployeeResponse } from './types';
import { API_URL } from '../../lib/utils';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const EmployeeService = {

  async getEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente');
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para ver los empleados. Contacta al administrador');
      }
      throw new Error(data.message || 'No se pudieron cargar los empleados. Por favor, intenta de nuevo');
    }
    
    return data;
  },

  async createEmployee(employeeData: EmployeeFormValues): Promise<EmployeeResponse> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...employeeData, role: "assistant" }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente');
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para crear empleados. Contacta al administrador');
      }
      if (response.status === 400) {
        const errorMessage = typeof data.message === 'string' 
          ? data.message 
          : Array.isArray(data.message) 
            ? data.message.join(', ') 
            : 'Datos inválidos. Verifica la información ingresada';
        throw new Error(errorMessage);
      }
      throw new Error(data.message || 'No se pudo crear el empleado. Por favor, intenta de nuevo');
    }
    
    return { ...data, message: 'Empleado creado exitosamente' };
  },

  async updateEmployee(id: string, employeeData: EmployeeFormValues ): Promise<EmployeeResponse> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente');
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para actualizar empleados. Contacta al administrador');
      }
      if (response.status === 400) {
        throw new Error(data.message || 'Datos inválidos. Verifica la información ingresada');
      }
      if (response.status === 404) {
        throw new Error('El empleado que intentas actualizar no existe');
      }
      throw new Error(data.message || 'No se pudo actualizar el empleado. Por favor, intenta de nuevo');
    }
    
    return { ...data, message: 'Empleado actualizado exitosamente' };
  },

  async deleteEmployee(id: string): Promise<EmployeeResponse> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401: No autorizado - Por favor, inicia sesión nuevamente');
      }
      if (response.status === 403) {
        throw new Error('403: No tienes permisos para eliminar empleados. Contacta al administrador');
      }
      if (response.status === 404) {
        throw new Error('El empleado que intentas eliminar no existe');
      }
      throw new Error(data.message || 'No se pudo eliminar el empleado. Por favor, intenta de nuevo');
    }
    
    return { ...data, message: 'Empleado eliminado exitosamente' };
  },

  async changeEmployeePassword(id: string, newPassword: string) {
    const response = await fetch(`${API_URL}/auth/password-change/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ password: newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'No se pudo cambiar la contraseña.');
    }
    return data;
  },

}; 