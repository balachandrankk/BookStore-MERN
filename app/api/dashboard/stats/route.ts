import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Book } from "@/models/Book"
import { User } from "@/models/User"
import { Order } from "@/models/Order"

export async function GET() {
  try {
    await connectDB()

    const [totalBooks, totalUsers, totalOrders, lowStockBooks] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Book.countDocuments({ stock: { $lt: 5 } }),
    ])

    return NextResponse.json({
      totalBooks,
      totalUsers,
      totalOrders,
      lowStockBooks,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
