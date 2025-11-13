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
import { ArrowLeft, Factory, Loader2, FileText } from "lucide-react";

/* ======================================================
   COMPONENTE AUXILIAR PARA RENDERIZAR E TESTAR DOCUMENTOS
   ====================================================== */
const DocumentosList = ({
  documentos,
  id_cliente,
}: {
  documentos: any[];
  id_cliente: string | number;
}) => {
  const [statusLinks, setStatusLinks] = useState<Record<number, boolean | null>>(
    {}
  );

  useEffect(() => {
    const testarLinks = async () => {
      const resultados: Record<number, boolean | null> = {};

      for (let i = 0; i < documentos.length; i++) {
        let linkCorrigido = documentos[i].link;
        if (linkCorrigido?.includes(":id")) {
          linkCorrigido = linkCorrigido.replace(":id", String(id_cliente));
        }

        try {
          const res = await fetch(linkCorrigido, { method: "HEAD" });
          console.log(
            `🔍 Testando link ${i + 1}:`,
            linkCorrigido,
            "→ status:",
            res.status
          );
          resultados[i] = res.ok;
        } catch (err) {
          console.error(`❌ Erro ao testar link ${i + 1}:`, linkCorrigido, err);
          resultados[i] = false;
        }
      }

      setStatusLinks(resultados);
    };

    if (documentos.length > 0) testarLinks();
  }, [documentos, id_cliente]);

  return (
    <ul className="space-y-3">
      {documentos.map((doc, index) => {
        let linkCorrigido = doc.link;
        if (linkCorrigido?.includes(":id")) {
          linkCorrigido = linkCorrigido.replace(":id", String(id_cliente));
        }

        const nomeArquivo =
          linkCorrigido?.split("/").pop() || `Documento ${index + 1}`;
        const status = statusLinks[index];

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

            {status === null || status === undefined ? (
              <Loader2 className="animate-spin w-4 h-4 text-gray-400" />
            ) : status ? (
              <Button asChild variant="outline" size="sm">
                <a
                  href={linkCorrigido}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visualizar
                </a>
              </Button>
            ) : (
              <span className="text-red-500 text-sm font-medium">
                Indisponível
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

/* ======================================================
   PÁGINA PRINCIPAL - DETALHES DA EMPRESA
   ====================================================== */
export default function EmpresaDetalhesPage() {
  const params = useParams() as { id_cliente?: string; id_CNPJ?: string };
  const { id_cliente, id_CNPJ } = params;
  const router = useRouter();

  const [empresa, setEmpresa] = useState<any>(null);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // === Buscar dados da empresa ===
  useEffect(() => {
    const fetchEmpresa = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        const res = await fetch(
          "https://projeto-back-ten.vercel.app/clientes-detalhes",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

        const data = await res.json();
        const found = Array.isArray(data)
          ? data.find(
              (item: any) =>
                String(item.id_cliente) === String(id_cliente) &&
                (String(item.id_CNPJ) === String(id_CNPJ) ||
                  String(item.id_empresa) === String(id_CNPJ))
            )
          : null;

        if (!found) throw new Error("Empresa não encontrada.");
        setEmpresa(found);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar empresa");
      } finally {
        setLoading(false);
      }
    };

    if (id_cliente && id_CNPJ) fetchEmpresa();
  }, [id_cliente, id_CNPJ]);

  // === Buscar documentos do cliente ===
  useEffect(() => {
    const fetchDocs = async () => {
      if (!id_cliente) return;
      setLoadingDocs(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://projeto-back-ten.vercel.app/documentos/${id_cliente}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok)
          throw new Error(`Erro ao buscar documentos: ${res.status}`);
        const data = await res.json();
        console.log("📦 Documentos recebidos:", data);

        if (!Array.isArray(data)) throw new Error("Formato inválido de resposta.");
        setDocumentos(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDocs();
  }, [id_cliente]);

  // === Loading ===
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
        <div className="p-6 text-center">
          <p className="text-red-600 mt-6">{error}</p>
          <Button onClick={() => router.back()} className="mt-6">
            Voltar
          </Button>
        </div>
      </AdminLayout>
    );
  }

  if (!empresa) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <p className="text-gray-500 mt-6">Empresa não encontrada.</p>
          <Button onClick={() => router.back()} className="mt-6">
            Voltar
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const cnpjNumber = empresa.CNPJ ?? empresa.cnpj ?? "-";

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Factory className="w-6 h-6 text-gray-700" />
            <h1 className="text-3xl font-bold">
              {empresa.nome_fantasia ?? "—"}
            </h1>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        </div>

        {/* Informações do Cliente */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <strong>Nome:</strong> {empresa.cliente ?? "-"}
            </div>
            <div>
              <strong>Email:</strong> {empresa.email ?? "-"}
            </div>
            <div>
              <strong>Telefone:</strong> {empresa.telefone ?? "-"}
            </div>
            <div>
              <strong>Data de Criação:</strong>{" "}
              {empresa.data_criacao
                ? new Date(empresa.data_criacao).toLocaleDateString("pt-BR")
                : "-"}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Informações da Empresa */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
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

        {/* Documentos */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>
              Arquivos disponíveis para este cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDocs ? (
              <div className="flex items-center text-gray-500">
                <Loader2 className="animate-spin w-5 h-5 mr-2" /> Carregando
                documentos...
              </div>
            ) : documentos.length > 0 ? (
              <DocumentosList
                documentos={documentos}
                id_cliente={id_cliente!}
              />
            ) : (
              <p className="text-gray-500 italic">
                Nenhum documento encontrado.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
