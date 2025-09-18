import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, FileText, Users, Zap, Shield, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-blue-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Building2 className="w-7 h-7 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-white">FACILITA</h1>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-blue-700 hover:text-white">
                  Entrar
                </Button>
              </Link>
              <Link href="/abrir-empresa">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">Abrir Empresa</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">Gestão Empresarial Simplificada</Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Facilite seus processos de
            <span className="text-blue-600"> CNPJ</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
            Plataforma completa para abertura, alteração e fechamento de CNPJ. Upload de documentos, acompanhamento em
            tempo real e gestão centralizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/abrir-empresa">Começar Agora</Link>
            </Button>
            <Button size="lg" variant="outline">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Tudo que você precisa em um só lugar</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simplifique a gestão dos seus processos empresariais com nossa plataforma integrada
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Upload de Documentos</CardTitle>
                <CardDescription>Envie todos os documentos necessários de forma segura e organizada</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Processos Ágeis</CardTitle>
                <CardDescription>Abertura, alteração e fechamento de CNPJ com máxima eficiência</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Gestão de Clientes</CardTitle>
                <CardDescription>Dashboard completo para acompanhar todos os seus clientes e processos</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Segurança Total</CardTitle>
                <CardDescription>Seus dados e documentos protegidos com criptografia de ponta</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Acompanhamento</CardTitle>
                <CardDescription>Monitore o status dos processos em tempo real</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Multi-empresa</CardTitle>
                <CardDescription>Gerencie múltiplas empresas em uma única plataforma</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Pronto para simplificar seus processos?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já confiam no FACILITA
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <Link href="/abrir-empresa">Começar Gratuitamente</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">FACILITA</h4>
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
                <li>Contato</li>
                <li>FAQ</li>
                <li>Documentação</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Empresa</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre Nós</li>
                <li>Termos de Uso</li>
                <li>Privacidade</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FACILITA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
