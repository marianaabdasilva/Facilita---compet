"use client"

import { AuthGuard } from "@/components/auth-guard"
import { ClientLayout } from "@/components/client-layout"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Building2, Shield, Edit } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <AuthGuard requiredRole="client">
      <ClientLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Dados</h1>
            <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e empresariais</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>Seus dados pessoais cadastrados no sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" value={user?.name || ""} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user?.email || ""} readOnly />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" value="(11) 99999-9999" readOnly />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" value="123.456.789-00" readOnly />
                    </div>
                  </div>
                  <Separator />
                  <Button className="w-full md:w-auto">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Informações
                  </Button>
                </CardContent>
              </Card>

              {/* Company Information */}
              {user?.company && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <img src="Facilitaj.png"
                        alt="Logo da Empresa"
                        width={20}
                        height={20}
                        className="w-16 h-16" 
                        />
                      Informações da Empresa
                    </CardTitle>
                    <CardDescription>Dados da sua empresa cadastrada</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company-name">Razão Social</Label>
                        <Input id="company-name" value={user.company.name} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" value={user.company.cnpj} readOnly />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fantasy-name">Nome Fantasia</Label>
                        <Input id="fantasy-name" value="Silva Comércio" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="activity">Atividade Principal</Label>
                        <Input id="activity" value="Comércio Varejista" readOnly />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Input id="address" value="Rua das Flores, 123 - Centro - São Paulo/SP" readOnly />
                    </div>
                    <Separator />
                    <Button className="w-full md:w-auto">
                      <Edit className="w-4 h-4 mr-2" />
                      Solicitar Alteração
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Status da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verificação</span>
                    <Badge className="bg-green-100 text-green-700">Verificado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tipo de Conta</span>
                    <Badge className="bg-blue-100 text-blue-700">Cliente</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Membro desde</span>
                    <span className="text-sm text-gray-900">Jan 2024</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Resumo da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">7</div>
                    <div className="text-sm text-gray-600">Processos Total</div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">5</div>
                    <div className="text-sm text-gray-600">Concluídos</div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">2</div>
                    <div className="text-sm text-gray-600">Em Andamento</div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Precisa de Ajuda?</CardTitle>
                  <CardDescription>Nossa equipe está pronta para ajudar</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Contatar Suporte
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ClientLayout>
    </AuthGuard>
  )
}
