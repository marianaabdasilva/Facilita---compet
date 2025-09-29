"use client"

import { AuthGuard } from "@/components/auth-guard"
import { EmployeeLayout } from "@/components/employee-layout"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Briefcase, Edit, Activity } from "lucide-react"

export default function EmployeeProfilePage() {
  const { user } = useAuth()

  return (
    <AuthGuard requiredRole="employee">
      <EmployeeLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              <Briefcase className="w-3 h-3 mr-1" />
              Funcionário
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Input id="role" value="Funcionário" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input id="department" value={user?.department || "Atendimento"} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-id">ID do Usuário</Label>
                <Input id="user-id" value={user?.id || ""} readOnly className="font-mono text-sm" />
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 mr-2" />
                <CardTitle>Desempenho</CardTitle>
              </div>
              <CardDescription>Suas estatísticas de trabalho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-gray-600 mt-1">Clientes Atendidos</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">47</div>
                  <div className="text-sm text-gray-600 mt-1">Processos Concluídos</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">96%</div>
                  <div className="text-sm text-gray-600 mt-1">Taxa de Sucesso</div>
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
            </CardContent>
          </Card>
        </div>
      </EmployeeLayout>
    </AuthGuard>
  )
}
