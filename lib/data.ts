import { Category } from "@/app/categorias/types"

// Función para formatear moneda
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

// Función para obtener el nombre de una categoría por ID
export const getCategoryName = (categoryId: number): string => {
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.name : 'Sin categoría'
}

// Función para generar un ID único
export const generateId = (): number => {
  return Math.floor(Math.random() * 1000000)
}

// Categorías de ejemplo (temporal)
export const categories: Category[] = [
  { id: 1, name: 'Bebidas' },
  { id: 2, name: 'Snacks' },
  { id: 3, name: 'Lácteos' },
  { id: 4, name: 'Abarrotes' }
]

// Datos de ejemplo para el dashboard
export const sales = [
  { id: 1, total: 1500, status: "completed", date: "2024-03-15" },
  { id: 2, total: 2300, status: "completed", date: "2024-03-14" },
  { id: 3, total: 1800, status: "completed", date: "2024-03-13" },
  { id: 4, total: 950, status: "pending", date: "2024-03-12" },
  { id: 5, total: 3200, status: "completed", date: "2024-03-11" }
]

export const expenses = [
  { id: 1, amount: 500, description: "Servicios", date: "2024-03-15" },
  { id: 2, amount: 1200, description: "Inventario", date: "2024-03-14" },
  { id: 3, amount: 300, description: "Limpieza", date: "2024-03-13" }
]

export const products = [
  { id: 1, name: "Coca Cola 600ml", price: 18, stock: 8, categoryId: 1 },
  { id: 2, name: "Sabritas Original", price: 15, stock: 25, categoryId: 2 },
  { id: 3, name: "Leche Alpura 1L", price: 28, stock: 12, categoryId: 3 },
  { id: 4, name: "Arroz 1kg", price: 32, stock: 5, categoryId: 4 }
]

export const employees = [
  { id: 1, name: "Juan Pérez", position: "Cajero", status: "active" },
  { id: 2, name: "María García", position: "Gerente", status: "active" },
  { id: 3, name: "Carlos López", position: "Almacén", status: "active" },
  { id: 4, name: "Ana Martínez", position: "Cajera", status: "inactive" }
] 