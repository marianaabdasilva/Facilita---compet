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
  // can be array of ids (numbers) or names (strings) depending on data source
  documentos?: Array<number | string>;
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
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [docError, setDocError] = useState<string>("");
  const [docsFromBackend, setDocsFromBackend] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);

  // Buscar dados
  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get("https://projeto-back-ten.vercel.app/clientes", {
        headers: { Authorization: Bearer ${token} },
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
        headers: { Authorization: Bearer ${token} },
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
        headers: { Authorization: Bearer ${token} },
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
        headers: { Authorization: Bearer ${token} },
      });
      const linksData = respLinks.data;
      const clientesMap = allClientes.reduce((acc, c) => {
        acc[c.id_cliente] = c.label;
        return acc;
      }, {} as Record<number, string>);

      const processosMap = allProcessos.reduce((acc, p) => {
        acc[p.id_tipo_processo] = p.label;
        return acc;
      }, {} as Record<number, string>);

      const allEmpresas = await fetchAllCompanies();
      const empresasMap = allEmpresas.reduce((acc: Record<number, string>, e: any) => {
        acc[e.id_cnpj] = ${e.nome} (CNPJ: ${e.numero_cnpj});
        return acc;
      }, {});

      const formattedLinks: GeneratedLink[] = linksData.map((item: any) => {
        const docsFromItem = item.documentos || item.documentos_requeridos || [];
        const normalizedDocs = (Array.isArray(docsFromItem) ? docsFromItem : []).map((d: any) => {
          if (typeof d === "number") return d;
          if (typeof d === "string" && /^\d+$/.test(d)) return Number(d);
          return d;
        });

        return {
          id: String(item.id_processo),
          clientName: clientesMap[item.id_cliente] || "Cliente não informado",
          companyName: empresasMap[item.id_cnpj] || "Empresa não informada",
          processType:
            processosMap[item.id_tipo_processo] ||
            item.tipo ||
            "Tipo não informado",
          link: item.link || https://projeto-front.vercel.app/visualizardocumentos/${item.id_processo},
          status: item.status_link || "Desconhecido",
          createdAt: item.data_atualizacao || new Date().toISOString(),
          expiresAt: item.data_expiracao || "",
          used: item.status_link?.toLowerCase() === "usado",
          documentos: normalizedDocs,
        } as GeneratedLink;
      });

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
        headers: { Authorization: Bearer ${token} },
      });

      const data = resp.data;
      console.log("DOCUMENTOS RECEBIDOS DO BACKEND:", resp.data);

      if (Array.isArray(data)) {
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

  // --- inicializa dados (clientes, tipos de processo, docs)
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchClientes(), fetchProcessos(), fetchDocumentsFromBackend()]);
    };
    loadData();
  }, []);

  // gerar links depois que clientes e processos estiverem prontos
  useEffect(() => {
    if (allClientes.length > 0 && allProcessos.length > 0) {
      fetchGeneratedLinks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allClientes, allProcessos]);

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
          https://projeto-back-ten.vercel.app/cliente_cnpjs/${selectedClient.id_cliente},
          { headers: { Authorization: Bearer ${token} } }
        );

        const empresas = resp.data.map((e: any) => ({
          value: String(e.id_cnpj),
          label: ${e.nome} (CNPJ: ${e.numero_cnpj || "N/A"}),
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
      const nomesSelecionados = selectedDocuments.map((docId) => {
        const doc = docsFromBackend.find(
          (d, idx) => String(d.id_tipo_documento ?? d.id ?? idx) === docId
        );
        return docLabel(doc);
      });

      const requestData = {
        id_cliente: selectedClient.id_cliente,
        id_cnpj: selectedCompany.id_cnpj,
        id_tipo_processo: selectedProcess.id_tipo_processo,
        documentos_requeridos: selectedDocuments.map(Number),
        status: "pendente",
      };

      const response = await axios.post(
        "https://projeto-back-ten.vercel.app/processo",
        requestData,
        { headers: { Authorization: Bearer ${localStorage.getItem("token")} } }
      );

      const { link, data_expiracao, id } = response.data;

      const newLink: GeneratedLink = {
        id,
        clientName: selectedClient.label,
        companyName: selectedCompany.label,
        processType: selectedProcess.label,
        link: link || https://projeto-front.vercel.app/visualizardocumentos/${id},
        status: "Ativo",
        createdAt: new Date().toISOString(),
        expiresAt: data_expiracao,
        used: false,
        documentos: nomesSelecionados, // nomes para UX imediato
      };

      setGeneratedLinks((prev) => [...prev, newLink]);
      setGeneratedLink(newLink.link);

      setSelectedDocuments([]);
    } catch (error) {
      console.error("Erro ao gerar o link:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // função para deletar link no backend e atualizar UI
  const handleDeleteLink = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(https://projeto-back-ten.vercel.app/processo/${id}, {
        headers: { Authorization: Bearer ${token} },
      });

      setGeneratedLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Erro ao deletar link:", err);
    }
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

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
vercel
  // helper para alternar doc
  const toggleDocument = (docId: string) => {
    if (docError) setDocError("");

    setSelectedDocuments((prev) =>
      prev.includes(docId) ? prev.filter((d) => d !== docId) : [...prev, docId]
    );
  };

  // helper para extrair rótulo do item retornado pelo backend
  const docLabel = (doc: any) => {
    if (typeof doc === "string") return doc;
    if (doc === null || doc === undefined) return String(doc);
    return doc.nome || doc.name || doc.tipo || doc.label || String(doc);
  };

  // helper para extrair valor único (id ou nome) para checkbox
  const docValue = (doc: any, idx: number) => {
    return String(doc.id_tipo_documento ?? doc.id ?? idx);
  };

  // helper para obter nome a partir de um id (usa docsFromBackend)
  const getDocNameById = (id: number | string) => {
    // se já for string não-numérica, retorna direto
    if (typeof id === "string" && !/^\d+$/.test(id)) return String(id);

    const numericId = typeof id === "number" ? id : Number(String(id));
    const found = docsFromBackend.find(
      (d, idx) => Number(d.id_tipo_documento ?? d.id ?? idx) === numericId
    );
    if (found) return docLabel(found);
    return Documento ${numericId};
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
                      onChange={(opt: any) => setSelectedClient(opt)}
                      placeholder="Selecione um cliente"
                    />
                  </div>

                  {selectedClient && (
                    <div className="space-y-2">
                      <Label>Empresa (CNPJ)</Label>
                      <Select
                        options={clientCompanies}
                        value={selectedCompany}
                        onChange={(opt: any) => setSelectedCompany(opt)}
                        placeholder="Selecione uma empresa"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Tipo de Processo</Label>
                    <Select
                      options={allProcessos}
                      value={selectedProcess}
                      onChange={(opt: any) => setSelectedProcess(opt)}
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
                            const label = docLabel(doc);
                            const value = docValue(doc, idx);
                            // o selectedDocuments armazena values (strings)
                            const checked = selectedDocuments.includes(value);
                            return (
                              <label
                                key={${value}}
                                className="flex items-center space-x-3 rounded-md p-2 hover:bg-gray-50"
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4"
                                  checked={checked}
                                  onChange={() => toggleDocument(value)}
                                  value={value}
                                />
                                <span className="text-sm">{label}</span>
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
                    <Alert className="mt-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium text-sm sm:text-base">Link gerado com sucesso!</p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input value={generatedLink} readOnly className="text-xs" />
                            <Button size="sm" onClick={() => copyToClipboard(generatedLink)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
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
                          {filteredLinks.map((link) => (
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
                                    {link.documentos.map((d, i) => {
                                      // d pode ser id number ou nome string
                                      const displayName =
                                        typeof d === "number"
                                          ? getDocNameById(d)
                                          : (typeof d === "string" && /^\d+$/.test(d)
                                              ? getDocNameById(Number(d))
                                              : String(d));
                                      return (
                                        <Badge
                                          key={i}
                                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                                        >
                                          {displayName}
                                        </Badge>
                                      );
                                    })}
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
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600"
                                    onClick={() => handleDeleteLink(link.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
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