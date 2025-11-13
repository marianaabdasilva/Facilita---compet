import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Building2, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-blue-100 text-gray-800">
      {/* Header */}
      <header className="bg-transparent">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center md:justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center space-x-3">
            <div className="w-32 h-32 md:w-24 md:h-24 bg-transparent rounded-full flex items-center justify-center">
              <Image
                src="/Facilitajs.svg"
                alt="Logo"
                width={128}
                height={128}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Botões - aparecem no topo só no desktop */}
          <div className="hidden md:flex items-center space-x-3">
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
      </header>

      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center md:text-left md:grid md:grid-cols-2 gap-10 container mx-auto px-6 md:px-8">
        {/* Texto à esquerda */}
        <div>
          <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">
            Sobre o Projeto
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Conheça o <span className="text-blue-600">FACILITA JÁ</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
            Uma plataforma inovadora criada para revolucionar a gestão de processos empresariais no Brasil,
            tornando a abertura, alteração e fechamento de CNPJ mais simples e eficiente.
          </p>

          {/* Botões - aparecem abaixo do texto no mobile */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:hidden">
            <Link href="/">
              <Button variant="ghost" className="text-blue-600 hover:text-white hover:bg-blue-100 w-full sm:w-auto">
                Voltar ao Início
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="ghost"
                className="px-6 py-2 border-2 border-blue-600 text-white bg-blue-600 hover:text-blue-600 hover:bg-blue-100 w-full sm:w-auto"
              >
                Entrar
              </Button>
            </Link>
          </div>
        </div>

        {/* Imagem - oculta no mobile */}
        <div className="hidden md:flex justify-center md:justify-end w-full">
          <Image
            src="/mesa.png"
            alt="Mesa de escritório"
            width={500}
            height={500}
            className="w-3/4 max-w-md lg:max-w-lg object-contain drop-shadow-lg"
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-8">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Nossa Missão</h3>
              <p className="text-gray-600 text-base md:text-lg mb-4">
                Simplificar e democratizar o acesso aos processos empresariais no Brasil, oferecendo uma plataforma
                digital completa que elimina a burocracia desnecessária e acelera a formalização de negócios.
              </p>
              <div className="space-y-3">
                {[
                  "Processos 100% digitais",
                  "Acompanhamento em tempo real",
                  "Suporte especializado",
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-blue-600 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Numbers */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-10">
              <div className="grid grid-cols-2 gap-6 text-center">
                {[
                  { num: "1000+", label: "Empresas Atendidas" },
                  { num: "98%", label: "Taxa de Sucesso" },
                  { num: "15", label: "Dias Médios" },
                  { num: "24/7", label: "Suporte Online" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{item.num}</div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 text-center">
        <div className="container mx-auto px-6 md:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Como Funciona</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Um processo simples e transparente para cuidar de todos os seus processos empresariais
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Cadastro e Documentos",
                desc: "Faça seu cadastro e envie todos os documentos necessários de forma segura",
              },
              {
                num: "2",
                title: "Processamento",
                desc: "Nossa equipe especializada cuida de todo o processo junto aos órgãos competentes",
              },
              {
                num: "3",
                title: "Conclusão",
                desc: "Receba todos os documentos da sua empresa e comece a operar legalmente",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{item.num}</span>
                </div>
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para começar?</h3>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
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
                className="border-white text-blue-600 hover:bg-white hover:text-blue-600"
              >
                Entre em contato
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <div className="flex justify-center md:justify-start items-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full relative flex items-center justify-center">
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
              <h5 className="font-semibold mb-3">Serviços</h5>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li>Abertura de CNPJ</li>
                <li>Alteração de CNPJ</li>
                <li>Fechamento de CNPJ</li>
                <li>Consultoria</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Suporte</h5>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li>Central de Ajuda</li>
                <li><Link href="/contato">Contato</Link></li>
                <li>FAQ</li>
                <li>Documentação</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Empresa</h5>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><Link href="/sobre">Sobre Nós</Link></li>
                <li>Termos de Uso</li>
                <li>Privacidade</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2025 FACILITA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
