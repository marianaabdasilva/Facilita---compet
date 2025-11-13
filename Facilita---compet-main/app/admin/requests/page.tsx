"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Search, Filter, ExternalLink, Clock, CheckCircle, AlertCircle, Copy, Check } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for client requests
const mockRequests = [
  {
    id: "REQ-001",
    clientName: "João Silva",
    company: "Silva Comércio LTDA",
    email: "joao@silva.com",
    processType: "Abertura de CNPJ",
    status: "Pendente",
    createdAt: "2024-01-22T10:30:00",
    observations: "Empresa de comércio varejista, precisa de urgência no processo",
  },
  {
    id: "REQ-002",
    clientName: "Maria Santos",
    company: "Santos & Associados",
    email: "maria@santos.com",
    processType: "Alteração Contratual",
    status: "Link Enviado",
    createdAt: "2024-01-21T14:15:00",
    observations: "Alteração de endereço e inclusão de sócio",
    linkSentAt: "2024-01-21T15:30:00",
  },
  {
    id: "REQ-003",
    clientName: "Pedro Costa",
    company: "Costa Transportes",
    email: "pedro@costa.com",
    processType: "Fechamento de CNPJ",
    status: "Documentos Recebidos",
    createdAt: "2024-01-20T09:45:00",
    observations: "Encerramento por aposentadoria do proprietário",
    linkSentAt: "2024-01-20T11:00:00",
  },
]

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [copiedLink, setCopiedLink] = useState("")
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
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
        return <Clock className="w-4 h-4" />
      case "Link Enviado":
        return <ExternalLink className="w-4 h-4" />
      case "Documentos Recebidos":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.processType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleGenerateLink = (request: any) => {
    // Generate link and redirect to generate-links page with pre-filled data
    router.push(`/admin/generate-links?clientId=${request.id}&processType=${request.processType}`)
  }

  const handleCopyLink = (requestId: string) => {
    const link = `${window.location.origin}/upload/${requestId}`
    navigator.clipboard.writeText(link)
    setCopiedLink(requestId)
    setTimeout(() => setCopiedLink(""), 2000)
  }

  const pendingCount = mockRequests.filter((r) => r.status === "Pendente").length

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                Solicitações de Processos
                {pendingCount > 0 && (
                  <Badge className="ml-3 bg-red-100 text-red-700">
                    <Bell className="w-3 h-3 mr-1" />
                    {pendingCount} pendente{pendingCount > 1 ? "s" : ""}
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600 mt-1">Gerencie solicitações de processos dos clientes</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por cliente, empresa ou tipo de processo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Link Enviado">Link Enviado</SelectItem>
                      <SelectItem value="Documentos Recebidos">Documentos Recebidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Solicitações ({filteredRequests.length})</CardTitle>
              <CardDescription>Lista de todas as solicitações de processos</CardDescription>
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
                        <div>
                          <div className="font-medium">{request.clientName}</div>
                          <div className="text-sm text-gray-500">{request.company}</div>
                          <div className="text-xs text-gray-400">{request.email}</div>
                        </div>
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
                        <div className="text-sm">{new Date(request.createdAt).toLocaleDateString("pt-BR")}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                Ver Detalhes
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalhes da Solicitação</DialogTitle>
                                <DialogDescription>
                                  Informações completas sobre a solicitação {selectedRequest?.id}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold">Cliente</h4>
                                    <p>{selectedRequest.clientName}</p>
                                    <p className="text-sm text-gray-600">{selectedRequest.company}</p>
                                    <p className="text-sm text-gray-600">{selectedRequest.email}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Processo</h4>
                                    <p>{selectedRequest.processType}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Observações</h4>
                                    <p className="text-sm">{selectedRequest.observations || "Nenhuma observação"}</p>
                                  </div>
                                  <div className="flex space-x-2">
                                    {selectedRequest.status === "Pendente" && (
                                      <Button
                                        onClick={() => handleGenerateLink(selectedRequest)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Gerar Link
                                      </Button>
                                    )}
                                    {selectedRequest.status !== "Pendente" && (
                                      <Button variant="outline" onClick={() => handleCopyLink(selectedRequest.id)}>
                                        {copiedLink === selectedRequest.id ? (
                                          <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                          <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        {copiedLink === selectedRequest.id ? "Copiado!" : "Copiar Link"}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {request.status === "Pendente" && (
                            <Button
                              size="sm"
                              onClick={() => handleGenerateLink(request)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Gerar Link
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
