import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('wp_token'))
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wp_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (newToken, userData) => {
    localStorage.setItem('wp_token', newToken)
    localStorage.setItem('wp_user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('wp_token')
    localStorage.removeItem('wp_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
