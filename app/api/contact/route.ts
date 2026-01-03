import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Contact } from "@/models/Contact"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    await connectDB()

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    })

    await contact.save()

    return NextResponse.json({ message: "Message sent successfully" }, { status: 201 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 })
  }
}
