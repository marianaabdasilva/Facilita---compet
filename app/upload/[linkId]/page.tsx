"use client"

import { useState, useEffect } from "react"
import { DocumentUpload } from "@/components/document-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {CheckCircle, AlertCircle, Clock } from "lucide-react"
import { useParams } from "next/navigation" 

// Mock data for link validation
const mockLinkData = {
  valid: true,
  clientName: "João Silva",
  company: "Silva Comércio LTDA",
  processType: "Abertura de CNPJ",
  expiresAt: "2024-02-20",
  used: false,
}

export default function UploadLinkPage() {
  const params = useParams()
  const linkId = params.linkId as string
  const [linkData, setLinkData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Simulate link validation
    setTimeout(() => {
      setLinkData(mockLinkData)
      setIsLoading(false)
    }, 1000)
  }, [linkId])

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) return

    // Simulate submission
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando link...</p>
        </div>
      </div>
    )
  }

  if (!linkData?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Inválido</h1>
            <p className="text-gray-600 mb-4">Este link de upload não é válido ou já expirou.</p>
            <p className="text-sm text-gray-500">Entre em contato com nossa equipe para obter um novo link.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-xl">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Documentos Enviados!</h1>
            <p className="text-gray-600 mb-8">
              Seus documentos foram enviados com sucesso para o processo de {linkData.processType.toLowerCase()}.
            </p>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">O que acontece agora?</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Nossa equipe irá analisar os documentos enviados</li>
                <li>• Você será contatado em caso de dúvidas ou documentos adicionais</li>
                <li>• O processo será iniciado junto aos órgãos competentes</li>
                <li>• Acompanhe o status através do seu dashboard</li>
              </ul>
            </div>
          </CardContent>
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
          <div>
            <img
            src="/Facilitaj.png" // caminho relativo à pasta public
            alt="Logo da empresa"
            width={28}
            height={48}
            className="w-16 h-16 "
            />
          </div>
          <p className="text-gray-600">Upload de Documentos</p>
        </div>

        {/* Process Info */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Informações do Processo</CardTitle>
            <CardDescription>Detalhes do processo para upload de documentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium text-gray-900">{linkData.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Empresa</p>
                <p className="font-medium text-gray-900">{linkData.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de Processo</p>
                <p className="font-medium text-gray-900">{linkData.processType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status do Link</p>
                <div className="flex items-center space-x-2">
                  {isExpired ? (
                    <Badge className="bg-red-100 text-red-700">
                      <Clock className="w-3 h-3 mr-1" />
                      Expirado
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ativo
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500">
                    Expira em {new Date(linkData.expiresAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isExpired ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Este link de upload expirou. Entre em contato com nossa equipe para obter um novo link.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Document Upload */}
            <DocumentUpload processType={linkData.processType} onFilesUploaded={setUploadedFiles} />

            {/* Submit Button */}
            {uploadedFiles.length > 0 && (
              <Card className="border-0 shadow-lg mt-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Finalizar Envio</h4>
                      <p className="text-sm text-gray-600">{uploadedFiles.length} documento(s) pronto(s) para envio</p>
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
