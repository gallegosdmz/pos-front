import { useState, useCallback } from 'react'
import { Expense, ExpenseFormValues } from './types'
import { ExpenseService } from './service'
import { useToast } from '@/components/ui/use-toast'

export const useExpenses = () => {
  const { toast } = useToast()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const loadExpenses = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await ExpenseService.getExpenses()
      setExpenses(data)
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

  const createExpense = useCallback(async (expenseData: ExpenseFormValues) => {
    try {
      setIsLoading(true)
      const response = await ExpenseService.createExpense(expenseData)
      setExpenses(prev => [...prev, response])
      toast({
        title: "Éxito",
        description: "Gasto registrado correctamente",
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

  const updateExpense = useCallback(async (id: number, expenseData: ExpenseFormValues) => {
    try {
      setIsLoading(true)
      const response = await ExpenseService.updateExpense(id, expenseData)
      setExpenses(prev => prev.map(exp => exp.id === id ? response : exp))
      toast({
        title: "Éxito",
        description: "Gasto actualizado correctamente",
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

  const deleteExpense = useCallback(async (id: number) => {
    try {
      setIsLoading(true)
      const response = await ExpenseService.deleteExpense(id)
      setExpenses(prev => prev.filter(exp => exp.id !== id))
      toast({
        title: "Éxito",
        description: "Gasto eliminado correctamente",
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

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.concept.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return {
    expenses: filteredExpenses,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  }
}

export const useExpenseForm = (initialData?: ExpenseFormValues) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ExpenseFormValues>(
    initialData || {
      concept: "",
      total: 0
    }
  )
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const validateField = (field: keyof ExpenseFormValues, value: any) => {
    const newErrors: string[] = [];

    switch (field) {
      case 'concept':
        if (!value || !value.trim()) {
          newErrors.push("El concepto es requerido");
        } else if (value.trim().length < 3) {
          newErrors.push("El concepto debe tener al menos 3 caracteres");
        } else if (value.trim().length > 100) {
          newErrors.push("El concepto no puede exceder los 100 caracteres");
        }
        break;

      case 'total':
        if (typeof value !== 'number' || isNaN(value) || value <= 0) {
          newErrors.push("El total debe ser mayor a 0");
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: newErrors
    }));

    return newErrors.length === 0;
  };

  const updateField = (field: keyof ExpenseFormValues, value: any) => {
    let processedValue = value;
    if (field === 'total') {
      if (value === '' || value === null || value === undefined) {
        processedValue = 0;
      } else {
        processedValue = Number(value);
        if (isNaN(processedValue)) {
          processedValue = 0;
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));

    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    validateField(field, processedValue);
  }

  const resetForm = () => {
    setFormData({
      concept: "",
      total: 0
    });
    setErrors({});
    setTouched({});
  }

  const isValid = () => {
    let isFormValid = true;
    const fields: (keyof ExpenseFormValues)[] = ['concept', 'total'];

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

  return {
    formData,
    updateField,
    resetForm,
    errors,
    isValid,
    touched,
    setFormData
  }
} 