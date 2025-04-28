"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, DollarSign, Package, ShoppingCart } from "lucide-react"
import { employees, products, sales, expenses } from "@/lib/data"
import { formatCurrency } from "@/lib/data"
import { motion } from "framer-motion"

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview")

  // Calcular estadísticas
  const totalSales = sales.filter((sale) => sale.status === "completed").reduce((sum, sale) => sum + sale.total, 0)

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const totalProfit = totalSales - totalExpenses

  const lowStockProducts = products.filter((product) => product.stock < 10).length

  const activeEmployees = employees.filter((employee) => employee.status === "active").length

  // Datos para gráficos
  const recentSales = sales
    .filter((sale) => sale.status === "completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
                <p className="text-xs text-muted-foreground">+20.1% respecto al mes anterior</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                <p className="text-xs text-muted-foreground">-4.5% respecto al mes anterior</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ganancias</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
                <p className="text-xs text-muted-foreground">+12.2% respecto al mes anterior</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventario Bajo</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockProducts} productos</div>
                <p className="text-xs text-muted-foreground">Requieren reabastecimiento</p>
              </CardContent>
            </Card>
          </div>
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
                        <p className="text-sm text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</p>
                      </div>
                      <div className="ml-auto font-medium">{formatCurrency(sale.total)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 card-hover">
              <CardHeader>
                <CardTitle>Empleados Activos</CardTitle>
                <CardDescription>Total de empleados activos: {activeEmployees}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {employees
                    .filter((employee) => employee.status === "active")
                    .slice(0, 5)
                    .map((employee) => (
                      <div key={employee.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.position}</p>
                        </div>
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
                <CardDescription>Distribución de ventas por método de pago</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="flex h-[200px] items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xl font-bold">Gráfico de Ventas</div>
                    <div className="text-sm text-muted-foreground">(Simulación de gráfico)</div>
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Efectivo</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Tarjeta</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Transferencia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 card-hover">
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Top 5 productos con más ventas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {products.slice(0, 5).map((product) => (
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
      </Tabs>
    </motion.div>
  )
}
