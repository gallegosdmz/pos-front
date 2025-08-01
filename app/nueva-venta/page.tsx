"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Barcode, Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner"
import { useSale } from "./hooks"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

export default function NewSalePage() {
  const { toast } = useToast()
  const {
    products,
    cartItems,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadProducts,
    getProductByBarcode,
    addToCart,
    updateQuantity,
    removeFromCart,
    createSale,
    getProduct
  } = useSale()

  const [barcodeInput, setBarcodeInput] = useState<number>(0)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash")
  const [cashReceived, setCashReceived] = useState<number>(0)
  const [customerName, setCustomerName] = useState("")
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProduct(item.product)
    return sum + (product?.price || 0) * item.quantity
  }, 0)
  const tax = subtotal * 0.16
  const total = subtotal + tax
  const change = cashReceived - total

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        document.getElementById("barcode-input")?.focus()
      } else if (e.key === "F3") {
        document.getElementById("search-input")?.focus()
      } else if (e.key === "F4") {
        handleCompleteSale()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [cartItems])

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcodeInput) return

    const product = await getProductByBarcode(barcodeInput)
    if (product) {
      addToCart(product)
      setBarcodeInput(0)
    }
  }

  const handleQRScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length === 0) return;

    const id = detectedCodes[0].rawValue;
    console.log("QR leído:", id, typeof id);
    console.log("Productos cargados:", products);
    const product = await getProductByBarcode(id);
    console.log("Producto encontrado:", product);

    if (product) {
      addToCart(product);
      setIsQRScannerOpen(false);
    }
  };

  const handleQRError = (error: any) => {
    console.error("Error en QR Scanner:", error);
    toast({
      title: "Error al escanear",
      description: "No se pudo acceder a la cámara o hubo un error al escanear.",
      variant: "destructive",
    })
  }

  const handleCompleteSale = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito para completar la venta.",
        variant: "destructive",
      })
      return
    }

    setIsPaymentDialogOpen(true)
  }

  const handleProcessPayment = async () => {
    if (paymentMethod === "cash" && cashReceived < total) {
      toast({
        title: "Monto insuficiente",
        description: "El monto recibido es menor que el total a pagar.",
        variant: "destructive",
      })
      return
    }

    try {
      await createSale({
        client: (customerName.trim() === "" ? "Cliente General" : customerName).slice(0, 150),
        method: String(paymentMethod).slice(0, 150)
      })
      setIsPaymentDialogOpen(false)
      setCashReceived(0)
      setCustomerName("")
    } catch (error) {
      // Error ya manejado por el hook
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="animate-in"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Nueva Venta</h1>
        <p className="text-muted-foreground">Registra una nueva venta agregando productos al carrito.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Carrito de compras */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Carrito de Compras</CardTitle>
            <CardDescription>{cartItems.length} productos en el carrito</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Barcode className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barcode-input"
                      type="text"
                      placeholder="Escanear código o ingresar ID..."
                      className="pl-8"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(Number(e.target.value))}
                    />
                  </div>
                  <Button type="submit">Agregar</Button>
                  <Button type="button" variant="outline" onClick={() => setIsQRScannerOpen(true)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-qr-code mr-2"
                    >
                      <rect width="5" height="5" x="3" y="3" rx="1" />
                      <rect width="5" height="5" x="16" y="3" rx="1" />
                      <rect width="5" height="5" x="3" y="16" rx="1" />
                      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                      <path d="M21 21v.01" />
                      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                      <path d="M3 12h.01" />
                      <path d="M12 3h.01" />
                      <path d="M12 16v.01" />
                      <path d="M16 12h1" />
                      <path d="M21 12v.01" />
                      <path d="M12 21v-1" />
                    </svg>
                    Escanear QR
                  </Button>
                </form>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ShoppingCart className="h-12 w-12 mb-2" />
                          <p>El carrito está vacío</p>
                          <p className="text-sm">Agrega productos escaneando o buscando</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    cartItems.map((item) => {
                      const product = getProduct(item.product)
                      return (
                        <TableRow key={item.product}>
                          <TableCell className="font-medium">
                            {product ? product.name : "Producto desconocido"}
                          </TableCell>
                          <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.product, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.product, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(item.unitPrice * item.quantity)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-end">
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (16%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button className="w-full mt-4" size="lg" onClick={handleCompleteSale} disabled={cartItems.length === 0}>
                Completar Venta (F4)
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Catálogo de productos */}
        <Card>
          <CardHeader>
            <CardTitle>Catálogo de Productos</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-input"
                type="search"
                placeholder="Buscar productos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Cargando productos...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No se encontraron productos</div>
              ) : (
                products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="flex-1 p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(product.price)}</div>
                            <Badge variant={product.stock < 10 ? "destructive" : "outline"}>
                              Stock: {product.stock}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCart(product)}
                            disabled={product.stock < 1}
                          >
                            <Plus className="mr-1 h-4 w-4" />
                            Agregar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de pago */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Procesar Pago</DialogTitle>
            <DialogDescription>Selecciona el método de pago y completa la información.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Cliente
              </Label>
              <Input
                id="customer"
                placeholder="Cliente General"
                className="col-span-3"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <Tabs
              defaultValue="cash"
              onValueChange={(value) => setPaymentMethod(value as "cash" | "card" | "transfer")}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cash">Efectivo</TabsTrigger>
                <TabsTrigger value="card">Tarjeta</TabsTrigger>
                <TabsTrigger value="transfer">Transferencia</TabsTrigger>
              </TabsList>
              <TabsContent value="cash" className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cash-amount" className="text-right">
                    Monto Recibido
                  </Label>
                  <Input
                    id="cash-amount"
                    type="number"
                    className="col-span-3"
                    value={cashReceived || ""}
                    onChange={(e) => setCashReceived(Number(e.target.value))}
                  />
                </div>
                {cashReceived >= total && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Cambio</Label>
                    <div className="col-span-3 font-bold">{formatCurrency(change)}</div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="card">
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="card-number" className="text-right">
                      Número de Tarjeta
                    </Label>
                    <Input id="card-number" placeholder="**** **** **** ****" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="card-name" className="text-right">
                      Nombre en Tarjeta
                    </Label>
                    <Input id="card-name" placeholder="Nombre del titular" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-start-2 col-span-1">
                      <Label htmlFor="expiry" className="mb-2 block">
                        Expiración
                      </Label>
                      <Input id="expiry" placeholder="MM/AA" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="cvc" className="mb-2 block">
                        CVC
                      </Label>
                      <Input id="cvc" placeholder="CVC" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="transfer">
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reference" className="text-right">
                      Referencia
                    </Label>
                    <Input id="reference" placeholder="Número de referencia" className="col-span-3" />
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <div className="font-medium">Datos de transferencia:</div>
                    <div className="text-sm mt-2">
                      <p>Banco: Banco Ejemplo</p>
                      <p>Cuenta: 1234 5678 9012 3456</p>
                      <p>CLABE: 012 345 678 901 234 567</p>
                      <p>Beneficiario: Mi Negocio S.A. de C.V.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (16%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleProcessPayment}>Procesar Pago</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo del escáner de QR */}
      <Dialog open={isQRScannerOpen} onOpenChange={setIsQRScannerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escanear Código QR</DialogTitle>
            <DialogDescription>Apunta la cámara al código QR del producto para agregarlo al carrito.</DialogDescription>
          </DialogHeader>
          <RenderScannerLog />
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-full max-w-sm overflow-hidden rounded-lg">
              <Scanner
                onScan={(codes) => { console.log("onScan fired", codes); handleQRScan(codes); }}
                onError={handleQRError}
                scanDelay={500}
                constraints={{
                  facingMode: "environment",
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQRScannerOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function RenderScannerLog() {
  console.log("Renderizando Scanner QR");
  return null;
}
