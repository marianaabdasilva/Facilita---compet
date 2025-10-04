"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function DocumentosPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({})

  useEffect(() => {
    const tempData = localStorage.getItem("tempUserData")
    if (!tempData) {
      router.push("/abrir-empresa/conta")
      return
    }
    setUserData(JSON.parse(tempData))
  }, [router])

  const requiredDocuments = ["Cópia do RG ou CIN", "Comprovante de Residência", "Foto 3x4 recente"]

  const handleFileChange = (document: string, file: File | null) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [document]: file,
    }))
  }

  const handleSubmit = async () => {
    setError("")
    setIsLoading(true)

    // Verifica se todos os documentos obrigatórios foram enviados
    const allUploaded = requiredDocuments.every((doc) => uploadedFiles[doc])
    if (!allUploaded) {
      setError("Por favor, faça upload de todos os documentos obrigatórios")
      setIsLoading(false)
      return
    }

    try {
      // Exemplo de envio dos arquivos (ajuste conforme sua API)
      const formData = new FormData()
      formData.append("userData", JSON.stringify(userData))
      requiredDocuments.forEach((doc) => {
        if (uploadedFiles[doc]) {
          formData.append("documents", uploadedFiles[doc] as File, doc)
        }
      })

      // Exemplo de requisição (ajuste a URL e método conforme necessário)
      // await fetch("/api/upload", { method: "POST", body: formData })

      localStorage.removeItem("tempUserData")
      router.push("/dashboard")
    } catch (err) {
      setError("Erro ao finalizar processo. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!userData) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-blue-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <img src="/Facilitaj.png"
                  alt="Logo da Empresa"
                  width={20}
                  height={20}
                  className="w-16 h-16 text-blue-600" 
                />
            </div>
            
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="text-blue-600 font-medium">Etapa 4 de 4</span>
              <span className="mx-2">•</span>
              <span>Documentos</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Upload de Documentos</CardTitle>
              <CardDescription>Faça upload dos documentos necessários para finalizar seu MEI</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {requiredDocuments.map((document, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{document}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          id={`file-${index}`}
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleFileChange(document, e.target.files ? e.target.files[0] : null)
                          }
                        />
                        <label htmlFor={`file-${index}`}>
                          <Button asChild variant="outline" size="sm">
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              {uploadedFiles[document] ? "Trocar arquivo" : "Upload"}
                            </span>
                          </Button>
                        </label>
                        {uploadedFiles[document] && (
                          <span className="text-green-600 flex items-center text-sm">
                            <CheckCircle className="w-5 h-5 mr-1" />
                            Enviado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Resumo da Solicitação</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Nome:</strong> {userData.name || "Não informado"}
                  </p>
                  <p>
                    <strong>Email:</strong> {userData.email || "Não informado"}
                  </p>
                  <p>
                    <strong>CPF:</strong> {userData.cpf || "Não informado"}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {userData.phone || "Não informado"}
                  </p>
                  <p>
                    <strong>Tipo de CNPJ:</strong>{" "}
                    {userData.cnpjType
                      ? userData.cnpjType === "mei"
                        ? "MEI - Microempreendedor Individual"
                        : userData.cnpjType === "me"
                          ? "ME - Microempresa"
                          : userData.cnpjType === "epp"
                            ? "EPP - Empresa de Pequeno Porte"
                            : userData.cnpjType
                      : "Não informado"}
                  </p>
                  <p>
                    <strong>Categoria:</strong>{" "}
                    {userData.category
                      ? userData.category === "comercio"
                        ? "Comércio"
                        : userData.category === "servicos"
                          ? "Serviços"
                          : userData.category === "industria"
                            ? "Indústria"
                            : userData.category === "agropecuaria"
                              ? "Agropecuária"
                              : userData.category
                      : "Não informado"}
                  </p>
                  <p>
                    <strong>Nome Fantasia:</strong> {userData.fantasyName || "Não informado"}
                  </p>
                  <p>
                    <strong>CNAE:</strong> {userData.cnae || "Não informado"}
                  </p>
                  {userData.description && (
                    <p>
                      <strong>Descrição:</strong> {userData.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Link href="/abrir-empresa/atividade">
                  <Button type="button" variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading || Object.keys(uploadedFiles).length < requiredDocuments.length}
                >
                  {isLoading ? "Finalizando..." : "Finalizar Solicitação"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
