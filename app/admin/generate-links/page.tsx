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

// Accordion (categorias recolhíveis)
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// ---------------------------
// Lista categorizada de documentos
// ---------------------------
const DOCUMENTOS_CATEGORIZADOS: Record<string, string[]> = {
  "Documentos Pessoais": [
    "RG (frente e verso)",
    "CNH (frente e verso, se usada no lugar do RG)",
    "CPF (se não constar no RG ou CNH)",
    "Título de Eleitor",
    "Recibo da última Declaração de Imposto de Renda (IRPF)",
    "Documento migratório — RNE, CRNM ou protocolo de refúgio",
  ],
  "Comprovação de Endereço": [
    "Comprovante de residência atualizado",
    "Comprovante de endereço comercial",
    "Contrato de locação ou autorização de uso do imóvel comercial",
  ],
  "Licenças Municipais": [
    "Comprovante de viabilidade municipal",
    "Alvará de Funcionamento",
    "Alvará Provisório",
    "Licença Sanitária",
    "Planta baixa ou croqui do estabelecimento",
  ],
  "Licenças Estaduais": [
    "Licença da Vigilância Sanitária Estadual",
    "Licença Ambiental",
    "Laudo Técnico de Segurança",
  ],
  "Licenças Federais": [
    "Licença do Corpo de Bombeiros (AVCB ou CLCB)",
    "Autorização da Polícia Federal",
    "Autorização do Exército",
    "Licença da Anvisa",
    "Licença da Secretaria de Agricultura",
    "Licença da Secretaria de Transportes",
    "Licença da Secretaria de Obras ou Urbanismo",
    "Licença da Prefeitura (específica conforme atividade)",
  ],
  "Pós-Abertura": [
    "Comprovante de inscrição estadual",
    "Comprovante de inscrição municipal",
    "Cartão do CNPJ",
    "Certificado CCMEI",
    "Comprovantes de pagamento DAS-MEI",
    "Certificado de Conclusão de Curso",
    "Carteira de Conselho Profissional",
    "Relatório fotográfico do local",
  ],
};

// Tipos
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
  documentos?: string[]; // documentos associados ao processo (se houver)
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

  // --- Novos estados para documentos ---
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [docError, setDocError] = useState<string>("");

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
        link: item.link || "Sem link",
        status: item.status_link || "Desconhecido",
        createdAt: item.data_atualizacao || new Date().toISOString(),
        expiresAt: item.data_expiracao || "",
        used: item.status_link?.toLowerCase() === "usado",
        // aceita ambos os formatos que o backend pode retornar
        documentos: item.documentos || item.documentos_requeridos || [],
      }));

      setGeneratedLinks(formattedLinks);
    } catch (error) {
      console.error("Erro ao buscar links gerados:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchClientes();
      await fetchProcessos();
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

    // validação: precisa selecionar ao menos 1 documento
    if (selectedDocuments.length === 0) {
      setDocError("Selecione ao menos 1 documento.");
      return;
    }

    setDocError("");
    setIsGenerating(true);

    try {
      // Por padrão uso o campo "documentos_requeridos" no POST.
      // Se o backend esperar outro nome, substitua "documentos_requeridos" pela chave correta.
      const requestData = {
        id_cliente: selectedClient.id_cliente,
        id_cnpj: selectedCompany.id_cnpj,
        id_tipo_processo: selectedProcess.id_tipo_processo,
        documentos_requeridos: selectedDocuments, // <-- substitua o nome da chave quando souber
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
        link,
        status: "Ativo",
        createdAt: new Date().toISOString(),
        expiresAt: data_expiracao,
        used: false,
        documentos: selectedDocuments,
      };

      setGeneratedLinks((prev) => [...prev, newLink]);
      setGeneratedLink(link);

      // opcional: limpa seleção de documentos após gerar (se quiser manter, remova)
      setSelectedDocuments([]);
    } catch (error) {
      console.error("Erro ao gerar o link:", error);
    } finally {
      setIsGenerating(false);
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

  // helper para alternar doc
  const toggleDocument = (doc: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
    if (docError && selectedDocuments.length > 0) setDocError("");
  };

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
          <div>
           <h1 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-900">
              <LinkIcon className="w-7 h-7 mr-3 text-blue-600" />
              Geração de Links
            </h1>

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

                  {/* ========== Accordion com categorias de documentos (decorativo) ========== */}
                  <div className="mt-2">
                    <Label>Documentos Necessários</Label>
                    {docError && <p className="text-red-600 text-sm">{docError}</p>}

                    <Accordion type="multiple" className="mt-2">
                      {Object.entries(DOCUMENTOS_CATEGORIZADOS).map(([categoria, docs]) => (
                        <AccordionItem key={categoria} value={categoria}>
                          <AccordionTrigger className="text-sm font-medium">
                            {categoria}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 gap-2 py-2">
                              {docs.map((doc) => (
                                <label
                                  key={doc}
                                  className="flex items-center space-x-3 rounded-md p-2 hover:bg-gray-50"
                                >
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={selectedDocuments.includes(doc)}
                                    onChange={() => toggleDocument(doc)}
                                    value={doc}
                                  />
                                  <span className="text-sm">{doc}</span>
                                </label>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    <p className="text-xs text-gray-500 mt-2">
                      Observação: as categorias são apenas decorativas — o que será enviado e
                      considerado são os documentos marcados. Atualmente os documentos são enviados
                      no POST como <code>documentos_requeridos</code>. Troque essa chave no código se
                      o backend esperar um nome diferente.
                    </p>
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
                          <p className="font-medium text-sm sm:text-base">
                            Link gerado com sucesso!
                          </p>
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
                                <Badge className={getStatusColor(link.status)}>
                                  {link.status}
                                </Badge>
                              </TableCell>

                              <TableCell>
                                {link.documentos && link.documentos.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {link.documentos.map((d, i) => (
                                      <Badge key={i} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                        {d}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-xs">—</span>
                                )}
                              </TableCell>

                              <TableCell>
                                {new Date(link.createdAt).toLocaleDateString("pt-BR")}
                              </TableCell>
                              <TableCell>
                                {link.expiresAt
                                  ? new Date(link.expiresAt).toLocaleDateString("pt-BR")
                                  : ""}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(link.link)}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-red-600">
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
