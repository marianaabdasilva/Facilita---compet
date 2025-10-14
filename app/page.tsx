import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, Users, Zap, Shield, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-blue-100 shadow-lg">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-32 h-32 bg-transparent rounded-full flex items-center justify-center">
                <Image
                  src="/Facilitaj.png"
                  alt="Logo"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:bg-transparent hover:text-white"
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
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 -mt-16 items-center">
          {/* Texto lado esquerdo */}
          <div className="text-left">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Gestão Empresarial Simplificada
            </Badge>

            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Facilite seus processos de
              <span className="text-blue-600"> CNPJ</span>
            </h2>

            <p className="text-2xl text-gray-600 mb-10 max-w-2xl">
              Plataforma completa para abertura, alteração e fechamento de CNPJ.
              Upload de documentos, acompanhamento em tempo real e gestão
              centralizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Botão principal */}
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2 border-blue-600 text-blue-100 bg-blue-600 hover:text-blue-600 hover:bg-blue-100"
              >
                <Link href="/contato">Entre em Contato</Link>
              </Button>

              {/* Botão secundário transparente */}
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2 border-blue-600 text-blue-600 bg-transparent hover:text-white hover:bg-blue-100 hover:border-blue-100"
              >
                {" "}
                <Link href="/sobre">Saiba Mais </Link>
              </Button>
            </div>
          </div>

          {/* Imagem lado direito */}
          <div className="flex justify-center md:justify-end">
            <img
              src="/elementos.png"
              alt="Ilustração empresarial"
              className="max-150 w-150"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="min-h-screen flex flex-col justify-center bg-white py-16">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só lugar
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simplifique a gestão dos seus processos empresariais com nossa
              plataforma integrada
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow p-6">
              <CardHeader className="items-center">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Upload de Documentos</CardTitle>
                <CardDescription className="text-base">
                  Envie todos os documentos necessários de forma segura e
                  organizada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow p-6">
              <CardHeader className="items-center">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Processos Ágeis</CardTitle>
                <CardDescription className="text-base">
                  Abertura, alteração e fechamento de CNPJ com máxima eficiência
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow p-6">
              <CardHeader className="items-center">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Gestão de Clientes</CardTitle>
                <CardDescription className="text-base">
                  Dashboard completo para acompanhar todos os seus clientes e
                  processos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow p-6">
              <CardHeader className="items-center">
                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Segurança Total</CardTitle>
                <CardDescription className="text-base">
                  Seus dados e documentos protegidos com criptografia de ponta
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow p-6">
              <CardHeader className="items-center">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Acompanhamento</CardTitle>
                <CardDescription className="text-base">
                  Monitore o status dos processos em tempo real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow p-6">
              <CardHeader className="items-center">
                <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle className="text-xl">Multi-empresa</CardTitle>
                <CardDescription className="text-base">
                  Gerencie múltiplas empresas em uma única plataforma
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Pronto para simplificar seus processos?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já confiam no FACILITA
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <Link href="/contato">Entre em Contato</Link>
          </Button>
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
                    src="/Facilitaj.png"
                    alt="Logo da Empresa"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-gray-400">
                Simplificando a gestão empresarial no Brasil
              </p>
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
                  <Link href="/contato" className="hover:text-white">
                    Contato
                  </Link>
                </li>
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
            <p>&copy; 2025 Facilita JÁ. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
