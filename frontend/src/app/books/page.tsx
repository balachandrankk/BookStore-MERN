"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search } from "lucide-react"
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

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    filterBooks()
  }, [books, searchTerm, selectedCategory])

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      const data = await response.json()
      setBooks(data)

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map((book: Book) => book.category))] as string[];
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching books:", error)
    }
  }

  const filterBooks = () => {
    let filtered = books

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    setFilteredBooks(filtered)
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

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Book Collection</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
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
                <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                <CardDescription>by {book.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge variant="secondary">{book.category}</Badge>
                  <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{`₹${book.price}`}</span>
                    <Badge variant={book.stock > 0 ? "default" : "destructive"}>
                      {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
                    </Badge>
                  </div>
                  <Button className="w-full" onClick={() => addToCart(book._id)} disabled={book.stock === 0}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
