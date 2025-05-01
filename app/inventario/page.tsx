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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { QRCodeCanvas } from "qrcode.react"
import { useProducts, useProductForm } from "./hooks"
import { Product } from "./types"
import { useCategories, useCategoryForm } from "@/app/categorias/hooks"
import { Category } from "@/app/categorias/types"
import { formatCurrency, getCategoryName, generateId } from "@/lib/data"
import { toast } from "@/components/ui/use-toast"
import { useSuppliers } from "@/app/proveedores/hooks"

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

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    loadProducts()
    loadCategories()
    loadSuppliers()
  }, [loadProducts, loadCategories, loadSuppliers])

  const handleAddProduct = async () => {
    console.log('Validando producto:', newProduct)
    if (!isNewProductValid()) {
      console.log('Validación fallida')
      return;
    }
    
    try {
      console.log('Intentando crear producto:', newProduct)
      const response = await createProduct(newProduct)
      console.log('Producto creado:', response)
      await loadProducts() // Recargar la lista de productos
      setIsAddProductDialogOpen(false)
      resetNewProductForm()
    } catch (error) {
      console.error('Error al crear producto:', error)
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
    if (!isEditCategoryValid() || !currentCategory) return;

    try {
      await updateCategory(currentCategory, editCategory)
      setIsEditCategoryDialogOpen(false)
      setCurrentCategory(null)
      resetEditCategoryForm()
    } catch {
      // Error ya manejado por el hook
    }
  }

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
    setCurrentCategory(String(category.id))
    setEditCategoryFormData({
      name: category.name
    })
    setIsEditCategoryDialogOpen(true)
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
            <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Producto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                  <DialogDescription>Ingresa la información del nuevo producto.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="name"
                        className={newProductErrors.name?.length ? "border-red-500" : ""}
                        value={newProduct.name}
                        onChange={(e) => updateNewProduct('name', e.target.value)}
                        placeholder="Nombre del producto"
                      />
                      {newProductErrors.name?.length > 0 && (
                        <p className="text-sm text-red-500">{newProductErrors.name.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Precio
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="price"
                        type="number"
                        className={newProductErrors.price?.length ? "border-red-500" : ""}
                        value={newProduct.price}
                        onChange={(e) => updateNewProduct('price', Number(e.target.value))}
                        placeholder="Precio de venta"
                      />
                      {newProductErrors.price?.length > 0 && (
                        <p className="text-sm text-red-500">{newProductErrors.price.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="purchasePrice" className="text-right">
                      Precio de Compra
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="purchasePrice"
                        type="number"
                        className={newProductErrors.purchasePrice?.length ? "border-red-500" : ""}
                        value={newProduct.purchasePrice}
                        onChange={(e) => updateNewProduct('purchasePrice', Number(e.target.value))}
                        placeholder="Precio de compra"
                      />
                      {newProductErrors.purchasePrice?.length > 0 && (
                        <p className="text-sm text-red-500">{newProductErrors.purchasePrice.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">
                      Stock
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="stock"
                        type="number"
                        className={newProductErrors.stock?.length ? "border-red-500" : ""}
                        value={newProduct.stock}
                        onChange={(e) => updateNewProduct('stock', Number(e.target.value))}
                        placeholder="Cantidad en stock"
                      />
                      {newProductErrors.stock?.length > 0 && (
                        <p className="text-sm text-red-500">{newProductErrors.stock.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="barCode" className="text-right">
                      Código de Barras
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="barCode"
                        className={newProductErrors.barCode?.length ? "border-red-500" : ""}
                        value={newProduct.barCode}
                        onChange={(e) => updateNewProduct('barCode', e.target.value)}
                        placeholder="Código de barras"
                      />
                      {newProductErrors.barCode?.length > 0 && (
                        <p className="text-sm text-red-500">{newProductErrors.barCode.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Categoría
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Select
                        value={String(newProduct.category) || undefined}
                        onValueChange={(value) => {
                          updateNewProduct('category', Number(value));
                        }}
                      >
                        <SelectTrigger className={newProductErrors.category?.length ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {newProductErrors.category?.length > 0 && (
                        <p className="text-sm text-red-500">{newProductErrors.category.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="supplier" className="text-right">
                      Proveedor
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Select
                        value={String(newProduct.supplier) || undefined}
                        onValueChange={(value) => {
                          updateNewProduct('supplier', Number(value));
                        }}
                      >
                        <SelectTrigger className={newProductErrors.supplier?.length ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={String(supplier.id)}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {newProductErrors.supplier?.length > 0 && (
                        <p className="text-sm text-red-500">{newProductErrors.supplier.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Descripción
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="description"
                        className={newProductErrors.description?.length ? "border-red-500" : ""}
                        value={newProduct.description}
                        onChange={(e) => updateNewProduct('description', e.target.value)}
                        placeholder="Descripción del producto"
                      />
                      {newProductErrors.description?.length > 0 && (
                        <p className="text-sm text-red-500">{newProductErrors.description.join(", ")}</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddProduct} disabled={isLoadingProducts}>
                    {isLoadingProducts ? "Guardando..." : "Guardar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>Total de productos: {products.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Precio Venta</TableHead>
                    <TableHead>Precio Compra</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingProducts ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell>{product.supplier.name}</TableCell>
                        <TableCell>{product.barCode}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>{formatCurrency(product.purchasePrice)}</TableCell>
                        <TableCell>
                          <Badge variant={product.stock < 10 ? "destructive" : "default"}>{product.stock}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openQRDialog(product)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-qr-code"
                              >
                                <rect width="5" height="5" x="3" y="3" rx="1" />
                                <rect width="5" height="5" x="16" y="3" rx="1" />
                                <rect width="5" height="5" x="3" y="16" rx="1" />
                                <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                                <path d="M21 21v.01" />
                                <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                                <path d="M3 12h.01" />
                                <path d="M12 3h.01" />
                                <path d="M12 16v.01" />
                                <path d="M16 12h1" />
                                <path d="M21 12v.01" />
                                <path d="M12 21v-1" />
                              </svg>
                              <span className="sr-only">Generar QR</span>
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
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
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
                    <Input
                      id="name"
                      className="col-span-3"
                      value={newCategory.name}
                      onChange={(e) => updateNewCategory('name', e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddCategory}>Guardar</Button>
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
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        No se encontraron categorías
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditCategoryDialog(category)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(String(category.id))}>
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
        </TabsContent>
      </Tabs>

      {/* Dialog para editar producto */}
      <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>Actualiza la información del producto.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nombre
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-name"
                  className={editProductErrors.name?.length ? "border-red-500" : ""}
                  value={editProduct.name}
                  onChange={(e) => updateEditProduct('name', e.target.value)}
                  placeholder="Nombre del producto"
                />
                {editProductErrors.name?.length > 0 && (
                  <p className="text-sm text-red-500">{editProductErrors.name.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Precio
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-price"
                  type="number"
                  className={editProductErrors.price?.length ? "border-red-500" : ""}
                  value={editProduct.price}
                  onChange={(e) => updateEditProduct('price', Number(e.target.value))}
                  placeholder="Precio de venta"
                />
                {editProductErrors.price?.length > 0 && (
                  <p className="text-sm text-red-500">{editProductErrors.price.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-purchasePrice" className="text-right">
                Precio de Compra
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-purchasePrice"
                  type="number"
                  className={editProductErrors.purchasePrice?.length ? "border-red-500" : ""}
                  value={editProduct.purchasePrice}
                  onChange={(e) => updateEditProduct('purchasePrice', Number(e.target.value))}
                  placeholder="Precio de compra"
                />
                {editProductErrors.purchasePrice?.length > 0 && (
                  <p className="text-sm text-red-500">{editProductErrors.purchasePrice.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-stock" className="text-right">
                Stock
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-stock"
                  type="number"
                  className={editProductErrors.stock?.length ? "border-red-500" : ""}
                  value={editProduct.stock}
                  onChange={(e) => updateEditProduct('stock', Number(e.target.value))}
                  placeholder="Cantidad en stock"
                />
                {editProductErrors.stock?.length > 0 && (
                  <p className="text-sm text-red-500">{editProductErrors.stock.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-barCode" className="text-right">
                Código de Barras
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-barCode"
                  className={editProductErrors.barCode?.length ? "border-red-500" : ""}
                  value={editProduct.barCode}
                  onChange={(e) => updateEditProduct('barCode', e.target.value)}
                  placeholder="Código de barras"
                />
                {editProductErrors.barCode?.length > 0 && (
                  <p className="text-sm text-red-500">{editProductErrors.barCode.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Categoría
              </Label>
              <div className="col-span-3 space-y-2">
                <Select
                  value={String(editProduct.category)}
                  onValueChange={(value) => updateEditProduct('category', Number(value))}
                >
                  <SelectTrigger className={editProductErrors.category?.length ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editProductErrors.category?.length > 0 && (
                  <p className="text-sm text-red-500">{editProductErrors.category.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-supplier" className="text-right">
                Proveedor
              </Label>
              <div className="col-span-3 space-y-2">
                <Select
                  value={String(editProduct.supplier)}
                  onValueChange={(value) => updateEditProduct('supplier', Number(value))}
                >
                  <SelectTrigger className={editProductErrors.supplier?.length ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={String(supplier.id)}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editProductErrors.supplier?.length > 0 && (
                  <p className="text-sm text-red-500">{editProductErrors.supplier.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Descripción
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-description"
                  className={editProductErrors.description?.length ? "border-red-500" : ""}
                  value={editProduct.description}
                  onChange={(e) => updateEditProduct('description', e.target.value)}
                  placeholder="Descripción del producto"
                />
                {editProductErrors.description?.length > 0 && (
                  <p className="text-sm text-red-500">{editProductErrors.description.join(", ")}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditProduct} disabled={isLoadingProducts}>
              {isLoadingProducts ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para mostrar QR */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Código QR del Producto</DialogTitle>
            <DialogDescription>
              {currentQRProduct ? `Código QR para ${currentQRProduct.name} (ID: ${currentQRProduct.id})` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            {currentQRProduct && (
              <div className="p-4 bg-white rounded-lg">
                <QRCodeCanvas
                  id="product-qr"
                  value={String(currentQRProduct.id)}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Este código QR contiene el ID del producto y puede ser escaneado en el módulo de ventas.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQRDialogOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={handleDownloadQR}>Descargar QR</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
