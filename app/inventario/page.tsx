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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import {
  products,
  categories,
  type Product,
  type Category,
  getCategoryName,
  formatCurrency,
  generateId,
} from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { QRCodeCanvas } from "qrcode.react"

export default function InventoryPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [productsList, setProductsList] = useState<Product[]>(products)
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories)
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    barcode: "",
    cost: 0,
  })
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
  })

  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
  const [currentQRProduct, setCurrentQRProduct] = useState<Product | null>(null)

  const filteredProducts = productsList.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(product.categoryId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredCategories = categoriesList.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    const product: Product = {
      id: generateId("PROD"),
      name: newProduct.name || "",
      description: newProduct.description || "",
      price: newProduct.price || 0,
      stock: newProduct.stock || 0,
      categoryId: newProduct.categoryId || "",
      barcode: newProduct.barcode || "",
      image: "/placeholder.svg?height=100&width=100",
      cost: newProduct.cost || 0,
      createdAt: new Date().toISOString(),
    }

    setProductsList([...productsList, product])
    setIsAddProductDialogOpen(false)
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      barcode: "",
      cost: 0,
    })

    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido agregado correctamente.`,
    })
  }

  const handleEditProduct = () => {
    if (!currentProduct) return

    const updatedProducts = productsList.map((prod) => (prod.id === currentProduct.id ? currentProduct : prod))

    setProductsList(updatedProducts)
    setIsEditProductDialogOpen(false)
    setCurrentProduct(null)

    toast({
      title: "Producto actualizado",
      description: `La información de ${currentProduct.name} ha sido actualizada.`,
    })
  }

  const handleDeleteProduct = (id: string) => {
    const productToDelete = productsList.find((prod) => prod.id === id)
    if (!productToDelete) return

    const updatedProducts = productsList.filter((prod) => prod.id !== id)
    setProductsList(updatedProducts)

    toast({
      title: "Producto eliminado",
      description: `${productToDelete.name} ha sido eliminado correctamente.`,
      variant: "destructive",
    })
  }

  const handleAddCategory = () => {
    const category: Category = {
      id: generateId("CAT"),
      name: newCategory.name || "",
      description: newCategory.description || "",
    }

    setCategoriesList([...categoriesList, category])
    setIsAddCategoryDialogOpen(false)
    setNewCategory({
      name: "",
      description: "",
    })

    toast({
      title: "Categoría agregada",
      description: `${category.name} ha sido agregada correctamente.`,
    })
  }

  const handleEditCategory = () => {
    if (!currentCategory) return

    const updatedCategories = categoriesList.map((cat) => (cat.id === currentCategory.id ? currentCategory : cat))

    setCategoriesList(updatedCategories)
    setIsEditCategoryDialogOpen(false)
    setCurrentCategory(null)

    toast({
      title: "Categoría actualizada",
      description: `La información de ${currentCategory.name} ha sido actualizada.`,
    })
  }

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categoriesList.find((cat) => cat.id === id)
    if (!categoryToDelete) return

    // Verificar si hay productos que usan esta categoría
    const productsWithCategory = productsList.filter((prod) => prod.categoryId === id)

    if (productsWithCategory.length > 0) {
      toast({
        title: "No se puede eliminar",
        description: `No se puede eliminar la categoría porque hay ${productsWithCategory.length} productos asociados a ella.`,
        variant: "destructive",
      })
      return
    }

    const updatedCategories = categoriesList.filter((cat) => cat.id !== id)
    setCategoriesList(updatedCategories)

    toast({
      title: "Categoría eliminada",
      description: `${categoryToDelete.name} ha sido eliminada correctamente.`,
      variant: "destructive",
    })
  }

  const openEditProductDialog = (product: Product) => {
    setCurrentProduct({ ...product })
    setIsEditProductDialogOpen(true)
  }

  const openEditCategoryDialog = (category: Category) => {
    setCurrentCategory({ ...category })
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
                    <Input
                      id="name"
                      className="col-span-3"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Descripción
                    </Label>
                    <Input
                      id="description"
                      className="col-span-3"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Precio
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      className="col-span-3"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Costo
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      className="col-span-3"
                      value={newProduct.cost}
                      onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      className="col-span-3"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Categoría
                    </Label>
                    <Select
                      value={newProduct.categoryId}
                      onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesList.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="barcode" className="text-right">
                      Código de Barras
                    </Label>
                    <Input
                      id="barcode"
                      className="col-span-3"
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddProduct}>Guardar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>Total de productos: {filteredProducts.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Costo</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>{formatCurrency(product.cost)}</TableCell>
                        <TableCell>
                          <Badge variant={product.stock < 10 ? "destructive" : "default"}>{product.stock}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditProductDialog(product)}>
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
                  <DialogDescription>Ingresa la información de la nueva categoría.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cat-name" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="cat-name"
                      className="col-span-3"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cat-description" className="text-right">
                      Descripción
                    </Label>
                    <Input
                      id="cat-description"
                      className="col-span-3"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
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
              <CardDescription>Total de categorías: {filteredCategories.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No se encontraron categorías
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditCategoryDialog(category)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
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
          {currentProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="edit-description"
                  className="col-span-3"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Precio
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  className="col-span-3"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cost" className="text-right">
                  Costo
                </Label>
                <Input
                  id="edit-cost"
                  type="number"
                  className="col-span-3"
                  value={currentProduct.cost}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, cost: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="edit-stock"
                  type="number"
                  className="col-span-3"
                  value={currentProduct.stock}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Categoría
                </Label>
                <Select
                  value={currentProduct.categoryId}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, categoryId: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-barcode" className="text-right">
                  Código de Barras
                </Label>
                <Input
                  id="edit-barcode"
                  className="col-span-3"
                  value={currentProduct.barcode}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, barcode: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditProduct}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar categoría */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Actualiza la información de la categoría.</DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cat-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-cat-name"
                  className="col-span-3"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cat-description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="edit-cat-description"
                  className="col-span-3"
                  value={currentCategory.description}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCategory}>Guardar Cambios</Button>
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
                <QRCodeCanvas id="product-qr" value={currentQRProduct.id} size={200} level="H" includeMargin={true} />
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
