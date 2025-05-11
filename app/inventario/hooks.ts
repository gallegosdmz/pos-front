import { useState, useCallback } from 'react'
import { Product, ProductFormValues } from './types'
import type { Category } from '@/app/categorias/types'
import { ProductService } from './service'
import { useToast } from '@/components/ui/use-toast'

export const useProducts = () => {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await ProductService.getProducts()
      setProducts(data)
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

  const createProduct = useCallback(async (
    productData: ProductFormValues,
    categories: Category[] = [],
    suppliers: { id: number; name: string }[] = []
  ) => {
    try {
      setIsLoading(true)
      const dataToSend = {
        name: productData.name,
        price: Number(productData.price),
        stock: Number(productData.stock),
        purchasePrice: Number(productData.purchasePrice),
        barCode: productData.barCode,
        category: Number(productData.category),
        supplier: Number(productData.supplier),
        description: productData.description
      }
      const createResponse = await ProductService.createProduct(dataToSend)
      const categoryId = typeof createResponse.category === 'object' ? createResponse.category.id : createResponse.category;
      const supplierId = typeof createResponse.supplier === 'object' ? createResponse.supplier.id : createResponse.supplier;
      const categoryObj = Array.isArray(categories) ? categories.find((cat: { id: number }) => cat.id === categoryId) || { id: categoryId, name: '' } : createResponse.category;
      const supplierObj = Array.isArray(suppliers) ? suppliers.find((sup: { id: number }) => sup.id === supplierId) || { id: supplierId, name: '' } : createResponse.supplier;
      const enrichedProduct = {
        ...createResponse,
        category: categoryObj,
        supplier: supplierObj
      }
      setProducts(prev => [...prev, enrichedProduct])
      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
      })
      return enrichedProduct
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

  const updateProduct = useCallback(async (id: number, productData: ProductFormValues) => {
    try {
      setIsLoading(true)
      const dataToSend = {
        name: productData.name,
        price: Number(productData.price),
        stock: Number(productData.stock),
        purchasePrice: Number(productData.purchasePrice),
        barCode: productData.barCode,
        category: Number(productData.category),
        supplier: Number(productData.supplier),
        description: productData.description
      }
      const updateResponse = await ProductService.updateProduct(id, dataToSend)
      setProducts(prev => prev.map(prod => prod.id === id ? updateResponse : prod))
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      })
      return updateResponse
    } catch (error: any) {
      console.error('Error al actualizar producto:', error)
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

  const deleteProduct = useCallback(async (id: number) => {
    try {
      setIsLoading(true)
      const response = await ProductService.deleteProduct(id)
      setProducts(prev => prev.filter(prod => prod.id !== id))
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return {
    products: filteredProducts,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct
  }
}

export const useProductForm = (initialData?: ProductFormValues) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ProductFormValues>(
    initialData || {
      name: "",
      price: 0,
      stock: 0,
      purchasePrice: 0,
      barCode: "",
      category: 0,
      supplier: 0,
      description: ""
    }
  )
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const updateField = (field: keyof ProductFormValues, value: any) => {
    let processedValue = value;
    
    if (['price', 'stock', 'purchasePrice', 'category', 'supplier'].includes(field)) {
      if (value === '' || value === null || value === undefined) {
        processedValue = 0;
      } else if (typeof value === 'string') {
        processedValue = parseFloat(value.replace(/,/g, ''));
        if (isNaN(processedValue)) {
          processedValue = 0;
        }
      } else {
        processedValue = Number(value);
        if (isNaN(processedValue)) {
          processedValue = 0;
        }
      }
    } else if (field === 'description' && !value) {
      processedValue = '';
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

  const validateField = (field: keyof ProductFormValues, value: any) => {
    const newErrors: string[] = [];

    const parseNumericValue = (val: any): number => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val.replace(/,/g, ''));
        return isNaN(parsed) ? 0 : parsed;
      }
      return typeof val === 'number' ? val : 0;
    };

    switch (field) {
      case 'name':
        if (!value || !value.trim()) {
          newErrors.push("El nombre del producto es requerido");
        } else if (value.trim().length < 3) {
          newErrors.push("El nombre debe tener al menos 3 caracteres");
        } else if (value.trim().length > 100) {
          newErrors.push("El nombre no puede exceder los 100 caracteres");
        }
        break;

      case 'price': {
        const numericValue = parseNumericValue(value);
        if (numericValue < 0) {
          newErrors.push("El precio no puede ser negativo");
        }
        break;
      }

      case 'stock': {
        const numericValue = parseNumericValue(value);
        if (numericValue < 0) {
          newErrors.push("El stock no puede ser negativo");
        }
        break;
      }

      case 'purchasePrice': {
        const numericValue = parseNumericValue(value);
        if (numericValue < 0) {
          newErrors.push("El precio de compra no puede ser negativo");
        }
        break;
      }

      case 'barCode':
        if (!value || !value.trim()) {
          newErrors.push("El código de barras es requerido");
        } else if (!/^[0-9]{8,13}$/.test(value.trim())) {
          newErrors.push("El código de barras debe tener entre 8 y 13 dígitos");
        }
        break;

      case 'category':
        const categoryValue = parseNumericValue(value);
        if (!categoryValue || categoryValue === 0) {
          newErrors.push("La categoría es requerida");
        }
        break;

      case 'supplier':
        const supplierValue = parseNumericValue(value);
        if (!supplierValue || supplierValue === 0) {
          newErrors.push("El proveedor es requerido");
        }
        break;

      case 'description':
        if (!value || !value.trim()) {
          newErrors.push("La descripción es requerida");
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: newErrors
    }));

    return newErrors.length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      stock: 0,
      purchasePrice: 0,
      barCode: "",
      category: 0,
      supplier: 0,
      description: ""
    });
    setErrors({});
    setTouched({});
  }

  const isValid = () => {
    let isFormValid = true;
    const fields: (keyof ProductFormValues)[] = ['name', 'price', 'stock', 'purchasePrice', 'barCode', 'category', 'supplier', 'description'];

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

  const getFieldError = (field: keyof ProductFormValues) => {
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