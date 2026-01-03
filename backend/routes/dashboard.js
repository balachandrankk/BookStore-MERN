const express = require("express")
const Book = require("../models/Book")
const User = require("../models/User")
const Order = require("../models/Order")

const router = express.Router()

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const [totalBooks, totalUsers, totalOrders, lowStockBooks] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Book.countDocuments({ stock: { $lt: 5 } }),
    ])

    res.json({
      totalBooks,
      totalUsers,
      totalOrders,
      lowStockBooks,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({ error: "Failed to fetch stats" })
  }
})

module.exports = router
