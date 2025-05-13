"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  })

  const handleQuickAdminLogin = async () => {
    setFormData({
      userName: "admin",
      password: "Admin123"
    })
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: "admin",
          password: "Admin123"
        }),
      })

      if (!response.ok) {
        throw new Error("Credenciales inválidas")
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido administrador",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.log('Mostrando toast de error', error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateFirstAdmin = async () => {
    setIsCreatingAdmin(true)
    try {
      const response = await fetch("http://localhost:3000/api/users/create-first-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear el administrador")
      }

      const data = await response.json()
      toast({
        title: "Administrador creado",
        description: "Se ha creado el primer administrador con éxito. Usuario: admin, Contraseña: Admin123",
      })

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al crear el administrador",
        variant: "destructive",
      })
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://82.180.133.39/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Credenciales inválidas")
      }

      const data = await response.json()
      console.log('Response completo del login:', data)
      localStorage.setItem("token", data.token)
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema",
      })

      if (data.role === 'admin') {
        router.push("/admin/businesses")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.log('Mostrando toast de error', error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/90 dark:bg-gray-900/90 p-4 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
        className="w-full max-w-md"
    >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
              </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Usuario</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  required
                />
          </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                </div>
              </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </CardFooter>
          </form>
            </Card>
      </motion.div>
          </div>
  )
}
