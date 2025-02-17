import express from "express"
import Message from "../models/Message.js"
import jwt from "jsonwebtoken"

const router = express.Router()

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")
  if (!token) return res.status(401).json({ error: "Access denied" })

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (error) {
    res.status(400).json({ error: "Invalid token" })
  }
}

router.get("/:room", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).populate("user", "username").sort({ createdAt: 1 })
    res.json(messages)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post("/", verifyToken, async (req, res) => {
  try {
    const { content, room } = req.body
    const message = new Message({
      content,
      user: req.user.userId,
      room,
    })
    await message.save()
    res.status(201).json(message)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router

