"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Users,
  Building2,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Bell,
  ExternalLink,
} from "lucide-react"

export default function AdminDashboard() {
  // Estado para os stats do backend
  const [stats, setStats] = useState({
    totalClients: 0,
    totalCNPJs: 0,
    activeProcesses: 0,
    completedThisMonth: 0,
    pendingRequests: 0,
  })

  // Requisições recentes ainda mockadas
  const recentRequests = [
    {
      id: "REQ-001",
      clientName: "João Silva",
      company: "Silva Comércio LTDA",
      type: "Abertura de CNPJ",
      status: "Aguardando Link",
      createdAt: "2024-01-22",
    },
    {
      id: "REQ-002",
      clientName: "Maria Santos",
      company: "Santos & Associados",
      type: "Alteração Contratual",
      status: "Link Enviado",
      createdAt: "2024-01-21",
    },
    {
      id: "REQ-003",
      clientName: "Pedro Costa",
      company: "Costa Transportes",
      type: "Fechamento de CNPJ",
      status: "Documentos Recebidos",
      createdAt: "2024-01-20",
    },
  ]

  // Funções auxiliares para cores e ícones
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Documentos Recebidos":
        return "bg-green-100 text-green-700"
      case "Link Enviado":
        return "bg-blue-100 text-blue-700"
      case "Aguardando Link":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Documentos Recebidos":
        return <CheckCircle className="w-4 h-4" />
      case "Link Enviado":
        return <ExternalLink className="w-4 h-4" />
      case "Aguardando Link":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  // Fetch backend para os cards (sem exibir erro)
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const fetchStats = async () => {
      try {
        const res = await fetch("https://projeto-back-ten.vercel.app/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setStats({
            totalClients: data.totalClients,
            totalCNPJs: data.totalCNPJs,
            activeProcesses: data.activeProcesses,
            completedThisMonth: data.completedThisMonth,
            pendingRequests: data.pendingRequests,
          })
        }
        // Se houver erro do backend, ele já envia mensagem detalhada
      } catch {
        // Nada a fazer aqui, backend já envia mensagens
      }
    }

    fetchStats()
  }, [])

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600 mt-1">Visão geral do sistema e métricas principais</p>
            </div>
            {stats.pendingRequests > 0 && (
              <Link href="/admin/requests">
                <Button className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700">
                  <Bell className="w-4 h-4 mr-2" />
                  {stats.pendingRequests} Solicitações Pendentes
                </Button>
              </Link>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalClients}</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CNPJs Gerenciados</CardTitle>
                <Building2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.totalCNPJs}</div>
                <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
                <FileText className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.activeProcesses}</div>
                <p className="text-xs text-muted-foreground">Em andamento no momento</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
                <Bell className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Aguardando geração de link</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Requests */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Solicitações Recentes
                    </CardTitle>
                    <Link href="/admin/requests">
                      <Button variant="outline" size="sm">
                        Ver Todas
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>Últimas solicitações de processos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            {getStatusIcon(request.status)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{request.type}</h4>
                            <p className="text-sm text-gray-600">
                              {request.clientName} - {request.company}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Resumo do Mês</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Processos Concluídos</span>
                    <span className="text-lg font-bold text-green-600">{stats.completedThisMonth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Aguardando Link</span>
                    <span className="text-lg font-bold text-red-600">{stats.pendingRequests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Em Andamento</span>
                    <span className="text-lg font-bold text-orange-600">{stats.activeProcesses}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Tipos de Processo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Abertura de CNPJ</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Alteração Contratual</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fechamento de CNPJ</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
