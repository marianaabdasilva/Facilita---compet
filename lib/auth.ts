// Mock authentication system - replace with real auth later
export interface User {
  id: string
  name: string
  email: string
  role: "client" | "admin"
  company?: {
    id: string
    name: string
    cnpj: string
  }
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    role: "client",
    company: {
      id: "1",
      name: "Empresa Silva LTDA",
      cnpj: "12.345.678/0001-90",
    },
  },
  {
    id: "2",
    name: "Maria Admin",
    email: "admin@facilita.com",
    role: "admin",
  },
]

export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    // Store in localStorage (replace with proper token handling)
    localStorage.setItem("user", JSON.stringify(user))
    return user
  },

  async register(userData: {
    name: string
    email: string
    phone: string
    password: string
  }): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: "client",
    }

    localStorage.setItem("user", JSON.stringify(newUser))
    return newUser
  },

  async logout(): Promise<void> {
    localStorage.removeItem("user")
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  },
}
