"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Factory } from "lucide-react";

interface Empresa {
  id: string;
  nome_fantasia: string;
  cnpj: string;
  data_abertura?: string;
  atividade_principal?: string;
}

interface ClienteDetalhes {
  id: string;
  cliente: string;
  email: string;
  telefone?: string;
  data_criacao: string;
  empresas?: Empresa[];
}

export default function DetalhesClientePage() {
  const { id } = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<ClienteDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado.");
          setLoading(false);
          return;
        }

        const response = await fetch(`https://projeto-back-ten.vercel.app/clientes-detalhes/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar detalhes do cliente");

        const data: ClienteDetalhes = await response.json();
        setCliente(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCliente();
  }, [id]);

  if (loading) {
    return (
      <AuthGuard requiredRole="admin">
        <AdminLayout>
          <div className="flex items-center justify-center h-96 text-gray-500">
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            Carregando dados do cliente...
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard requiredRole="admin">
        <AdminLayout>
          <p className="text-red-600 text-center mt-10">{error}</p>
          <div className="text-center mt-6">
            <Button onClick={() => router.back()}>Voltar</Button>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  if (!cliente) {
    return (
      <AuthGuard requiredRole="admin">
        <AdminLayout>
          <p className="text-gray-500 text-center mt-10">Cliente não encontrado.</p>
          <div className="text-center mt-6">
            <Button onClick={() => router.back()}>Voltar</Button>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{cliente.cliente}</h1>
              <p className="text-gray-600 mt-1">Detalhes do cliente e suas empresas</p>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>

          {/* Detalhes do cliente */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>Dados gerais cadastrados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Email:</strong> {cliente.email}</p>
              {cliente.telefone && <p><strong>Telefone:</strong> {cliente.telefone}</p>}
              <p><strong>Data de criação:</strong> {new Date(cliente.data_criacao).toLocaleDateString("pt-BR")}</p>
            </CardContent>
          </Card>

          {/* Empresas vinculadas */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Empresas vinculadas</CardTitle>
              <CardDescription>Empresas cadastradas para este cliente</CardDescription>
            </CardHeader>
            <CardContent>
              {cliente.empresas && cliente.empresas.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome Fantasia</TableHead>
                        <TableHead>CNPJ</TableHead>
                        <TableHead>Atividade Principal</TableHead>
                        <TableHead>Data de Abertura</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cliente.empresas.map((empresa) => (
                        <TableRow key={empresa.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <Factory className="w-4 h-4 text-gray-600" />
                            {empresa.nome_fantasia}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{empresa.cnpj}</TableCell>
                          <TableCell>{empresa.atividade_principal || "-"}</TableCell>
                          <TableCell>
                            {empresa.data_abertura
                              ? new Date(empresa.data_abertura).toLocaleDateString("pt-BR")
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma empresa vinculada a este cliente.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
