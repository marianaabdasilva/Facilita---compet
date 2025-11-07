"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Factory, Loader2 } from "lucide-react";

interface Empresa {
  id_CNPJ: string | number;
  nome_fantasia?: string;
  CNPJ?: string | number; // número do CNPJ que pode começar com zero
  cnpj?: string | number; // alternativa
  cliente?: string;
  email?: string;
  telefone?: string;
  cnae?: string;
  data_criacao?: string;
  endereco?: string;
  id_cliente?: string | number;
}

export default function EmpresaDetalhesPage() {
  const params = useParams() as { id_cliente?: string; id_CNPJ?: string };
  const { id_cliente, id_CNPJ } = params;
  const router = useRouter();

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEmpresa = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        const res = await fetch("https://projeto-back-ten.vercel.app/clientes-detalhes", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Erro na requisição: ${res.status} ${txt}`);
        }

        const data: any = await res.json();
        console.log("Dados retornados (clientes-detalhes):", data);

        // Se a API já retorna um array de empresas planas (como no seu log), procuramos direto nele:
        if (Array.isArray(data)) {
          const found = data.find(
            (item: any) =>
              String(item.id_cliente) === String(id_cliente) &&
              (String(item.id_CNPJ) === String(id_CNPJ) ||
                String(item.idCNPJ) === String(id_CNPJ) ||
                String(item.id_empresa) === String(id_CNPJ)) // tentativas alternativas
          );

          if (!found) {
            // possibilidade alternativa: a API pode retornar clientes com array "empresas"
            // vamos verificar se existe um cliente que tenha campo "empresas" e procurar dentro
            const clienteComEmpresas = data.find(
              (c: any) => String(c.id_cliente) === String(id_cliente) && Array.isArray(c.empresas)
            );

            if (clienteComEmpresas) {
              const innerFound = clienteComEmpresas.empresas.find(
                (e: any) => String(e.id_CNPJ) === String(id_CNPJ) || String(e.id) === String(id_CNPJ)
              );
              if (innerFound) {
                setEmpresa(innerFound);
                return;
              }
            }

            throw new Error("Empresa não encontrada (verifique id_cliente / id_CNPJ).");
          }

          setEmpresa(found);
          return;
        }

        // Se a API retornar um objeto (não array), tentamos caminhos comuns
        if (typeof data === "object" && data !== null) {
          // se o endpoint retornar { clientes: [...] } ou similar
          const maybeArray =
            data.clientes || data.data || data.empresas || Object.values(data).find(Array.isArray);
          if (Array.isArray(maybeArray)) {
            const found = maybeArray.find(
              (item: any) =>
                String(item.id_cliente) === String(id_cliente) &&
                String(item.id_CNPJ) === String(id_CNPJ)
            );
            if (found) {
              setEmpresa(found);
              return;
            }
          }
        }

        throw new Error("Formato de resposta inesperado da API.");
      } catch (err: any) {
        console.error("Erro ao buscar empresa:", err);
        setError(err?.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    // só busca se ambos params chegarem (evita execução prematura)
    if (id_cliente && id_CNPJ) {
      fetchEmpresa();
    } else {
      // params ausentes: mostra mensagem mais clara no console
      console.warn("Parâmetros ausentes:", { id_cliente, id_CNPJ });
      setError("Parâmetros da rota ausentes (id_cliente ou id_CNPJ).");
      setLoading(false);
    }
  }, [id_cliente, id_CNPJ]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          Carregando informações da empresa...
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-red-600 text-center mt-6">{error}</p>
          <div className="text-center mt-6">
            <Button onClick={() => router.back()}>Voltar</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!empresa) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-gray-500 text-center mt-6">Empresa não encontrada.</p>
          <div className="text-center mt-6">
            <Button onClick={() => router.back()}>Voltar</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Normaliza campo CNPJ (tenta vários nomes possíveis)
  const cnpjNumber = empresa.CNPJ ?? empresa.cnpj ?? empresa.CNPJ ?? "-";

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Factory className="w-6 h-6 text-gray-700" />
            <h1 className="text-3xl font-bold">{empresa.nome_fantasia ?? "—"}</h1>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Card: informações do cliente */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
            <CardDescription>Dados gerais do cliente associado</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <strong>Nome do Cliente:</strong> {empresa.cliente ?? "-"}
            </div>
            <div>
              <strong>Telefone:</strong> {empresa.telefone ?? "-"}
            </div>
            <div>
              <strong>Email:</strong> {empresa.email ?? "-"}
            </div>
            <div>
              <strong>Data de Criação:</strong>{" "}
              {empresa.data_criacao ? new Date(empresa.data_criacao).toLocaleDateString("pt-BR") : "-"}
            </div>
          </CardContent>
        </Card>
        <Separator />
        {/* Card: informações da empresa */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Informações do Empresa</CardTitle>
            <CardDescription>Dados gerais do empresa associado</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <strong>Nome Fantasia:</strong> {empresa.nome_fantasia ?? "-"}
            </div>
            <div>
              <strong>CNPJ:</strong> {String(cnpjNumber)}
            </div>
            <div>
              <strong>CNAE:</strong> {empresa.cnae ?? "-"}
            </div>
            <div>
              <strong>Endereço:</strong> {empresa.endereco ?? "-"}
            </div>
          </CardContent>
          </Card>

        <Separator />

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>Área reservada para documentos futuros</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 italic">
                Nenhum documento encontrado. (Implementar rota de documentos quando disponível.)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
