import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"
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
    const orders = await Order.find({ user: decoded.userId }).populate("items.book").sort({ createdAt: -1 })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    await connectDB()

    const cart = await Cart.findOne({ user: decoded.userId }).populate("items.book")
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 })
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.book.stock < item.quantity) {
        return NextResponse.json(
          {
            message: `Insufficient stock for ${item.book.title}`,
          },
          { status: 400 },
        )
      }
    }

    // Create order
    const order = new Order({
      user: decoded.userId,
      items: cart.items.map((item) => ({
        book: item.book._id,
        quantity: item.quantity,
      })),
      total: cart.total,
      status: "pending",
    })

    await order.save()

    // Update book stock
    for (const item of cart.items) {
      await Book.findByIdAndUpdate(item.book._id, {
        $inc: { stock: -item.quantity },
      })
    }

    // Clear cart
    cart.items = []
    cart.total = 0
    await cart.save()

    return NextResponse.json({ message: "Order placed successfully", orderId: order._id })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
