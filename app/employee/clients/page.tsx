"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { EmployeeLayout } from "@/components/employee-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Mail, Phone, FileText } from "lucide-react";
import { getClientes } from "@/lib/clientes";

interface Cliente {
  id_cliente: number;
  nome: string;
  fone1: string;
  fone2?: string;
  cpf: string;
}

export default function EmployeeClientsPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const data = await getClientes();
        setClientes(data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClientes();
  }, []);

  if (loading) return <p>Carregando clientes...</p>;

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
                <Input placeholder="Buscar clientes por nome ou CPF..." className="flex-1" />
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
                <div className="text-2xl font-bold">{clientes.length}</div>
              </CardContent>
            </Card>

            {/* Aqui você pode colocar regras para definir "ativos" e "processos ativos" se a API enviar esses dados */}
          </div>

          {/* Lista de Clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>Clientes atribuídos a você</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientes.map((client) => (
                  <div
                    key={client.id_cliente}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.nome}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {client.fone1}
                          </div>
                          {client.fone2 && (
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {client.fone2}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            CPF: {client.cpf}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-green-100 text-green-700">ativo</Badge>
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
  );
}
