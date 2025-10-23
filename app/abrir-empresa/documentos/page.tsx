"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DocumentosPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({})

  // Documentos obrigatórios
  const requiredDocuments = ["Cópia do RG ou CIN", "Comprovante de Residência", "Foto 3x4 recente"]

  // Atualiza o arquivo selecionado
  const handleFileChange = (document: string, file: File | null) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [document]: file,
    }))
  }

  // Envia os documentos
  const handleSubmit = async () => {
    setError("")
    setIsLoading(true)

    const allUploaded = requiredDocuments.every((doc) => uploadedFiles[doc])
    if (!allUploaded) {
      setError("Por favor, faça upload de todos os documentos obrigatórios.")
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      requiredDocuments.forEach((doc) => {
        if (uploadedFiles[doc]) {
          formData.append("documents", uploadedFiles[doc] as File, doc)
        }
      })

      // Envio real (ajuste quando tiver o backend)
      // await fetch("/api/upload", { method: "POST", body: formData })

      router.push("/abrir-empresa/concluido") // destino final do cliente
    } catch (err) {
      console.error(err)
      setError("Erro ao enviar os documentos. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <Image
            src="/Facilitajs.svg"
            alt="Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Envio de Documentos</CardTitle>
              <CardDescription>
                Faça o upload dos documentos necessários para iniciar seu processo.
              </CardDescription>
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

              <div className="flex justify-end pt-6">
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading || Object.keys(uploadedFiles).length < requiredDocuments.length}
                >
                  {isLoading ? "Enviando..." : "Finalizar Envio"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}