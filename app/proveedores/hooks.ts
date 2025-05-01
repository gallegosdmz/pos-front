import { useState, useCallback } from 'react'
import { Supplier, SupplierFormValues } from './types'
import { SupplierService } from './service'
import { useToast } from '@/components/ui/use-toast'

export const useSuppliers = () => {
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const loadSuppliers = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await SupplierService.getSuppliers()
      setSuppliers(data)
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

  const createSupplier = useCallback(async (supplierData: SupplierFormValues) => {
    try {
      setIsLoading(true)
      const response = await SupplierService.createSupplier(supplierData)
      setSuppliers(prev => [...prev, response])
      toast({
        title: "Éxito",
        description: "Proveedor creado correctamente",
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

  const updateSupplier = useCallback(async (id: number, supplierData: SupplierFormValues) => {
    try {
      setIsLoading(true)
      const response = await SupplierService.updateSupplier(String(id), supplierData)
      setSuppliers(prev => prev.map(sup => sup.id === id ? response : sup))
      toast({
        title: "Éxito",
        description: "Proveedor actualizado correctamente",
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

  const deleteSupplier = useCallback(async (id: number) => {
    try {
      setIsLoading(true)
      const response = await SupplierService.deleteSupplier(String(id))
      setSuppliers(prev => prev.filter(sup => sup.id !== id))
      toast({
        title: "Éxito",
        description: "Proveedor eliminado correctamente",
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

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return {
    suppliers: filteredSuppliers,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
  }
}

export const useSupplierForm = (initialData?: SupplierFormValues) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<SupplierFormValues>(
    initialData || {
      name: "",
      contact: "",
      phone: "",
      email: ""
    }
  )
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const validateField = (field: keyof SupplierFormValues, value: any) => {
    const newErrors: string[] = [];

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.push("El nombre de la empresa es requerido");
        } else if (value.trim().length < 3) {
          newErrors.push("El nombre debe tener al menos 3 caracteres");
        } else if (value.trim().length > 100) {
          newErrors.push("El nombre no puede exceder los 100 caracteres");
        }
        break;

      case 'contact':
        if (!value.trim()) {
          newErrors.push("El nombre del contacto es requerido");
        } else if (value.trim().length < 3) {
          newErrors.push("El nombre del contacto debe tener al menos 3 caracteres");
        } else if (value.trim().length > 50) {
          newErrors.push("El nombre del contacto no puede exceder los 50 caracteres");
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
          newErrors.push("El nombre del contacto solo debe contener letras y espacios");
        }
        break;

      case 'phone':
        if (!value.trim()) {
          newErrors.push("El teléfono es requerido");
        } else if (!/^\+?[\d\s-]{8,15}$/.test(value.trim())) {
          newErrors.push("Ingrese un número de teléfono válido (8-15 dígitos)");
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.push("El correo electrónico es requerido");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors.push("Ingrese un correo electrónico válido");
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: newErrors
    }));

    return newErrors.length === 0;
  };

  const updateField = (field: keyof SupplierFormValues, value: any) => {
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
      contact: "",
      phone: "",
      email: ""
    });
    setErrors({});
    setTouched({});
  }

  const isValid = () => {
    let isFormValid = true;
    const fields: (keyof SupplierFormValues)[] = ['name', 'contact', 'phone', 'email'];

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
      toast({
        title: "Error de validación",
        description: "Por favor, revisa los campos marcados en rojo",
        variant: "destructive",
      });
    }

    return isFormValid;
  }

  const getFieldError = (field: keyof SupplierFormValues) => {
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