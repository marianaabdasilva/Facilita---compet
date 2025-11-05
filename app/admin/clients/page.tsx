"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Plus, UserPlus } from "lucide-react";
import Link from "next/link";

interface Client {
  id_cliente: string;
  id_empresa: string;
  cliente: string;
  nome_fantasia: string;
  cnpj: string;
  data_criacao: string;
  email: string;
  CNPJ: string;
}

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

        const response = await fetch("https://projeto-back-ten.vercel.app/clientes-detalhes", {
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

  const filteredClients = clients.filter((client) => {
    const fieldsToSearch = [
      client.cliente,
      client.email,
      client.nome_fantasia,
      client.CNPJ?.toString(),
      client.data_criacao ? new Date(client.data_criacao).toLocaleDateString("pt-BR") : "",
    ];

    return fieldsToSearch.some((field) =>
      (field || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
              <p className="text-gray-600 mt-1">Gerencie todos os clientes e seus processos</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link href="/abrir-empresa/clientes">
                <Button className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Conta de Cliente
                </Button>
              </Link>
              <Link href="/abrir-empresa/atividade">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Empresa
                </Button>
              </Link>
            </div>
          </div>

          {/* Filtro */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Encontre clientes específicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  name="search"
                  placeholder="Buscar por nome, email, empresa ou CNPJ..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (/^\d+$/.test(value.replace(/\D/g, ""))) {
                      value = formatCNPJ(value);
                    }
                    setSearchTerm(value);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Estado de carregamento/erro */}
          {loading && <p className="text-gray-500">Carregando clientes...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* Tabela */}
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
                          <TableRow key={`row-${client.id_cliente}-${client.CNPJ || client.nome_fantasia}`}>
                            <TableCell>
                              <div>
                                <div className="font-medium text-gray-900">{client.cliente}</div>
                                <div className="text-sm text-gray-500">{client.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{client.nome_fantasia}</TableCell>
                            <TableCell className="font-mono text-sm">{client.CNPJ}</TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-500">
                                {new Date(client.data_criacao).toLocaleDateString("pt-BR")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Link href={`/admin/clients/empresas/${client.id_cliente}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Visualizar
                                </Button>
                              </Link>
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
