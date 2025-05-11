import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Sale } from "./types"

interface SalesTableProps {
  sales: Sale[]
  isLoading: boolean
  filteredSales: Sale[]
  formatDate: (date: string | Date) => string
  formatCurrency: (amount: number) => string
  setSelectedSaleId: (id: number) => void
}

export function SalesTable({ sales, isLoading, filteredSales, formatDate, formatCurrency, setSelectedSaleId }: SalesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="w-[100px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Cargando ventas...
            </TableCell>
          </TableRow>
        ) : filteredSales.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No se encontraron ventas
            </TableCell>
          </TableRow>
        ) : (
          filteredSales.map((sale) => (
            <TableRow key={`sale-${sale.id}`}>
              <TableCell className="font-medium">{sale.id}</TableCell>
              <TableCell>{formatDate(sale.date)}</TableCell>
              <TableCell>{formatCurrency(sale.total)}</TableCell>
              <TableCell>
                <Badge variant={sale.status === "completed" ? "default" : "destructive"}>
                  {sale.status === "completed" ? "Completada" : "Cancelada"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedSaleId(sale.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
} 