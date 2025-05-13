"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search} from "lucide-react"
import { motion } from "framer-motion"
import { Supplier } from "./types"
import { useSuppliers, useSupplierForm } from "./hooks"
import { SupplierTable } from "./SupplierTable"
import { AddSupplierDialog } from "./AddSupplierDialog"
import { EditSupplierDialog } from "./EditSupplierDialog"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

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

  const handleAskDeleteSupplier = (id: number) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDeleteSupplier = async () => {
    if (deletingId !== null) {
      await handleDeleteSupplier(deletingId)
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
    }
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
        <AddSupplierDialog
          open={isAddDialogOpen}
          setOpen={setIsAddDialogOpen}
          formData={newSupplier}
          errors={newSupplierErrors}
          updateField={updateNewSupplier}
          isLoading={isLoading}
          onSubmit={handleAddSupplier}
          resetForm={resetNewSupplierForm}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>Total de proveedores: {suppliers.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierTable
            suppliers={suppliers}
            isLoading={isLoading}
            openEditDialog={openEditDialog}
            handleDeleteSupplier={handleAskDeleteSupplier}
          />
        </CardContent>
      </Card>

      <EditSupplierDialog
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
        formData={editSupplier}
        errors={editSupplierErrors}
        updateField={updateEditSupplier}
        isLoading={isLoading}
        onSubmit={handleEditSupplier}
        resetForm={resetEditForm}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDeleteSupplier}
        title="¿Eliminar proveedor?"
        description="Esta acción eliminará el proveedor permanentemente."
        confirmText="Eliminar proveedor"
      />
    </motion.div>
  )
}
