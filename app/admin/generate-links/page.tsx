"use client"

import { useState, useEffect } from "react"
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
import { LinkIcon, Copy, Eye, Trash2, CheckCircle, MessageCircle, Building2 } from "lucide-react"

// Mock data for clients
const clients = [
  { id: "1", name: "João Silva", company: "Silva Comércio LTDA", phone: "11999999999" },
  { id: "2", name: "Maria Santos", company: "Santos & Associados", phone: "11988888888" },
  { id: "3", name: "Pedro Costa", company: "Costa Transportes", phone: "11977777777" },
  { id: "4", name: "Ana Oliveira", company: "Oliveira Consultoria", phone: "11966666666" },
]

// Mock data for generated links
const generatedLinks = [
  {
    id: "1",
    clientName: "João Silva",
    companyType: "MEI",
    cnae: "4711-3/02",
    link: "https://facilita.com/upload/abc123def456",
    status: "Ativo",
    createdAt: "2024-01-20",
    expiresAt: "2024-02-20",
    used: false,
  },
  {
    id: "2",
    clientName: "Maria Santos",
    companyType: "ME",
    cnae: "9602-5/01",
    link: "https://facilita.com/upload/xyz789ghi012",
    status: "Usado",
    createdAt: "2024-01-18",
    expiresAt: "2024-02-18",
    used: true,
  },
]

function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard:", text)
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err)
    })
}

export default function GenerateLinksPage() {
  const [selectedClient, setSelectedClient] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [companyData, setCompanyData] = useState<any>(null)

  useEffect(() => {
    const tempData = localStorage.getItem("tempUserData")
    if (tempData) {
      const data = JSON.parse(tempData)
      setCompanyData(data)
      // Clear the temp data after loading
      localStorage.removeItem("tempUserData")
    }
  }, [])

  const handleGenerateLink = async () => {
    if (!selectedClient || !companyData) return

    setIsGenerating(true)

    // Simulate link generation
    setTimeout(() => {
      const linkId = Math.random().toString(36).substring(2, 15)
      const newLink = `${window.location.origin}/upload/${linkId}`
      setGeneratedLink(newLink)
      setIsGenerating(false)
    }, 1000)
  }

  const sendViaWhatsApp = (link: string, clientPhone?: string) => {
    const selectedClientData = clients.find((c) => c.id === selectedClient)
    const phone = clientPhone || selectedClientData?.phone || ""
    const message = encodeURIComponent(
      `Olá! Aqui está o link para upload dos documentos da sua empresa:\n\n${link}\n\nPor favor, acesse o link e envie os documentos solicitados.\n\nEquipe FACILITA`,
    )
    const whatsappUrl = `https://wa.me/55${phone}?text=${message}`
    window.open(whatsappUrl, "_blank")
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
            <p className="text-gray-600 mt-1">Crie links personalizados para upload de documentos dos clientes</p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Links Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {generatedLinks.filter((l) => l.status === "Ativo").length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Disponíveis para uso</p>
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
                <p className="text-sm text-gray-600 mt-1">Já utilizados</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Total Gerados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{generatedLinks.length}</div>
                <p className="text-sm text-gray-600 mt-1">Links criados</p>
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
                <p className="text-sm text-gray-600 mt-1">Efetividade</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Link Generation Form */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Gerar Link de Upload
                  </CardTitle>
                  <CardDescription>Selecione o cliente para enviar o link de upload de documentos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companyData && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium text-blue-900">Empresa Criada</p>
                          <div className="text-sm text-blue-800 space-y-1">
                            <p>
                              <strong>Nome:</strong> {companyData.fantasyName}
                            </p>
                            <p>
                              <strong>Tipo:</strong> {companyData.cnpjType?.toUpperCase()}
                            </p>
                            <p>
                              <strong>CNAE:</strong> {companyData.cnae}
                            </p>
                            <p>
                              <strong>Categoria:</strong> {companyData.category}
                            </p>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

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

                  <Button
                    onClick={handleGenerateLink}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedClient || !companyData || isGenerating}
                  >
                    {isGenerating ? "Gerando..." : "Gerar Link"}
                  </Button>

                  {generatedLink && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        <div className="space-y-3">
                          <p className="font-medium text-green-800">Link gerado com sucesso!</p>
                          <div className="flex items-center space-x-2">
                            <Input value={generatedLink} readOnly className="text-xs bg-white" />
                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedLink)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            onClick={() => sendViaWhatsApp(generatedLink)}
                            className="w-full bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Enviar via WhatsApp
                          </Button>
                          <p className="text-xs text-gray-600">
                            Envie este link para o cliente fazer upload dos documentos
                          </p>
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
                  <CardDescription>Histórico de links criados para upload de documentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Tipo/CNAE</TableHead>
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
                              <div className="text-sm">
                                <div className="font-medium">{link.companyType}</div>
                                <div className="text-gray-500">{link.cnae}</div>
                              </div>
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
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => sendViaWhatsApp(link.link)}
                                  title="Enviar via WhatsApp"
                                >
                                  <MessageCircle className="w-3 h-3 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(link.link)}
                                  title="Copiar link"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" title="Visualizar">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600" title="Excluir">
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
