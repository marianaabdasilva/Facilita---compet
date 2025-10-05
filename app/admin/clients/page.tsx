"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Edit, Trash2, Plus, Filter } from "lucide-react"
import Link from "next/link"

// Mock data for clients
const clients = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    company: "Silva Comércio LTDA",
    cnpj: "12.345.678/0001-90",
    processType: "Abertura de CNPJ",
    status: "Em andamento",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@santos.com",
    company: "Santos & Associados",
    cnpj: "98.765.432/0001-10",
    processType: "Alteração Contratual",
    status: "Pendente Aprovação",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@costa.com",
    company: "Costa Transportes",
    cnpj: "11.222.333/0001-44",
    processType: "Fechamento de CNPJ",
    status: "Concluído",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@oliveira.com",
    company: "Oliveira Consultoria",
    cnpj: "55.666.777/0001-88",
    processType: "Abertura de CNPJ",
    status: "Em andamento",
    createdAt: "2024-01-20",
  },
]

export default function ClientsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-700"
      case "Em andamento":
        return "bg-blue-100 text-blue-700"
      case "Pendente Aprovação":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
              <p className="text-gray-600 mt-1">Gerencie todos os clientes e seus processos</p>
            </div>
            <Link href="/abrir-empresa/conta">
              <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Empresa
              </Button>
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Total de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{clients.length}</div>
                <p className="text-sm text-gray-600 mt-1">Clientes cadastrados</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Processos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {clients.filter((c) => c.status === "Em andamento").length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Em andamento</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Concluídos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {clients.filter((c) => c.status === "Concluído").length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Processos finalizados</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Encontre clientes específicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Buscar por nome, email ou empresa..." className="pl-10" />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Clients Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Lista de Clientes ({clients.length})</CardTitle>
              <CardDescription>Todos os clientes cadastrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Processo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="w-[50px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
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
                          <div className="font-mono text-sm">{client.cnpj}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{client.processType}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
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
                                <Eye className="w-4 h-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
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
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}

