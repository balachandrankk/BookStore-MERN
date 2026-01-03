const express = require("express")
const Book = require("../models/Book")

const router = express.Router()

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 })
    res.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    res.status(500).json({ error: "Failed to fetch books" })
  }
})

// Get book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }
    res.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    res.status(500).json({ error: "Failed to fetch book" })
  }
})

module.exports = router
