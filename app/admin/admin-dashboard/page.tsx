"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

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

  // Aquí podrías agregar lógica para proteger la página solo para administradores

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
      <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">{stats.totalUsuarios}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de Negocios</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">{stats.totalNegocios}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ventas Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold text-green-600">${stats.ventasHoy}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold text-red-600">${stats.gastosHoy}</span>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Últimos accesos</CardTitle>
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
    </motion.div>
  );
} 