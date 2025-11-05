"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface Empresa {
  id_empresa: string; // 👈 identificador da empresa (depois você confirma o nome no backend)
  id_cliente: string;
  cliente: string;
  email: string;
  telefone?: string;
  nome_fantasia?: string;
  cnpj?: string;
  cnae?: string;
  data_criacao?: string;
  endereco?: string;
}

export default function EmpresaDetalhesPage() {
  const { id } = useParams(); // vem da URL: /empresas/[id]
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        const res = await fetch("https://projeto-back-ten.vercel.app/clientes-detalhes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data: Empresa[] = await res.json();
        console.log("DADOS RETORNADOS PELA API:", data);

        // 👉 Aqui você filtra pelo identificador da empresa (ajuste o campo quando confirmar)
        const found = data.find((e) => String(e.id_empresa) === String(id));

        if (!found) throw new Error("Empresa não encontrada");
        setEmpresa(found);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEmpresa();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!empresa) return <p>Empresa não encontrada.</p>;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Detalhes da Empresa</h1>

        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
            <CardDescription>Informações do cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <strong>Nome:</strong> {empresa.cliente}
              </div>
              <div>
                <strong>Email:</strong> {empresa.email}
              </div>
              {empresa.telefone && (
                <div>
                  <strong>Telefone:</strong> {empresa.telefone}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empresa</CardTitle>
            <CardDescription>Informações da empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <strong>Nome Fantasia:</strong> {empresa.nome_fantasia || "-"}
              </div>
              <div>
                <strong>CNPJ:</strong> {empresa.cnpj || "-"}
              </div>
              <div>
                <strong>CNAE:</strong> {empresa.cnae || "-"}
              </div>
              <div>
                <strong>Endereço:</strong> {empresa.endereco || "-"}
              </div>
              <div>
                <strong>Data de Criação:</strong>{" "}
                {empresa.data_criacao
                  ? new Date(empresa.data_criacao).toLocaleDateString("pt-BR")
                  : "-"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
