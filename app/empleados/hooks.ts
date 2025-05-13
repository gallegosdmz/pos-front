import { useState, useCallback } from 'react'
import { Employee, EmployeeFormValues } from './types'
import { EmployeeService } from './service'
import { useToast } from '@/hooks/use-toast'

const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Debe contener al menos una letra mayúscula");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Debe contener al menos una letra minúscula");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Debe contener al menos un número");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const useEmployees = () => {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const loadEmployees = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await EmployeeService.getEmployees()
      setEmployees(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const createEmployee = useCallback(async (employeeData: EmployeeFormValues) => {
    try {
      setIsLoading(true)
      const response = await EmployeeService.createEmployee(employeeData)
      toast({
        title: "Éxito",
        description: response.message,
      })
      await loadEmployees()
      return response
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast, loadEmployees])

  const updateEmployee = useCallback(async (id: string, employeeData: EmployeeFormValues) => {
    try {
      setIsLoading(true)
      const response = await EmployeeService.updateEmployee(id, employeeData)
      setEmployees(prev => prev.map(emp => emp.id === id ? response : emp))
      toast({
        title: "Éxito",
        description: response.message,
      })
      return response
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const deleteEmployee = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const response = await EmployeeService.deleteEmployee(id)
      setEmployees(prev => prev.filter(emp => emp.id !== id))
      toast({
        title: "Éxito",
        description: response.message,
      })
      return response
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.userName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return {
    employees: filteredEmployees,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  }
}

export const useEmployeeForm = (initialData?: EmployeeFormValues) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<EmployeeFormValues>(
    initialData || {
      name: "",
      userName: "",
      password: ""
    }
  )
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const validateField = (field: keyof EmployeeFormValues, value: any) => {
    const newErrors: string[] = [];

    switch (field) {
      case 'password':
        if (!value && !initialData) {
          newErrors.push("La contraseña es requerida");
        } else if (value) {
          const { isValid, errors } = validatePassword(value);
          if (!isValid) {
            newErrors.push(...errors);
          }
        }
        break;
      case 'name':
        if (!value.trim()) {
          newErrors.push("El nombre es requerido");
        } else if (value.trim().length < 3) {
          newErrors.push("El nombre debe tener al menos 3 caracteres");
        } else if (value.trim().length > 50) {
          newErrors.push("El nombre no puede exceder los 50 caracteres");
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
          newErrors.push("El nombre solo debe contener letras y espacios");
        }
        break;
      case 'userName':
        if (!value.trim()) {
          newErrors.push("El usuario es requerido");
        } else if (value.trim().length < 4) {
          newErrors.push("El usuario debe tener al menos 4 caracteres");
        } else if (value.trim().length > 20) {
          newErrors.push("El usuario no puede exceder los 20 caracteres");
        } else if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
          newErrors.push("El usuario solo puede contener letras, números y guiones bajos");
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: newErrors
    }));

    return newErrors.length === 0;
  };

  const updateField = (field: keyof EmployeeFormValues, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field, value);
  }

  const resetForm = () => {
    setFormData({
      name: "",
      userName: "",
      password: ""
    });
    setErrors({});
    setTouched({});
  }

  const isValid = () => {
    let isFormValid = true;
    const newErrors: { [key: string]: string[] } = {};
    const fields: (keyof EmployeeFormValues)[] = ['name', 'userName'];
    
    // Solo validar contraseña si es un nuevo empleado o si se está cambiando la contraseña
    if (!initialData || (initialData && formData.password)) {
      fields.push('password');
    }

    fields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) {
        isFormValid = false;
      }
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));
    });

    if (!isFormValid) {
      console.log('DEBUG VALIDACION EMPLEADO:', { formData, errors });
      toast({
        title: "Error de validación",
        description: "Por favor, revisa los campos marcados en rojo",
        variant: "destructive",
      });
    }

    return isFormValid;
  }

  const getFieldError = (field: keyof EmployeeFormValues) => {
    return touched[field] ? errors[field] : undefined;
  }

  return {
    formData,
    updateField,
    resetForm,
    errors,
    isValid,
    getFieldError,
    touched
  }
} 