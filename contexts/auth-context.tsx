"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  username: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  role: string
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, email: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<string>("user")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const setAuth = useCallback((userData: User | null, authToken: string | null, userRole?: string) => {
    setUser(userData)
    setToken(authToken)
    setRole(userRole || userData?.role || "user")
    setIsAuthenticated(!!userData && !!authToken)
  }, [])

  const clearAuth = useCallback(() => {
    setUser(null)
    setToken(null)
    setRole("user")
    setIsAuthenticated(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
    }
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.login(username, password)

      if (response.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.token!)
          localStorage.setItem("userRole", response.user?.role || "user")
        }

        setAuth(response.user!, response.token!, response.user?.role)
        apiClient.setAuthToken(response.token!)

        toast({
          title: "登录成功",
          description: `欢迎回来，${response.user?.username}！`,
        })
        return true
      } else {
        setError(response.message || "登录失败")
        toast({
          title: "登录失败",
          description: response.message || "登录失败",
          variant: "destructive",
        })
        return false
      }
    } catch (err: any) {
      const errorMessage = err.message || "登录失败，请稍后再试"
      setError(errorMessage)
      toast({
        title: "登录失败",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, password: string, email: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.register(username, password, email)

      if (response.success) {
        setAuth(response.user!, response.token!, response.user?.role)
        toast({
          title: "注册成功",
          description: "欢迎加入EchoWeb3！",
        })
        return true
      } else {
        setError(response.message || "注册失败")
        toast({
          title: "注册失败",
          description: response.message || "注册失败",
          variant: "destructive",
        })
        return false
      }
    } catch (err: any) {
      const errorMessage = err.message || "注册失败，请稍后再试"
      setError(errorMessage)
      toast({
        title: "注册失败",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(() => {
    clearAuth()
    toast({
      title: "已退出登录",
      description: "期待您的再次光临！",
    })
  }, [clearAuth, toast])

  const checkAuth = useCallback(async () => {
    if (!token) return

    try {
      apiClient.setAuthToken(token)
      const userData = await apiClient.getUserInfo()

      if (userData.success) {
        setUser(userData.user!)
        setRole(userData.user?.role || "user")
        setIsAuthenticated(true)
      } else {
        const refreshResult = await apiClient.refreshToken()
        if (refreshResult.success) {
          setAuth(refreshResult.user!, refreshResult.token!, refreshResult.user?.role)
        } else {
          clearAuth()
        }
      }
    } catch (err) {
      clearAuth()
    }
  }, [token, setAuth, clearAuth])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token")
      const savedRole = localStorage.getItem("userRole")
      if (savedToken) {
        setToken(savedToken)
        setRole(savedRole || "user")
      }
    }
  }, [])

  useEffect(() => {
    if (token) {
      checkAuth()
    }
  }, [token, checkAuth])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
