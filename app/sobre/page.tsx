import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Target, Users, Zap, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-blue-100"> 
  {/* Header */}
  <header className="bg-transparent">
    <div className="container mx-auto px-4 py-1">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link href = "/" className="Back">
          <div className="w-32 h-32 bg-transparent rounded-full flex items-center justify-center">
            <Image
              src="/Facilitajs.svg"
              alt="Logo"
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" className="text-blue-600 hover:text-white hover:bg-blue-100">
              Voltar ao Início
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="ghost"
              className="px-6 py-2 border-2 border-blue-600 text-white bg-blue-600 hover:text-blue-600 hover:bg-blue-100"
            >
              Entrar
            </Button>
          </Link>
        
        </div>
      </div>
    </div>
  </header>

{/* Hero Section */}
<section className="min-h-screen flex items-center bg-blue-100">
  <div className="container mx-auto px-8 grid md:grid-cols-2 gap-14 items-center">
    
    {/* Texts Left */}
    <div className="text-left">
      <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
        Sobre o Projeto
      </Badge>
      <h2 className="text-6xl font-bold text-gray-900 mb-6 text-balance leading-tight">
        Conheça o <span className="text-blue-600">FACILITA JÁ</span>
      </h2>
      <p className="text-2xl text-gray-600 mb-24 max-w-1xl text-pretty">
        Uma plataforma inovadora criada para revolucionar a gestão de processos empresariais no Brasil,
        tornando a abertura, alteração e fechamento de CNPJ mais simples e eficiente.
      </p>
    </div>

    {/* Image Right */}
    <div className="flex justify-center md:justify-end">
      <Image
        src="/mesa.png"
        alt="Mesa de escritório"
        width={500}
        height={500}
        className="max-140 w-140"
      />
    </div>
  </div>
</section>


      {/* Mission Section */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-10">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">Nossa Missão</h3>
              <p className="text-gray-600 text-lg mb-3">
                Simplificar e democratizar o acesso aos processos empresariais no Brasil, oferecendo uma plataforma
                digital completa que elimina a burocracia desnecessária e acelera a formalização de negócios.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-5" />
                  <span className="text-gray-700">Processos 100% digitais</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-5" />
                  <span className="text-gray-700">Acompanhamento em tempo real</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-5" />
                  <span className="text-gray-700">Suporte especializado</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                  <div className="text-sm text-gray-600">Empresas Atendidas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                  <div className="text-sm text-gray-600">Taxa de Sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
                  <div className="text-sm text-gray-600">Dias Médios</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Suporte Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Um processo simples e transparente para cuidar de todos os seus processos empresariais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Cadastro e Documentos</h4>
              <p className="text-gray-600">
                Faça seu cadastro na plataforma e envie todos os documentos necessários de forma segura
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Processamento</h4>
              <p className="text-gray-600">
                Nossa equipe especializada cuida de todo o processo junto aos órgãos competentes
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Conclusão</h4>
              <p className="text-gray-600">Receba todos os documentos da sua empresa e comece a operar legalmente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Recursos da Plataforma</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tecnologia de ponta para oferecer a melhor experiência em gestão empresarial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Segurança Avançada</CardTitle>
                <CardDescription>
                  Criptografia de ponta a ponta, certificados SSL e conformidade com a LGPD para proteger seus dados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Automação Inteligente</CardTitle>
                <CardDescription>
                  Processos automatizados que reduzem o tempo de abertura de empresa de meses para dias
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Suporte Especializado</CardTitle>
                <CardDescription>
                  Equipe de contadores e advogados especializados disponível para esclarecer dúvidas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Acompanhamento Real-time</CardTitle>
                <CardDescription>
                  Dashboard completo para monitorar cada etapa do processo em tempo real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Multi-empresa</CardTitle>
                <CardDescription>
                  Gerencie múltiplas empresas e processos em uma única plataforma integrada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Conformidade Total</CardTitle>
                <CardDescription>
                  Garantia de conformidade com todas as exigências legais e regulamentações vigentes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nossa Equipe</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profissionais experientes dedicados a simplificar seus processos empresariais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Contadores Especializados</h4>
                <p className="text-gray-600">
                  Profissionais com mais de 10 anos de experiência em abertura e gestão empresarial
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Advogados Empresariais</h4>
                <p className="text-gray-600">
                  Especialistas em direito empresarial para garantir conformidade legal total
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Desenvolvedores</h4>
                <p className="text-gray-600">
                  Equipe técnica focada em criar a melhor experiência digital para nossos usuários
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Pronto para começar?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empreendedores que já confiam no FACILITA para seus processos empresariais
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Fazer login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contato">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Entre em contato
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-20 h-20 bg-white rounded-full relative flex items-center justify-center">
                  <Image
                    src="/Facilitajs.svg"
                    alt="Logo da Empresa"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-gray-400">Simplificando a gestão empresarial no Brasil</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Serviços</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Abertura de CNPJ</li>
                <li>Alteração de CNPJ</li>
                <li>Fechamento de CNPJ</li>
                <li>Consultoria</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Suporte</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>
                  <Link href="/contato">Contato
                  </Link>
                  </li>
                <li>FAQ</li>
                <li>Documentação</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Empresa</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/sobre">Sobre Nós</Link>
                </li>
                <li>Termos de Uso</li>
                <li>Privacidade</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FACILITA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
