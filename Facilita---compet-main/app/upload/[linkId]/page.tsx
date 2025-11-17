"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DocumentUpload } from "@/components/document-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import { uploadArquivoCliente } from "@/lib/upload"

export default function UploadLinkPage() {
  const params = useParams()
  const linkId = params.linkId as string

  const [linkData, setLinkData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔹 Busca informações do link real na API
  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const res = await axios.get(`/links/${linkId}`) // ajuste conforme seu endpoint real
        setLinkData(res.data)
      } catch (err) {
        console.error("Erro ao buscar link:", err)
        setError("Link inválido ou expirado.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLinkData()
  }, [linkId])

  // 🔹 Envia os arquivos para a API
  const handleSubmit = async () => {
    if (uploadedFiles.length === 0 || !linkData?.cliente_id) return

    try {
      for (const fileData of uploadedFiles) {
        await uploadArquivoCliente(
          linkData.cliente_id,        // ID do cliente vindo da API
          fileData.arquivo,           // Arquivo tipo File
          fileData.tipo_documento_id, // tipo do documento
          fileData.cnpj_id            // ID do CNPJ
        )
      }

      setIsSubmitted(true)
    } catch (err) {
      console.error("Erro ao enviar:", err)
      alert("Erro ao enviar arquivos. Tente novamente.")
    }
  }

  // 🔸 Carregando link
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-600">Validando link...</p>
      </div>
    )
  }

  // 🔸 Link inválido
  if (error || !linkData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-6 text-center shadow-md">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Link Inválido</h1>
          <p className="text-gray-600">{error || "Não foi possível validar este link."}</p>
        </Card>
      </div>
    )
  }

  // 🔸 Upload concluído
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <Card className="max-w-lg w-full text-center border-0 shadow-lg p-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Documentos Enviados!</h1>
          <p className="text-gray-600 mb-6">
            Seus documentos foram enviados com sucesso. Nossa equipe irá analisá-los em breve.
          </p>
        </Card>
      </div>
    )
  }

  const isExpired = new Date(linkData.expiresAt) < new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Facilitaj.png" alt="Logo" className="w-16 h-16 mx-auto" />
          <p className="text-gray-600">Upload de Documentos</p>
        </div>

        {/* Informações do processo */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Informações do Processo</CardTitle>
            <CardDescription>Detalhes do processo para upload de documentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium text-gray-900">{linkData.cliente_nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Empresa</p>
                <p className="font-medium text-gray-900">{linkData.empresa_nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de Processo</p>
                <p className="font-medium text-gray-900">{linkData.tipo_processo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status do Link</p>
                <div className="flex items-center space-x-2">
                  {isExpired ? (
                    <Badge className="bg-red-100 text-red-700">
                      <Clock className="w-3 h-3 mr-1" /> Expirado
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" /> Ativo
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Expirado */}
        {isExpired ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Este link de upload expirou. Solicite um novo link à equipe.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Upload de documentos */}
            <DocumentUpload processType={linkData.tipo_processo} onFilesUploaded={setUploadedFiles} />

            {/* Botão de Enviar */}
            {uploadedFiles.length > 0 && (
              <Card className="border-0 shadow-lg mt-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Finalizar Envio</h4>
                      <p className="text-sm text-gray-600">
                        {uploadedFiles.length} documento(s) pronto(s) para envio
                      </p>
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={uploadedFiles.length === 0}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      Enviar Documentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
