"use client"

import { AuthGuard } from "@/components/auth-guard"
import { ClientLayout } from "@/components/client-layout"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, FileText, Plus, Clock, CheckCircle, AlertCircle, TrendingUp, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

const mockRequests = [
  {
    id: "REQ-001",
    type: "Abertura de MEI",
    status: "Aguardando Link",
    createdAt: "2024-01-22",
    description: "Solicitação enviada, aguardando link para upload de documentos",
  },
  {
    id: "REQ-002",
    type: "Alteração de MEI",
    status: "Link Recebido",
    createdAt: "2024-01-20",
    description: "Link recebido, documentos podem ser enviados",
    uploadLink: "/upload/REQ-002",
  },
]

const mockMEIs = [
  {
    id: "1",
    name: "João Silva - Serviços de Informática",
    cnpj: "12.345.678/0001-90",
    status: "ativo",
    foundedAt: "2020-03-15",
    activity: "Desenvolvimento de Software",
    address: "São Paulo, SP",
    faturamento: "R$ 5.200,00/mês",
  },
  {
    id: "2",
    name: "Maria Santos - Consultoria",
    cnpj: "98.765.432/0001-10",
    status: "inativo",
    foundedAt: "2019-08-22",
    activity: "Consultoria Empresarial",
    address: "Rio de Janeiro, RJ",
    faturamento: "R$ 0,00/mês",
  },
  {
    id: "3",
    name: "Pedro Costa - Vendas Online",
    cnpj: "11.222.333/0001-44",
    status: "transferido",
    foundedAt: "2021-11-10",
    activity: "Comércio Eletrônico",
    address: "Belo Horizonte, MG",
    faturamento: "R$ 3.800,00/mês",
  },
]

const statusColors = {
  ativo: "bg-green-100 text-green-700",
  inativo: "bg-red-100 text-red-700",
  transferido: "bg-yellow-100 text-yellow-700",
}

export default function ClientDashboard() {
  const { user } = useAuth()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-700"
      case "Link Recebido":
        return "bg-blue-100 text-blue-700"
      case "Aguardando Link":
        return "bg-yellow-100 text-yellow-700"
      case "Documentos Enviados":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
        return <CheckCircle className="w-4 h-4" />
      case "Link Recebido":
        return <ExternalLink className="w-4 h-4" />
      case "Aguardando Link":
        return <Clock className="w-4 h-4" />
      case "Documentos Enviados":
        return <FileText className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <AuthGuard requiredRole="client">
      <ClientLayout>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Olá, {user?.name?.split(" ")[0]}!</h1>
              <p className="text-gray-600 mt-1">Gerencie seus MEIs e solicitações de processos</p>
            </div>
            <Link href="/dashboard/new-process">
              <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Solicitação
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Seus MEIs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {mockMEIs.map((mei) => (
                <Card key={mei.id} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{mei.name}</CardTitle>
                          <CardDescription>CNPJ: {mei.cnpj}</CardDescription>
                        </div>
                      </div>
                      <Badge className={statusColors[mei.status as keyof typeof statusColors]}>
                        {mei.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Atividade:</span>
                        <span className="font-medium">{mei.activity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Abertura:</span>
                        <span className="font-medium">{new Date(mei.foundedAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Localização:</span>
                        <span className="font-medium">{mei.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Faturamento:</span>
                        <span className={`font-medium ${mei.status === "ativo" ? "text-green-600" : "text-gray-500"}`}>
                          {mei.faturamento}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status do CNPJ:</span>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              mei.status === "ativo"
                                ? "bg-green-500"
                                : mei.status === "inativo"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                            }`}
                          />
                          <span className="font-medium capitalize">{mei.status}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Suas Solicitações
                </CardTitle>
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        {getStatusIcon(request.status)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{request.type}</h4>
                        <p className="text-sm text-gray-600">{request.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Solicitado em {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      {request.status === "Link Recebido" && request.uploadLink && (
                        <div className="mt-2">
                          <Link href={request.uploadLink}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Enviar Documentos
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ClientLayout>
    </AuthGuard>
  )
}
