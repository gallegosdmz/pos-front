// Tipos de datos
export interface Employee {
  id: string
  name: string
  position: string
  email: string
  phone: string
  startDate: string
  salary: number
  status: "active" | "inactive"
  avatar: string
}

export interface Category {
  id: string
  name: string
  description: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  barcode: string
  image: string
  cost: number
  createdAt: string
}

export interface Sale {
  id: string
  date: string
  total: number
  items: SaleItem[]
  paymentMethod: "cash" | "card" | "transfer"
  employeeId: string
  status: "completed" | "cancelled"
  customer?: string
}

export interface SaleItem {
  productId: string
  quantity: number
  price: number
  subtotal: number
}

export interface Expense {
  id: string
  date: string
  amount: number
  description: string
  category: string
  paymentMethod: "cash" | "card" | "transfer"
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  products: string[]
}

// Datos ficticios
export const employees: Employee[] = [
  {
    id: "EMP001",
    name: "Carlos Rodríguez",
    position: "Gerente",
    email: "carlos@example.com",
    phone: "555-1234",
    startDate: "2021-05-15",
    salary: 25000,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "EMP002",
    name: "Ana Martínez",
    position: "Cajero",
    email: "ana@example.com",
    phone: "555-2345",
    startDate: "2022-01-10",
    salary: 15000,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "EMP003",
    name: "Miguel López",
    position: "Vendedor",
    email: "miguel@example.com",
    phone: "555-3456",
    startDate: "2022-03-22",
    salary: 12000,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "EMP004",
    name: "Laura Sánchez",
    position: "Almacenista",
    email: "laura@example.com",
    phone: "555-4567",
    startDate: "2021-11-05",
    salary: 13500,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "EMP005",
    name: "Roberto Gómez",
    position: "Cajero",
    email: "roberto@example.com",
    phone: "555-5678",
    startDate: "2022-06-15",
    salary: 15000,
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export const categories: Category[] = [
  {
    id: "CAT001",
    name: "Electrónicos",
    description: "Productos electrónicos y gadgets",
  },
  {
    id: "CAT002",
    name: "Hogar",
    description: "Artículos para el hogar",
  },
  {
    id: "CAT003",
    name: "Ropa",
    description: "Prendas de vestir y accesorios",
  },
  {
    id: "CAT004",
    name: "Alimentos",
    description: "Productos alimenticios",
  },
  {
    id: "CAT005",
    name: "Bebidas",
    description: "Refrescos, agua y bebidas alcohólicas",
  },
]

export const products: Product[] = [
  {
    id: "PROD001",
    name: "Smartphone XYZ",
    description: "Smartphone de última generación",
    price: 8999.99,
    stock: 15,
    categoryId: "CAT001",
    barcode: "1234567890123",
    image: "/placeholder.svg?height=100&width=100",
    cost: 6500,
    createdAt: "2023-01-15",
  },
  {
    id: "PROD002",
    name: "Laptop Pro",
    description: "Laptop para profesionales",
    price: 18999.99,
    stock: 8,
    categoryId: "CAT001",
    barcode: "2345678901234",
    image: "/placeholder.svg?height=100&width=100",
    cost: 15000,
    createdAt: "2023-02-10",
  },
  {
    id: "PROD003",
    name: "Camiseta Casual",
    description: "Camiseta de algodón",
    price: 299.99,
    stock: 50,
    categoryId: "CAT003",
    barcode: "3456789012345",
    image: "/placeholder.svg?height=100&width=100",
    cost: 150,
    createdAt: "2023-03-05",
  },
  {
    id: "PROD004",
    name: "Sartén Antiadherente",
    description: "Sartén de 28cm antiadherente",
    price: 499.99,
    stock: 20,
    categoryId: "CAT002",
    barcode: "4567890123456",
    image: "/placeholder.svg?height=100&width=100",
    cost: 300,
    createdAt: "2023-01-20",
  },
  {
    id: "PROD005",
    name: "Refresco Cola",
    description: "Refresco de cola 2L",
    price: 25.99,
    stock: 100,
    categoryId: "CAT005",
    barcode: "5678901234567",
    image: "/placeholder.svg?height=100&width=100",
    cost: 15,
    createdAt: "2023-04-12",
  },
  {
    id: "PROD006",
    name: "Chocolate Premium",
    description: "Barra de chocolate premium 100g",
    price: 45.99,
    stock: 80,
    categoryId: "CAT004",
    barcode: "6789012345678",
    image: "/placeholder.svg?height=100&width=100",
    cost: 30,
    createdAt: "2023-03-15",
  },
  {
    id: "PROD007",
    name: "Audífonos Bluetooth",
    description: "Audífonos inalámbricos con cancelación de ruido",
    price: 1299.99,
    stock: 25,
    categoryId: "CAT001",
    barcode: "7890123456789",
    image: "/placeholder.svg?height=100&width=100",
    cost: 800,
    createdAt: "2023-02-28",
  },
  {
    id: "PROD008",
    name: "Jeans Clásicos",
    description: "Jeans de mezclilla clásicos",
    price: 599.99,
    stock: 30,
    categoryId: "CAT003",
    barcode: "8901234567890",
    image: "/placeholder.svg?height=100&width=100",
    cost: 350,
    createdAt: "2023-01-30",
  },
]

export const sales: Sale[] = [
  {
    id: "SALE001",
    date: "2023-05-15T14:30:00",
    total: 9299.98,
    items: [
      {
        productId: "PROD001",
        quantity: 1,
        price: 8999.99,
        subtotal: 8999.99,
      },
      {
        productId: "PROD003",
        quantity: 1,
        price: 299.99,
        subtotal: 299.99,
      },
    ],
    paymentMethod: "card",
    employeeId: "EMP002",
    status: "completed",
  },
  {
    id: "SALE002",
    date: "2023-05-16T10:15:00",
    total: 545.98,
    items: [
      {
        productId: "PROD004",
        quantity: 1,
        price: 499.99,
        subtotal: 499.99,
      },
      {
        productId: "PROD005",
        quantity: 2,
        price: 25.99,
        subtotal: 51.98,
      },
    ],
    paymentMethod: "cash",
    employeeId: "EMP003",
    status: "completed",
    customer: "Cliente General",
  },
  {
    id: "SALE003",
    date: "2023-05-16T16:45:00",
    total: 18999.99,
    items: [
      {
        productId: "PROD002",
        quantity: 1,
        price: 18999.99,
        subtotal: 18999.99,
      },
    ],
    paymentMethod: "transfer",
    employeeId: "EMP002",
    status: "completed",
    customer: "María González",
  },
  {
    id: "SALE004",
    date: "2023-05-17T09:30:00",
    total: 1345.98,
    items: [
      {
        productId: "PROD007",
        quantity: 1,
        price: 1299.99,
        subtotal: 1299.99,
      },
      {
        productId: "PROD005",
        quantity: 2,
        price: 25.99,
        subtotal: 51.98,
      },
    ],
    paymentMethod: "card",
    employeeId: "EMP003",
    status: "cancelled",
  },
  {
    id: "SALE005",
    date: "2023-05-17T14:20:00",
    total: 599.99,
    items: [
      {
        productId: "PROD008",
        quantity: 1,
        price: 599.99,
        subtotal: 599.99,
      },
    ],
    paymentMethod: "cash",
    employeeId: "EMP002",
    status: "completed",
  },
]

export const expenses: Expense[] = [
  {
    id: "EXP001",
    date: "2023-05-10T10:00:00",
    amount: 5000,
    description: "Pago de renta mensual",
    category: "Renta",
    paymentMethod: "transfer",
  },
  {
    id: "EXP002",
    date: "2023-05-12T14:30:00",
    amount: 1200,
    description: "Pago de servicios de electricidad",
    category: "Servicios",
    paymentMethod: "card",
  },
  {
    id: "EXP003",
    date: "2023-05-14T09:15:00",
    amount: 800,
    description: "Compra de material de oficina",
    category: "Suministros",
    paymentMethod: "cash",
  },
  {
    id: "EXP004",
    date: "2023-05-15T16:45:00",
    amount: 3500,
    description: "Mantenimiento de equipo",
    category: "Mantenimiento",
    paymentMethod: "transfer",
  },
  {
    id: "EXP005",
    date: "2023-05-16T11:30:00",
    amount: 1500,
    description: "Pago de servicio de internet",
    category: "Servicios",
    paymentMethod: "card",
  },
]

export const suppliers: Supplier[] = [
  {
    id: "SUP001",
    name: "Electrónicos Globales",
    contact: "Juan Pérez",
    email: "juan@electronicos.com",
    phone: "555-9876",
    address: "Av. Tecnología 123, Ciudad de México",
    products: ["PROD001", "PROD002", "PROD007"],
  },
  {
    id: "SUP002",
    name: "Textiles Modernos",
    contact: "María Gómez",
    email: "maria@textiles.com",
    phone: "555-8765",
    address: "Calle Moda 456, Guadalajara",
    products: ["PROD003", "PROD008"],
  },
  {
    id: "SUP003",
    name: "Hogar y Más",
    contact: "Roberto Sánchez",
    email: "roberto@hogar.com",
    phone: "555-7654",
    address: "Blvd. Casa 789, Monterrey",
    products: ["PROD004"],
  },
  {
    id: "SUP004",
    name: "Distribuidora de Alimentos",
    contact: "Laura Torres",
    email: "laura@alimentos.com",
    phone: "555-6543",
    address: "Av. Comida 321, Puebla",
    products: ["PROD006"],
  },
  {
    id: "SUP005",
    name: "Bebidas del Valle",
    contact: "Carlos Ramírez",
    email: "carlos@bebidas.com",
    phone: "555-5432",
    address: "Calle Refrescos 654, Querétaro",
    products: ["PROD005"],
  },
]

// Funciones de utilidad para simular operaciones CRUD

// Función para obtener un elemento por ID
export function getById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}

// Función para obtener el nombre de una categoría por ID
export function getCategoryName(categoryId: string): string {
  const category = categories.find((cat) => cat.id === categoryId)
  return category ? category.name : "Desconocida"
}

// Función para obtener el nombre de un empleado por ID
export function getEmployeeName(employeeId: string): string {
  const employee = employees.find((emp) => emp.id === employeeId)
  return employee ? employee.name : "Desconocido"
}

// Función para obtener el nombre de un producto por ID
export function getProductName(productId: string): string {
  const product = products.find((prod) => prod.id === productId)
  return product ? product.name : "Desconocido"
}

// Función para generar un ID único
export function generateId(prefix: string): string {
  const timestamp = new Date().getTime().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}${timestamp}${random}`.toUpperCase()
}

// Función para formatear moneda
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount)
}

// Función para formatear fecha
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Función para formatear fecha corta
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}
