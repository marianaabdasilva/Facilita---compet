"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface Client {
  id: string;
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
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        const res = await fetch("https://projeto-back-ten.vercel.app/clientes-detalhes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Client[] = await res.json();
        const found = data.find(c => c.id === String(id));
        if (!found) throw new Error("Cliente não encontrado");
        setClient(found);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClient();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!client) return <p>Cliente não encontrado.</p>;

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
              <div><strong>Nome:</strong> {client.cliente}</div>
              <div><strong>Email:</strong> {client.email}</div>
              {client.telefone && <div><strong>Telefone:</strong> {client.telefone}</div>}
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
              <div><strong>Nome Fantasia:</strong> {client.nome_fantasia || "-"}</div>
              <div><strong>CNPJ:</strong> {client.cnpj || "-"}</div>
              <div><strong>CNAE:</strong> {client.cnae || "-"}</div>
              <div><strong>Endereço:</strong> {client.endereco || "-"}</div>
              <div><strong>Data de Criação:</strong> {client.data_criacao ? new Date(client.data_criacao).toLocaleDateString("pt-BR") : "-"}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
