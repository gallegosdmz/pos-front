"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { SalesService } from "../ventas/service"
import { ProductService } from "../inventario/service"
import { ExpenseService } from "../gastos/service"
import type { Sale } from "../ventas/types"
import type { Product } from "../inventario/types"
import type { Expense } from "../gastos/types"
import { DashboardStats } from "./DashboardStats"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch data
  const { data: sales = [], isLoading: isLoadingSales } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      await delay(0); // No delay para la primera
      return SalesService.getSales();
    }
  })
  const { data: expenses = [], isLoading: isLoadingExpenses, error: expensesError } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      await delay(1000); // Espera 1 segundo después de ventas
      return ExpenseService.getExpenses();
    }
  })
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      await delay(2000); // Espera 2 segundos después de ventas
      return ProductService.getProducts();
    }
  })

  // Calcular estadísticas
  const totalSales = sales
    .filter((sale: Sale) => sale.status === "completed")
    .reduce((sum: number, sale: Sale) => {
      const saleTotal = typeof sale.total === 'number' ? sale.total : 0
      return sum + saleTotal
    }, 0)

  const totalExpenses = Array.isArray(expenses) ? expenses.reduce((sum: number, expense: Expense) => {
    const expenseTotal = typeof expense.total === 'string' 
      ? parseFloat(expense.total) 
      : typeof expense.total === 'number' 
        ? expense.total 
        : 0
    return sum + expenseTotal
  }, 0) : 0

  const totalProfit = Number(totalSales) - Number(totalExpenses)

  // Determinar clases de color
  const profitColor = totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
  const expenseColor = 'text-red-600'
  const salesColor = 'text-green-600'

  const lowStockProducts = products.filter((product: Product) => {
    const stock = typeof product.stock === 'number' ? product.stock : 0
    return stock < 10
  }).length

  // Datos para gráficos
  const recentSales = sales
    .filter((sale: Sale) => sale.status === "completed")
    .sort((a: Sale, b: Sale) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Top productos más vendidos
  const topProducts = products
    .sort((a: Product, b: Product) => (b.stock || 0) - (a.stock || 0))
    .slice(0, 5)

  if (isLoadingProducts || isLoadingSales || isLoadingExpenses) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al sistema de punto de venta. Aquí puedes ver un resumen de tu negocio.
        </p>
      </div>

      <Tabs defaultValue="overview" className="mt-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardStats
            totalSales={formatCurrency(totalSales)}
            totalExpenses={formatCurrency(totalExpenses)}
            totalProfit={formatCurrency(totalProfit)}
            lowStockProducts={lowStockProducts}
            salesColor={salesColor}
            expenseColor={expenseColor}
            profitColor={profitColor}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 card-hover">
              <CardHeader>
                <CardTitle>Ventas Recientes</CardTitle>
                <CardDescription>Las últimas 5 ventas realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Venta #{sale.id}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(sale.date)}</p>
                      </div>
                      <div className="ml-auto font-medium">{formatCurrency(sale.total)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 card-hover">
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Top 5 productos en inventario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Stock: {product.stock} unidades</p>
                      </div>
                      <div className="ml-auto font-medium">{formatCurrency(product.price)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 card-hover">
              <CardHeader>
                <CardTitle>Análisis de Ventas</CardTitle>
                <CardDescription>Resumen de ventas del mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">Total de Ventas</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total de Gastos</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Ganancia Neta</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalProfit)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Número de Ventas</p>
                    <p className="text-2xl font-bold">{sales.filter(s => s.status === 'completed').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 card-hover">
              <CardHeader>
                <CardTitle>Estado del Inventario</CardTitle>
                <CardDescription>Resumen de productos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Total de Productos</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Productos con Stock Bajo</p>
                    <p className="text-2xl font-bold">{lowStockProducts}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Valor del Inventario</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        products.reduce((sum: number, product: Product) => {
                          const price = typeof product.price === 'number' ? product.price : 0
                          const stock = typeof product.stock === 'number' ? product.stock : 0
                          return sum + (price * stock)
                        }, 0)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
} 