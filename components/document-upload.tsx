"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, File, X, CheckCircle, AlertCircle, FileText, ImageIcon, FileSpreadsheet } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "completed" | "error"
  progress: number
  url?: string
}

interface DocumentUploadProps {
  processType: string
  onFilesUploaded?: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number // in MB
}

export function DocumentUpload({ processType, onFilesUploaded, maxFiles = 10, maxSize = 10 }: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading" as const,
        progress: 0,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])
      setIsUploading(true)

      // Simulate file upload
      newFiles.forEach((file, index) => {
        const interval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, progress: Math.min(f.progress + 10, 100) } : f)),
          )
        }, 200)

        setTimeout(
          () => {
            clearInterval(interval)
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, status: "completed", progress: 100, url: `https://example.com/files/${f.id}` }
                  : f,
              ),
            )

            if (index === newFiles.length - 1) {
              setIsUploading(false)
              onFilesUploaded?.(newFiles)
            }
          },
          2000 + index * 500,
        )
      })
    },
    [onFilesUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - uploadedFiles.length,
    maxSize: maxSize * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <ImageIcon className="w-4 h-4" />
    if (type.includes("pdf")) return <FileText className="w-4 h-4" />
    if (type.includes("spreadsheet") || type.includes("excel")) return <FileSpreadsheet className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getRequiredDocuments = (processType: string) => {
    switch (processType) {
      case "Abertura de CNPJ":
        return [
          "Contrato Social",
          "RG e CPF dos sócios",
          "Comprovante de endereço da empresa",
          "Consulta de viabilidade",
          "Requerimento de empresário",
        ]
      case "Alteração Contratual":
        return [
          "Alteração contratual",
          "RG e CPF dos sócios",
          "Comprovante de endereço atualizado",
          "Última alteração registrada",
          "Certidão simplificada",
        ]
      case "Fechamento de CNPJ":
        return [
          "Distrato social",
          "Certidões negativas",
          "Balanço patrimonial",
          "Declaração de débitos",
          "Comprovante de publicação",
        ]
      default:
        return []
    }
  }

  const requiredDocs = getRequiredDocuments(processType)

  return (
    <div className="space-y-6">
      {/* Required Documents */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Documentos Necessários</CardTitle>
          <CardDescription>Para {processType.toLowerCase()}, você precisa dos seguintes documentos:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2">
            {requiredDocs.map((doc, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Upload de Documentos</CardTitle>
          <CardDescription>Arraste e solte seus arquivos aqui ou clique para selecionar</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Solte os arquivos aqui...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Arraste arquivos aqui ou <span className="text-blue-600 font-medium">clique para selecionar</span>
                </p>
                <p className="text-sm text-gray-500">
                  Suporta PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (máx. {maxSize}MB cada)
                </p>
              </div>
            )}
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-gray-900">Arquivos Enviados ({uploadedFiles.length})</h4>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {file.status === "uploading" && (
                      <div className="flex items-center space-x-2">
                        <Progress value={file.progress} className="w-20 h-2" />
                        <span className="text-xs text-gray-500">{file.progress}%</span>
                      </div>
                    )}

                    {file.status === "completed" && (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enviado
                      </Badge>
                    )}

                    {file.status === "error" && (
                      <Badge className="bg-red-100 text-red-700">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Erro
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {uploadedFiles.length > 0 && !isUploading && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Todos os arquivos foram enviados com sucesso! Nossa equipe irá analisar os documentos em breve.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
