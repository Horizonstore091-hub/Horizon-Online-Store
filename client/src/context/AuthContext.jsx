import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('horizon-auth')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed.user || parsed)
        setToken(parsed.token || parsed.id)
      } catch {}
    }
  }, [])

  const login = async (email, password) => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Invalid credentials')
    }
    const data = await res.json()
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('horizon-auth', JSON.stringify({ user: data.user, token: data.token }))
    return data
  }

  const register = async (name, email, password, phone) => {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Registration failed')
    }
    const data = await res.json()
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('horizon-auth', JSON.stringify({ user: data.user, token: data.token }))
    return data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('horizon-auth')
  }

  const refreshUser = async () => {
    if (!token) return
    try {
      const res = await fetch(`/api/users/${token}`)
      if (res.ok) {
        const u = await res.json()
        setUser(u)
        localStorage.setItem('horizon-auth', JSON.stringify({ user: u, token }))
      }
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refreshUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
