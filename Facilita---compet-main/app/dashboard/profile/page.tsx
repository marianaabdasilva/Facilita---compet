"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Shield, Edit, Activity } from "lucide-react"

export default function AdminProfilePage() {
  const { user } = useAuth()

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Perfil do Administrador</h1>
              <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e configurações</p>
            </div>
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
              <Shield className="w-3 h-3 mr-1" />
              Administrador
            </Badge>
          </div>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 mr-2" />
                  <CardTitle>Informações Pessoais</CardTitle>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
              <CardDescription>Suas informações básicas de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={user?.name || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Input id="role" value="Administrador do Sistema" readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-id">ID do Usuário</Label>
                <Input id="user-id" value={user?.id || ""} readOnly className="font-mono text-sm" />
              </div>
            </CardContent>
          </Card>

          {/* Access & Permissions */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 mr-2" />
                <CardTitle>Permissões e Acesso</CardTitle>
              </div>
              <CardDescription>Suas permissões administrativas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Gerenciar Clientes</span>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Ativo
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Gerenciar Solicitações</span>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Ativo
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Gerar Links de Processo</span>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Ativo
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Visualizar Dashboard Administrativo</span>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Ativo
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Gerenciar Funcionários</span>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Ativo
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 mr-2" />
                <CardTitle>Estatísticas de Atividade</CardTitle>
              </div>
              <CardDescription>Resumo das suas atividades no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">127</div>
                  <div className="text-sm text-gray-600 mt-1">Clientes Gerenciados</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89</div>
                  <div className="text-sm text-gray-600 mt-1">Processos Aprovados</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">15</div>
                  <div className="text-sm text-gray-600 mt-1">Links Gerados</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie suas configurações de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Senha</div>
                  <div className="text-sm text-gray-600">Última alteração há 30 dias</div>
                </div>
                <Button variant="outline" size="sm">
                  Alterar Senha
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Autenticação de Dois Fatores</div>
                  <div className="text-sm text-gray-600">Adicione uma camada extra de segurança</div>
                </div>
                <Button variant="outline" size="sm">
                  Ativar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Sessões Ativas</div>
                  <div className="text-sm text-gray-600">Gerencie dispositivos conectados</div>
                </div>
                <Button variant="outline" size="sm">
                  Ver Sessões
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
