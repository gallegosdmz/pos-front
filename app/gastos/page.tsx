"use client"

import { useState, useEffect } from "react"
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
import { CalendarIcon, Download, Plus, Search, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { useExpenses, useExpenseForm } from "./hooks"
import { Expense, ExpenseFormValues } from "./types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ExpenseTable } from "./ExpenseTable"
import { AddExpenseDialog } from "./AddExpenseDialog"
import { EditExpenseDialog } from "./EditExpenseDialog"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

const formatDate = (date: string) => {
  try {
    if (!date) return '-'
    // Intentar parsear la fecha
    const parsedDate = new Date(date)
    // Verificar si la fecha es válida
    if (isNaN(parsedDate.getTime())) return '-'
    return format(parsedDate, "PP", { locale: es })
  } catch (error) {
    return '-'
  }
}

const parseExpenseTotal = (total: string | number): number => {
  if (typeof total === 'string') {
    return parseFloat(total) || 0
  }
  return total
}

export default function ExpensesPage() {
  const { toast } = useToast()
  const {
    expenses,
    isLoading,
    searchTerm,
    setSearchTerm,
    createExpense,
    updateExpense,
    deleteExpense,
    loadExpenses,
  } = useExpenses()

  const {
    formData,
    updateField,
    resetForm,
    isValid,
    setFormData
  } = useExpenseForm()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleAddOrUpdateExpense = async () => {
    if (!isValid()) return

    try {
      if (isEditMode && editingId !== null) {
        await updateExpense(editingId, formData)
      } else {
        await createExpense(formData)
      }
      setIsAddDialogOpen(false)
      resetForm()
      setIsEditMode(false)
      setEditingId(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditClick = (expense: Expense) => {
    setFormData({
      concept: expense.concept,
      total: parseExpenseTotal(expense.total)
    })
    setIsEditMode(true)
    setEditingId(expense.id)
    setIsAddDialogOpen(true)
  }

  const handleDeleteClick = (id: number) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return

    try {
      await deleteExpense(deletingId)
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDialogClose = () => {
    setIsAddDialogOpen(false)
    resetForm()
    setIsEditMode(false)
    setEditingId(null)
  }

  useEffect(() => {
    loadExpenses()
  }, [loadExpenses])

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
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <AddExpenseDialog
            open={isAddDialogOpen && !isEditMode}
            setOpen={setIsAddDialogOpen}
            formData={formData}
            updateField={updateField}
            isLoading={isLoading}
            onSubmit={handleAddOrUpdateExpense}
            resetForm={resetForm}
          />
          <EditExpenseDialog
            open={isAddDialogOpen && isEditMode}
            setOpen={setIsAddDialogOpen}
            formData={formData}
            updateField={updateField}
            isLoading={isLoading}
            onSubmit={handleAddOrUpdateExpense}
            resetForm={resetForm}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Gastos</CardTitle>
          <CardDescription>
            Total: {expenses.length} gastos | Monto: {formatCurrency(
              expenses.reduce((sum, expense) => sum + parseExpenseTotal(expense.total), 0)
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseTable
            expenses={expenses}
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            parseExpenseTotal={parseExpenseTotal}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El gasto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
