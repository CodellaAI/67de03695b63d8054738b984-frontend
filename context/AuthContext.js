
'use client'

import { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in cookies
    const userData = Cookies.get('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data from cookie:', error)
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    // Store user data in cookie for 7 days
    Cookies.set('user', JSON.stringify(userData), { expires: 7 })
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
