"use client"

import { useEffect, useState } from "react"
import axios from "axios"
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
  const [stats, setStats] = useState({
    totalClients: 0,
    totalCNPJs: 0,
    activeProcesses: 0,
    completedThisMonth: 0,
    pendingRequests: 0,
  })

  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [loadingRecent, setLoadingRecent] = useState<boolean>(true)
  const [loadingStats, setLoadingStats] = useState<boolean>(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Documentos Recebidos":
        return "bg-green-100 text-green-700"
      case "Link Enviado":
        return "bg-blue-100 text-blue-700"
      case "Pendente":
      case "Aguardando Link":
        return "bg-yellow-100 text-yellow-700"
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
      case "Pendente":
      case "Aguardando Link":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token")
      if (!token) return setLoadingStats(false)

      try {
        setLoadingStats(true)
        const res = await fetch("https://projeto-back-ten.vercel.app/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          setStats({
            totalClients: data.totalClientes ?? 0,
            totalCNPJs: data.totalCNPJS ?? 0,
            activeProcesses: data.totalAtivos ?? 0,
            completedThisMonth: data.completedThisMonth ?? 0,
            pendingRequests: data.totalPendentes ?? 0,
          })
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const fetchRecentRequests = async () => {
      const token = localStorage.getItem("token")
      if (!token) return setLoadingRecent(false)

      try {
        setLoadingRecent(true)
        const [processosResp, clientesResp, empresasResp] = await Promise.all([
          axios.get("https://projeto-back-ten.vercel.app/processos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://projeto-back-ten.vercel.app/clientes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://projeto-back-ten.vercel.app/totalcnpjs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const clientesMap = (clientesResp.data || []).reduce((acc: any, c: any) => {
          acc[c.id_cliente] = { name: c.nome, email: c.email }
          return acc
        }, {})

        const empresasMap = (empresasResp.data || []).reduce((acc: any, e: any) => {
          acc[e.id_cnpj] = { name: e.nome, cnpj: e.numero_cnpj }
          return acc
        }, {})

        const formatted = (processosResp.data || []).map((p: any) => ({
          id: p.id_processo,
          clientName: clientesMap[p.id_cliente]?.name || "Cliente não encontrado",
          company: empresasMap[p.id_cnpj]?.name || "Empresa não encontrada",
          type: p.tipo || "Não informado",
          status: p.status_link || "Pendente",
          createdAt: p.data_atualizacao || p.created_at || new Date().toISOString(),
        }))

        const sorted = formatted
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)

        setRecentRequests(sorted)
      } catch (error) {
        console.error("Erro ao buscar solicitações recentes:", error)
        setRecentRequests([])
      } finally {
        setLoadingRecent(false)
      }
    }

    fetchRecentRequests()
  }, [])

  const pendingCount =
    stats.pendingRequests ??
    recentRequests.filter((r) => r.status === "Pendente" || r.status === "Aguardando Link").length

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8 px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Visão geral do sistema e métricas principais
              </p>
            </div>
            {pendingCount > 0 && (
              <Link href="/admin/requests">
                <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
                  <Bell className="w-4 h-4 mr-2" />
                  {pendingCount} Pendentes
                </Button>
              </Link>
            )}
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin/clients">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                  <Users className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {loadingStats ? "—" : stats.totalClients}
                  </div>
                  <p className="text-xs text-gray-500">+12% em relação ao mês anterior</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CNPJs Gerenciados</CardTitle>
                <Building2 className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {loadingStats ? "—" : stats.totalCNPJs}
                </div>
                <p className="text-xs text-gray-500">+8% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
                <FileText className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {loadingStats ? "—" : stats.activeProcesses}
                </div>
                <p className="text-xs text-gray-500">Em andamento</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
                <Bell className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {loadingStats ? "—" : stats.pendingRequests}
                </div>
                <p className="text-xs text-gray-500">Aguardando link</p>
              </CardContent>
            </Card>
          </div>

          {/* Solicitações Recentes + Resumo */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Solicitações Recentes */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <CardTitle className="flex items-center text-base sm:text-lg">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Solicitações Recentes
                    </CardTitle>
                    <Link href="/admin/requests">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Ver Todas
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>Últimas solicitações de processos</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {loadingRecent ? (
                      <p className="text-gray-500 text-sm">Carregando solicitações...</p>
                    ) : recentRequests.length === 0 ? (
                      <p className="text-gray-500 text-sm">Nenhuma solicitação recente encontrada.</p>
                    ) : (
                      recentRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                              {getStatusIcon(request.status)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                                {request.type}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600">
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
                            <Badge className={`${getStatusColor(request.status)} text-xs sm:text-sm`}>
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
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
                <CardContent className="space-y-4 text-sm sm:text-base">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Concluídos</span>
                    <span className="font-bold text-green-600">
                      {loadingStats ? "—" : stats.completedThisMonth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Aguardando Link</span>
                    <span className="font-bold text-red-600">
                      {loadingStats ? "—" : stats.pendingRequests}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Em Andamento</span>
                    <span className="font-bold text-orange-600">
                      {loadingStats ? "—" : stats.activeProcesses}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Tipos de Processo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm sm:text-base">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Abertura de CNPJ</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Alteração Contratual</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
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
