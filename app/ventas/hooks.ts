import { useState, useCallback, useEffect } from 'react'
import { Sale, Employee, SaleFilters, SaleDetail } from './types'
import { SalesService } from './service'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const useSales = () => {
  const { toast } = useToast()
  const [sales, setSales] = useState<Sale[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [filters, setFilters] = useState<SaleFilters>({
    searchTerm: "",
    status: "all",
    paymentMethod: "all",
    dateFrom: undefined,
    dateTo: undefined
  })

  const loadSales = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await SalesService.getSales()
      setSales(data)
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

  const loadEmployees = useCallback(async () => {
    try {
      const data = await SalesService.getEmployees()
      setEmployees(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }, [toast])

  const loadSaleDetails = useCallback(async (saleId: number) => {
    try {
      setLoadingDetails(true)
      const details = await SalesService.getSaleDetails(saleId)
      
      // Cargar información de productos para cada detalle
      const detailsWithProducts = await Promise.all(
        details.map(async (detail) => {
          const product = await SalesService.getProduct(detail.productId)
          return { ...detail, product }
        })
      )

      // Actualizar la venta con sus detalles
      setSales(currentSales => 
        currentSales.map(sale => 
          sale.id === saleId 
            ? { ...sale, details: detailsWithProducts }
            : sale
        )
      )
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoadingDetails(false)
    }
  }, [toast])

  const toggleSaleDetails = useCallback(async (saleId: number) => {
    if (expandedSaleId === saleId) {
      setExpandedSaleId(null)
      return
    }

    setExpandedSaleId(saleId)
    const sale = sales.find(s => s.id === saleId)
    if (!sale?.details) {
      await loadSaleDetails(saleId)
    }
  }, [expandedSaleId, sales, loadSaleDetails])

  useEffect(() => {
    loadSales()
    loadEmployees()
  }, [loadSales, loadEmployees])

  const getEmployeeName = useCallback((id: number) => {
    const employee = employees.find(emp => emp.id === id)
    return employee?.name || 'Desconocido'
  }, [employees])

  const formatDate = useCallback((date: string | Date) => {
    try {
      if (!date) return 'Fecha no disponible';
      
      let dateObj: Date;
      if (date instanceof Date) {
        dateObj = date;
      } else {
        // Si es un string ISO, usar directamente new Date()
        if (date.includes('T')) {
          dateObj = new Date(date);
        } else {
          // Si es un string de fecha simple (YYYY-MM-DD), agregar la hora
          dateObj = new Date(date + 'T00:00:00');
        }
      }

      // Verificar si la fecha es válida
      if (isNaN(dateObj.getTime())) {
        return 'Fecha inválida';
      }

      return format(dateObj, "PPP", { locale: es });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Error en fecha';
    }
  }, [])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }, [])

  const parseSaleDate = useCallback((date: string | Date): Date | null => {
    try {
      if (date instanceof Date) return date;
      
      // Si es un string ISO, usar directamente new Date()
      if (date.includes('T')) {
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      
      // Si es un string de fecha simple (YYYY-MM-DD), agregar la hora
      const parsed = new Date(date + 'T00:00:00');
      return isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  }, []);

  const filteredSales = sales.filter((sale) => {
    // Filtro de búsqueda
    const searchMatch =
      String(sale.id).toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      getEmployeeName(sale.employeeId).toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (sale.customer && sale.customer.toLowerCase().includes(filters.searchTerm.toLowerCase()))

    // Filtro de estado
    const statusMatch = filters.status === "all" || sale.status === filters.status

    // Filtro de método de pago
    const paymentMatch = filters.paymentMethod === "all" || sale.paymentMethod === filters.paymentMethod

    // Filtro de fecha
    let dateMatch = true;
    const saleDate = parseSaleDate(sale.date);
    
    if (saleDate && filters.dateFrom) {
      dateMatch = dateMatch && saleDate >= filters.dateFrom;
    }
    
    if (saleDate && filters.dateTo) {
      const nextDay = new Date(filters.dateTo);
      nextDay.setDate(nextDay.getDate() + 1);
      dateMatch = dateMatch && saleDate < nextDay;
    }

    return searchMatch && statusMatch && paymentMatch && dateMatch;
  })

  const totalAmount = filteredSales
    .filter((sale) => sale.status === "completed")
    .reduce((sum, sale) => sum + sale.total, 0)

  return {
    sales: filteredSales,
    isLoading,
    loadingDetails,
    filters,
    setFilters,
    totalAmount,
    getEmployeeName,
    formatDate,
    formatCurrency,
    expandedSaleId,
    toggleSaleDetails
  }
} 