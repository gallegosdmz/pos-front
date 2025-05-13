"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CreditCard, Download, Search, ChevronDown, ChevronUp, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isValid, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { motion } from "framer-motion"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { SalesService } from "./service"
import type { Sale, SaleDetail } from "./types"
import { SalesTable } from "./SalesTable"
import { SaleDetailsDialog } from "./SaleDetailsDialog"

// Función de formato de fecha
const formatDate = (date: string | Date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) {
      return 'Fecha inválida'
    }
    return format(dateObj, "PPP", { locale: es })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Fecha inválida'
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null)

  // Fetch sales data
  const { data: sales = [], isLoading, error } = useQuery<Sale[], Error>({
    queryKey: ['sales'],
    queryFn: () => SalesService.getSales(),
    retry: 2
  } as UseQueryOptions<Sale[], Error>)

  // Fetch sale details when a sale is selected
  const { data: saleDetails = [], isLoading: isLoadingDetails } = useQuery<SaleDetail[], Error>({
    queryKey: ['saleDetails', selectedSaleId],
    queryFn: () => selectedSaleId ? SalesService.getSaleDetails(selectedSaleId) : Promise.resolve([]),
    enabled: !!selectedSaleId
  } as UseQueryOptions<SaleDetail[], Error>)

  useEffect(() => {
    if (error) console.error('Error al cargar ventas:', error)
  }, [error])

  useEffect(() => {
    if (isLoadingDetails) console.error('Error al cargar detalles:', isLoadingDetails)
  }, [isLoadingDetails])

  const filteredSales = sales.filter((sale: Sale) => {
    // Filtro de búsqueda
    const searchMatch = String(sale.id).toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de estado
    const statusMatch = statusFilter === "all" || sale.status === statusFilter

    // Filtro de fecha
    let dateMatch = true
    if (dateFrom) {
      const saleDate = new Date(sale.date)
      dateMatch = dateMatch && saleDate >= dateFrom
    }
    if (dateTo) {
      const saleDate = new Date(sale.date)
      const nextDay = new Date(dateTo)
      nextDay.setDate(nextDay.getDate() + 1)
      dateMatch = dateMatch && saleDate < nextDay
    }

    return searchMatch && statusMatch && dateMatch
  })

  const totalAmount = filteredSales
    .filter((sale: Sale) => sale.status === "completed")
    .reduce((sum: number, sale: Sale) => sum + sale.total, 0)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-semibold text-destructive">Error al cargar las ventas</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <p className="text-sm text-muted-foreground">
          Asegúrate de que:
          <ul className="list-disc list-inside mt-2">
            <li>El servidor está corriendo en {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}</li>
            <li>Has iniciado sesión correctamente</li>
            <li>Tienes conexión a internet</li>
          </ul>
        </p>
        <Button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="animate-in"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
        <p className="text-muted-foreground">Consulta y administra el historial de ventas.</p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 my-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ventas..."
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal md:w-[180px]",
                    !dateFrom && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PP", { locale: es }) : "Fecha desde"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal md:w-[180px]",
                    !dateTo && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PP", { locale: es }) : "Fecha hasta"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Historial de Ventas</CardTitle>
            <CardDescription>
              Total: {filteredSales.length} ventas | Monto: {formatCurrency(totalAmount)}
            </CardDescription>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <SalesTable
            sales={sales}
            isLoading={isLoading}
            filteredSales={filteredSales}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            setSelectedSaleId={setSelectedSaleId}
          />
        </CardContent>
      </Card>

      <SaleDetailsDialog
        open={!!selectedSaleId}
        onOpenChange={() => setSelectedSaleId(null)}
        selectedSaleId={selectedSaleId}
        isLoadingDetails={isLoadingDetails}
        saleDetails={saleDetails}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </motion.div>
  )
}
