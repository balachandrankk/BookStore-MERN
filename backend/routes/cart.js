const express = require("express")
const Cart = require("../models/Cart")
const Book = require("../models/Book")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Get user cart
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.book")

    if (!cart) {
      return res.json({ items: [], total: 0 })
    }

    res.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    res.status(500).json({ error: "Failed to fetch cart" })
  }
})

// Add item to cart
router.post("/", auth, async (req, res) => {
  try {
    const { bookId, quantity } = req.body

    const book = await Book.findById(bookId)
    if (!book || book.stock < quantity) {
      return res.status(400).json({ message: "Book not available" })
    }

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    const existingItem = cart.items.find((item) => item.book.toString() === bookId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ book: bookId, quantity })
    }

    // Calculate total
    await cart.populate("items.book")
    cart.total = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

    await cart.save()

    res.json({ message: "Item added to cart" })
  } catch (error) {
    console.error("Error adding to cart:", error)
    res.status(500).json({ error: "Failed to add to cart" })
  }
})

// Update cart item quantity
router.put("/update", auth, async (req, res) => {
  try {
    const { itemId, quantity } = req.body

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const item = cart.items.id(itemId)
    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    item.quantity = quantity

    // Calculate total
    await cart.populate("items.book")
    cart.total = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

    await cart.save()

    res.json({ message: "Cart updated" })
  } catch (error) {
    console.error("Error updating cart:", error)
    res.status(500).json({ error: "Failed to update cart" })
  }
})

// Remove item from cart
router.delete("/remove", auth, async (req, res) => {
  try {
    const { itemId } = req.body

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.items.id(itemId).deleteOne()

    // Calculate total
    await cart.populate("items.book")
    cart.total = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

    await cart.save()

    res.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing from cart:", error)
    res.status(500).json({ error: "Failed to remove from cart" })
  }
})

module.exports = router
