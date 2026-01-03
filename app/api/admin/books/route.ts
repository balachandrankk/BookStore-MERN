import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { Book } from "@/models/Book"
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

    const books = await Book.find({}).sort({ createdAt: -1 })
    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)

    const bookData = await request.json()
    const book = new Book(bookData)
    await book.save()

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
  }
}
