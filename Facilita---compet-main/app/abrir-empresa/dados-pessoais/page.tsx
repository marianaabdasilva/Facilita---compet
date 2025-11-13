"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {  MapPin, Calendar, FileText, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DadosPessoaisPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const tempData = localStorage.getItem("tempUserData")
    if (!tempData) {
      router.push("/abrir-empresa/conta")
      return
    }
    setUserData(JSON.parse(tempData))
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const personalData = {
      cpf: formData.get("cpf") as string,
      rg: formData.get("rg") as string,
      birthDate: formData.get("birthDate") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
    }

    try {
      // Combinar dados da conta com dados pessoais
      const combinedData = { ...userData, ...personalData }
      localStorage.setItem("tempUserData", JSON.stringify(combinedData))
      router.push("/abrir-empresa/atividade")
    } catch (err) {
      setError("Erro ao salvar dados. Tente novamente.")
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
                  width={30}
                  height={30}
                  className="w-16 h-16 text-blue-600" />
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="text-blue-600 font-medium">Etapa 2 de 4</span>
              <span className="mx-2">•</span>
              <span>Dados Pessoais</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "50%" }} />
            </div>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Dados Pessoais</CardTitle>
              <CardDescription>Agora precisamos dos seus dados pessoais para o MEI</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="cpf" name="cpf" type="text" placeholder="000.000.000-00" className="pl-10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rg">RG *</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="rg" name="rg" type="text" placeholder="00.000.000-0" className="pl-10" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="birthDate" name="birthDate" type="date" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Rua, número, complemento"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input id="city" name="city" type="text" placeholder="Sua cidade" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input id="state" name="state" type="text" placeholder="SP" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input id="zipCode" name="zipCode" type="text" placeholder="00000-000" required />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Link href="/abrir-empresa/conta">
                    <Button type="button" variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  </Link>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Próxima Etapa"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
