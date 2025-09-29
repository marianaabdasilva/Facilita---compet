"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { ClientLayout } from "@/components/client-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, CheckCircle, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const processTypes = [
  {
    value: "abertura-mei",
    label: "Abertura de MEI",
    description: "Registro como Microempreendedor Individual",
    duration: "1-3 dias úteis",
    price: "Gratuito",
  },
  {
    value: "alteracao-mei",
    label: "Alteração de MEI",
    description: "Modificação de dados do MEI existente",
    duration: "1-2 dias úteis",
    price: "Gratuito",
  },
  {
    value: "baixa-mei",
    label: "Baixa de MEI",
    description: "Encerramento das atividades do MEI",
    duration: "5-10 dias úteis",
    price: "Gratuito",
  },
]

const mockMEIs = [
  {
    id: "1",
    name: "João Silva - Serviços de Informática",
    cnpj: "12.345.678/0001-90",
    status: "ativo",
  },
  {
    id: "2",
    name: "Maria Santos - Consultoria",
    cnpj: "98.765.432/0001-10",
    status: "inativo",
  },
  {
    id: "3",
    name: "Pedro Costa - Vendas Online",
    cnpj: "11.222.333/0001-44",
    status: "transferido",
  },
]

const statusColors = {
  ativo: "bg-green-100 text-green-700",
  inativo: "bg-red-100 text-red-700",
  transferido: "bg-yellow-100 text-yellow-700",
}

export default function NewProcessPage() {
  const [selectedProcess, setSelectedProcess] = useState("")
  const [selectedMEI, setSelectedMEI] = useState("")
  const [observations, setObservations] = useState("")
  const [nomeCompleto, setNomeCompleto] = useState("")
  const [cpf, setCpf] = useState("")
  const [atividade, setAtividade] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const selectedProcessData = processTypes.find((p) => p.value === selectedProcess)
  const selectedMEIData = mockMEIs.find((m) => m.id === selectedMEI)

  const handleSubmit = async () => {
    if (!selectedProcess) return
    if ((selectedProcess === "alteracao-mei" || selectedProcess === "baixa-mei") && !selectedMEI) return
    if (selectedProcess === "abertura-mei" && (!nomeCompleto || !cpf || !atividade)) return

    setIsSubmitting(true)

    // Simulate process request creation
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <AuthGuard requiredRole="client">
        <ClientLayout>
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Solicitação Enviada com Sucesso!</h1>
            <p className="text-gray-600 mb-8">
              Sua solicitação de {selectedProcessData?.label.toLowerCase()} foi enviada. Nossa equipe irá analisar e
              enviar um link personalizado para upload dos documentos necessários.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">Próximos Passos:</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Nossa equipe analisará sua solicitação (1-2 horas)</li>
                <li>• Você receberá um link personalizado por email</li>
                <li>• Use o link para fazer upload dos documentos necessários</li>
                <li>• Acompanhe o progresso via dashboard</li>
              </ul>
            </div>
            <Button onClick={() => router.push("/dashboard")}>Voltar ao Dashboard</Button>
          </div>
        </ClientLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="client">
      <ClientLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Solicitar Processo MEI</h1>
              <p className="text-gray-600 mt-1">Solicite um processo para Microempreendedor Individual</p>
            </div>
          </div>

          {/* Process Type Selection */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Tipo de Processo MEI
              </CardTitle>
              <CardDescription>Selecione o tipo de processo MEI que deseja solicitar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="process-type">Tipo de Processo</Label>
                <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de processo MEI" />
                  </SelectTrigger>
                  <SelectContent>
                    {processTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="py-2">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedProcessData && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">{selectedProcessData.label}</h4>
                    <p className="text-sm text-blue-800 mb-3">{selectedProcessData.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-700">Prazo: {selectedProcessData.duration}</Badge>
                      <Badge className="bg-green-100 text-green-700">Valor: {selectedProcessData.price}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedProcess === "abertura-mei" && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Dados do Empreendedor
                </CardTitle>
                <CardDescription>Informe os dados básicos para abertura do MEI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome-completo">Nome Completo</Label>
                    <Input
                      id="nome-completo"
                      placeholder="Digite seu nome completo"
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="atividade">Atividade Principal</Label>
                    <Input
                      id="atividade"
                      placeholder="Ex: Desenvolvimento de software, Consultoria, Vendas online..."
                      value={atividade}
                      onChange={(e) => setAtividade(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedProcess && (selectedProcess === "alteracao-mei" || selectedProcess === "baixa-mei") && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <img src="/Facilitaj.png"
                        alt="Logo da Empresa"
                        width={30}
                        height={30}
                        className="w-16 h-16" 
                   />
                  Selecionar MEI
                </CardTitle>
                <CardDescription>
                  Escolha qual MEI passará pelo processo de {selectedProcessData?.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="mei-select">MEI</Label>
                  <Select value={selectedMEI} onValueChange={setSelectedMEI}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o MEI" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMEIs.map((mei) => (
                        <SelectItem key={mei.id} value={mei.id}>
                          <div className="py-2">
                            <div className="font-medium">{mei.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              CNPJ: {mei.cnpj}
                              <Badge className={`text-xs ${statusColors[mei.status as keyof typeof statusColors]}`}>
                                {mei.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedMEIData && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-1">{selectedMEIData.name}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-green-800">CNPJ: {selectedMEIData.cnpj}</p>
                        <Badge
                          className={`text-xs ${statusColors[selectedMEIData.status as keyof typeof statusColors]}`}
                        >
                          {selectedMEIData.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          {selectedProcess && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Informações Adicionais
                </CardTitle>
                <CardDescription>Observações ou informações extras sobre a solicitação</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Descreva qualquer informação adicional que possa ser relevante para o processo..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          {selectedProcess && (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Resumo da Solicitação</h4>
                    <p className="text-sm text-gray-600">
                      {selectedProcessData?.label}
                      {selectedMEIData && ` • ${selectedMEIData.name}`}
                      {selectedProcess === "abertura-mei" && nomeCompleto && ` • ${nomeCompleto}`}
                      {" • Aguardando link para upload de documentos"}
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !selectedProcess ||
                      ((selectedProcess === "alteracao-mei" || selectedProcess === "baixa-mei") && !selectedMEI) ||
                      (selectedProcess === "abertura-mei" && (!nomeCompleto || !cpf || !atividade)) ||
                      isSubmitting
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isSubmitting ? "Enviando Solicitação..." : "Enviar Solicitação"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ClientLayout>
    </AuthGuard>
  )
}
