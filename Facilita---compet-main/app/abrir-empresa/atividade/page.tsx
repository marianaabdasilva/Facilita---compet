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
import {Store, AlertCircle, ArrowLeft, ArrowRight, Search } from "lucide-react"
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
    comercio: [
      {
        value: "4711-3/02",
        label:
          "4711-3/02 - Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - minimercados, mercearias e armazéns",
      },
      { value: "4712-1/00", label: "4712-1/00 - Comércio varejista de ferragens, madeira e materiais de construção" },
      { value: "4713-0/01", label: "4713-0/01 - Lojas de departamentos ou magazines" },
      { value: "4721-1/02", label: "4721-1/02 - Padaria e confeitaria com predominância de revenda" },
      { value: "4722-9/01", label: "4722-9/01 - Comércio varejista de carnes - açougues" },
      { value: "4723-7/00", label: "4723-7/00 - Comércio varejista de bebidas" },
      { value: "4724-5/00", label: "4724-5/00 - Comércio varejista de hortifrutigranjeiros" },
      {
        value: "4729-6/99",
        label:
          "4729-6/99 - Comércio varejista de produtos alimentícios em geral ou especializado em produtos alimentícios não especificados anteriormente",
      },
      {
        value: "4751-2/01",
        label: "4751-2/01 - Comércio varejista especializado de equipamentos e suprimentos de informática",
      },
      {
        value: "4752-1/00",
        label: "4752-1/00 - Comércio varejista especializado de equipamentos de telefonia e comunicação",
      },
      {
        value: "4753-9/00",
        label: "4753-9/00 - Comércio varejista especializado de eletrodomésticos e equipamentos de áudio e vídeo",
      },
      { value: "4754-7/01", label: "4754-7/01 - Comércio varejista de móveis" },
      { value: "4755-5/01", label: "4755-5/01 - Comércio varejista de tecidos" },
      {
        value: "4756-3/00",
        label: "4756-3/00 - Comércio varejista especializado de instrumentos musicais e acessórios",
      },
      {
        value: "4757-1/00",
        label: "4757-1/00 - Comércio varejista especializado de peças e acessórios para veículos automotores",
      },
      {
        value: "4771-7/01",
        label: "4771-7/01 - Comércio varejista de produtos farmacêuticos, sem manipulação de fórmulas",
      },
      {
        value: "4772-5/00",
        label: "4772-5/00 - Comércio varejista de cosméticos, produtos de perfumaria e de higiene pessoal",
      },
      { value: "4773-3/00", label: "4773-3/00 - Comércio varejista de artigos médicos e ortopédicos" },
      { value: "4781-4/00", label: "4781-4/00 - Comércio varejista de artigos do vestuário e acessórios" },
      { value: "4782-2/01", label: "4782-2/01 - Comércio varejista de calçados" },
      { value: "4783-1/01", label: "4783-1/01 - Comércio varejista de artigos de armarinho" },
      { value: "4784-9/00", label: "4784-9/00 - Comércio varejista de artigos de colchoaria" },
      { value: "4789-0/01", label: "4789-0/01 - Comércio varejista de suvenires, bijuterias e artesanatos" },
      { value: "4789-0/02", label: "4789-0/02 - Comércio varejista de artigos de caça, pesca e camping" },
      { value: "4789-0/03", label: "4789-0/03 - Comércio varejista de armas e munições" },
      { value: "4789-0/04", label: "4789-0/04 - Comércio varejista de artigos de joalheria" },
      { value: "4789-0/05", label: "4789-0/05 - Comércio varejista de artigos de ótica" },
      { value: "4789-0/06", label: "4789-0/06 - Comércio varejista de artigos de papelaria" },
      { value: "4789-0/07", label: "4789-0/07 - Comércio varejista de livros, jornais, revistas e papelaria" },
      { value: "4789-0/08", label: "4789-0/08 - Comércio varejista de discos, CDs, DVDs e fitas" },
      { value: "4789-0/09", label: "4789-0/09 - Comércio varejista de artigos esportivos" },
      {
        value: "4789-0/99",
        label: "4789-0/99 - Comércio varejista de outros produtos não especificados anteriormente",
      },
    ],
    servicos: [
      { value: "9602-5/01", label: "9602-5/01 - Cabeleireiros, manicure e pedicure" },
      { value: "9602-5/02", label: "9602-5/02 - Atividades de estética e outros serviços de cuidados com a beleza" },
      { value: "8230-0/01", label: "8230-0/01 - Serviços de organização de feiras, congressos, exposições e festas" },
      {
        value: "7490-1/04",
        label:
          "7490-1/04 - Atividades de intermediação e agenciamento de serviços e negócios em geral, exceto imobiliários",
      },
      { value: "9511-8/00", label: "9511-8/00 - Reparação e manutenção de computadores e de equipamentos periféricos" },
      { value: "8599-6/04", label: "8599-6/04 - Treinamento em desenvolvimento profissional e gerencial" },
      { value: "4520-0/01", label: "4520-0/01 - Serviços de manutenção e reparação mecânica de veículos automotores" },
      { value: "4520-0/02", label: "4520-0/02 - Serviços de lanternagem ou pintura de veículos automotores" },
      { value: "4520-0/03", label: "4520-0/03 - Serviços de manutenção e reparação elétrica de veículos automotores" },
      { value: "4520-0/04", label: "4520-0/04 - Serviços de alinhamento e balanceamento de veículos automotores" },
      {
        value: "4520-0/05",
        label: "4520-0/05 - Serviços de lavagem, lubrificação e enceramento de veículos automotores",
      },
      {
        value: "4530-7/01",
        label: "4530-7/01 - Comércio por atacado e a varejo de peças e acessórios para motocicletas e similares",
      },
      { value: "4530-7/02", label: "4530-7/02 - Manutenção e reparação de motocicletas e similares" },
      { value: "5611-2/01", label: "5611-2/01 - Restaurantes e similares" },
      {
        value: "5611-2/02",
        label: "5611-2/02 - Bares e outros estabelecimentos especializados em servir bebidas, sem entretenimento",
      },
      { value: "5611-2/03", label: "5611-2/03 - Lanchonetes, casas de chá, de sucos e similares" },
      {
        value: "5620-1/01",
        label: "5620-1/01 - Fornecimento de alimentos preparados preponderantemente para empresas",
      },
      { value: "5620-1/02", label: "5620-1/02 - Serviços de alimentação para eventos e recepções - bufê" },
      { value: "5620-1/03", label: "5620-1/03 - Cantinas - serviços de alimentação privativos" },
      {
        value: "5620-1/04",
        label: "5620-1/04 - Fornecimento de alimentos preparados preponderantemente para consumo domiciliar",
      },
      { value: "6201-5/01", label: "6201-5/01 - Desenvolvimento de programas de computador sob encomenda" },
      {
        value: "6202-3/00",
        label: "6202-3/00 - Desenvolvimento e licenciamento de programas de computador customizáveis",
      },
      {
        value: "6203-1/00",
        label: "6203-1/00 - Desenvolvimento e licenciamento de programas de computador não customizáveis",
      },
      { value: "6204-0/00", label: "6204-0/00 - Consultoria em tecnologia da informação" },
      {
        value: "6209-1/00",
        label: "6209-1/00 - Suporte técnico, manutenção e outros serviços em tecnologia da informação",
      },
      { value: "7319-0/02", label: "7319-0/02 - Promoção de vendas" },
      { value: "7319-0/03", label: "7319-0/03 - Marketing direto" },
      { value: "7319-0/99", label: "7319-0/99 - Outras atividades de publicidade não especificadas anteriormente" },
      { value: "7420-0/04", label: "7420-0/04 - Atividades de fotografias" },
      { value: "8511-2/00", label: "8511-2/00 - Educação infantil - creche" },
      { value: "8512-1/00", label: "8512-1/00 - Educação infantil - pré-escola" },
      { value: "8513-9/00", label: "8513-9/00 - Ensino fundamental" },
      { value: "8520-1/00", label: "8520-1/00 - Ensino médio" },
      { value: "8531-7/00", label: "8531-7/00 - Educação superior - graduação" },
      { value: "8532-5/00", label: "8532-5/00 - Educação superior - graduação e pós-graduação" },
      { value: "8541-4/00", label: "8541-4/00 - Educação profissional de nível técnico" },
      { value: "8542-2/00", label: "8542-2/00 - Educação profissional de nível tecnológico" },
      { value: "8593-7/00", label: "8593-7/00 - Ensino de idiomas" },
      { value: "8599-6/01", label: "8599-6/01 - Formação de condutores" },
      { value: "8599-6/02", label: "8599-6/02 - Cursos de pilotagem" },
      { value: "8599-6/03", label: "8599-6/03 - Treinamento em informática" },
      { value: "8599-6/05", label: "8599-6/05 - Cursos preparatórios para concursos" },
      { value: "8599-6/99", label: "8599-6/99 - Outras atividades de ensino não especificadas anteriormente" },
    ],
    industria: [
      { value: "1091-1/01", label: "1091-1/01 - Fabricação de produtos de padaria, confeitaria e pastelaria" },
      { value: "1091-1/02", label: "1091-1/02 - Fabricação de biscoitos e bolachas" },
      { value: "1412-6/01", label: "1412-6/01 - Confecção de roupas íntimas" },
      {
        value: "1412-6/02",
        label: "1412-6/02 - Confecção de peças do vestuário, exceto roupas íntimas e as confeccionadas sob medida",
      },
      { value: "1413-4/01", label: "1413-4/01 - Confecção de roupas profissionais, exceto sob medida" },
      {
        value: "1414-2/00",
        label: "1414-2/00 - Fabricação de acessórios do vestuário, exceto para segurança e proteção",
      },
      { value: "1531-9/01", label: "1531-9/01 - Curtimento e outras preparações de couro" },
      { value: "1540-8/00", label: "1540-8/00 - Fabricação de calçados de couro" },
      {
        value: "1621-8/00",
        label: "1621-8/00 - Fabricação de madeira laminada e de chapas de madeira compensada, prensada e aglomerada",
      },
      { value: "1622-6/01", label: "1622-6/01 - Fabricação de casas de madeira pré-fabricadas" },
      { value: "1622-6/02", label: "1622-6/02 - Fabricação de outros artigos de carpintaria para construção" },
      { value: "1623-4/00", label: "1623-4/00 - Fabricação de artefatos de tanoaria e de embalagens de madeira" },
      { value: "1629-3/01", label: "1629-3/01 - Fabricação de artefatos diversos de madeira, exceto móveis" },
      {
        value: "1629-3/02",
        label:
          "1629-3/02 - Fabricação de artefatos diversos de cortiça, bambu, palha, vime e outros materiais trançados, exceto móveis",
      },
      { value: "2542-2/00", label: "2542-2/00 - Fabricação de esquadrias de metal" },
      { value: "2543-1/00", label: "2543-1/00 - Fabricação de obras de caldeiraria pesada" },
      { value: "2591-8/00", label: "2591-8/00 - Fabricação de embalagens metálicas" },
      { value: "2592-6/01", label: "2592-6/01 - Fabricação de produtos de cutelaria" },
      { value: "2592-6/02", label: "2592-6/02 - Fabricação de produtos de serralheria, exceto esquadrias" },
      { value: "2593-4/00", label: "2593-4/00 - Fabricação de artigos de metal para uso doméstico e pessoal" },
      { value: "3101-2/00", label: "3101-2/00 - Fabricação de móveis com predominância de madeira" },
      { value: "3102-1/00", label: "3102-1/00 - Fabricação de móveis com predominância de metal" },
      { value: "3103-9/00", label: "3103-9/00 - Fabricação de móveis de outros materiais, exceto madeira e metal" },
      { value: "3104-7/01", label: "3104-7/01 - Fabricação de colchões" },
      {
        value: "3250-7/05",
        label:
          "3250-7/05 - Fabricação de instrumentos não eletrônicos e utensílios para uso médico, cirúrgico, odontológico e de laboratório",
      },
      { value: "3291-4/00", label: "3291-4/00 - Fabricação de escovas, pincéis e vassouras" },
      {
        value: "3292-2/01",
        label: "3292-2/01 - Fabricação de equipamentos e acessórios para segurança pessoal e profissional",
      },
      { value: "3299-0/01", label: "3299-0/01 - Fabricação de guarda-chuvas e similares" },
      { value: "3299-0/02", label: "3299-0/02 - Fabricação de canetas, lápis e outros artigos para escritório" },
      {
        value: "3299-0/03",
        label: "3299-0/03 - Fabricação de letras, letreiros e placas de qualquer material, exceto luminosos",
      },
      { value: "3299-0/04", label: "3299-0/04 - Fabricação de painéis e letreiros luminosos" },
      { value: "3299-0/05", label: "3299-0/05 - Fabricação de aviamentos para costura" },
      {
        value: "3299-0/99",
        label: "3299-0/99 - Fabricação de outros produtos diversos não especificados anteriormente",
      },
    ],
    agropecuaria: [
      { value: "0161-0/01", label: "0161-0/01 - Atividades de apoio à agricultura" },
      { value: "0162-8/01", label: "0162-8/01 - Atividades de apoio à pecuária" },
      { value: "0220-4/01", label: "0220-4/01 - Coleta de produtos florestais não madeireiros" },
      { value: "0230-1/01", label: "0230-1/01 - Aqüicultura em água doce" },
      { value: "0230-1/02", label: "0230-1/02 - Aqüicultura em água salgada e salobra" },
      { value: "0322-1/01", label: "0322-1/01 - Aqüicultura de peixes ornamentais em água doce" },
      { value: "0322-1/02", label: "0322-1/02 - Aqüicultura de peixes ornamentais em água salgada e salobra" },
      { value: "0500-3/01", label: "0500-3/01 - Extração de carvão mineral" },
      { value: "0810-0/01", label: "0810-0/01 - Extração de ardósia e beneficiamento associado" },
      { value: "0810-0/02", label: "0810-0/02 - Extração de granito e beneficiamento associado" },
      { value: "0810-0/03", label: "0810-0/03 - Extração de mármore e beneficiamento associado" },
      {
        value: "0810-0/99",
        label:
          "0810-0/99 - Extração e britamento de pedras e outros materiais para construção e beneficiamento associado",
      },
      { value: "0891-6/01", label: "0891-6/01 - Extração de argila e beneficiamento associado" },
      { value: "0892-4/01", label: "0892-4/01 - Extração de cascalho, saibro e beneficiamento associado" },
      {
        value: "0892-4/02",
        label: "0892-4/02 - Extração de areia, cascalho ou pedregulho e atividades de beneficiamento associadas",
      },
      { value: "0893-2/00", label: "0893-2/00 - Extração de sal marinho e sal-gema" },
      {
        value: "0899-1/01",
        label: "0899-1/01 - Extração de minerais para fabricação de adubos, fertilizantes e outros produtos químicos",
      },
      {
        value: "0899-1/99",
        label: "0899-1/99 - Extração de outros minerais não metálicos não especificados anteriormente",
      },
    ],
  }

  const filteredCnaes = useMemo(() => {
    if (!selectedCategory) return []

    const categoryOptions = cnaes[selectedCategory as keyof typeof cnaes] || []

    if (!cnaeSearch.trim()) return categoryOptions

    return categoryOptions.filter(
      (cnae) => cnae.label.toLowerCase().includes(cnaeSearch.toLowerCase()) || cnae.value.includes(cnaeSearch),
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
              <img src="/Facilitaj.png"
                  alt="Logo da Empresa"
                  width={20}
                  height={20}
                  className="w-16 h-16 text-blue-600" />
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
              <CardDescription>Defina o tipo de CNPJ, categoria e atividade que você irá exercer</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value)
                      setSelectedCnae("") // Reset CNAE when category changes
                      setCnaeSearch("") // Reset search when category changes
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
                      <Label htmlFor="cnae">
                        CNAE *{" "}
                        {filteredCnaes.length > 0 && (
                          <span className="text-sm text-gray-500">({filteredCnaes.length} encontrados)</span>
                        )}
                      </Label>
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

                <div className="space-y-2">
                  <Label htmlFor="fantasyName">Nome Fantasia *</Label>
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

                <div className="flex justify-between pt-6">
                  <Link href="/abrir-empresa/dados-pessoais">
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
