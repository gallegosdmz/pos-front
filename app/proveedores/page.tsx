"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { suppliers, type Supplier, getProductName, generateId } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function SuppliersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(suppliers)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null)
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    products: [],
  })

  const filteredSuppliers = suppliersList.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSupplier = () => {
    const supplier: Supplier = {
      id: generateId("SUP"),
      name: newSupplier.name || "",
      contact: newSupplier.contact || "",
      email: newSupplier.email || "",
      phone: newSupplier.phone || "",
      address: newSupplier.address || "",
      products: newSupplier.products || [],
    }

    setSuppliersList([...suppliersList, supplier])
    setIsAddDialogOpen(false)
    setNewSupplier({
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      products: [],
    })

    toast({
      title: "Proveedor agregado",
      description: `${supplier.name} ha sido agregado correctamente.`,
    })
  }

  const handleEditSupplier = () => {
    if (!currentSupplier) return

    const updatedSuppliers = suppliersList.map((sup) => (sup.id === currentSupplier.id ? currentSupplier : sup))

    setSuppliersList(updatedSuppliers)
    setIsEditDialogOpen(false)
    setCurrentSupplier(null)

    toast({
      title: "Proveedor actualizado",
      description: `La información de ${currentSupplier.name} ha sido actualizada.`,
    })
  }

  const handleDeleteSupplier = (id: string) => {
    const supplierToDelete = suppliersList.find((sup) => sup.id === id)
    if (!supplierToDelete) return

    const updatedSuppliers = suppliersList.filter((sup) => sup.id !== id)
    setSuppliersList(updatedSuppliers)

    toast({
      title: "Proveedor eliminado",
      description: `${supplierToDelete.name} ha sido eliminado correctamente.`,
      variant: "destructive",
    })
  }

  const openEditDialog = (supplier: Supplier) => {
    setCurrentSupplier({ ...supplier })
    setIsEditDialogOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="animate-in"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
        <p className="text-muted-foreground">Administra la información de tus proveedores.</p>
      </div>

      <div className="flex items-center justify-between my-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar proveedores..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
              <DialogDescription>Ingresa la información del nuevo proveedor.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contacto
                </Label>
                <Input
                  id="contact"
                  className="col-span-3"
                  value={newSupplier.contact}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  className="col-span-3"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Dirección
                </Label>
                <Textarea
                  id="address"
                  className="col-span-3"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSupplier}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>Total de proveedores: {suppliersList.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No se encontraron proveedores
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{supplier.address}</TableCell>
                    <TableCell>
                      {supplier.products.length > 0
                        ? supplier.products.map((id) => getProductName(id)).join(", ")
                        : "Sin productos"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(supplier)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSupplier(supplier.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para editar proveedor */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
            <DialogDescription>Actualiza la información del proveedor.</DialogDescription>
          </DialogHeader>
          {currentSupplier && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={currentSupplier.name}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contact" className="text-right">
                  Contacto
                </Label>
                <Input
                  id="edit-contact"
                  className="col-span-3"
                  value={currentSupplier.contact}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, contact: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  className="col-span-3"
                  value={currentSupplier.email}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="edit-phone"
                  className="col-span-3"
                  value={currentSupplier.phone}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Dirección
                </Label>
                <Textarea
                  id="edit-address"
                  className="col-span-3"
                  value={currentSupplier.address}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, address: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSupplier}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
