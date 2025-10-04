import axios from "axios"

export interface User {
  id: string
  name: string
  email: string
  role: "client" | "employee" | "Administrador"
  company?: {
    id: string
    name: string
    cnpj: string
  }
  department?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      const res = await axios.post("https://projeto-back-ten.vercel.app/login", {
        Email: email,
        Senha: password,
      });

      console.log("Resposta completa do backend:", res);

      const { token, user } = res.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      return user
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro no login")
    }
  },

  async register(userData: {
    name: string
    email: string
    phone: string
    password: string
    role: "client" | "employee"
  }): Promise<User> {

    try {

      const res = await axios.post("https://projeto-back-ten.vercel.app/cadastro", userData)

      const { token, user } = res.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      return user

    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro no registro")
    }
  },

  async logout(): Promise<void> {
    
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  },
}

