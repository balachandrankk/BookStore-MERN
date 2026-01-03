import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { Cart } from "@/models/Cart"
import { Book } from "@/models/Book"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    await connectDB()
    const cart = await Cart.findOne({ user: decoded.userId }).populate("items.book")

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const { bookId, quantity } = await request.json()

    await connectDB()

    const book = await Book.findById(bookId)
    if (!book || book.stock < quantity) {
      return NextResponse.json({ message: "Book not available" }, { status: 400 })
    }

    let cart = await Cart.findOne({ user: decoded.userId })

    if (!cart) {
      cart = new Cart({ user: decoded.userId, items: [] })
    }

    const existingItem = cart.items.find((item) => item.book.toString() === bookId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ book: bookId, quantity })
    }

    // Calculate total
    await cart.populate("items.book")
    cart.total = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

    await cart.save()

    return NextResponse.json({ message: "Item added to cart" })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
