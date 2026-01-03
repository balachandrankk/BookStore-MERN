const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ message: "Invalid token" })
  }
}

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {})

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    next()
  } catch (error) {
    console.error("Admin auth error:", error)
    res.status(401).json({ message: "Unauthorized" })
  }
}

module.exports = { auth, adminAuth }
