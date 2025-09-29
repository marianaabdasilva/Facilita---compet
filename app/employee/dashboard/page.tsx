"use client"

import { AuthGuard } from "@/components/auth-guard"
import { EmployeeLayout } from "@/components/employee-layout"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Clock, CheckCircle, TrendingUp } from "lucide-react"

export default function EmployeeDashboardPage() {
  const { user } = useAuth()

  return (
    <AuthGuard requiredRole="employee">
      <EmployeeLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Olá, {user?.name?.split(" ")[0]}!</h1>
            <p className="text-gray-600 mt-1">Bem-vindo ao seu painel de trabalho</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <Users className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-gray-600 mt-1">+3 esta semana</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processos em Andamento</CardTitle>
                <FileText className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-600 mt-1">5 aguardando ação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processos Concluídos</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-gray-600 mt-1">Este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96%</div>
                <p className="text-xs text-gray-600 mt-1">+2% vs mês anterior</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Suas últimas interações com clientes e processos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Processo aprovado - Silva LTDA</div>
                      <div className="text-sm text-gray-600">Abertura de CNPJ concluída</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Há 2h
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Novo cliente atribuído</div>
                      <div className="text-sm text-gray-600">João Santos - Alteração de CNPJ</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Há 4h
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Documentos pendentes</div>
                      <div className="text-sm text-gray-600">Maria Costa - Aguardando RG</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Há 1d
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Tarefas Pendentes</CardTitle>
              <CardDescription>Processos que precisam da sua atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900">Revisar documentos - Tech Solutions</div>
                      <div className="text-sm text-gray-600">Abertura de CNPJ</div>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Urgente</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Contatar cliente - Oliveira ME</div>
                      <div className="text-sm text-gray-600">Alteração de CNPJ</div>
                    </div>
                  </div>
                  <Badge variant="outline">Normal</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Finalizar processo - Pereira & Cia</div>
                      <div className="text-sm text-gray-600">Fechamento de CNPJ</div>
                    </div>
                  </div>
                  <Badge variant="outline">Normal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </EmployeeLayout>
    </AuthGuard>
  )
}
