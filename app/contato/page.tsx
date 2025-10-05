import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-transparent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-30 h-30 bg-transparent rounded-full flex items-center justify-center">
                <Image
                  src="/Facilitaj.png"
                  alt="Logo"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-white bg-blue-600 hover:bg-transparent hover:text-blue-600">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Contact Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-600 mb-8">Entre em Contato</h2>
              <p className="text-xl text-gray-600">
                Estamos aqui para ajudar você a simplificar seus processos empresariais
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Contact Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Envie sua mensagem</CardTitle>
                  <CardDescription>Preencha o formulário e entraremos em contato em breve</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" placeholder="Seu nome" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" type="tel" placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea id="message" placeholder="Como podemos ajudar?" rows={5} />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Informações de Contato */}
              <div className="space-y-6">
                {/* Horário de Atendimento */}
                <Card className="shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Horário de Atendimento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-100">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-blue-100">Sábado: 9h às 13h</p>
                    <p className="text-blue-100 mt-2">Respondemos em até 24 horas úteis</p>
                  </CardContent>
                </Card>

                {/* WhatsApp */}
                <Card className="shadow-lg border-2 border-green-500 bg-gradient-to-br from-green-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-700">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Contato Principal - WhatsApp
                    </CardTitle>
                    <CardDescription>Nossa forma preferencial de atendimento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                          <p className="text-green-700 font-medium">(11) 99999-9999</p>
                        </div>
                      </div>
                    </div>
                    <a
                      href="https://wa.me/5511999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Iniciar Conversa no WhatsApp
                      </Button>
                    </a>
                    <p className="text-sm text-gray-600 text-center">
                      Atendimento rápido e direto pelo WhatsApp
                    </p>
                  </CardContent>
                </Card>

                {/* Outras formas de contato */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Outras Formas de Contato</CardTitle>
                    <CardDescription>Canais alternativos de comunicação</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">E-mail</h4>
                        <p className="text-gray-600">contato@facilita.com.br</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Telefone</h4>
                        <p className="text-gray-600">(11) 3000-0000</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Endereço</h4>
                        <p className="text-gray-600">São Paulo, SP - Brasil</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
