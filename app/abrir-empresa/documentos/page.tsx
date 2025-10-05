"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, FileText, RefreshCw } from "lucide-react"
import documents from "@/lib/documents" 

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editing, setEditing] = useState<{ id: number; nome: string } | null>(null)

  // Busca os documentos existentes
  const fetchDocumentos = async () => {
    try {
      setLoading(true)
      const res = await documents.get("/documentos")
      setDocumentos(res.data)
    } catch (err) {
      setError("Erro ao carregar tipos de documentos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocumentos()
  }, [])

  // Atualiza nome do documento via PATCH
  const handleUpdate = async (id: number, novoNome: string) => {
    try {
      setError(null)
      setSuccess(null)
      await documents.patch(`/documentos`, { nome: novoNome })
      setSuccess("Tipo de documento atualizado com sucesso!")
      setEditing(null)
      fetchDocumentos()
    } catch (err) {
      setError("Erro ao atualizar tipo de documento.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin w-6 h-6 text-blue-500" />
        <span className="ml-2 text-gray-700">Carregando documentos...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Gerenciar Tipos de Documentos</CardTitle>
            <CardDescription>Atualize as informações dos documentos cadastrados no sistema</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {documentos.length === 0 ? (
              <p className="text-gray-600 text-center">Nenhum tipo de documento encontrado.</p>
            ) : (
              documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-lg p-4 flex items-center justify-between bg-white shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    {editing?.id === doc.id ? (
                      <Input
                        value={editing?.nome || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditing((prev) => prev ? { ...prev, nome: e.target.value }: prev )
                        }
                        className="w-64"
                      />
                    ) : (
                      <span className="font-medium">{doc.nome}</span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {editing?.id === doc.id ? (
                      <>
                        <Button
                          onClick={() => {
                            if (editing) handleUpdate(doc.id, editing.nome)}}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          Salvar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(null)}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing({ id: doc.id, nome: doc.nome })}
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
