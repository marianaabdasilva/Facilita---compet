"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Select, { SingleValue } from "react-select";
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
import { LinkIcon, Copy, CheckCircle, Trash2, Eye, Search } from "lucide-react";

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

  // Buscar clientes
  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get("https://projeto-back-ten.vercel.app/clientes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Array<{ id_cliente: number; nome: string }> = resp.data;

      setAllClientes(
        data.map((c) => ({
          value: String(c.id_cliente),
          label: c.nome,
          id_cliente: c.id_cliente,
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  // Buscar tipos de processo
  const fetchProcessos = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get("https://projeto-back-ten.vercel.app/tiposProcesso", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Array<{ id_tipo_processo: number; tipo: string }> = resp.data;

      setAllProcessos(
        data.map((p) => ({
          value: String(p.id_tipo_processo),
          label: p.tipo,
          id_tipo_processo: p.id_tipo_processo,
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar processos:", err);
    }
  };

  // Buscar empresas do cliente selecionado
  const fetchClientCompanies = async (idCliente: number) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get(
        `https://projeto-back-ten.vercel.app/cliente_cnpjs/${idCliente}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const empresas: Array<{
        id_cnpj: number;
        nome: string;
        numero_cnpj: number;
        data_criacao: string;
      }> = resp.data;

      const formatted = empresas.map((empresa) => ({
        value: String(empresa.id_cnpj),
        label: `${empresa.nome} (CNPJ: ${empresa.numero_cnpj})`,
        id_cnpj: empresa.id_cnpj,
      }));

      setClientCompanies(formatted);
      setSelectedCompany(null);
    } catch (err) {
      console.error("Erro ao buscar empresas do cliente:", err);
      setClientCompanies([]);
    }
  };

  // Efeitos iniciais
  useEffect(() => {
    fetchClientes();
    fetchProcessos();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchClientCompanies(selectedClient.id_cliente);
    }
  }, [selectedClient]);

  const handleGenerateLink = async () => {
    if (!selectedClient || !selectedCompany || !selectedProcess) return;

    setIsGenerating(true);

    setTimeout(() => {
      const id = Math.random().toString(36).substring(2, 10);
      const newLink: GeneratedLink = {
        id,
        clientName: selectedClient.label,
        companyName: selectedCompany.label,
        processType: selectedProcess.label,
        link: `https://facilita-compet.vercel.app/abrir-empresa/documentos?id=${id}`,
        status: "Ativo",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        used: false,
      };

      // Aqui você pode fazer uma requisição POST se quiser salvar na API

      console.log({
        id_cliente: selectedClient.id_cliente,
        id_cnpj: selectedCompany.id_cnpj,
        id_tipo_processo: selectedProcess.id_tipo_processo,
      });

      setGeneratedLinks((prev) => [...prev, newLink]);
      setGeneratedLink(newLink.link);
      setIsGenerating(false);
    }, 1000);
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

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Geração de Links</h1>
            <p className="text-gray-600 mt-1">
              Crie links personalizados para upload de documentos
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LinkIcon className="w-5 h-5 mr-2" /> Gerar Novo Link
                  </CardTitle>
                  <CardDescription>
                    Selecione o cliente, empresa e tipo de processo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Select
                      options={allClientes}
                      value={selectedClient}
                      onChange={(opt) => setSelectedClient(opt)}
                      placeholder="Selecione um cliente"
                      className="z-50"
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
                        className="z-40"
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
                      className="z-30"
                    />
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
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium">Link gerado com sucesso!</p>
                          <div className="flex items-center space-x-2">
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
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Links Gerados</CardTitle>
                  <CardDescription>Histórico de links criados</CardDescription>
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
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Processo</TableHead>
                            <TableHead>Status</TableHead>
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
                                {new Date(link.createdAt).toLocaleDateString("pt-BR")}
                              </TableCell>
                              <TableCell>
                                {new Date(link.expiresAt).toLocaleDateString("pt-BR")}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(link.link)}>
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Eye className="w-3 h-3" />
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
                              <TableCell colSpan={7} className="text-center text-gray-500 py-6">
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
