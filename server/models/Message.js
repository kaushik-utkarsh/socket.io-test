import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  room: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Message", messageSchema)

