"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Package, Plus, Edit, LogOut, Search, Trash } from "lucide-react"
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/services/productService"
import { Product } from "@/types/product"

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Products() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {

    const fetchProducts = async () => {
      const response = await getProducts()
      setProducts(response.products || [])
    }
    fetchProducts()
  }, [])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    sku: "",
    image_url: "",
    description: "",
    quantity: 0,
    price: 0,
  })

  console.log("products", products)
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = async () => {
    try {
      const newProductData = { ...newProduct };
      const addedProduct = await addProduct(newProductData);
      setProducts([...products, addedProduct]);
      setNewProduct({
        name: "",
        type: "",
        sku: "",
        image_url: "",
        description: "",
        quantity: 0,
        price: 0,
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleEditProduct = async (product: Product) => {
    if (!editingProduct) return;
    try {
      await updateProduct(product.id, editingProduct.quantity);
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity, lastUpdated: new Date().toISOString().split("T")[0] }
          : product,
      ),
    )
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId)
      const updatedProducts = await getProducts()
      setProducts(updatedProducts)
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fi-Inventories</h1>
                <p className="text-sm text-gray-600">Welcome, {currentUser?.name || "User"}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
              <span className="text-sm">₹</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{products.reduce((sum, product) => sum + product.quantity * product.price, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Product Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(products.map((p) => p.type)).size}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full sm:w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Enter the details for the new product.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Product Type</Label>
                  <Select onValueChange={(value) => setNewProduct({ ...newProduct, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="Enter SKU"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: Number.parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter product description"
                  />
                </div>
                <Button onClick={handleAddProduct} className="w-full">
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products Inventory</CardTitle>
            <CardDescription>Manage your product inventory and stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover hidden sm:block"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground hidden sm:block">{product.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{product.sku}</TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleUpdateQuantity(product.id, Number.parseInt(e.target.value) || 0)}
                        className="w-20"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setEditingProduct(product); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md" onClick={(e) => e.stopPropagation()}>
                          <DialogHeader>
                            <DialogTitle>Edit Product Quantity</DialogTitle>
                            <DialogDescription>Update the product details.</DialogDescription>
                          </DialogHeader>
                          {editingProduct && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Product Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                  disabled
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-type">Product Type</Label>
                                <Select
                                  value={editingProduct.type}
                                  onValueChange={(value) => setEditingProduct({ ...editingProduct, type: value })}
                                  disabled
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Electronics">Electronics</SelectItem>
                                    <SelectItem value="Furniture">Furniture</SelectItem>
                                    <SelectItem value="Kitchen">Kitchen</SelectItem>
                                    <SelectItem value="Office">Office</SelectItem>
                                    <SelectItem value="Clothing">Clothing</SelectItem>
                                    <SelectItem value="Books">Books</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-sku">SKU</Label>
                                <Input
                                  id="edit-sku"
                                  value={editingProduct.sku}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                                  disabled
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-image_url">Image URL</Label>
                                <Input
                                  id="edit-image_url"
                                  value={editingProduct.image_url}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                                  disabled
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-quantity">Quantity</Label>
                                <Input
                                  id="edit-quantity"
                                  type="number"
                                  value={editingProduct.quantity}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      quantity: Number.parseInt(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-price">Price (₹)</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.price}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      price: Number.parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  disabled
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  value={editingProduct.description}
                                  onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, description: e.target.value })
                                  }
                                  disabled
                                />
                              </div>
                              <Button onClick={() => handleEditProduct(editingProduct)} className="w-full">
                                Update Product Quantity
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Delete Product Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()} >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent onClick={(e) => e.stopPropagation()}>
                          <DialogHeader>
                            <DialogTitle>Delete Product</DialogTitle>
                            <DialogDescription>Are you sure you want to delete this product?</DialogDescription>
                          </DialogHeader>
                          <Button onClick={() => handleDeleteProduct(product.id)} className="w-full">
                            Delete Product
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-lg">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>{selectedProduct.type}</DialogDescription>
              </DialogHeader>
              <div>
                <img
                  src={selectedProduct.image_url || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
                <p className="text-sm text-muted-foreground mb-4">{selectedProduct.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">SKU</p>
                    <p>{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <p className="font-medium">Price</p>
                    <p>₹{selectedProduct.price}</p>
                  </div>
                  <div>
                    <p className="font-medium">Quantity</p>
                    <p>{selectedProduct.quantity}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
