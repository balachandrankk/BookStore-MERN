"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, BookOpen, Users, Package } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import Image from "next/image"

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

interface DashboardStats {
  totalBooks: number
  totalUsers: number
  totalOrders: number
  lowStockBooks: number
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    lowStockBooks: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
    fetchStats()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      const data = await response.json()
      setBooks(data.slice(0, 6)) // Show only first 6 books on homepage
    } catch (error) {
      console.error("Error fetching books:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (bookId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId, quantity: 1 }),
        credentials: "include",
      })

      if (response.ok) {
        alert("Book added to cart!")
      } else {
        alert("Please login to add items to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to BookStore</h1>
          <p className="text-xl mb-8">Discover your next favorite book from our vast collection</p>
          <Link href="/books">
            <Button size="lg" variant="secondary">
              Browse Books
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBooks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lowStockBooks}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card key={book._id} className="overflow-hidden">
                <div className="aspect-[3/4] bg-muted relative">
                  <Image
                    src={book.image || `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(book.title)}`}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">{`₹.${book.price}`}</span>
                    <Badge variant={book.stock > 0 ? "default" : "destructive"}>
                      {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
                    </Badge>
                  </div>
                  <Button className="w-full" onClick={() => addToCart(book._id)} disabled={book.stock === 0}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/books">
              <Button variant="outline" size="lg">
                View All Books
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
