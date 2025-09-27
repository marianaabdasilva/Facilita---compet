"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, AlertCircle, ArrowLeft, ArrowRight, Search } from "lucide-react"
import Link from "next/link"

export default function AtividadePage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [selectedCnpjType, setSelectedCnpjType] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCnae, setSelectedCnae] = useState("")
  const [cnaeSearch, setCnaeSearch] = useState("")

  const cnpjTypes = [
    { value: "mei", label: "MEI - Microempreendedor Individual" },
    { value: "me", label: "ME - Microempresa" },
    { value: "epp", label: "EPP - Empresa de Pequeno Porte" },
  ]

  const categories = [
    { value: "comercio", label: "Comércio" },
    { value: "servicos", label: "Serviços" },
    { value: "industria", label: "Indústria" },
    { value: "agropecuaria", label: "Agropecuária" },
  ]

  const cnaes = {
    comercio: [{ value: "4711-3/02", label: "4711-3/02 - Comércio varejista de mercadorias em geral" }],
    servicos: [{ value: "9602-5/01", label: "9602-5/01 - Cabeleireiros, manicure e pedicure" }],
    industria: [{ value: "1091-1/01", label: "1091-1/01 - Fabricação de produtos de padaria" }],
    agropecuaria: [{ value: "0161-0/01", label: "0161-0/01 - Atividades de apoio à agricultura" }],
  }

  const filteredCnaes = useMemo(() => {
    if (!selectedCategory) return []
    const categoryOptions = cnaes[selectedCategory as keyof typeof cnaes] || []
    if (!cnaeSearch.trim()) return categoryOptions
    return categoryOptions.filter(
      (cnae) =>
        cnae.label.toLowerCase().includes(cnaeSearch.toLowerCase()) ||
        cnae.value.includes(cnaeSearch),
    )
  }, [selectedCategory, cnaeSearch])

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
    const activityData = {
      cnpjType: selectedCnpjType,
      category: selectedCategory,
      cnae: selectedCnae,
      fantasyName: formData.get("fantasyName") as string,
      description: formData.get("description") as string,
      address: formData.get("address") || "",
      district: formData.get("district") || "",
      city: formData.get("city") || "",
      state: formData.get("state") || "",
      cep: formData.get("cep") || "",
    }

    if (!selectedCnpjType || !selectedCategory || !selectedCnae) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    try {
      const combinedData = { ...userData, ...activityData }
      localStorage.setItem("tempUserData", JSON.stringify(combinedData))
      router.push("/abrir-empresa/documentos")
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
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img
              src="/Facilitaj.png"
              alt="Logo da Empresa"
              width={20}
              height={20}
              className="w-16 h-16 text-blue-600"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="text-blue-600 font-medium">Etapa 3 de 4</span>
              <span className="mx-2">•</span>
              <span>Atividade</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }} />
            </div>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Atividade da Empresa</CardTitle>
              <CardDescription>
                Defina o tipo de CNPJ, categoria e atividade que você irá exercer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de CNPJ */}
                <div className="space-y-2">
                  <Label htmlFor="cnpjType">Tipo de CNPJ *</Label>
                  <Select value={selectedCnpjType} onValueChange={setSelectedCnpjType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de CNPJ" />
                    </SelectTrigger>
                    <SelectContent>
                      {cnpjTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value)
                      setSelectedCnae("")
                      setCnaeSearch("")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria da atividade" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* CNAE */}
                {selectedCategory && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cnaeSearch">Pesquisar CNAE</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="cnaeSearch"
                          type="text"
                          placeholder="Digite para pesquisar atividades..."
                          className="pl-10"
                          value={cnaeSearch}
                          onChange={(e) => setCnaeSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="cnae">CNAE *</Label>
                        {filteredCnaes.length > 0 && (
                          <span className="text-sm text-gray-500">
                            ({filteredCnaes.length} encontrados)
                          </span>
                        )}
                      </div>
                      <Select value={selectedCnae} onValueChange={setSelectedCnae}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o código CNAE" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {filteredCnaes.length > 0 ? (
                            filteredCnaes.map((cnae) => (
                              <SelectItem key={cnae.value} value={cnae.value}>
                                {cnae.label}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1 text-sm text-gray-500">
                              {cnaeSearch ? "Nenhum CNAE encontrado" : "Digite para pesquisar"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Nome Fantasia */}
                <div className="space-y-2">
                  <Label htmlFor="fantasyName">Nome da Empresa*</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fantasyName"
                      name="fantasyName"
                      type="text"
                      placeholder="Nome da sua empresa"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Endereço (opcional) */}
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Endereço (da empresa, caso haja)
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input id="address" name="address" type="text" placeholder="Rua, número e complemento" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">Bairro</Label>
                      <Input id="district" name="district" type="text" placeholder="Digite o bairro" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" name="city" type="text" placeholder="Digite a cidade" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" name="state" type="text" placeholder="Ex: SP" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" name="cep" type="text" placeholder="Digite o CEP" />
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Atividade</Label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Descreva brevemente a atividade que você irá exercer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-between pt-6">
                  <Link href="/abrir-empresa/dados-pessoais">
                    <Button type="button" variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
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
