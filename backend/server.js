const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const bookRoutes = require("./routes/books")
const cartRoutes = require("./routes/cart")
const orderRoutes = require("./routes/orders")
const adminRoutes = require("./routes/admin")
const contactRoutes = require("./routes/contact")
const dashboardRoutes = require("./routes/dashboard")

const app = express()

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Database connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bookstore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err)
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/dashboard", dashboardRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
