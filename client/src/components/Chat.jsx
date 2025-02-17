"use client"

import { useState, useEffect, useRef } from "react"
import io from "socket.io-client"
import axios from "axios"

const ENDPOINT = "http://localhost:5000"

function Chat({ user }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [room, setRoom] = useState("general")
  const socketRef = useRef()

  useEffect(() => {
    socketRef.current = io(ENDPOINT)

    socketRef.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    socketRef.current.emit("join", room)
    fetchMessages()
  }, [room])

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/messages/${room}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const messageData = {
        content: inputMessage,
        user: user.userId,
        room,
      }

      try {
        await axios.post("http://localhost:5000/api/messages", messageData, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        socketRef.current.emit("chatMessage", { ...messageData, username: user.username })
        setInputMessage("")
      } catch (error) {
        console.error("Error sending message:", error)
      }
    }
  }

  return (
    <div>
      <h2>Chat Room: {room}</h2>
      <div>
        <button onClick={() => setRoom("general")}>General</button>
        <button onClick={() => setRoom("random")}>Random</button>
      </div>
      <div style={{ height: "400px", overflowY: "scroll", border: "1px solid #ccc" }}>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.user.username || message.username}: </strong>
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default Chat

