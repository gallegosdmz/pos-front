"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Plus, Search } from "lucide-react"
import { expenses, formatCurrency, formatDate, generateId } from "@/lib/data"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function ExpensesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [expensesList, setExpensesList] = useState(expenses)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: 0,
    category: "",
    paymentMethod: "cash",
    date: new Date().toISOString(),
  })

  const filteredExpenses = expensesList.filter((expense) => {
    // Filtro de búsqueda
    const searchMatch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de categoría
    const categoryMatch = categoryFilter === "all" || expense.category === categoryFilter

    // Filtro de método de pago
    const paymentMatch = paymentMethodFilter === "all" || expense.paymentMethod === paymentMethodFilter

    // Filtro de fecha
    let dateMatch = true
    if (dateFrom) {
      const expenseDate = new Date(expense.date)
      dateMatch = dateMatch && expenseDate >= dateFrom
    }
    if (dateTo) {
      const expenseDate = new Date(expense.date)
      const nextDay = new Date(dateTo)
      nextDay.setDate(nextDay.getDate() + 1)
      dateMatch = dateMatch && expenseDate < nextDay
    }

    return searchMatch && categoryMatch && paymentMatch && dateMatch
  })

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Obtener categorías únicas
  const uniqueCategories = Array.from(new Set(expensesList.map((expense) => expense.category)))

  const handleAddExpense = () => {
    const expense = {
      id: generateId("EXP"),
      description: newExpense.description,
      amount: newExpense.amount,
      category: newExpense.category,
      paymentMethod: newExpense.paymentMethod as "cash" | "card" | "transfer",
      date: newExpense.date,
    }

    setExpensesList([...expensesList, expense])
    setIsAddDialogOpen(false)
    setNewExpense({
      description: "",
      amount: 0,
      category: "",
      paymentMethod: "cash",
      date: new Date().toISOString(),
    })

    toast({
      title: "Gasto registrado",
      description: `Se ha registrado un nuevo gasto por ${formatCurrency(expense.amount)}.`,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="animate-in"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gastos</h1>
        <p className="text-muted-foreground">Consulta y administra los gastos de tu negocio.</p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 my-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar gastos..."
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
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
            <CardTitle>Historial de Gastos</CardTitle>
            <CardDescription>
              Total: {filteredExpenses.length} gastos | Monto: {formatCurrency(totalAmount)}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Gasto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
                  <DialogDescription>Ingresa la información del nuevo gasto.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Descripción
                    </Label>
                    <Input
                      id="description"
                      className="col-span-3"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Monto
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      className="col-span-3"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Categoría
                    </Label>
                    <Input
                      id="category"
                      className="col-span-3"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      list="categories"
                    />
                    <datalist id="categories">
                      {uniqueCategories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paymentMethod" className="text-right">
                      Método de Pago
                    </Label>
                    <Select
                      value={newExpense.paymentMethod}
                      onValueChange={(value) => setNewExpense({ ...newExpense, paymentMethod: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="card">Tarjeta</SelectItem>
                        <SelectItem value="transfer">Transferencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Fecha
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-3 justify-start text-left font-normal",
                            !newExpense.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newExpense.date
                            ? format(new Date(newExpense.date), "PP", { locale: es })
                            : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newExpense.date ? new Date(newExpense.date) : undefined}
                          onSelect={(date) => setNewExpense({ ...newExpense, date: date ? date.toISOString() : "" })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddExpense}>Guardar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No se encontraron gastos
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>
                      {expense.paymentMethod === "cash"
                        ? "Efectivo"
                        : expense.paymentMethod === "card"
                          ? "Tarjeta"
                          : "Transferencia"}
                    </TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
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
