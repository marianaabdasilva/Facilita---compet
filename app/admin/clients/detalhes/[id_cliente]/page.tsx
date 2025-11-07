"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Loader2, Factory } from "lucide-react";

interface Empresa {
  id_CNPJ: string | number;
  nome_fantasia?: string;
  CNPJ?: string | number;
  cnpj?: string | number;
  data_criacao?: string;
  atividade_principal?: string;
  data_abertura?: string;
}

interface ClienteDetalhes {
  id_cliente: string | number;
  cliente: string;
  email?: string;
  telefone?: string;
  data_criacao?: string;
  empresas?: Empresa[];
}

export default function DetalhesClientePage() {
  // captura params de forma robusta (cobre várias possíveis chaves)
  const params = useParams() as Record<string, any>;
  const id = params.id_cliente ?? params.id ?? params["id-cliente"];
  const router = useRouter();

  const [cliente, setCliente] = useState<ClienteDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // logs para depuração — veja no console do navegador (F12 → Console)
  console.log("Params recebidos (useParams):", params);
  console.log("ID do cliente recebido (usado):", id);

  useEffect(() => {
    const fetchCliente = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Usuário não autenticado.");
        }

        // usamos o endpoint geral e filtramos localmente (padrão que funcionou para a empresa)
        const res = await fetch("https://projeto-back-ten.vercel.app/clientes-detalhes", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Status da resposta:", res.status);

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Erro na requisição: ${res.status} ${txt}`);
        }

        const data: any = await res.json();
        console.log("Dados retornados (clientes-detalhes):", data);

        // Se a API retornar um array de registros planos (cada registro tem id_cliente + id_CNPJ)
        if (Array.isArray(data)) {
          // encontra um registro do cliente para extrair info geral
          const clienteRegistro = data.find((r: any) => String(r.id_cliente) === String(id));
          if (!clienteRegistro) {
            throw new Error("Cliente não encontrado (nenhum registro com esse id_cliente).");
          }

          // agrupa todas as empresas desse cliente (cada item do array que tiver o mesmo id_cliente)
          const empresasDoCliente = data
            .filter((r: any) => String(r.id_cliente) === String(id))
            .map((item: any) => ({
              id_CNPJ: item.id_CNPJ ?? item.id_empresa ?? item.id ?? null,
              nome_fantasia: (item.nome_fantasia ?? item.razao_social ?? item.nome) || "-",
              cnpj: item.CNPJ ?? item.cnpj ?? item.cnpj_numero ?? "-",
              data_criacao: item.data_criacao ?? item.data_abertura ?? undefined,
              atividade_principal: item.atividade_principal ?? item.cnae ?? undefined,
              data_abertura: item.data_abertura ?? undefined,
            }));

          setCliente({
            id_cliente: clienteRegistro.id_cliente,
            cliente: clienteRegistro.cliente ?? clienteRegistro.nome ?? "-",
            email: clienteRegistro.email ?? "-",
            telefone: clienteRegistro.telefone ?? undefined,
            data_criacao: clienteRegistro.data_criacao ?? undefined,
            empresas: empresasDoCliente,
          });
        } else if (typeof data === "object" && data !== null) {
          // Caso a API retorne um objeto com lista interna (ex: { clientes: [...] })
          const maybeArray = data.clientes || data.data || data.empresas || Object.values(data).find(Array.isArray);
          if (Array.isArray(maybeArray)) {
            const clienteRegistro = maybeArray.find((r: any) => String(r.id_cliente) === String(id));
            const empresasDoCliente = maybeArray.filter((r: any) => String(r.id_cliente) === String(id))
              .map((item: any) => ({
                id_CNPJ: item.id_CNPJ ?? item.id_empresa ?? item.id ?? null,
                nome_fantasia: (item.nome_fantasia ?? item.razao_social ?? item.nome) || "-",
                cnpj: item.CNPJ ?? item.cnpj ?? "-",
                data_criacao: item.data_criacao ?? item.data_abertura ?? undefined,
                atividade_principal: item.atividade_principal ?? item.cnae ?? undefined,
                data_abertura: item.data_abertura ?? undefined,
              }));

            if (!clienteRegistro) throw new Error("Cliente não encontrado.");
            setCliente({
              id_cliente: clienteRegistro.id_cliente,
              cliente: clienteRegistro.cliente ?? clienteRegistro.nome ?? "-",
              email: clienteRegistro.email ?? "-",
              telefone: clienteRegistro.telefone ?? undefined,
              data_criacao: clienteRegistro.data_criacao ?? undefined,
              empresas: empresasDoCliente,
            });
          } else {
            throw new Error("Formato de resposta inesperado da API.");
          }
        } else {
          throw new Error("Formato de resposta inesperado da API.");
        }
      } catch (err: any) {
        console.error("Erro ao buscar cliente:", err);
        setError(err?.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    // só executa quando tivermos o id
    if (id) {
      fetchCliente();
    } else {
      // se id ausente, mostra erro claro
      console.warn("ID do cliente não definido ainda — verificando params:", params);
      setError("ID do cliente ausente na rota.");
      setLoading(false);
    }
  }, [id, params]);

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
          <div className="p-6">
            <p className="text-red-600 text-center mt-6">{error}</p>
            <div className="text-center mt-6">
              <Button onClick={() => router.back()}>Voltar</Button>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  if (!cliente) {
    return (
      <AuthGuard requiredRole="admin">
        <AdminLayout>
          <div className="p-6">
            <p className="text-gray-500 text-center mt-6">Cliente não encontrado.</p>
            <div className="text-center mt-6">
              <Button onClick={() => router.back()}>Voltar</Button>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8 p-6">
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

          {/* Informações do Cliente */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>Dados gerais cadastrados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Email:</strong> {cliente.email ?? "-"}</p>
              <p><strong>Telefone:</strong> {cliente.telefone ?? "-"}</p>
              <p><strong>Data de criação:</strong> {cliente.data_criacao ? new Date(cliente.data_criacao).toLocaleDateString("pt-BR") : "-"}</p>
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
                        <TableHead>Atividade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cliente.empresas.map((empresa) => (
                        <TableRow key={String(empresa.id_CNPJ ?? empresa.cnpj ?? empresa.CNPJ ?? Math.random())}>
                          <TableCell className="font-medium">
                            <button
                              onClick={() => router.push(`/clients/${cliente.id_cliente}/empresas/${empresa.id_CNPJ}`)}
                              className="text-blue-600 hover:underline flex items-center gap-2"
                            >
                              <Factory className="w-4 h-4 text-gray-600" />
                              {empresa.nome_fantasia}
                            </button>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{empresa.cnpj ?? empresa.CNPJ ?? "-"}</TableCell>
                          <TableCell>{empresa.atividade_principal ?? "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500 italic">Nenhuma empresa vinculada a este cliente.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
