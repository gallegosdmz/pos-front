"use client"

import { useEffect, useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Edit, Search, Trash2, Building2 } from "lucide-react"
import { motion } from "framer-motion"
import { Supplier } from "./types"
import { useSuppliers, useSupplierForm } from "./hooks"

export default function SuppliersPage() {
  const {
    suppliers,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
  } = useSuppliers()

  const {
    formData: newSupplier,
    updateField: updateNewSupplier,
    resetForm: resetNewSupplierForm,
    errors: newSupplierErrors,
    isValid: isNewSupplierValid
  } = useSupplierForm()

  const {
    formData: editSupplier,
    updateField: updateEditSupplier,
    resetForm: resetEditForm,
    errors: editSupplierErrors,
    isValid: isEditSupplierValid
  } = useSupplierForm()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentSupplierId, setCurrentSupplierId] = useState<number | null>(null)

  useEffect(() => {
    loadSuppliers()
  }, [loadSuppliers])

  const handleAddSupplier = async () => {
    if (!isNewSupplierValid()) return;
    
    try {
      await createSupplier(newSupplier)
      setIsAddDialogOpen(false)
      resetNewSupplierForm()
    } catch {
      // Error ya manejado por el hook
    }
  }

  const handleEditSupplier = async () => {
    if (!isEditSupplierValid() || currentSupplierId === null) return;

    try {
      await updateSupplier(currentSupplierId, editSupplier)
      setIsEditDialogOpen(false)
      setCurrentSupplierId(null)
      resetEditForm()
    } catch {
      // Error ya manejado por el hook
    }
  }

  const handleDeleteSupplier = async (id: number) => {
    try {
      await deleteSupplier(id)
    } catch {
      // Error ya manejado por el hook
    }
  }

  const openEditDialog = (supplier: Supplier) => {
    setCurrentSupplierId(supplier.id)
    updateEditSupplier('name', supplier.name)
    updateEditSupplier('contact', supplier.contact)
    updateEditSupplier('phone', supplier.phone)
    updateEditSupplier('email', supplier.email)
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
        <p className="text-muted-foreground">Administra la información de los proveedores de tu negocio.</p>
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
              <Building2 className="mr-2 h-4 w-4" />
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
                  Empresa
                </Label>
                <div className="col-span-3 space-y-2">
                <Input
                  id="name"
                    className={newSupplierErrors.name?.length ? "border-red-500" : ""}
                  value={newSupplier.name}
                    onChange={(e) => updateNewSupplier('name', e.target.value)}
                    placeholder="Nombre de la empresa"
                />
                  {newSupplierErrors.name?.length > 0 && (
                    <p className="text-sm text-red-500">{newSupplierErrors.name.join(", ")}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contacto
                </Label>
                <div className="col-span-3 space-y-2">
                <Input
                  id="contact"
                    className={newSupplierErrors.contact?.length ? "border-red-500" : ""}
                  value={newSupplier.contact}
                    onChange={(e) => updateNewSupplier('contact', e.target.value)}
                    placeholder="Nombre del contacto"
                />
                  {newSupplierErrors.contact?.length > 0 && (
                    <p className="text-sm text-red-500">{newSupplierErrors.contact.join(", ")}</p>
                  )}
              </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <div className="col-span-3 space-y-2">
                <Input
                  id="phone"
                    className={newSupplierErrors.phone?.length ? "border-red-500" : ""}
                  value={newSupplier.phone}
                    onChange={(e) => updateNewSupplier('phone', e.target.value)}
                    placeholder="Número de teléfono"
                />
                  {newSupplierErrors.phone?.length > 0 && (
                    <p className="text-sm text-red-500">{newSupplierErrors.phone.join(", ")}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="email"
                    type="email"
                    className={newSupplierErrors.email?.length ? "border-red-500" : ""}
                    value={newSupplier.email}
                    onChange={(e) => updateNewSupplier('email', e.target.value)}
                    placeholder="Correo electrónico"
                  />
                  {newSupplierErrors.email?.length > 0 && (
                    <p className="text-sm text-red-500">{newSupplierErrors.email.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSupplier} disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>Total de proveedores: {suppliers.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {isLoading ? "Cargando..." : "No se encontraron proveedores"}
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>
                      <Badge variant={!supplier.isDeleted ? "default" : "secondary"}>
                        {!supplier.isDeleted ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(supplier)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                Empresa
                </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-name"
                  className={editSupplierErrors.name?.length ? "border-red-500" : ""}
                  value={editSupplier.name}
                  onChange={(e) => updateEditSupplier('name', e.target.value)}
                  placeholder="Nombre de la empresa"
                />
                {editSupplierErrors.name?.length > 0 && (
                  <p className="text-sm text-red-500">{editSupplierErrors.name.join(", ")}</p>
                )}
              </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contact" className="text-right">
                  Contacto
                </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-contact"
                  className={editSupplierErrors.contact?.length ? "border-red-500" : ""}
                  value={editSupplier.contact}
                  onChange={(e) => updateEditSupplier('contact', e.target.value)}
                  placeholder="Nombre del contacto"
                />
                {editSupplierErrors.contact?.length > 0 && (
                  <p className="text-sm text-red-500">{editSupplierErrors.contact.join(", ")}</p>
                )}
              </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Teléfono
                </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-phone"
                  className={editSupplierErrors.phone?.length ? "border-red-500" : ""}
                  value={editSupplier.phone}
                  onChange={(e) => updateEditSupplier('phone', e.target.value)}
                  placeholder="Número de teléfono"
                />
                {editSupplierErrors.phone?.length > 0 && (
                  <p className="text-sm text-red-500">{editSupplierErrors.phone.join(", ")}</p>
                )}
              </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
                </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-email"
                  type="email"
                  className={editSupplierErrors.email?.length ? "border-red-500" : ""}
                  value={editSupplier.email}
                  onChange={(e) => updateEditSupplier('email', e.target.value)}
                  placeholder="Correo electrónico"
                />
                {editSupplierErrors.email?.length > 0 && (
                  <p className="text-sm text-red-500">{editSupplierErrors.email.join(", ")}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSupplier} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
