const express = require("express")
const Order = require("../models/Order")
const Cart = require("../models/Cart")
const Book = require("../models/Book")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Get user orders
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.book").sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
})

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.book")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.book.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.book.title}`,
        })
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
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

    res.json({ message: "Order placed successfully", orderId: order._id })
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ error: "Failed to create order" })
  }
})

module.exports = router
