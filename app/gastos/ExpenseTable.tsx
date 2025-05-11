import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface ExpenseTableProps {
  expenses: any[]
  isLoading: boolean
  formatCurrency: (amount: number) => string
  parseExpenseTotal: (total: string | number) => number
  handleEditClick: (expense: any) => void
  handleDeleteClick: (id: number) => void
}

export function ExpenseTable({ expenses, isLoading, formatCurrency, parseExpenseTotal, handleEditClick, handleDeleteClick }: ExpenseTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Concepto</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="w-[100px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              Cargando gastos...
            </TableCell>
          </TableRow>
        ) : expenses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              No se encontraron gastos
            </TableCell>
          </TableRow>
        ) : (
          expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.concept}</TableCell>
              <TableCell>{formatCurrency(parseExpenseTotal(expense.total))}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(expense)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(expense.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
} 