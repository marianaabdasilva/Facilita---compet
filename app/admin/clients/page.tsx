"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Eye, Edit, Trash2, Plus } from "lucide-react";
import Link from "next/link";

// Tipagem do cliente
interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  cnpj: string;
  createdAt: string;
}

// bagui para formatar os numeros da pesquisa do cnpj
function formatCNPJ(value: string) {
  const digits = value.replace(/\D/g, "");
  let formatted = digits;

  if (digits.length > 2) formatted = digits.slice(0, 2) + "." + digits.slice(2);
  if (digits.length > 5) formatted = formatted.slice(0, 6) + "." + formatted.slice(6);
  if (digits.length > 8) formatted = formatted.slice(0, 10) + "/" + formatted.slice(10);
  if (digits.length > 12) formatted = formatted.slice(0, 15) + "-" + formatted.slice(15, 17);

  return formatted;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado.");
          setLoading(false);
          return;
        }

        const response = await fetch("https://projeto-back-ten.vercel.app/clientes", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar clientes");
        }

        const data: Client[] = await response.json();
        setClients(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // filtrar os clientes com a pesquisa
  const filteredClients = clients.filter((client) =>
    [client.name, client.email, client.company, client.cnpj]
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Cabeçalho da Página */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
              <p className="text-gray-600 mt-1">Gerencie todos os clientes e seus processos</p>
            </div>
            <Link href="/abrir-empresa/conta">
              <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Empresa
              </Button>
            </Link>
          </div>

          {/* Pesquisa */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Encontre clientes específicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email, empresa ou CNPJ..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/^company/i, "empresa");

                    // Se for apenas números, aplica a máscara de CNPJ
                    if (/^\d+$/.test(value.replace(/\D/g, ""))) {
                      value = formatCNPJ(value);
                    }

                    setSearchTerm(value);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mensagens de Loading ou Erro */}
          {loading && <p className="text-gray-500">Carregando clientes...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* Tabela de Clientes */}
          {!loading && !error && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Lista de Clientes ({filteredClients.length})</CardTitle>
                <CardDescription>Todos os clientes cadastrados no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>CNPJ</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="w-[50px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-500">{client.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{client.company}</TableCell>
                            <TableCell className="font-mono text-sm">{client.cnpj}</TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-500">
                                {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" /> Visualizar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" /> Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" /> Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                            Nenhum cliente encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
