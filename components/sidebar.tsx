"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Package, ShoppingCart, DollarSign, Truck, Menu, X, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Empleados",
    href: "/empleados",
    icon: Users,
  },
  {
    name: "Inventario",
    href: "/inventario",
    icon: Package,
  },
  {
    name: "Ventas",
    href: "/ventas",
    icon: ShoppingCart,
  },
  {
    name: "Gastos",
    href: "/gastos",
    icon: DollarSign,
  },
  {
    name: "Proveedores",
    href: "/proveedores",
    icon: Truck,
  },
  {
    name: "Nueva Venta",
    href: "/nueva-venta",
    icon: ShoppingCart,
    highlight: true,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  // Debug: mostrar ruta y estado admin
  console.log('SIDEBAR DEBUG - pathname:', pathname, 'isAdmin:', isAdmin)

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setIsAdmin(user?.role === 'Admin' || user?.role === 'Administrador')
      } catch {
        setIsAdmin(false)
      }
    } else {
      setIsAdmin(false)
    }
  }, [])

  if (pathname === "/login" || pathname === "/") {
    return null;
  }

  if (isAdmin === null) {
    return null // No renderizar el sidebar hasta saber el rol
  }

  const adminNavItems = [
    {
      name: "Dashboard Administrador",
      href: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Panel de Administración",
      href: "/admin-panel",
      icon: Users,
    },
  ]

  // Si la ruta incluye '/admin', mostrar solo dos botones especiales
  if (pathname.includes('/admin')) {
    return (
      <div className="hidden w-64 flex-shrink-0 border-r bg-card md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <h1 className="text-xl font-bold text-primary">Panel Admin</h1>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <Link href="/admin/businesses">
              <div
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  pathname === "/admin/businesses"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Users className="mr-3 h-5 w-5" />
                Panel
              </div>
            </Link>
            <Link href="/admin-dashboard">
              <div
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  pathname === "/admin-dashboard"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Admin Dashboard
              </div>
            </Link>
          </nav>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 transform bg-background/80 backdrop-blur-sm transition-all duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="flex h-full w-64 flex-col bg-background p-5 shadow-lg">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">POS System</h1>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <div className="space-y-1">
            {(isAdmin ? adminNavItems : navItems).map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <div
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : 'highlight' in item && item.highlight
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Sidebar for desktop */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden w-64 flex-shrink-0 border-r bg-card md:block"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <h1 className="text-xl font-bold text-primary">POS System</h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {(isAdmin ? adminNavItems : navItems).map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : 'highlight' in item && item.highlight
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  )
}
