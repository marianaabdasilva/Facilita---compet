"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Empresa {
  nome_fantasia: string;
  cnpj: string;
  data_criacao: string;
  cnae?: string;
  endereco?: string;
}

interface Documento {
  id: string;
  nome_arquivo: string;
  tipo: string;
  data_envio: string;
  url: string;
}

interface Cliente {
  id: string;
  cliente: string;
  email: string;
  telefone?: string;
  empresas?: Empresa[];
  documentos?: Documento[];
}

export default function EmpresaDetalhesPage() {
  const { cnpj } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await fetch("https://projeto-back-ten.vercel.app/clientes-detalhes", {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao buscar dados do cliente");

        const clientes: Cliente[] = await response.json();

        // 🔹 Filtra o cliente que possui a empresa com o CNPJ da URL
        const clienteEncontrado = clientes.find(c =>
          c.empresas?.some(e => e.cnpj === cnpj)
        );

        if (!clienteEncontrado) throw new Error("Empresa não encontrada para este CNPJ.");

        // 🔹 Pega a empresa específica dentro desse cliente
        const empresaEncontrada = clienteEncontrado.empresas?.find(e => e.cnpj === cnpj);

        setCliente(clienteEncontrado);
        setEmpresa(empresaEncontrada || null);

        // 🔹 Filtra apenas os documentos que pertencem a essa empresa
        const documentosFiltrados = clienteEncontrado.documentos?.filter(doc =>
          doc.tipo === cnpj // ou outro critério que relacione documentos à empresa
        ) || [];
        setDocumentos(documentosFiltrados);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (cnpj) fetchDados();
  }, [cnpj]);

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!cliente || !empresa) return <p>Empresa não encontrada.</p>;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes da Empresa</h1>
          <p className="text-gray-600 mt-1">
            Informações completas sobre o cliente e sua empresa.
          </p>
        </div>

        {/* Dados do Cliente */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Cliente Responsável</CardTitle>
            <CardDescription>Informações do titular</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div><strong>Nome:</strong> {cliente.cliente}</div>
              <div><strong>Email:</strong> {cliente.email}</div>
              {cliente.telefone && <div><strong>Telefone:</strong> {cliente.telefone}</div>}
            </div>
          </CardContent>
        </Card>

        {/* Dados da Empresa */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
            <CardDescription>Dados cadastrados e fiscais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div><strong>Nome Fantasia:</strong> {empresa.nome_fantasia}</div>
              <div><strong>CNPJ:</strong> {empresa.cnpj}</div>
              <div><strong>Data de Criação:</strong> {new Date(empresa.data_criacao).toLocaleDateString("pt-BR")}</div>
              {empresa.cnae && <div><strong>CNAE:</strong> {empresa.cnae}</div>}
              {empresa.endereco && <div><strong>Endereço:</strong> {empresa.endereco}</div>}
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>Arquivos vinculados a esta empresa</CardDescription>
          </CardHeader>
          <CardContent>
            {documentos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data de Envio</TableHead>
                    <TableHead className="w-[100px] text-center">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.nome_arquivo}</TableCell>
                      <TableCell>{doc.tipo}</TableCell>
                      <TableCell>{new Date(doc.data_envio).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-center">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Baixar
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">Nenhum documento disponível para esta empresa.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
