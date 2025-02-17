import express from "express"
import http from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import messageRoutes from "./routes/messages.js"

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

// Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected")

  socket.on("join", (room) => {
    socket.join(room)
    console.log(`User joined room: ${room}`)
  })

  socket.on("chatMessage", (message) => {
    io.to(message.room).emit("message", message)
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected")
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

