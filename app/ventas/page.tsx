"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CreditCard, Download, Search } from "lucide-react"
import { sales, formatCurrency, formatDate, getEmployeeName } from "@/lib/data"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { motion } from "framer-motion"

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  const filteredSales = sales.filter((sale) => {
    // Filtro de búsqueda
    const searchMatch =
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEmployeeName(sale.employeeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.customer && sale.customer.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filtro de estado
    const statusMatch = statusFilter === "all" || sale.status === statusFilter

    // Filtro de método de pago
    const paymentMatch = paymentMethodFilter === "all" || sale.paymentMethod === paymentMethodFilter

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

    return searchMatch && statusMatch && paymentMatch && dateMatch
  })

  const totalAmount = filteredSales
    .filter((sale) => sale.status === "completed")
    .reduce((sum, sale) => sum + sale.total, 0)

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
          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Método de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los métodos</SelectItem>
              <SelectItem value="cash">Efectivo</SelectItem>
              <SelectItem value="card">Tarjeta</SelectItem>
              <SelectItem value="transfer">Transferencia</SelectItem>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No se encontraron ventas
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{formatDate(sale.date)}</TableCell>
                    <TableCell>{getEmployeeName(sale.employeeId)}</TableCell>
                    <TableCell>{sale.customer || "Cliente General"}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {sale.paymentMethod === "card" && <CreditCard className="mr-2 h-4 w-4" />}
                        {sale.paymentMethod === "cash" && <span className="mr-2">💵</span>}
                        {sale.paymentMethod === "transfer" && <span className="mr-2">🏦</span>}
                        {sale.paymentMethod === "cash"
                          ? "Efectivo"
                          : sale.paymentMethod === "card"
                            ? "Tarjeta"
                            : "Transferencia"}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(sale.total)}</TableCell>
                    <TableCell>
                      <Badge variant={sale.status === "completed" ? "default" : "destructive"}>
                        {sale.status === "completed" ? "Completada" : "Cancelada"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
