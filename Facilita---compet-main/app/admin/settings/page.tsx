"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Moon, Bell, Shield, Database, Users } from "lucide-react"
import { useState } from "react"

export default function AdminSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        {/* Container para centralizar o conteúdo da página */}
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-4xl w-full space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
              <p className="text-gray-600 mt-1">Gerencie as configurações do sistema</p>
            </div>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription>Configurações gerais da plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" defaultValue="FACILITA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Email de Suporte</Label>
                  <Input id="support-email" type="email" defaultValue="suporte@facilita.com.br" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Mensagem de Boas-Vindas</Label>
                  <Textarea
                    id="welcome-message"
                    defaultValue="Bem-vindo ao FACILITA! Estamos aqui para facilitar seus processos."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Salvar Configurações
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
