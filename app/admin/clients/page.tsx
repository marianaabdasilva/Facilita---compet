"use client"

import { useState, useMemo } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Users,
  UserCheck,
  UserX,
  ArrowRightLeft,
  X,
} from "lucide-react"

const clients = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    company: "Silva Comércio LTDA",
    cnpj: "12.345.678/0001-90",
    clientStatus: "ativo",
    createdAt: "2024-01-15",
    lastActivity: "2024-01-25",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@santos.com",
    company: "Santos & Associados",
    cnpj: "98.765.432/0001-10",
    clientStatus: "inativo",
    createdAt: "2024-01-10",
    lastActivity: "2024-01-20",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@costa.com",
    company: "Costa Transportes",
    cnpj: "11.222.333/0001-44",
    clientStatus: "transferido",
    createdAt: "2024-01-05",
    lastActivity: "2024-01-22",
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@oliveira.com",
    company: "Oliveira Consultoria",
    cnpj: "55.666.777/0001-88",
    clientStatus: "ativo",
    createdAt: "2024-01-20",
    lastActivity: "2024-01-26",
  },
  {
    id: "5",
    name: "Carlos Mendes",
    email: "carlos@mendes.com",
    company: "Mendes Tecnologia",
    cnpj: "33.444.555/0001-66",
    clientStatus: "ativo",
    createdAt: "2024-01-12",
    lastActivity: "2024-01-24",
  },
  {
    id: "6",
    name: "Lucia Ferreira",
    email: "lucia@ferreira.com",
    company: "Ferreira Advocacia",
    cnpj: "77.888.999/0001-22",
    clientStatus: "inativo",
    createdAt: "2024-01-08",
    lastActivity: "2024-01-18",
  },
]

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cnpj.includes(searchTerm)

      const matchesStatus = statusFilter === "todos" || client.clientStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const getClientStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-700 border-green-200"
      case "inativo":
        return "bg-red-100 text-red-700 border-red-200"
      case "transferido":
        return "bg-orange-100 text-orange-700 border-orange-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getClientStatusLabel = (status: string) => {
    switch (status) {
      case "ativo":
        return "Ativo"
      case "inativo":
        return "Inativo"
      case "transferido":
        return "Transferido"
      default:
        return status
    }
  }

  const activeClients = clients.filter((c) => c.clientStatus === "ativo").length
  const inactiveClients = clients.filter((c) => c.clientStatus === "inativo").length
  const transferredClients = clients.filter((c) => c.clientStatus === "transferido").length
  const totalClients = clients.length

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("todos")
    setShowAdvancedFilters(false)
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
              <p className="text-gray-600 mt-1">Dashboard e lista completa de clientes</p>
            </div>
            <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-white from-blue-50 to-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalClients}</div>
                <p className="text-xs text-gray-600 mt-1">Clientes cadastrados</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white from-green-50 to-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Clientes Ativos</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeClients}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {((activeClients / totalClients) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white from-red-50 to-red-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Clientes Inativos</CardTitle>
                <UserX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{inactiveClients}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {((inactiveClients / totalClients) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Transferidos</CardTitle>
                <ArrowRightLeft className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{transferredClients}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {((transferredClients / totalClients) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Encontre clientes específicos por nome, empresa ou status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nome, email, empresa ou CNPJ..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros Avançados
                  </Button>
                  {(searchTerm || statusFilter !== "todos") && (
                    <Button variant="outline" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Limpar
                    </Button>
                  )}
                </div>

                {showAdvancedFilters && (
                  <div className="flex flex-col md:flex-row gap-4 pt-4 border-t">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status do Cliente</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os Status</SelectItem>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                          <SelectItem value="transferido">Transferido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Active Filters Display */}
                {(searchTerm || statusFilter !== "todos") && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-sm text-gray-600">Filtros ativos:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="text-xs">
                        Busca: "{searchTerm}"
                      </Badge>
                    )}
                    {statusFilter !== "todos" && (
                      <Badge variant="secondary" className="text-xs">
                        Status: {getClientStatusLabel(statusFilter)}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Updated Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Lista de Clientes ({filteredClients.length})</CardTitle>
              <CardDescription>
                {filteredClients.length === clients.length
                  ? "Todos os clientes cadastrados com seus respectivos status"
                  : `Mostrando ${filteredClients.length} de ${clients.length} clientes`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Status do Cliente</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Última Atividade</TableHead>
                      <TableHead className="w-[50px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Nenhum cliente encontrado com os filtros aplicados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{client.name}</div>
                              <div className="text-sm text-gray-500">{client.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{client.company}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getClientStatusColor(client.clientStatus)}>
                              {getClientStatusLabel(client.clientStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm">{client.cnpj}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-500">
                              {new Date(client.lastActivity).toLocaleDateString("pt-BR")}
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
                                  <Eye className="w-4 h-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                                  Alterar Status
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
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
