import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { SaleDetail } from "./types"

interface SaleDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSaleId: number | null
  isLoadingDetails: boolean
  saleDetails: SaleDetail[]
  formatCurrency: (amount: number) => string
  formatDate: (date: string | Date) => string
}

export function SaleDetailsDialog({ open, onOpenChange, selectedSaleId, isLoadingDetails, saleDetails, formatCurrency }: SaleDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles de la Venta #{selectedSaleId}</DialogTitle>
        </DialogHeader>
        {isLoadingDetails ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleDetails.map((detail: SaleDetail) => (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.product?.name || `Producto ${detail.productId}`}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>{formatCurrency(detail.unitPrice)}</TableCell>
                    <TableCell>{formatCurrency(detail.quantity * detail.unitPrice)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    IVA:
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(saleDetails.reduce((sum, detail) => sum + (detail.quantity * detail.unitPrice) * 0.16, 0))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total:
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(saleDetails.reduce((sum, detail) => sum + (detail.quantity * detail.unitPrice) + (detail.quantity * detail.unitPrice) * 0.16, 0))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 