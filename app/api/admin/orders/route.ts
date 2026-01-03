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

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)

    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.book", "title price")
      .sort({ createdAt: -1 })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
