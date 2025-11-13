"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Loader2, Factory, FileText } from "lucide-react";

/* ======================================================
   COMPONENTE DE LISTAGEM DE DOCUMENTOS 
   ====================================================== */
const DocumentosList = ({
  documentos,
  id_cliente,
}: {
  documentos: any[];
  id_cliente: string | number;
}) => {
  return (
    <ul className="space-y-3">
      {documentos.map((doc, index) => {
        // Substitui :id pelo ID real do cliente
        let linkCorrigido = doc.link;
        if (linkCorrigido?.includes(":id")) {
          linkCorrigido = linkCorrigido.replace(":id", String(id_cliente));
        }

        const nomeArquivo =
          linkCorrigido?.split("/").pop() || `Documento ${index + 1}`;

        return (
          <li
            key={`doc-${index}`}
            className="flex items-center justify-between border p-3 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">{nomeArquivo}</p>
                <p className="text-sm text-gray-500 break-all">
                  {linkCorrigido}
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm">
              <a
                href={linkCorrigido}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visualizar
              </a>
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

/* ======================================================
   PÁGINA PRINCIPAL — DETALHES DO CLIENTE
   ====================================================== */
export default function DetalhesClientePage() {
  const params = useParams() as Record<string, any>;
  const id = params.id_cliente ?? params.id ?? params["id-cliente"];
  const router = useRouter();

  const [cliente, setCliente] = useState<any>(null);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* === Buscar dados do cliente === */
  useEffect(() => {
    const fetchCliente = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado.");

        const res = await fetch("https://projeto-back-ten.vercel.app/clientes-detalhes", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const clienteRegistro = data.find((r: any) => String(r.id_cliente) === String(id));
          if (!clienteRegistro) throw new Error("Cliente não encontrado.");

          const empresasDoCliente = data
            .filter((r: any) => String(r.id_cliente) === String(id))
            .map((item: any) => ({
              id_CNPJ: item.id_CNPJ ?? item.id_empresa ?? item.id ?? null,
              nome_fantasia: item.nome_fantasia ?? item.razao_social ?? item.nome ?? "-",
              cnpj: item.CNPJ ?? item.cnpj ?? "-",
              atividade_principal: item.atividade_principal ?? item.cnae ?? "-",
            }));

          setCliente({
            id_cliente: clienteRegistro.id_cliente,
            cliente: clienteRegistro.cliente ?? clienteRegistro.nome ?? "-",
            email: clienteRegistro.email ?? "-",
            telefone: clienteRegistro.telefone ?? "-",
            data_criacao: clienteRegistro.data_criacao ?? undefined,
            empresas: empresasDoCliente,
          });
        } else {
          throw new Error("Formato inesperado de resposta.");
        }
      } catch (err: any) {
        setError(err.message || "Erro ao carregar cliente");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCliente();
  }, [id]);

  /* === Buscar documentos vinculados ao cliente === */
  useEffect(() => {
    const fetchDocs = async () => {
      if (!id) return;
      setLoadingDocs(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://projeto-back-ten.vercel.app/documentos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Erro ao buscar documentos: ${res.status}`);
        const data = await res.json();
        setDocumentos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setDocumentos([]);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDocs();
  }, [id]);

  /* === Renderizações === */
  if (loading)
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

  if (error)
    return (
      <AuthGuard requiredRole="admin">
        <AdminLayout>
          <div className="p-6 text-center">
            <p className="text-red-600 mt-6">{error}</p>
            <Button onClick={() => router.back()} className="mt-6">
              Voltar
            </Button>
          </div>
        </AdminLayout>
      </AuthGuard>
    );

  if (!cliente)
    return (
      <AuthGuard requiredRole="admin">
        <AdminLayout>
          <div className="p-6 text-center">
            <p className="text-gray-500 mt-6">Cliente não encontrado.</p>
            <Button onClick={() => router.back()} className="mt-6">
              Voltar
            </Button>
          </div>
        </AdminLayout>
      </AuthGuard>
    );

  /* === Render principal === */
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
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </div>

          {/* Informações do Cliente */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>Dados gerais cadastrados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Nome:</strong> {cliente.cliente}</p>
              <p><strong>Email:</strong> {cliente.email}</p>
              <p><strong>Telefone:</strong> {cliente.telefone}</p>
              <p>
                <strong>Data de criação:</strong>{" "}
                {cliente.data_criacao ? new Date(cliente.data_criacao).toLocaleDateString("pt-BR") : "-"}
              </p>
            </CardContent>
          </Card>

          {/* Empresas vinculadas */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Empresas vinculadas</CardTitle>
              <CardDescription>Empresas cadastradas para este cliente</CardDescription>
            </CardHeader>
            <CardContent>
              {cliente.empresas?.length ? (
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
                      {cliente.empresas.map((empresa: any) => (
                        <TableRow
                          key={String(empresa.id_CNPJ ?? empresa.cnpj ?? Math.random())}
                        >
                          <TableCell>
                            <button
                              onClick={() =>
                                router.push(`/admin/clients/${cliente.id_cliente}/empresas/${empresa.id_CNPJ}`)
                              }
                              className="text-gray-900 hover:underline flex items-center gap-2"
                            >
                              <Factory className="w-4 h-4" /> {empresa.nome_fantasia}
                            </button>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{empresa.cnpj}</TableCell>
                          <TableCell>{empresa.atividade_principal ?? "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : ( 
                <p className="text-gray-500 italic">
                  Nenhuma empresa vinculada a este cliente.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Documentos vinculados ao cliente */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Arquivos disponíveis para este cliente</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDocs ? (
                <div className="flex items-center text-gray-500">
                  <Loader2 className="animate-spin w-5 h-5 mr-2" /> Carregando documentos...
                </div>
              ) : documentos.length > 0 ? (
                <DocumentosList documentos={documentos} id_cliente={id!} />
              ) : (
                <p className="text-gray-500 italic">
                  Nenhum documento encontrado para este cliente.
                </p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
