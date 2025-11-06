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
import { Separator } from "@/components/ui/separator";

interface Empresa {
  id_empresa?: string; // identificador único da empresa (ajuste depois conforme o backend)
  id_cliente?: number;
  cliente?: string;
  email?: string;
  telefone?: string;
  nome_fantasia?: string;
  cnpj?: string | number;
  cnae?: string;
  data_criacao?: string;
  endereco?: string;
  documentos?: Documento[]; // campo futuro (quando a API retornar)
}

interface Documento {
  id: number;
  nome: string;
  tipo: string;
  dataEnvio: string;
  link?: string;
}

export default function EmpresaDetalhesPage() {
  const { id } = useParams(); // /empresas/[id]
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

        // Filtra pela empresa (ajustar o campo conforme o backend)
        const found = data.find((e) => String(e.id_empresa) === String(id));
        if (!found)
          throw new Error("Empresa não encontrada (verifique se o campo id_empresa existe no backend)");

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
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold">Detalhes da Empresa</h1>

        {/* Card: informações principais */}
        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
            <CardDescription>Informações do cliente relacionadas a esta empresa</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div><strong>Nome:</strong> {empresa.cliente || "-"}</div>
            <div><strong>Email:</strong> {empresa.email || "-"}</div>
            <div><strong>Telefone:</strong> {empresa.telefone || "-"}</div>
            <div><strong>Nome Fantasia:</strong> {empresa.nome_fantasia || "-"}</div>
            <div><strong>CNPJ:</strong> {empresa.cnpj ?? "-"}</div>
            <div><strong>CNAE:</strong> {empresa.cnae || "-"}</div>
            <div><strong>Endereço:</strong> {empresa.endereco || "-"}</div>
            <div>
              <strong>Data de Criação:</strong>{" "}
              {empresa.data_criacao
                ? new Date(empresa.data_criacao).toLocaleDateString("pt-BR")
                : "-"}
            </div>
            <div><strong>ID Empresa (esperado):</strong> {empresa.id_empresa ?? <span className="text-sm text-gray-500">insira o id_empresa aqui</span>}</div>
            <div><strong>ID Cliente:</strong> {empresa.id_cliente ?? "-"}</div>
          </CardContent>
        </Card>

        <Separator />

        {/* Card: documentos — estrutura pronta, sem mocks */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos da Empresa</CardTitle>
            <CardDescription>
              Área reservada para exibir os documentos enviados.  
              <span className="text-gray-500 ml-1">Insira o link da rota aqui quando disponível.</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            {empresa.documentos && empresa.documentos.length > 0 ? (
              <div className="space-y-3">
                {empresa.documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{doc.nome}</p>
                      <p className="text-sm text-gray-500">
                        Tipo: {doc.tipo} • Enviado em: {doc.dataEnvio}
                      </p>
                    </div>
                    {doc.link ? (
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Abrir
                      </a>
                    ) : (
                      <span className="text-sm italic text-gray-500">
                        Inserir link da rota aqui
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Nenhum documento encontrado.  
                (Adicione a lógica de busca assim que a rota da API estiver pronta.)
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
