"use client"

import { AuthGuard } from "@/components/auth-guard"
import { EmployeeLayout } from "@/components/employee-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Mail, Phone, MapPin, FileText } from "lucide-react"

const mockClients = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    city: "São Paulo, SP",
    activeProcesses: 2,
    status: "ativo",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(21) 97654-3210",
    city: "Rio de Janeiro, RJ",
    activeProcesses: 1,
    status: "ativo",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro.costa@email.com",
    phone: "(31) 96543-2109",
    city: "Belo Horizonte, MG",
    activeProcesses: 0,
    status: "inativo",
  },
]

export default function EmployeeClientsPage() {
  return (
    <AuthGuard requiredRole="employee">
      <EmployeeLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-1">Gerencie seus clientes atribuídos</p>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <Input placeholder="Buscar clientes por nome, email ou telefone..." className="flex-1" />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockClients.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <Users className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockClients.filter((c) => c.status === "ativo").length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
                <FileText className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockClients.reduce((sum, c) => sum + c.activeProcesses, 0)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Clients List */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>Clientes atribuídos a você</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {client.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {client.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {client.city}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Processos Ativos</div>
                        <div className="text-lg font-bold text-gray-900">{client.activeProcesses}</div>
                      </div>
                      <Badge
                        className={
                          client.status === "ativo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }
                      >
                        {client.status}
                      </Badge>
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
