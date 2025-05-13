"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { QRCodeCanvas } from "qrcode.react"
import { useProducts, useProductForm } from "./hooks"
import { Product } from "./types"
import { useCategories, useCategoryForm } from "@/app/categorias/hooks"
import { Category} from "@/app/categorias/types"
import { toast } from "@/hooks/use-toast"
import { useSuppliers } from "@/app/proveedores/hooks"
import { ProductTable } from "./ProductTable"
import { AddProductDialog } from "./AddProductDialog"
import { EditProductDialog } from "./EditProductDialog"
import { CategoryTable } from "@/app/categorias/CategoryTable"
import { AddCategoryDialog } from "@/app/categorias/AddCategoryDialog"
import { EditCategoryDialog } from "@/app/categorias/EditCategoryDialog"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"

// Mantenemos las categorías de ejemplo por ahora

export default function InventoryPage() {
  const {
    products,
    isLoading: isLoadingProducts,
    searchTerm,
    setSearchTerm,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProducts()

  const {
    categories,
    isLoading: isLoadingCategories,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories()

  const {
    suppliers,
    isLoading: isLoadingSuppliers,
    loadSuppliers
  } = useSuppliers()

  const {
    formData: newProduct,
    updateField: updateNewProduct,
    resetForm: resetNewProductForm,
    errors: newProductErrors,
    isValid: isNewProductValid
  } = useProductForm()

  const {
    formData: newCategory,
    updateField: updateNewCategory,
    resetForm: resetNewCategoryForm,
    errors: newCategoryErrors,
    isValid: isNewCategoryValid
  } = useCategoryForm()

  const {
    formData: editProduct,
    updateField: updateEditProduct,
    resetForm: resetEditProductForm,
    errors: editProductErrors,
    isValid: isEditProductValid,
    setFormData: setEditProductFormData
  } = useProductForm()

  const {
    formData: editCategory,
    updateField: updateEditCategory,
    resetForm: resetEditCategoryForm,
    errors: editCategoryErrors,
    isValid: isEditCategoryValid,
    setFormData: setEditCategoryFormData
  } = useCategoryForm()

  // Estados para diálogos
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<number | null>(null)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
  const [currentQRProduct, setCurrentQRProduct] = useState<Product | null>(null)

  // Estados para diálogos de eliminación
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null)

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    loadProducts()
    loadCategories()
    loadSuppliers()
  }, [loadProducts, loadCategories, loadSuppliers])

  const handleAddProduct = async () => {
    console.log("[DEBUG] Click en Guardar producto");
    console.log("[DEBUG] Datos actuales del formulario:", newProduct);
    const valid = isNewProductValid();
    console.log("[DEBUG] ¿Formulario válido?:", valid);
    if (!valid) {
      console.log("[DEBUG] Formulario inválido. Errores:", newProductErrors);
      return;
    }
    try {
      console.log("[DEBUG] Llamando a createProduct con:", newProduct, categories, suppliers);
      const result = await createProduct(newProduct, categories, suppliers)
      console.log("[DEBUG] Respuesta de createProduct:", result);
      await loadProducts() // Recargar la lista de productos
      setIsAddProductDialogOpen(false)
      resetNewProductForm()
      console.log("[DEBUG] Producto guardado y formulario reseteado");
    } catch (error) {
      console.log("[DEBUG] Error al guardar producto", error);
      // Error ya manejado por el hook
    }
  }

  const handleEditProduct = async () => {
    if (!isEditProductValid() || !currentProduct) return;

    try {
      await updateProduct(currentProduct, editProduct)
      setIsEditProductDialogOpen(false)
      setCurrentProduct(null)
      resetEditProductForm()
    } catch {
      // Error ya manejado por el hook
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id)
    } catch {
      // Error ya manejado por el hook
    }
  }

  const handleAddCategory = async () => {
    if (!isNewCategoryValid()) return;
    
    try {
      await createCategory(newCategory)
      setIsAddCategoryDialogOpen(false)
      resetNewCategoryForm()
    } catch {
      // Error ya manejado por el hook
    }
  }

  const handleEditCategory = async () => {
    if (!isEditCategoryValid() || !currentCategory) {
      return;
    }

    try {
      await updateCategory(currentCategory, editCategory);
      await loadCategories(); // Recargar las categorías después de la actualización
      setIsEditCategoryDialogOpen(false);
      setCurrentCategory(null);
      resetEditCategoryForm();
      toast({
        title: "Éxito",
        description: "Categoría actualizada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    // Verificar si hay productos que usan esta categoría
    const productsWithCategory = products.filter((prod) => String(prod.category) === id)

    if (productsWithCategory.length > 0) {
      toast({
        title: "No se puede eliminar",
        description: `No se puede eliminar la categoría porque hay ${productsWithCategory.length} productos asociados a ella.`,
        variant: "destructive",
      })
      return
    }

    try {
      await deleteCategory(id)
    } catch {
      // Error ya manejado por el hook
    }
  }

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product.id)
    setEditProductFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      purchasePrice: product.purchasePrice,
      barCode: product.barCode,
      category: product.category.id,
      supplier: product.supplier.id
    })
    setIsEditProductDialogOpen(true)
  }

  const openEditCategoryDialog = (category: Category) => {
    try {
      setEditCategoryFormData({
        name: category.name
      });
      
      setCurrentCategory(String(category.id));
      
      setIsEditCategoryDialogOpen(true);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo abrir el diálogo de edición",
        variant: "destructive",
      });
    }
  }

  const openQRDialog = (product: Product) => {
    setCurrentQRProduct(product)
    setIsQRDialogOpen(true)
  }

  const handleDownloadQR = () => {
    if (!currentQRProduct) return

    const canvas = document.getElementById("product-qr") as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `qr-${currentQRProduct.id}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const handleCategorySelect = (value: string) => {
    const categoryId = Number(value);
    console.log('ID de categoría seleccionada:', categoryId);
    // Actualizar tanto categoryId como supplierId
    updateNewProduct('category', categoryId);
    updateNewProduct('supplier', categoryId);
  };

  const handleAskDeleteProduct = (id: number) => {
    setDeletingProductId(id)
    setIsDeleteProductDialogOpen(true)
  }
  const handleConfirmDeleteProduct = async () => {
    if (deletingProductId !== null) {
      await handleDeleteProduct(deletingProductId)
      setIsDeleteProductDialogOpen(false)
      setDeletingProductId(null)
    }
  }

  const handleAskDeleteCategory = (id: number) => {
    setDeletingCategoryId(id)
    setIsDeleteCategoryDialogOpen(true)
  }
  const handleConfirmDeleteCategory = async () => {
    if (deletingCategoryId !== null) {
      await handleDeleteCategory(String(deletingCategoryId))
      setIsDeleteCategoryDialogOpen(false)
      setDeletingCategoryId(null)
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
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
        <p className="text-muted-foreground">Administra los productos y categorías de tu inventario.</p>
      </div>

      <div className="flex items-center justify-between my-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar en inventario..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="products" className="mt-6">
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-end">
            <AddProductDialog
              open={isAddProductDialogOpen}
              setOpen={setIsAddProductDialogOpen}
              formData={newProduct}
              errors={newProductErrors}
              updateField={updateNewProduct}
              categories={categories}
              suppliers={suppliers}
              isLoading={isLoadingProducts}
              onSubmit={handleAddProduct}
              resetForm={resetNewProductForm}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>Total de productos: {products.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductTable
                products={products}
                isLoading={isLoadingProducts}
                openEditDialog={openEditDialog}
                handleDeleteProduct={handleAskDeleteProduct}
                handleShowQR={openQRDialog}
              />
            </CardContent>
          </Card>
          <EditProductDialog
            open={isEditProductDialogOpen}
            setOpen={setIsEditProductDialogOpen}
            formData={editProduct}
            errors={editProductErrors}
            updateField={updateEditProduct}
            categories={categories}
            suppliers={suppliers}
            isLoading={isLoadingProducts}
            onSubmit={handleEditProduct}
            resetForm={resetEditProductForm}
          />
          <DeleteConfirmDialog
            open={isDeleteProductDialogOpen}
            onOpenChange={setIsDeleteProductDialogOpen}
            onConfirm={handleConfirmDeleteProduct}
            title="¿Eliminar producto?"
            description="Esta acción eliminará el producto permanentemente."
            confirmText="Eliminar producto"
          />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <AddCategoryDialog
              open={isAddCategoryDialogOpen}
              setOpen={setIsAddCategoryDialogOpen}
              formData={newCategory}
              errors={newCategoryErrors}
              updateField={updateNewCategory}
              isLoading={isLoadingCategories}
              onSubmit={handleAddCategory}
              resetForm={resetNewCategoryForm}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Lista de Categorías</CardTitle>
              <CardDescription>Total de categorías: {categories.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryTable
                categories={categories}
                isLoading={isLoadingCategories}
                openEditDialog={openEditCategoryDialog}
                handleDeleteCategory={handleAskDeleteCategory}
              />
            </CardContent>
          </Card>
          <EditCategoryDialog
            open={isEditCategoryDialogOpen}
            setOpen={setIsEditCategoryDialogOpen}
            formData={editCategory}
            errors={editCategoryErrors}
            updateField={updateEditCategory}
            isLoading={isLoadingCategories}
            onSubmit={handleEditCategory}
            resetForm={resetEditCategoryForm}
          />
          <DeleteConfirmDialog
            open={isDeleteCategoryDialogOpen}
            onOpenChange={setIsDeleteCategoryDialogOpen}
            onConfirm={handleConfirmDeleteCategory}
            title="¿Eliminar categoría?"
            description="Esta acción eliminará la categoría permanentemente."
            confirmText="Eliminar categoría"
          />
        </TabsContent>
      </Tabs>

      {/* Dialog para mostrar QR */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR del producto</DialogTitle>
            <DialogDescription>
              Escanea este código QR para ver el producto.
            </DialogDescription>
          </DialogHeader>
          {currentQRProduct && (
            <div className="flex flex-col items-center justify-center py-4">
              <QRCodeCanvas id="product-qr" value={currentQRProduct.barCode} size={200} includeMargin={true} level="H" />
              <div className="mt-4 text-center">
                <div className="font-bold">{currentQRProduct.name}</div>
                <div className="text-sm text-muted-foreground">{currentQRProduct.barCode}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQRDialogOpen(false)}>Cerrar</Button>
            <Button onClick={handleDownloadQR}>Descargar QR</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
