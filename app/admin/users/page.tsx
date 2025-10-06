"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Mail, Calendar, Shield, UserPlus, RefreshCw } from "lucide-react"
import documents from "@/lib/documents"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [novoUsuario, setNovoUsuario] = useState({
    Nome: "",
    Email: "",
    Senha: "",
    nivel_usuario_id: 2, // padrão como "cliente"  // 1 = admin, 2 = cliente
  })

  // Carrega a lista de usuários
  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const res = await documents.get("/usuarios")
      setUsuarios(res.data)
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar usuários.")
    } finally {
      setLoading(false)
    //console.log(usuarios) // Debug: Verifica os dados carregadosgi
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  // Cadastra u novo usuário
  const handleCadastro = async () => {
    if (!novoUsuario.Nome || !novoUsuario.Email || !novoUsuario.Senha) {
      setError("Preencha todos os campos antes de cadastrar.")
      return
    }

    try {
      setError(null)
      setSuccess(null)
      await documents.post("/cadastro", novoUsuario)
      setSuccess("Usuário cadastrado com sucesso!")
      setNovoUsuario({ Nome: "", Email: "", Senha: "", nivel_usuario_id: 2 })
      fetchUsuarios()
    } catch (err) {
      console.error(err)
      setError("Erro ao cadastrar usuário.")
    }
  }

  const filteredUsers = usuarios.filter(
    (user) =>
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin w-6 h-6 text-blue-500" />
        <span className="ml-2 text-gray-700">Carregando usuários...</span>
      </div>
    )
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
              <p className="text-gray-600 mt-1">Gerencie e cadastre novos usuários no sistema</p>
            </div>
          </div>

          {/* Mensagens */}
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

          {/* Cadastro de Usuário */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                Cadastrar Novo Usuário
              </CardTitle>
              <CardDescription>Preencha as informações abaixo para criar um novo usuário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Nome completo"
                value={novoUsuario.Nome}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, Nome: e.target.value })}
              />
              <Input
                placeholder="E-mail"
                type="email"
                value={novoUsuario.Email}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, Email: e.target.value })}
              />
              <Input
                placeholder="Senha"
                type="password"
                value={novoUsuario.Senha}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, Senha: e.target.value })}
              />
              <Button onClick={handleCadastro} className="bg-blue-600 hover:bg-blue-700 text-white">
                Cadastrar Usuário
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Usuários */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
              <CardDescription>Todos os usuários cadastrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

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
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id_usuario}>
                        <TableCell className="font-medium">{user.nome}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.nivel_usuario_id === 1 ? "Administrador" : "Cliente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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