"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Navbar } from "@/components/navbar"

interface Book {
  _id: string
  title: string
  author: string
  price: number
  stock: number
  category: string
  description: string
  image: string
}

interface Order {
  _id: string
  user: {
    name: string
    email: string
  }
  items: Array<{
    book: {
      title: string
      price: number
    }
    quantity: number
  }>
  total: number
  status: string
  createdAt: string
}

interface User {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [isAddingBook, setIsAddingBook] = useState(false)
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    price: 0,
    stock: 0,
    category: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    fetchBooks()
    fetchOrders()
    fetchUsers()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/admin/books")
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error("Error fetching books:", error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingBook ? `/api/admin/books/${editingBook._id}` : "/api/admin/books"
      const method = editingBook ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookForm),
      })

      if (response.ok) {
        fetchBooks()
        setEditingBook(null)
        setIsAddingBook(false)
        setBookForm({
          title: "",
          author: "",
          price: 0,
          stock: 0,
          category: "",
          description: "",
          image: "",
        })
      }
    } catch (error) {
      console.error("Error saving book:", error)
    }
  }

  const deleteBook = async (bookId: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await fetch(`/api/admin/books/${bookId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchBooks()
        }
      } catch (error) {
        console.error("Error deleting book:", error)
      }
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const startEdit = (book: Book) => {
    setEditingBook(book)
    setBookForm({
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
      category: book.category,
      description: book.description,
      image: book.image,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="books" className="space-y-6">
          <TabsList>
            <TabsTrigger value="books">Books Management</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Books Management</h2>
              <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBookSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={bookForm.title}
                          onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                          id="author"
                          value={bookForm.author}
                          onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={bookForm.price}
                          onChange={(e) => setBookForm({ ...bookForm, price: Number.parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={bookForm.stock}
                          onChange={(e) => setBookForm({ ...bookForm, stock: Number.parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={bookForm.category}
                          onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={bookForm.description}
                        onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={bookForm.image}
                        onChange={(e) => setBookForm({ ...bookForm, image: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Book
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book._id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{`₹${book.price}`}</TableCell>
                        <TableCell>
                          <Badge variant={book.stock > 0 ? "default" : "destructive"}>{book.stock}</Badge>
                        </TableCell>
                        <TableCell>{book.category}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => startEdit(book)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Book</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleBookSubmit} className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-title">Title</Label>
                                      <Input
                                        id="edit-title"
                                        value={bookForm.title}
                                        onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-author">Author</Label>
                                      <Input
                                        id="edit-author"
                                        value={bookForm.author}
                                        onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-price">Price</Label>
                                      <Input
                                        id="edit-price"
                                        type="number"
                                        step="0.01"
                                        value={bookForm.price}
                                        onChange={(e) =>
                                          setBookForm({ ...bookForm, price: Number.parseFloat(e.target.value) })
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-stock">Stock</Label>
                                      <Input
                                        id="edit-stock"
                                        type="number"
                                        value={bookForm.stock}
                                        onChange={(e) =>
                                          setBookForm({ ...bookForm, stock: Number.parseInt(e.target.value) })
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-category">Category</Label>
                                      <Input
                                        id="edit-category"
                                        value={bookForm.category}
                                        onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={bookForm.description}
                                      onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-image">Image URL</Label>
                                    <Input
                                      id="edit-image"
                                      value={bookForm.image}
                                      onChange={(e) => setBookForm({ ...bookForm, image: e.target.value })}
                                    />
                                  </div>
                                  <Button type="submit" className="w-full">
                                    Update Book
                                  </Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteBook(book._id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-semibold">Orders Management</h2>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-mono text-sm">{order._id.slice(-8)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.user?.name || "Unknown User"}</div>
                            <div className="text-sm text-muted-foreground">{order.user?.email || "N/A"}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>{`₹${order.total.toFixed(2)}`}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select value={order.status} onValueChange={(status) => updateOrderStatus(order._id, status)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-semibold">Users Management</h2>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
