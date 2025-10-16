"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Shield, Edit, Activity, Bell } from "lucide-react"
import { useState } from "react"


export default function AdminProfilePage() {
  const { user } = useAuth()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

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
            <Badge className="bg-red-100 text-purple-700 hover:bg-purple-100">
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
              </div>
              <CardDescription>Suas informações básicas de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={user?.nome || ""} readOnly />
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

          {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notificações
                </CardTitle>
                <CardDescription>Configure como você deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Notificações por Email</Label>
                    <p className="text-sm text-gray-600">Receber alertas importantes por email</p>
                  </div>
                  <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
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

