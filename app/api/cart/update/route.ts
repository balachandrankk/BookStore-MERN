import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { Cart } from "@/models/Cart"

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const { itemId, quantity } = await request.json()

    await connectDB()

    const cart = await Cart.findOne({ user: decoded.userId })
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 })
    }

    const item = cart.items.id(itemId)
    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 })
    }

    item.quantity = quantity

    // Calculate total
    await cart.populate("items.book")
    cart.total = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

    await cart.save()

    return NextResponse.json({ message: "Cart updated" })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
