const express = require("express")
const Contact = require("../models/Contact")

const router = express.Router()

// Submit contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    })

    await contact.save()

    res.status(201).json({ message: "Message sent successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    res.status(500).json({ message: "Failed to send message" })
  }
})

module.exports = router
