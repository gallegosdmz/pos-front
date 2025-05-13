import { useState, useCallback } from 'react'
import { Category, CategoryFormValues } from './types'
import { CategoryService } from './service'
import { useToast } from '@/hooks/use-toast'

export const useCategories = () => {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await CategoryService.getCategories()
      setCategories(data)
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

  const createCategory = useCallback(async (categoryData: CategoryFormValues) => {
    try {
      setIsLoading(true)
      const response = await CategoryService.createCategory(categoryData)
      toast({
        title: "¡Categoría agregada con éxito!",
        description: response.message || "La categoría fue creada correctamente.",
        variant: "default",
      })
      await loadCategories()
      return response
    } catch (error: any) {
      toast({
        title: "Error al crear categoría",
        description: error.message || "Ocurrió un error desconocido al crear la categoría.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast, loadCategories])

  const updateCategory = useCallback(async (id: string, categoryData: CategoryFormValues) => {
    try {
      setIsLoading(true)
      const response = await CategoryService.updateCategory(id, categoryData)
      toast({
        title: "¡Categoría actualizada con éxito!",
        description: response.message || "La categoría fue actualizada correctamente.",
        variant: "default",
      })
      return response
    } catch (error: any) {
      toast({
        title: "Error al actualizar categoría",
        description: error.message || "Ocurrió un error desconocido al actualizar la categoría.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const response = await CategoryService.deleteCategory(id)
      toast({
        title: "¡Categoría eliminada con éxito!",
        description: response.message || "La categoría fue eliminada correctamente.",
        variant: "default",
      })
      await loadCategories()
      return response
    } catch (error: any) {
      toast({
        title: "Error al eliminar categoría",
        description: error.message || "Ocurrió un error desconocido al eliminar la categoría.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast, loadCategories])

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return {
    categories: filteredCategories,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}

export const useCategoryForm = (initialData?: CategoryFormValues) => {
  const [formData, setFormData] = useState<CategoryFormValues>(
    initialData || {
      name: ""
    }
  )
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const validateField = (field: keyof CategoryFormValues, value: any) => {
    const newErrors: string[] = [];

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.push("El nombre de la categoría es requerido");
        } else if (value.trim().length < 3) {
          newErrors.push("El nombre debe tener al menos 3 caracteres");
        } else if (value.trim().length > 50) {
          newErrors.push("El nombre no puede exceder los 50 caracteres");
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: newErrors
    }));

    return newErrors.length === 0;
  };

  const updateField = (field: keyof CategoryFormValues, value: any) => {
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
      name: ""
    });
    setErrors({});
    setTouched({});
  }

  const isValid = () => {
    let isFormValid = true;
    const fields: (keyof CategoryFormValues)[] = ['name'];

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

    return isFormValid;
  }

  const getFieldError = (field: keyof CategoryFormValues) => {
    return touched[field] ? errors[field] : undefined;
  }

  return {
    formData,
    updateField,
    resetForm,
    errors,
    isValid,
    getFieldError,
    touched,
    setFormData
  }
} 