"use client"

import { CheckCircle, FileText, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DocumentosEnviadosPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center px-4">
      <Card className="shadow-lg border-0 max-w-md w-full bg-white text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Documentos enviados com sucesso!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-gray-600">
          <p>
            Seus documentos foram enviados com sucesso e estão sendo analisados.
            Você receberá uma notificação assim que forem processados.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
