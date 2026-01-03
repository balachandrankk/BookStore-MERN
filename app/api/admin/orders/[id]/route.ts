import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import { User } from "@/models/User"

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  if (!token) {
    throw new Error("Not authenticated")
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

  await connectDB()
  const user = await User.findById(decoded.userId)

  if (!user || user.role !== "admin") {
    throw new Error("Not authorized")
  }

  return user
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request)

    const { status } = await request.json()
    const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
