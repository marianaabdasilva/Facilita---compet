import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-50 h-50 bg-transparent rounded-full flex items-center justify-center">
            <Image
              src="/Facilitajs.svg"
              alt="Logo"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </div>

        {/* 404 Message */}
        <div className="mb-8">
          <h2 className="text-8xl font-bold text-blue-600 mb-4">404</h2>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            Página não encontrada
          </h3>
          <p className="text-gray-600 text-pretty">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Back to Home Button */}
        <Link href="/">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Home className="w-5 h-5 mr-2" />
            Voltar à Tela Inicial
          </Button>
        </Link>
      </div>
    </div>
  )
}

