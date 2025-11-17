"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, UserPlus, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import documents from "@/lib/documents"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [novoUsuario, setNovoUsuario] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "funcionario", 
  })

  // 🔹 Define cores por status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "administrador":
        return "bg-purple-100 text-purple-600 border border-purple-200"
      case "funcionario":
        return "bg-blue-100 text-blue-600 border border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300"
    }
  }

  // 🔹 Carrega usuários
  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await documents.get("/usuarios")
      setUsuarios(res.data)
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar usuários.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  // 🔹 Cadastra novo usuário
  const handleCadastro = async () => {
    if (!novoUsuario.name || !novoUsuario.email || !novoUsuario.phone || !novoUsuario.password) {
      setError("Preencha todos os campos antes de cadastrar.")
      return
    }

    try {
      setError(null)
      setSuccess(null)
      await documents.post("/cadastro", novoUsuario) 
      setSuccess("Usuário cadastrado com sucesso!")
      setNovoUsuario({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "funcionario",
      })
      fetchUsuarios()
    } catch (err) {
      console.error(err)
      setError("Erro ao cadastrar usuário.")
    }
  }

  // 🔹 Filtra lista de usuários
  const filteredUsers = Array.isArray(usuarios.data)
    ? usuarios.data.filter((user) =>
        [user.nome, user.email]
          .some((field) =>
            (field ?? "").toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    : []

  // 🔹 Tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin w-6 h-6 text-blue-500" />
        <span className="ml-2 text-gray-700">Carregando usuários...</span>
      </div>
    )
  }

  // 🔹 Interface principal
  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
              <p className="text-gray-600 mt-1">
                Gerencie e cadastre novos usuários no sistema
              </p>
            </div>
          </div>

          {/* Alertas */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-50 border-green-500 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* 🔹 Cadastro de Usuário */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                Cadastrar Novo Usuário
              </CardTitle>
              <CardDescription>
                Preencha as informações abaixo para criar um novo usuário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Nome completo"
                value={novoUsuario.name}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, name: e.target.value })
                }
              />
              <Input
                placeholder="E-mail"
                type="email"
                value={novoUsuario.email}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, email: e.target.value })
                }
              />
              <Input
                placeholder="Telefone"
                type="text"
                value={novoUsuario.phone}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, phone: e.target.value })
                }
              />
              <Input
                placeholder="Senha"
                type="password"
                value={novoUsuario.password}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, password: e.target.value })
                }
              />

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuário
                </label>
                <select
                  value={novoUsuario.role}
                  onChange={(e) =>
                    setNovoUsuario({ ...novoUsuario, role: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="funcionario">Funcionário</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>

              <Button
                onClick={handleCadastro}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Cadastrar Usuário
              </Button>
            </CardContent>
          </Card>

          {/* 🔹 Lista de Usuários */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Todos os usuários cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Busca */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tabela */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Nível</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id_usuario}>
                          <TableCell className="font-medium">{user.nome}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(
                                user.nivel_usuario_id === 2 ? "administrador" : "funcionario"
                              )}`}
                            >
                              {user.nivel_usuario_id === 2
                                ? "Administrador"
                                : "Funcionário"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-500 py-6"
                        >
                          Nenhum usuário encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
