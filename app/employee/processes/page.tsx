"use client"

import { AuthGuard } from "@/components/auth-guard"
import { EmployeeLayout } from "@/components/employee-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, Clock, CheckCircle, AlertCircle, User } from "lucide-react"

const mockProcesses = [
  {
    id: "PROC-001",
    client: "João Silva",
    type: "Abertura de MEI",
    status: "Em Andamento",
    priority: "alta",
    createdAt: "2024-01-20",
    deadline: "2024-02-05",
  },
  {
    id: "PROC-002",
    client: "Maria Santos",
    type: "Alteração de CNPJ",
    status: "Aguardando Documentos",
    priority: "média",
    createdAt: "2024-01-18",
    deadline: "2024-02-10",
  },
  {
    id: "PROC-003",
    client: "Pedro Costa",
    type: "Fechamento de MEI",
    status: "Concluído",
    priority: "baixa",
    createdAt: "2024-01-15",
    deadline: "2024-01-30",
  },
  {
    id: "PROC-004",
    client: "Ana Oliveira",
    type: "Abertura de CNPJ",
    status: "Em Análise",
    priority: "alta",
    createdAt: "2024-01-22",
    deadline: "2024-02-08",
  },
]

export default function EmployeeProcessesPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-700"
      case "Em Andamento":
        return "bg-blue-100 text-blue-700"
      case "Aguardando Documentos":
        return "bg-yellow-100 text-yellow-700"
      case "Em Análise":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-700"
      case "média":
        return "bg-orange-100 text-orange-700"
      case "baixa":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
        return <CheckCircle className="w-4 h-4" />
      case "Em Andamento":
        return <Clock className="w-4 h-4" />
      case "Aguardando Documentos":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <AuthGuard requiredRole="employee">
      <EmployeeLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Processos</h1>
            <p className="text-gray-600 mt-1">Gerencie os processos dos seus clientes</p>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <Input placeholder="Buscar processos por ID, cliente ou tipo..." className="flex-1" />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <FileText className="w-4 h-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProcesses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                <Clock className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockProcesses.filter((p) => p.status === "Em Andamento").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockProcesses.filter((p) => p.status === "Aguardando Documentos").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProcesses.filter((p) => p.status === "Concluído").length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Processes List */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Processos</CardTitle>
              <CardDescription>Todos os processos atribuídos a você</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProcesses.map((process) => (
                  <div
                    key={process.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        {getStatusIcon(process.status)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{process.id}</h3>
                          <Badge className={getPriorityColor(process.priority)}>{process.priority}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{process.type}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {process.client}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Prazo: {new Date(process.deadline).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(process.status)}>{process.status}</Badge>
                      <Button size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </EmployeeLayout>
    </AuthGuard>
  )
}
