"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
} from "lucide-react"

// Mock data combining clients and their processes
const processos = [
  {
    id: "PROC-001",
    clientName: "João Silva",
    email: "joao@empresa.com",
    company: "Silva Comércio LTDA",
    cnpj: "12.345.678/0001-90",
    processType: "Abertura de CNPJ",
    status: "Em andamento",
    dataSolicitacao: "2024-01-15T10:30:00",
    observations: "Empresa de comércio varejista, precisa de urgência no processo",
  },
  {
    id: "PROC-002",
    clientName: "Maria Santos",
    email: "maria@santos.com",
    company: "Santos & Associados",
    cnpj: "98.765.432/0001-10",
    processType: "Alteração Contratual",
    status: "Pendente Aprovação",
    dataSolicitacao: "2024-01-10T14:15:00",
    observations: "Alteração de endereço e inclusão de sócio",
  },
  {
    id: "PROC-003",
    clientName: "Pedro Costa",
    email: "pedro@costa.com",
    company: "Costa Transportes",
    cnpj: "11.222.333/0001-44",
    processType: "Fechamento de CNPJ",
    status: "Concluído",
    dataSolicitacao: "2024-01-05T09:45:00",
    observations: "Encerramento por aposentadoria do proprietário",
  },
  {
    id: "PROC-004",
    clientName: "Ana Oliveira",
    email: "ana@oliveira.com",
    company: "Oliveira Consultoria",
    cnpj: "55.666.777/0001-88",
    processType: "Abertura de CNPJ",
    status: "Documentos Pendentes",
    dataSolicitacao: "2024-01-20T16:20:00",
    observations: "Aguardando documentos complementares do cliente",
  },
  {
    id: "PROC-005",
    clientName: "Carlos Mendes",
    email: "carlos@mendes.com",
    company: "Mendes Tecnologia",
    cnpj: "77.888.999/0001-22",
    processType: "Alteração de Atividade",
    status: "Em andamento",
    dataSolicitacao: "2024-01-18T11:45:00",
    observations: "Inclusão de atividade de desenvolvimento de software",
  },
  {
    id: "PROC-006",
    clientName: "Lucia Ferreira",
    email: "lucia@ferreira.com",
    company: "Ferreira Advocacia",
    cnpj: "33.444.555/0001-66",
    processType: "Abertura de CNPJ",
    status: "Concluído",
    dataSolicitacao: "2024-01-12T08:30:00",
    observations: "Escritório de advocacia, processo finalizado com sucesso",
  },
]

export default function ProcessosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [processTypeFilter, setProcessTypeFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-700"
      case "Em andamento":
        return "bg-orange-100 text-orange-700"
      case "Pendente Aprovação":
        return "bg-red-100 text-red-700"
      case "Documentos Pendentes":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
        return <CheckCircle className="w-4 h-4" />
      case "Em andamento":
        return <Clock className="w-4 h-4" />
      case "Pendente Aprovação":
        return <AlertCircle className="w-4 h-4" />
      case "Documentos Pendentes":
        return <FileText className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getProcessTypeColor = (type: string) => {
    switch (type) {
      case "Abertura de CNPJ":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Alteração Contratual":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "Fechamento de CNPJ":
        return "bg-red-50 text-red-700 border-red-200"
      case "Alteração de Atividade":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const filteredProcessos = processos.filter((processo) => {
    const matchesSearch =
      processo.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.processType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.cnpj.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || processo.status === statusFilter
    const matchesProcessType = processTypeFilter === "all" || processo.processType === processTypeFilter

    return matchesSearch && matchesStatus && matchesProcessType
  })

  const statusCounts = {
    total: processos.length,
    emAndamento: processos.filter((p) => p.status === "Em andamento").length,
    pendente: processos.filter((p) => p.status === "Pendente Aprovação" || p.status === "Documentos Pendentes").length,
    concluido: processos.filter((p) => p.status === "Concluído").length,
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Processos</h1>
              <p className="text-gray-600 mt-1">Gerencie todos os processos e clientes em um só lugar</p>
            </div>
            <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Processo
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Processos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{statusCounts.total}</div>
                <p className="text-xs text-gray-500 mt-1">Todos os processos</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Em Andamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{statusCounts.emAndamento}</div>
                <p className="text-xs text-gray-500 mt-1">Processos ativos</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{statusCounts.pendente}</div>
                <p className="text-xs text-gray-500 mt-1">Aguardando ação</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Concluídos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{statusCounts.concluido}</div>
                <p className="text-xs text-gray-500 mt-1">Finalizados</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Encontre processos específicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por cliente, empresa, CNPJ ou tipo de processo..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Pendente Aprovação">Pendente Aprovação</SelectItem>
                      <SelectItem value="Documentos Pendentes">Documentos Pendentes</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:w-48">
                  <Select value={processTypeFilter} onValueChange={setProcessTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Processo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="Abertura de CNPJ">Abertura de CNPJ</SelectItem>
                      <SelectItem value="Alteração Contratual">Alteração Contratual</SelectItem>
                      <SelectItem value="Fechamento de CNPJ">Fechamento de CNPJ</SelectItem>
                      <SelectItem value="Alteração de Atividade">Alteração de Atividade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processes Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Lista de Processos ({filteredProcessos.length})</CardTitle>
              <CardDescription>Todos os processos cadastrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Tipo de Processo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Solicitação</TableHead>
                      <TableHead className="w-[50px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProcessos.map((processo) => (
                      <TableRow key={processo.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{processo.clientName}</div>
                            <div className="text-sm text-gray-500">{processo.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{processo.company}</div>
                            <div className="text-sm text-gray-500 font-mono">{processo.cnpj}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getProcessTypeColor(processo.processType)}>
                            {processo.processType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(processo.status)}>
                            {getStatusIcon(processo.status)}
                            <span className="ml-1">{processo.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(processo.dataSolicitacao).toLocaleDateString("pt-BR")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(processo.dataSolicitacao).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Gerar Link
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
