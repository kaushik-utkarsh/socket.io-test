"use client"

import { useState } from "react"
import Login from "./components/Login"
import Chat from "./components/Chat"

function App() {
  const [user, setUser] = useState(null)

  return <div className="App">{user ? <Chat user={user} /> : <Login setUser={setUser} />}</div>
}

export default App

