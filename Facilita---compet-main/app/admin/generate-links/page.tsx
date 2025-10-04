"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LinkIcon, Copy, Eye, Trash2, CheckCircle } from "lucide-react"

// Mock data for clients
const clients = [
  { id: "1", name: "João Silva", company: "Silva Comércio LTDA" },
  { id: "2", name: "Maria Santos", company: "Santos & Associados" },
  { id: "3", name: "Pedro Costa", company: "Costa Transportes" },
  { id: "4", name: "Ana Oliveira", company: "Oliveira Consultoria" },
]

const processTypes = [
  { value: "abertura", label: "Abertura de CNPJ" },
  { value: "alteracao", label: "Alteração Contratual" },
  { value: "fechamento", label: "Fechamento de CNPJ" },
]

// Mock data for generated links
const generatedLinks = [
  {
    id: "1",
    clientName: "João Silva",
    processType: "Abertura de CNPJ",
    link: "https://facilita.com/upload/abc123def456",
    status: "Ativo",
    createdAt: "2024-01-20",
    expiresAt: "2024-02-20",
    used: false,
  },
  {
    id: "2",
    clientName: "Maria Santos",
    processType: "Alteração Contratual",
    link: "https://facilita.com/upload/xyz789ghi012",
    status: "Usado",
    createdAt: "2024-01-18",
    expiresAt: "2024-02-18",
    used: true,
  },
]

export default function GenerateLinksPage() {
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedProcess, setSelectedProcess] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateLink = async () => {
    if (!selectedClient || !selectedProcess) return

    setIsGenerating(true)

    // Simulate link generation
    setTimeout(() => {
      const linkId = Math.random().toString(36).substring(2, 15)
      const newLink = `https://facilita.com/upload/${linkId}`
      setGeneratedLink(newLink)
      setIsGenerating(false)
    }, 1000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Você pode adicionar um toast aqui se quiser
  }

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

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Geração de Links</h1>
            <p className="text-gray-600 mt-1">Crie links personalizados para upload de documentos</p>
          </div>

          {/* Statistics */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Suas Estatísticas</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Links Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {generatedLinks.filter((l) => l.status === "Ativo").length}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Links Usados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {generatedLinks.filter((l) => l.status === "Usado").length}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Total Gerados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{generatedLinks.length}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Taxa de Uso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round((generatedLinks.filter((l) => l.used).length / generatedLinks.length) * 100)}%
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form + List */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Link Generation Form */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Gerar Novo Link
                  </CardTitle>
                  <CardDescription>Selecione o cliente e tipo de processo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="client">Cliente</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-gray-500">{client.company}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="process">Tipo de Processo</Label>
                    <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {processTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

            {/* Generated Links List */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Links Gerados</CardTitle>
                  <CardDescription>Histórico de links criados</CardDescription>
                </CardHeader>
                <CardContent>
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
                        {generatedLinks.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell>
                              <div className="font-medium">{link.clientName}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{link.processType}</div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(link.status)}>{link.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-500">
                                {new Date(link.createdAt).toLocaleDateString("pt-BR")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-500">
                                {new Date(link.expiresAt).toLocaleDateString("pt-BR")}
                              </div>
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
                      </TableBody>
                    </Table>
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
