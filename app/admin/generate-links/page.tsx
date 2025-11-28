"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LinkIcon, Copy, CheckCircle, Trash2, Search } from "lucide-react";

interface ClientesOption {
  value: string;
  label: string;
  id_cliente: number;
}
interface ProcessosOption {
  value: string;
  label: string;
  id_tipo_processo: number;
}
interface EmpresaOption {
  value: string;
  label: string;
  id_cnpj: number;
}
interface GeneratedLink {
  id: string;
  clientName: string;
  companyName: string;
  processType: string;
  link: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  documentos?: string[];
}

export default function GenerateLinksPage() {
  const [allClientes, setAllClientes] = useState<ClientesOption[]>([]);
  const [allProcessos, setAllProcessos] = useState<ProcessosOption[]>([]);
  const [clientCompanies, setClientCompanies] = useState<EmpresaOption[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientesOption | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<EmpresaOption | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<ProcessosOption | null>(null);
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchLink, setSearchLink] = useState("");
  const [error, setError] = useState<string>("");

  // --- Novos estados para documentos ---
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [docError, setDocError] = useState<string>("");

  // lista simples de documentos vinda do backend (/visualizardocumentos)
  const [docsFromBackend, setDocsFromBackend] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);

  // Buscar dados
  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get("https://projeto-back-ten.vercel.app/clientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = resp.data;
      setAllClientes(
        data.map((c: any) => ({
          value: String(c.id_cliente),
          label: c.nome,
          id_cliente: c.id_cliente,
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  const fetchProcessos = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get("https://projeto-back-ten.vercel.app/tiposProcesso", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = resp.data;
      setAllProcessos(
        data.map((p: any) => ({
          value: String(p.id_tipo_processo),
          label: p.tipo,
          id_tipo_processo: p.id_tipo_processo,
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar processos:", err);
    }
  };

  const fetchAllCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get("https://projeto-back-ten.vercel.app/totalcnpjs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return resp.data;
    } catch (err) {
      console.error("Erro ao buscar todas as empresas:", err);
      return [];
    }
  };

  const fetchGeneratedLinks = async () => {
    try {
      const token = localStorage.getItem("token");
      const respLinks = await axios.get("https://projeto-back-ten.vercel.app/processos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const linksData = respLinks.data;

      const clientesMap = allClientes.reduce((acc, c) => {
        acc[c.id_cliente] = c.label;
        return acc;
      }, {} as Record<number, string>);

      const allEmpresas = await fetchAllCompanies();
      const empresasMap = allEmpresas.reduce((acc: Record<number, string>, e: any) => {
        acc[e.id_cnpj] = `${e.nome} (CNPJ: ${e.numero_cnpj})`;
        return acc;
      }, {});

      const formattedLinks: GeneratedLink[] = linksData.map((item: any) => ({
        id: String(item.id_processo),
        clientName: clientesMap[item.id_cliente] || "Cliente não informado",
        companyName: empresasMap[item.id_cnpj] || "Empresa não informada",
        processType: item.tipo || "Tipo não informado",
        // manter link conforme backend ou sobrescrever se necessário
        link: item.link || `https://projeto-front.vercel.app/visualizardocumentos/${item.id_processo}`,
        status: item.status_link || "Desconhecido",
        createdAt: item.data_atualizacao || new Date().toISOString(),
        expiresAt: item.data_expiracao || "",
        used: item.status_link?.toLowerCase() === "usado",
        documentos: item.documentos || item.documentos_requeridos || [],
      }));

      setGeneratedLinks(formattedLinks);
    } catch (error) {
      console.error("Erro ao buscar links gerados:", error);
    }
  };

  // ---------- Nova função: buscar lista de documentos do backend ----------
  const fetchDocumentsFromBackend = async () => {
  setLoadingDocs(true);
  try {
    const token = localStorage.getItem("token");
    const resp = await axios.get("https://projeto-back-ten.vercel.app/visualizardocumentos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = resp.data;
    console.log("DOCUMENTOS RECEBIDOS DO BACKEND:", resp.data);


    if (Array.isArray(data)) {
      // AQUI: ORDENAR ANTES DE SALVAR
      const sorted = [...data].sort((a, b) => {
        const A = (typeof a === "string" ? a : a.nome)?.toLowerCase();
        const B = (typeof b === "string" ? b : b.nome)?.toLowerCase();
        return A.localeCompare(B);
      });

      setDocsFromBackend(sorted);
    } else {
      console.warn("Resposta /visualizardocumentos não é array:", data);
      setDocsFromBackend([]);
    }
  } catch (err) {
    console.error("Erro ao buscar documentos do backend:", err);
    setDocsFromBackend([]);
  } finally {
    setLoadingDocs(false);
  }
};

  useEffect(() => {
    const loadData = async () => {
      await fetchClientes();
      await fetchProcessos();
      await fetchDocumentsFromBackend(); // busca os documentos ao montar
    };
    loadData();
  }, []);

  useEffect(() => {
    if (allClientes.length > 0) fetchGeneratedLinks();
  }, [allClientes]);

  useEffect(() => {
    const loadClientCompanies = async () => {
      if (!selectedClient) {
        setClientCompanies([]);
        setSelectedCompany(null);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const resp = await axios.get(
          `https://projeto-back-ten.vercel.app/cliente_cnpjs/${selectedClient.id_cliente}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const empresas = resp.data.map((e: any) => ({
          value: String(e.id_cnpj),
          label: `${e.nome} (CNPJ: ${e.numero_cnpj || "N/A"})`,
          id_cnpj: e.id_cnpj,
        }));

        setClientCompanies(empresas);
        setSelectedCompany(null);
      } catch (err) {
        console.error("Erro ao buscar empresas do cliente:", err);
        setClientCompanies([]);
        setSelectedCompany(null);
      }
    };
    loadClientCompanies();
  }, [selectedClient]);

 const handleGenerateLink = async () => {
  if (!selectedClient || !selectedCompany || !selectedProcess) return;

  if (selectedDocuments.length === 0) {
    setDocError("Selecione ao menos 1 documento.");
    return;
  }

  setDocError("");
  setIsGenerating(true);

  try {
    // Monta array com nomes REAIS dos documentos selecionados
    const nomesSelecionados = selectedDocuments.map((docId) => {
      const doc = docsFromBackend.find(
        (d, idx) => String(d.id_tipo_documento ?? d.id ?? idx) === docId
      );
      return docLabel(doc); // Aqui você já extrai o nome do documento
    });

    const requestData = {
      id_cliente: selectedClient.id_cliente,
      id_cnpj: selectedCompany.id_cnpj,
      id_tipo_processo: selectedProcess.id_tipo_processo,

      // IDs dos documentos
      documentos_requeridos: selectedDocuments.map(Number),

      // NOMES dos documentos — ESSENCIAL para aparecer no upload
      nomes_documentos: nomesSelecionados,

      status: "pendente",
    };

    const response = await axios.post(
      "https://projeto-back-ten.vercel.app/processo",
      requestData,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    const { link, data_expiracao, id } = response.data;

    const newLink: GeneratedLink = {
      id,
      clientName: selectedClient.label,
      companyName: selectedCompany.label,
      processType: selectedProcess.label,
      link: link || `https://projeto-front.vercel.app/visualizardocumentos/${id}`,
      status: "Ativo",
      createdAt: new Date().toISOString(),
      expiresAt: data_expiracao,
      used: false,
      documentos: nomesSelecionados, // Aqui você salva os nomes dos documentos
    };

    setGeneratedLinks((prev) => [...prev, newLink]);
    try {
      // Código para gerar o link
      setGeneratedLink(newLink.link);

      localStorage.setItem(
        `docs_processo_${newLink.id}`, 
        JSON.stringify(selectedDocuments)
);
      localStorage.setItem(
  `docs_processo_nomes_${newLink.id}`,
  JSON.stringify(nomesSelecionados)
);

    localStorage.setItem("documentos_ids", JSON.stringify(selectedDocuments));
    localStorage.setItem("documentos_nomes", JSON.stringify(nomesSelecionados));


    } catch (error) {
      console.error("Erro ao gerar o link:", error);
      setError("Não foi possível gerar o link. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }

    setSelectedDocuments([]);
  } catch (error) {
    console.error("Erro ao gerar o link:", error);
  } finally {
    setIsGenerating(false);
  }
};


  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Link copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao copiar o link:", error);
      alert("Não foi possível copiar o link. Tente novamente.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-700";
      case "Usado":
        return "bg-blue-100 text-blue-700";
      case "Expirado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredLinks = generatedLinks.filter((link) => {
    const term = searchLink.toLowerCase();
    return (
      link.clientName.toLowerCase().includes(term) ||
      link.processType.toLowerCase().includes(term) ||
      link.status.toLowerCase().includes(term)
    );
  });

  // helper para alternar doc
  const toggleDocument = (docId: string) => {
  if (docError) setDocError("");

  setSelectedDocuments((prev) =>
    prev.includes(docId)
      ? prev.filter((d) => d !== docId)
      : [...prev, docId]
  );
};


  // helper para extrair rótulo do item retornado pelo backend
  const docLabel = (doc: any) => {
    if (!doc) return "Documento";
    return doc.nome ?? doc.label ?? "Documento";
};

// helper para extrair o ID corretamente
  const docValue = (doc: any, idx: number) => {
  return `doc-${doc.id_tipo_documento ?? doc.id ?? `idx-${idx}`}`;
};



  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Geração de Links</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Crie links personalizados para upload de documentos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Formulário */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md sm:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <LinkIcon className="w-5 h-5 mr-2" /> Gerar Novo Link
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Selecione o cliente, empresa e tipo de processo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Select
                      options={allClientes}
                      value={selectedClient}
                      onChange={(opt) => setSelectedClient(opt)}
                      placeholder="Selecione um cliente"
                    />
                  </div>

                  {selectedClient && (
                    <div className="space-y-2">
                      <Label>Empresa (CNPJ)</Label>
                      <Select
                        options={clientCompanies}
                        value={selectedCompany}
                        onChange={(opt) => setSelectedCompany(opt)}
                        placeholder="Selecione uma empresa"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Tipo de Processo</Label>
                    <Select
                      options={allProcessos}
                      value={selectedProcess}
                      onChange={(opt) => setSelectedProcess(opt)}
                      placeholder="Selecione o tipo de processo"
                    />
                  </div>

                  {/* ========== Lista PLANA de documentos (vinda do backend) ========== */}
                  <div className="mt-2">
                    <Label>Documentos Necessários</Label>
                    {docError && <p className="text-red-600 text-sm">{docError}</p>}

                    <div className="mt-2">
                      {loadingDocs ? (
                        <p className="text-sm text-gray-500">Carregando documentos...</p>
                      ) : docsFromBackend.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum documento disponível.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 py-2">
                          {docsFromBackend.map((doc, idx) => {
                            const id = String(doc.id_tipo_documento ?? doc.id ?? idx);
                            const nome = doc.nome ?? doc;

                            return (
                              <label
                                key={id}
                                className="flex items-center space-x-3 rounded-md p-2 hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedDocuments.includes(id)}
                                  onChange={() => toggleDocument(id)}
                                  className="h-4 w-4"
                                />

                                <span className="text-sm">{nome}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                  <Button
                    onClick={handleGenerateLink}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={
                      !selectedClient || !selectedCompany || !selectedProcess || isGenerating
                    }
                  >
                    {isGenerating ? "Gerando..." : "Gerar Link"}
                  </Button>

                  {generatedLink && (
                    <div className="mt-4 p-4 border border-green-300 bg-green-100 rounded-md">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="font-medium text-green-700 text-sm sm:text-base">
                          Link gerado com sucesso! Copie o link abaixo:
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <Input value={generatedLink} readOnly className="text-xs" />
                        <Button size="sm" onClick={() => copyToClipboard(generatedLink)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}{error && (
                    <div className="mt-4 p-4 border border-red-300 bg-red-100 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        <p className="font-medium text-red-700 text-sm sm:text-base">{error}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tabela de links gerados */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md sm:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Links Gerados</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Histórico de links criados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Pesquisar Links Gerados</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Digite nome do cliente, tipo de processo ou status..."
                          value={searchLink}
                          onChange={(e) => setSearchLink(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Processo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Docs</TableHead>
                            <TableHead>Criado</TableHead>
                            <TableHead>Expira</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLinks.map((link) => {
                      return (
                        <TableRow key={link.id}>
                          <TableCell>{link.clientName}</TableCell>
                          <TableCell>{link.companyName}</TableCell>
                          <TableCell>{link.processType}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(link.status)}>{link.status}</Badge>
                          </TableCell>

                          <TableCell>
                            {link.documentos && link.documentos.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {link.documentos.map((docName, idx) => (
                                  <Badge
                                    key={`doc-${link.id}-${docName}`}
                                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                                  >
                                    {docName}
                                  </Badge>

                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500 text-xs">—</span>
                            )}
                          </TableCell>

                          <TableCell>{new Date(link.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString("pt-BR") : ""}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(link.link)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                          {filteredLinks.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center text-gray-500 py-6">
                                Nenhum link encontrado.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}