"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  Bell, Search, Filter, ExternalLink, Clock,
  CheckCircle, AlertCircle, Copy, Check, Info, Plus
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Alert, AlertDescription, AlertTitle
} from "@/components/ui/alert"

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [copiedLink, setCopiedLink] = useState("")
  const router = useRouter()

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const [processosResp, clientesResp, empresasResp] = await Promise.all([
        axios.get("https://projeto-back-ten.vercel.app/processos", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("https://projeto-back-ten.vercel.app/clientes", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("https://projeto-back-ten.vercel.app/totalcnpjs", {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ])

      const clientesMap = clientesResp.data.reduce((acc: any, c: any) => {
        acc[c.id_cliente] = { name: c.nome, email: c.email }
        return acc
      }, {})

      const empresasMap = empresasResp.data.reduce((acc: any, e: any) => {
        acc[e.id_cnpj] = { name: e.nome, cnpj: e.numero_cnpj }
        return acc
      }, {})

      const formatted = processosResp.data.map((p: any) => ({
        id: p.id_processo,
        clientName: clientesMap[p.id_cliente]?.name || "Cliente não encontrado",
        email: clientesMap[p.id_cliente]?.email || "Sem email",
        company: empresasMap[p.id_cnpj]?.name || "Empresa não encontrada",
        cnpj: empresasMap[p.id_cnpj]?.cnpj || "",
        processType: p.tipo || "Não informado",
        status: p.status_link || "Pendente",
        createdAt: p.data_atualizacao || new Date().toISOString(),
        observations: p.observacoes || "Nenhuma"
      }))

      setRequests(formatted)
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
      case "Aguardando Link":
        return "bg-yellow-100 text-yellow-700"
      case "Link Enviado":
        return "bg-blue-100 text-blue-700"
      case "Documentos Recebidos":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pendente":
      case "Aguardando Link":
        return <Clock className="w-4 h-4" />
      case "Link Enviado":
        return <ExternalLink className="w-4 h-4" />
      case "Documentos Recebidos":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.processType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleGenerateLink = (request: any) => {
    router.push(`/admin/generate-links?clientId=${request.id}&processType=${request.processType}`)
  }

  const handleCopyLink = (requestId: string) => {
    const link = `${window.location.origin}/upload/${requestId}`
    navigator.clipboard.writeText(link)
    setCopiedLink(requestId)

    setTimeout(() => setCopiedLink(""), 2000)
  }

  const pendingCount = requests.filter((r) => r.status === "Pendente" || r.status === "Aguardando Link").length

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                Solicitações de Processos
                {pendingCount > 0 && (
                  <Badge className="ml-3 bg-red-100 text-red-700">
                    <Bell className="w-3 h-3 mr-1" />
                    {pendingCount} pendente(s)
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600 mt-1">Gerencie solicitações dos clientes</p>
            </div>

            <Link href="/admin/generate-links">
              <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Gerar Link
              </Button>
            </Link>
          </div>

          {/* CARD DO FLUXO */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-900 font-semibold">Processo de Abertura de Empresa</AlertTitle>
            <AlertDescription className="text-blue-800 mt-2">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Recebimento da Solicitação:</strong> Cliente solicita abertura de empresa
                </li>
                <li>
                  <strong>Criação de cliente:</strong> Admin cria cadastro do cliente no sistema
                </li>
                <li>
                  <strong>Geração de Link:</strong> Admin gera link personalizado para envio de documentos
                </li>
                <li>
                  <strong>Envio de Documentos:</strong> Cliente acessa o link e envia toda documentação necessária (RG,
                  CPF, Comprovante de Endereço, etc.)
                </li>
                <li>
                  <strong>Análise Documental:</strong> Equipe verifica e valida todos os documentos recebidos
                </li>
                <li>
                  <strong>Registro na Junta Comercial:</strong> Processo de registro e obtenção do CNPJ
                </li>
                <li>
                  <strong>Finalização:</strong> Cliente recebe documentação da empresa constituída
                </li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* FILTROS */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar cliente, empresa ou tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><Filter className="mr-2 w-4 h-4" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Aguardando Link">Aguardando Link</SelectItem>
                      <SelectItem value="Link Enviado">Link Enviado</SelectItem>
                      <SelectItem value="Documentos Recebidos">Documentos Recebidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TABELA */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Solicitações ({filteredRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Processo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.clientName}</div>
                        <div className="text-sm text-gray-500">{request.company}</div>
                        <div className="text-xs text-gray-400">{request.email}</div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">{request.processType}</Badge>
                      </TableCell>

                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{request.status}</span>
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>

                      <TableCell className="space-x-2">
                        {/* MODAL DETALHES */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                              Ver detalhes
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Solicitação {request.id}</DialogTitle>
                              <DialogDescription>Informações completas</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <p><strong>Cliente:</strong> {request.clientName}</p>
                              <p><strong>Email:</strong> {request.email}</p>
                              <p><strong>Empresa:</strong> {request.company}</p>
                              <p><strong>CNPJ:</strong> {request.cnpj}</p>
                              <p><strong>Processo:</strong> {request.processType}</p>
                              <p><strong>Observações:</strong> {request.observations}</p>

                              {/* Ações dentro do modal */}
                              {request.status === "Pendente" || request.status === "Aguardando Link" ? (
                                <Button className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleGenerateLink(request)}>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Gerar Link
                                </Button>
                              ) : (
                                <Button variant="outline"
                                  onClick={() => handleCopyLink(request.id)}>
                                  {copiedLink === request.id ?
                                    <Check className="w-4 h-4 mr-2" /> :
                                    <Copy className="w-4 h-4 mr-2" />
                                  }
                                  {copiedLink === request.id ? "Copiado!" : "Copiar Link"}
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* BOTÃO GERAR LINK NA TABELA */}
                        {(request.status === "Pendente" || request.status === "Aguardando Link") && (
                          <Button
                            size="sm"
                            onClick={() => handleGenerateLink(request)}
                            className="bg-blue-600 hover:bg-blue-700">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Link
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Nenhuma solicitação encontrada
                      </TableCell>
                    </TableRow>
                  )}

                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      </AdminLayout>
    </AuthGuard>
  )
}