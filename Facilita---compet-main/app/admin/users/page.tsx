"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Shield, User, Mail, Calendar, Edit, Trash2, UserPlus } from "lucide-react"

// Mock data for administrators
const administrators = [
  {
    id: "1",
    name: "Carlos Administrador",
    email: "carlos@facilita.com",
    role: "Super Admin",
    status: "Ativo",
    createdAt: "2023-06-15",
    lastLogin: "2024-01-22T14:30:00",
  },
  {
    id: "2",
    name: "Ana Paula Silva",
    email: "ana@facilita.com",
    role: "Admin",
    status: "Ativo",
    createdAt: "2023-08-20",
    lastLogin: "2024-01-22T09:15:00",
  },
  {
    id: "3",
    name: "Roberto Santos",
    email: "roberto@facilita.com",
    role: "Admin",
    status: "Ativo",
    createdAt: "2023-11-10",
    lastLogin: "2024-01-21T16:45:00",
  },
]

// Mock data for clients
const clientUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    company: "Silva Comércio LTDA",
    status: "Ativo",
    createdAt: "2024-01-15",
    processCount: 2,
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@santos.com",
    company: "Santos & Associados",
    status: "Ativo",
    createdAt: "2024-01-10",
    processCount: 1,
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@costa.com",
    company: "Costa Transportes",
    status: "Ativo",
    createdAt: "2024-01-05",
    processCount: 3,
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@oliveira.com",
    company: "Oliveira Consultoria",
    status: "Ativo",
    createdAt: "2024-01-20",
    processCount: 1,
  },
  {
    id: "5",
    name: "Lucas Ferreira",
    email: "lucas@ferreira.com",
    company: "Ferreira Tech",
    status: "Inativo",
    createdAt: "2023-12-28",
    processCount: 0,
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
  }

  const getRoleColor = (role: string) => {
    return role === "Super Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
  }

  const filteredAdmins = administrators.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredClients = clientUsers.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
              <p className="text-gray-600 mt-1">Gerencie administradores e clientes do sistema</p>
            </div>
           
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  Administradores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{administrators.length}</div>
                <p className="text-sm text-gray-600 mt-1">Usuários com acesso admin</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{clientUsers.length}</div>
                <p className="text-sm text-gray-600 mt-1">Clientes cadastrados</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Usuários Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {administrators.filter((a) => a.status === "Ativo").length +
                    clientUsers.filter((c) => c.status === "Ativo").length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Total de usuários ativos</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Users Tables */}
          <Tabs defaultValue="admins" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="admins">
                <Shield className="w-4 h-4 mr-2" />
                Administradores
              </TabsTrigger>
              <TabsTrigger value="clients">
                <User className="w-4 h-4 mr-2" />
                Clientes
              </TabsTrigger>
            </TabsList>

            {/* Administrators Tab */}
            <TabsContent value="admins">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Lista de Administradores ({filteredAdmins.length})</CardTitle>
                  <CardDescription>Todos os usuários com permissões administrativas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Último Acesso</TableHead>
                          <TableHead>Cadastrado em</TableHead>
                          <TableHead className="w-[50px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAdmins.map((admin) => (
                          <TableRow key={admin.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                  <Shield className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="font-medium text-gray-900">{admin.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-3 h-3 mr-1" />
                                {admin.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleColor(admin.role)}>{admin.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(admin.status)}>{admin.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-500">
                                {new Date(admin.lastLogin).toLocaleDateString("pt-BR")}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(admin.lastLogin).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(admin.createdAt).toLocaleDateString("pt-BR")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remover
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Lista de Clientes ({filteredClients.length})</CardTitle>
                  <CardDescription>Todos os clientes cadastrados no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Processos</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Cadastrado em</TableHead>
                          <TableHead className="w-[50px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="font-medium text-gray-900">{client.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-3 h-3 mr-1" />
                                {client.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium">{client.company}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{client.processCount} processo(s)</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remover
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
