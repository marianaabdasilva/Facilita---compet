"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, Plus, UserPlus, Users } from "lucide-react";
import Link from "next/link";

interface Client {
  id_cliente: string;
  id_CNPJ: string;
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

        // 🔹 Puxa apenas os clientes que já foram finalizados (etapa 1 + 2)
        const response = await fetch(
          "https://projeto-back-ten.vercel.app/clientes-detalhes",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Erro na resposta:", data);
          throw new Error(data.message || "Erro ao buscar clientes");
        }

        setClients(data);
      } catch (err: any) {
        console.error("Erro ao carregar clientes:", err);
        setError(err.message || "Erro inesperado ao carregar clientes.");
      } finally {
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="flex items-center text-2xl md:text-3xl font-bold text-gray-900 text-center md:text-left">
                <Users className="w-8 h-8 mr-4 text-blue-600" />
                Gestão de Clientes
              </h1>

              <p className="text-gray-600 text-sm md:text-base mt-1 text-center md:text-left">
                Gerencie todos os clientes e seus processos
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/abrir-empresa/clientes" className="w-full sm:w-auto">
                <Button className="bg-green-600 hover:bg-green-700 w-full text-sm md:text-base">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Conta de Cliente
                </Button>
              </Link>
              <Link href="/abrir-empresa/atividade" className="w-full sm:w-auto">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full text-sm md:text-base">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Empresa
                </Button>
              </Link>
            </div>
          </div>

          {/* Filtro */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Filtros</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Encontre clientes específicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  name="search"
                  placeholder="Buscar por nome, email, empresa ou CNPJ..."
                  className="pl-10 text-sm md:text-base"
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

          {/* Tabela */}
          {!loading && !error && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Lista de Clientes ({filteredClients.length})
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Todos os clientes cadastrados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-md">
                  <Table className="min-w-full text-sm md:text-base">
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
                          <TableRow
                            key={`row-${client.id_cliente}-${client.id_CNPJ}`}
                            className="hover:bg-gray-50"
                          >
                            {/* CLIENTE */}
                            <TableCell>
                              <div>
                                <Link
                                  href={`/admin/clients/detalhes/${client.id_cliente}`}
                                  className="font-medium text-gray-900 hover:underline"
                                >
                                  {client.cliente}
                                </Link>
                                <div className="text-xs md:text-sm text-gray-500">
                                  {client.email}
                                </div>
                              </div>
                            </TableCell>

                            {/* EMPRESA */}
                            <TableCell>
                              <Link
                                href={`/admin/clients/${client.id_cliente}/empresas/${client.id_CNPJ}`}
                                className="font-medium text-gray-900 hover:underline"
                              >
                                {client.nome_fantasia}
                              </Link>
                            </TableCell>

                            {/* CNPJ */}
                            <TableCell className="font-mono text-xs md:text-sm">
                              {client.CNPJ}
                            </TableCell>

                            {/* DATA */}
                            <TableCell>
                              <div className="text-xs md:text-sm text-gray-500">
                                {new Date(client.data_criacao).toLocaleDateString("pt-BR")}
                              </div>
                            </TableCell>

                            {/* AÇÃO */}
                            <TableCell>
                              <Link
                                href={`/admin/clients/${client.id_cliente}/empresas/${client.id_CNPJ}`}
                              >
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  <span className="hidden sm:inline">Visualizar</span>
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-gray-500 py-6 text-sm"
                          >
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

          {/* Estado de Carregamento ou Erro */}
          {loading && (
            <p className="text-center text-gray-500 mt-6">Carregando clientes...</p>
          )}
          {error && (
            <p className="text-center text-red-600 mt-6">Erro: {error}</p>
          )}
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}