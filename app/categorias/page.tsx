"use client"

import { useState, useEffect } from "react"
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
import { Edit, Plus, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { useCategories, useCategoryForm } from "./hooks"
import { Category } from "./types"

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories()

  const {
    formData: newCategory,
    updateField: updateNewCategory,
    resetForm: resetNewCategoryForm,
    errors: newCategoryErrors,
    isValid: isNewCategoryValid
  } = useCategoryForm()

  const {
    formData: editCategory,
    updateField: updateEditCategory,
    resetForm: resetEditCategoryForm,
    errors: editCategoryErrors,
    isValid: isEditCategoryValid,
    setFormData: setEditCategoryFormData
  } = useCategoryForm()

  // Estados para diálogos
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<number | null>(null)

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleAddCategory = async () => {
    if (!isNewCategoryValid()) return;
    
    try {
      console.log('Datos a enviar:', newCategory)
      await createCategory(newCategory)
      setIsAddDialogOpen(false)
      resetNewCategoryForm()
    } catch (error) {
      console.error('Error al crear categoría:', error)
    }
  }

  const handleEditCategory = async () => {
    if (!isEditCategoryValid() || !currentCategory) return;

    try {
      await updateCategory(String(currentCategory), editCategory)
      setIsEditDialogOpen(false)
      setCurrentCategory(null)
      resetEditCategoryForm()
    } catch {
      // Error ya manejado por el hook
    }
  }

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category.id)
    setEditCategoryFormData({
      name: category.name
    })
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
        <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
        <p className="text-muted-foreground">Administra las categorías de productos.</p>
      </div>

      <div className="flex items-center justify-between my-6">
        <div className="relative w-full max-w-sm">
          <Input
            type="search"
            placeholder="Buscar categorías..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Categoría</DialogTitle>
              <DialogDescription>Ingresa el nombre de la nueva categoría.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="name"
                    className={newCategoryErrors.name?.length ? "border-red-500" : ""}
                    value={newCategory.name}
                    onChange={(e) => updateNewCategory('name', e.target.value)}
                    placeholder="Nombre de la categoría"
                  />
                  {newCategoryErrors.name?.length > 0 && (
                    <p className="text-sm text-red-500">{newCategoryErrors.name.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCategory} disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorías</CardTitle>
          <CardDescription>Total de categorías: {categories.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No se encontraron categorías
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCategory(String(category.id))}>
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

      {/* Dialog para editar categoría */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Actualiza el nombre de la categoría.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nombre
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-name"
                  className={editCategoryErrors.name?.length ? "border-red-500" : ""}
                  value={editCategory.name}
                  onChange={(e) => updateEditCategory('name', e.target.value)}
                  placeholder="Nombre de la categoría"
                />
                {editCategoryErrors.name?.length > 0 && (
                  <p className="text-sm text-red-500">{editCategoryErrors.name.join(", ")}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCategory} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
} 