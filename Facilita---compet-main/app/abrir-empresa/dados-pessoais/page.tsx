"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";

function isValidCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) return false;
  return true;
}

function formatCPF(value: string) {
  value = value.replace(/\D/g, "");
  return value
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
    .slice(0, 14);
}

export default function DadosPessoaisPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    const tempData = localStorage.getItem("clienteTemp");
    if (!tempData) {
      router.push("/abrir-empresa/clientes");
      return;
    }
    setUserData(JSON.parse(tempData));
  }, [router]);

  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setStreet(data.logradouro || "");
            setCity(data.localidade);
            setState(data.uf);
          } else {
            setError("CEP não encontrado.");
          }
        })
        .catch(() => setError("Erro ao buscar CEP."));
    }
  }, [cep]);

  const today = new Date();
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const getDateString = (date: Date) => date.toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const cpfValue = formData.get("cpf") as string;

    if (!isValidCPF(cpfValue)) {
      setError("CPF inválido");
      setIsLoading(false);
      return;
    }

    const birthDateValue = formData.get("birthDate") as string;
    const birthDate = new Date(birthDateValue);

    if (!birthDateValue || isNaN(birthDate.getTime())) {
      setError("Data de nascimento inválida.");
      setIsLoading(false);
      return;
    }

    if (birthDate < minDate || birthDate > maxDate) {
      setError("Apenas maiores de 18 anos");
      setIsLoading(false);
      return;
    }

    try {
      const etapa1 = userData;

      // 🔥 PAYLOAD EXATAMENTE COMO O BACKEND PEDIU
      const payload = {
        Nome: etapa1.name,
        Fone: etapa1.phone,
        gmail: etapa1.email,

        CPF: cpfValue,
        rg: formData.get("rg"),
        data_nascimento: birthDateValue,
        cep,
        cidade: city,
        estado: state,
      };

      const response = await fetch("https://projeto-back-ten.vercel.app/cadastrarcliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar cliente");
      }

      // 🔥 limpa etapa anterior
      localStorage.removeItem("clienteTemp");

      // 🔥 redireciona depois de sucesso
      router.push("/admin/clients");

    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>

        {/* MANTIVE 100% O VISUAL, NADA ALTERADO */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Dados Pessoais</CardTitle>
                <CardDescription>
                  Dados pessoais para o cadastro da empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-6" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* NENHUM ELEMENTO VISUAL FOI ALTERADO */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="cpf"
                          name="cpf"
                          type="text"
                          placeholder="000.000.000-00"
                          required
                          value={cpf}
                          onChange={(e) => setCpf(formatCPF(e.target.value))}
                          maxLength={14}
                          inputMode="numeric"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rg">RG</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="rg"
                          name="rg"
                          type="text"
                          placeholder="00.000.000-0"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        required
                        min={getDateString(minDate)}
                        max={getDateString(maxDate)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        placeholder="00000-000"
                        required
                        value={cep}
                        onChange={(e) =>
                          setCep(e.target.value.replace(/\D/g, "").slice(0, 8))
                        }
                        inputMode="numeric"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado *</Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Rua *</Label>
                      <Input
                        id="street"
                        name="street"
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number">Número *</Label>
                      <Input
                        id="number"
                        name="number"
                        type="text"
                        required
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        name="complement"
                        type="text"
                        value={complement}
                        placeholder="Opcional"
                        onChange={(e) => setComplement(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Link href="/abrir-empresa/clientes">
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
      </AdminLayout>
    </AuthGuard>
  );
}
