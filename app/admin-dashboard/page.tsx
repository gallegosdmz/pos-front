"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DashboardStats } from "../dashboard/DashboardStats";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

export default function AdminDashboardPage() {
  // Simulación de datos crudos
  const [stats] = useState({
    totalUsuarios: 42,
    totalNegocios: 7,
    ventasHoy: 12345,
    gastosHoy: 2345,
    ultimosAccesos: [
      { nombre: "Eduardo Gallegos", fecha: "2024-06-01 09:12" },
      { nombre: "Usuario de Premias", fecha: "2024-06-01 08:55" },
      { nombre: "Admin", fecha: "2024-05-31 22:10" },
    ],
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="animate-in"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Panel de control para administradores. Aquí puedes ver un resumen global del sistema.
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <DashboardStats
          totalSales={formatCurrency(stats.ventasHoy)}
          totalExpenses={formatCurrency(stats.gastosHoy)}
          totalProfit={formatCurrency(stats.ventasHoy - stats.gastosHoy)}
          lowStockProducts={stats.totalNegocios}
          salesColor="text-green-600"
          expenseColor="text-red-600"
          profitColor={stats.ventasHoy - stats.gastosHoy >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="col-span-2 card-hover">
            <CardHeader>
              <CardTitle>Usuarios Totales</CardTitle>
              <CardDescription>Usuarios registrados en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">{stats.totalUsuarios}</span>
            </CardContent>
          </Card>
          <Card className="col-span-2 card-hover">
            <CardHeader>
              <CardTitle>Negocios Totales</CardTitle>
              <CardDescription>Negocios registrados en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">{stats.totalNegocios}</span>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Últimos accesos</CardTitle>
            <CardDescription>Actividad reciente de administradores</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {stats.ultimosAccesos.map((acceso, idx) => (
                <li key={idx} className="mb-1">
                  <span className="font-semibold">{acceso.nombre}</span> - <span className="text-muted-foreground">{acceso.fecha}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
} 