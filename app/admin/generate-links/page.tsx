"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Select, { SingleValue } from "react-select"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LinkIcon, Copy, CheckCircle, Trash2, Eye, Search } from "lucide-react"

interface ClientesOption {
  value: string
  label: string
  id_cliente: number
}

interface ProcessosOption {
  value: string
  label: string
  id_processo: number
}

interface GeneratedLink {
  id: string
  clientName: string
  processType: string
  link: string
  status: string
  createdAt: string
  expiresAt: string
  used: boolean
}

export default function GenerateLinksPage() {
  const [allClientes, setAllClientes] = useState<ClientesOption[]>([])
  const [allProcessos, setAllProcessos] = useState<ProcessosOption[]>([])
  const [selectedClient, setSelectedClient] = useState<ClientesOption | null>(null)
  const [selectedProcess, setSelectedProcess] = useState<ProcessosOption | null>(null)
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([])
  const [generatedLink, setGeneratedLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchLink, setSearchLink] = useState("") // 🔍 busca de links gerados

  // Buscar clientes
  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem("token") // Pegue o token do localStorage

      const resp = await axios.get("https://projeto-back-ten.vercel.app/clientes", {
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
      })
      

      const data: Array<{ id_cliente: number; nome: string }> = resp.data

      setAllClientes(
        data.map((c) => ({
          value: String(c.id_cliente),
          label: c.nome,
          id_cliente: c.id_cliente,
        }))
      )
      
    } catch (err) {
      console.error("Erro ao buscar clientes:", err)
    }
  }


  // Buscar tipos de processo
  const fetchProcessos = async () => {
    try {
      const resp = await axios.get("https://projeto-back-ten.vercel.app/tiposprocessos")
      const data: Array<{ id_processo: number; nome: string }> = resp.data
      setAllProcessos(
        data.map((c) => ({
          value: String(c.id_processo),
          label: c.nome,
          id_processo: c.id_processo,
        }))
      )
    } catch (err) {
      console.error("Erro ao buscar processos:", err)
    }
  }

  useEffect(() => {
    fetchClientes()
    fetchProcessos()
  }, [])

  // Gerar link
  const handleGenerateLink = async () => {
    if (!selectedClient || !selectedProcess) return
    setIsGenerating(true)

    setTimeout(() => {
      const id = Math.random().toString(36).substring(2, 10)
      const newLink: GeneratedLink = {
        id,
        clientName: selectedClient.label,
        processType: selectedProcess.label,
        link: `https://facilita.com/abrir-empresa/documentos?id=${id}`,
        status: "Ativo",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        used: false,
      }

      setGeneratedLinks((prev) => [...prev, newLink])
      setGeneratedLink(newLink.link)
      setIsGenerating(false)
    }, 1000)
  }

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-700"
      case "Usado":
        return "bg-blue-100 text-blue-700"
      case "Expirado":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // 🔎 Filtrar links gerados
  const filteredLinks = generatedLinks.filter((link) => {
    const term = searchLink.toLowerCase()
    return (
      link.clientName.toLowerCase().includes(term) ||
      link.processType.toLowerCase().includes(term) ||
      link.status.toLowerCase().includes(term)
    )
  })

  const handleClientChange = (option: SingleValue<ClientesOption>) => {
    setSelectedClient(option)
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Cabeçalho */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Geração de Links</h1>
            <p className="text-gray-600 mt-1">Crie links personalizados para upload de documentos</p>
          </div>

          {/* Estatísticas */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Suas Estatísticas</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  title: "Links Ativos",
                  color: "text-green-600",
                  value: generatedLinks.filter((l) => l.status === "Ativo").length,
                },
                {
                  title: "Links Usados",
                  color: "text-blue-600",
                  value: generatedLinks.filter((l) => l.status === "Usado").length,
                },
                { title: "Total Gerados", color: "text-green-600", value: generatedLinks.length },
                {
                  title: "Taxa de Uso",
                  color: "text-blue-600",
                  value: `${generatedLinks.length
                      ? Math.round(
                        (generatedLinks.filter((l) => l.used).length / generatedLinks.length) * 100
                      )
                      : 0
                    }%`,
                },
              ].map((stat, i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Seção principal */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LinkIcon className="w-5 h-5 mr-2" /> Gerar Novo Link
                  </CardTitle>
                  <CardDescription>Selecione o cliente e tipo de processo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Select de clientes */}
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Select
                      options={allClientes}
                      value={selectedClient}
                      onChange={handleClientChange}
                      placeholder="Selecione um cliente"
                      className="z-50"
                    />
                  </div>

                  {/* Tipo de processo */}
                  <div className="space-y-2">
                    <Label>Tipo de Processo</Label>
                    <Select
                      options={allProcessos}
                      value={selectedProcess}
                      onChange={(opt) => setSelectedProcess(opt)}
                      placeholder="Selecione o tipo de processo"
                      className="z-50"
                    />
                  </div>

                  <Button
                    onClick={handleGenerateLink}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedClient || !selectedProcess || isGenerating}
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

            {/* 🔍 Campo de pesquisa + tabela */}
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

                    {/* Tabela */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cliente</TableHead>
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
                              <TableCell>{link.processType}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(link.status)}>{link.status}</Badge>
                              </TableCell>
                              <TableCell>{new Date(link.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell>{new Date(link.expiresAt).toLocaleDateString("pt-BR")}</TableCell>
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
                              <TableCell colSpan={6} className="text-center text-gray-500 py-6">
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
  )
}


