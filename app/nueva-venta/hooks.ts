import { useState, useCallback } from 'react'
import { Product, SaleItem } from './types'
import { SaleService } from './service'
import { useToast } from '@/hooks/use-toast'

export const useSale = () => {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<SaleItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await SaleService.getProducts()
      setProducts(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getProductByBarcode = useCallback(async (id: string | number) => {
    try {
      setIsLoading(true)
      const product = SaleService.findProductById(products, id)
      if (!product) {
        toast({
          title: "Error",
          description: "No se encontró ningún producto con ese código",
          variant: "destructive",
        })
        return null
      }
      return product
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [products, toast])

  const addToCart = useCallback((product: Product) => {
    if (product.stock < 1) {
      toast({
        title: "Error",
        description: "No hay stock disponible de este producto",
        variant: "destructive",
      })
      return
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.product === product.id)
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast({
            title: "Error",
            description: "No hay suficiente stock disponible",
            variant: "destructive",
          })
          return prev
        }
        return prev.map(item =>
          item.product === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, {
        product: product.id,
        quantity: 1,
        unitPrice: Number(product.price)
      }]
    })

    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido agregado al carrito.`,
    })
  }, [toast])

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    if (newQuantity > product.stock) {
      toast({
        title: "Error",
        description: "No hay suficiente stock disponible",
        variant: "destructive",
      })
      return
    }

    if (newQuantity < 1) {
      setCartItems(prev => prev.filter(item => item.product !== productId))
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.product === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }, [products, toast])

  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prev => prev.filter(item => item.product !== productId))
  }, [])

  const createSale = useCallback(async (extraData?: { [key: string]: any }) => {
    try {
      setIsLoading(true)
      const total = cartItems.reduce((sum, item) => {
        const product = products.find(p => p.id === item.product)
        return sum + (product?.price || 0) * item.quantity
      }, 0)

      const details = cartItems.map(item => {
        const product = products.find(p => p.id === item.product)
        const unitPrice = Number(product?.price || 0)
        
        console.log('Detalle del item:', {
          item,
          product,
          unitPrice,
          typeofUnitPrice: typeof unitPrice
        })
        
        return {
          product: item.product,
          quantity: Number(item.quantity),
          unitPrice: unitPrice
        }
      })

      const saleData = {
        dateSale: new Date(),
        total: Number(total),
        details: details,
        ...(extraData || {})
      }

      console.log('Datos finales de venta:', {
        saleData,
        detailsTypes: saleData.details.map(d => ({
          product: typeof d.product,
          quantity: typeof d.quantity,
          unitPrice: typeof d.unitPrice,
          actualUnitPrice: d.unitPrice
        }))
      })

      const response = await SaleService.createSale(saleData)
      setCartItems([])
      toast({
        title: "Venta completada",
        description: response.message || "La venta se ha procesado correctamente",
      })
      return response
    } catch (error: any) {
      console.error('Error al crear venta:', error)
      console.error('Estado actual:', {
        cartItems,
        products,
        cartItemsTypes: cartItems.map(item => ({
          product: typeof item.product,
          quantity: typeof item.quantity,
          unitPrice: typeof item.unitPrice,
          actualUnitPrice: item.unitPrice
        }))
      })
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [cartItems, products, toast])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barCode.includes(searchTerm)
  )

  return {
    products: filteredProducts,
    cartItems,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadProducts,
    getProductByBarcode,
    addToCart,
    updateQuantity,
    removeFromCart,
    createSale,
    getProduct: (id: number) => products.find(p => p.id === id)
  }
} 