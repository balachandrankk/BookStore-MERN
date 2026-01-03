import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { Cart } from "@/models/Cart"

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const { itemId } = await request.json()

    await connectDB()

    const cart = await Cart.findOne({ user: decoded.userId })
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 })
    }

    cart.items.id(itemId).deleteOne()

    // Calculate total
    await cart.populate("items.book")
    cart.total = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

    await cart.save()

    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
