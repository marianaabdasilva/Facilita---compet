"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  User,
  Phone,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";

// Função para formatar telefone
function formatPhone(value: string) {
  value = value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length > 6) {
    return value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  } else if (value.length > 2) {
    return value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    return value;
  }
}

export default function CriarClienteEtapa1() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const name = formData.get("name")?.toString().trim();
      const email = formData.get("email")?.toString().trim();

      if (!name || !email || !phone) {
        setError("Preencha todos os campos obrigatórios.");
        setIsLoading(false);
        return;
      }

      const clienteData = {
        name,
        email,
        phone,
      };

      // Salvar etapa 1 no localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("clienteTemp", JSON.stringify(clienteData));
      }

      // Ir para a etapa 2
      router.push("/abrir-empresa/dados-pessoais");

    } catch (err) {
      console.error("Erro ao salvar etapa 1:", err);
      setError("Erro ao salvar os dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Botão Voltar */}
          <Link href="/admin/clients">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Clientes
            </Button>
          </Link>

          {/* Header da Página */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Criar Novo Cliente</CardTitle>
              <CardDescription>
                Cadastre as informações básicas do cliente
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Formulário */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Informações do Cliente</CardTitle>
                  <CardDescription>
                    Preencha os dados básicos do cliente
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Nome */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Nome completo"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="@email.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Telefone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          className="pl-10"
                          required
                          value={phone}
                          onChange={(e) => setPhone(formatPhone(e.target.value))}
                          maxLength={15}
                          inputMode="numeric"
                        />
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex justify-between pt-6">
                      <Link href="/admin/clients">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          Cancelar
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
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
