"use client"

import type React from "react"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateClientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Creating client:", formData)

    // Redirect back to clients page
    router.push("/admin/clients")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Back Button */}
          <Link href="/admin/clients">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Clientes
            </Button>
          </Link>

          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Criar Novo Cliente</h1>
            <p className="text-gray-600 mt-1">Cadastre um novo cliente no sistema</p>
          </div>

          {/* Form Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>Preencha os dados básicos do cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Digite o nome completo do cliente"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="cliente@exemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Telefone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Criando..." : "Criar Cliente"}
                  </Button>
                  <Link href="/admin/clients" className="flex-1">
                    <Button type="button" variant="outline" className="w-full bg-transparent">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
