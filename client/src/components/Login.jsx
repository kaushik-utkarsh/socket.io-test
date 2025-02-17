"use client"

import { useState } from "react"
import axios from "axios"

function Login({ setUser }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login"
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, {
        username,
        password,
      })
      if (isRegistering) {
        alert("Registration successful. Please log in.")
        setIsRegistering(false)
      } else {
        setUser(data)
      }
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred")
    }
  }

  return (
    <div>
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? "Register" : "Login"}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Switch to Login" : "Switch to Register"}
      </button>
    </div>
  )
}

export default Login

