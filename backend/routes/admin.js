const express = require("express")
const Book = require("../models/Book")
const Order = require("../models/Order")
const User = require("../models/User")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// Books management
router.get("/books", adminAuth, async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 })
    res.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    res.status(500).json({ error: "Failed to fetch books" })
  }
})

router.post("/books", adminAuth, async (req, res) => {
  try {
    const book = new Book(req.body)
    await book.save()
    res.status(201).json(book)
  } catch (error) {
    console.error("Error creating book:", error)
    res.status(500).json({ error: "Failed to create book" })
  }
})

router.put("/books/:id", adminAuth, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }
    res.json(book)
  } catch (error) {
    console.error("Error updating book:", error)
    res.status(500).json({ error: "Failed to update book" })
  }
})

router.delete("/books/:id", adminAuth, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)
    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }
    res.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Error deleting book:", error)
    res.status(500).json({ error: "Failed to delete book" })
  }
})

// Orders management
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.book", "title price")
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
})

router.put("/orders/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    res.status(500).json({ error: "Failed to update order" })
  }
})

// Users management
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

module.exports = router
