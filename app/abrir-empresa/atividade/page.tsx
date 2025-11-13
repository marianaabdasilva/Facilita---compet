"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Select, { SingleValue, MultiValue } from "react-select";
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
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";

interface CnaeOption {
  value: string;
  label: string;
  id_cnae: number;
}

interface ClientesOption {
  value: string;
  label: string;
  id_cliente: number;
}

export default function AtividadePage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Clientes
  const [allClientes, setAllClientes] = useState<ClientesOption[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientesOption | null>(
    null
  );

  // CNAEs
  const [allCnaes, setAllCnaes] = useState<CnaeOption[]>([]);
  const [cnaeSearch, setCnaeSearch] = useState("");
  const [selectedCnaes, setSelectedCnaes] = useState<CnaeOption[]>([]);

  // Endereço
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [stateUf, setStateUf] = useState("");

  // Buscar clientes
  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get(
        "https://projeto-back-ten.vercel.app/clientes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: Array<{ id_cliente: number; nome: string }> = resp.data;

      setAllClientes(
        data.map((c) => ({
          value: String(c.id_cliente),
          label: c.nome,
          id_cliente: c.id_cliente,
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  // Buscar CNAEs
  const fetchCnaes = async () => {
    try {
      const resp = await axios.get("https://projeto-back-ten.vercel.app/cnae");
      const data: Array<{ id_cnae: number; nome: string; numero: string }> =
        resp.data;
      const opts: CnaeOption[] = data.map((c) => ({
        value: c.numero,
        label: `${c.numero} — ${c.nome}`,
        id_cnae: c.id_cnae,
      }));
      setAllCnaes(opts);
    } catch (err) {
      console.error("Erro ao buscar CNAEs:", err);
    }
  };

  useEffect(() => {
    fetchCnaes();
    fetchClientes();
  }, []);

  // Buscar endereço pelo CEP
  const fetchAddressByCep = async (cepParam: string) => {
    const digits = cepParam.replace(/\D/g, "");
    if (digits.length !== 8) return;

    try {
      const resp = await axios.get(`https://viacep.com.br/ws/${digits}/json/`);
      if (resp.data) {
        const d = resp.data;
        setStreet(d.logradouro || "");
        setDistrict(d.bairro || "");
        setCity(d.localidade || "");
        setStateUf(d.uf || "");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  };

  useEffect(() => {
    if (cep.replace(/\D/g, "").length === 8 && useDifferentAddress) {
      fetchAddressByCep(cep);
    }
  }, [cep, useDifferentAddress]);

  // Cria um CNPJ fictício (simulando retorno da API)
  const createFakeCnpj = () => {
    // Gera um CNPJ aleatório
    const fakeCnpjNumber = Math.floor(Math.random() * 90000000000000 + 10000000000000)
      .toString()
      .padStart(14, "0");

    // Simula um objeto retornado pela API
    return {
      id_cnpj: Math.floor(Math.random() * 10000),
      numero: fakeCnpjNumber,
      criadoEm: new Date().toISOString(),
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!selectedClient) {
      setError("Por favor, selecione um cliente.");
      setIsLoading(false);
      return;
    }

    if (selectedCnaes.length === 0) {
      setError("Por favor, selecione pelo menos uma atividade (CNAE).");
      setIsLoading(false);
      return;
    }

    if (useDifferentAddress) {
      if (!cep || !street || !number || !district || !city || !stateUf) {
        setError("Preencha todos os campos de endereço da empresa.");
        setIsLoading(false);
        return;
      }
    }

    try {
      // 🔹 Cria CNPJ fictício
      const fakeCnpj = createFakeCnpj();

      // 🔹 Associa o CNPJ ao cliente
      const token = localStorage.getItem("token");
      await axios.post(
        `https://projeto-back-ten.vercel.app/adicionarcnpjcliente/${selectedClient.id_cliente}`,
        { cnpj_id: fakeCnpj.id_cnpj },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔹 Salva os dados localmente
      const formData = new FormData(e.currentTarget);
      const activityData = {
        cliente: selectedClient,
        cnaes: selectedCnaes.map((c) => ({
          id_cnae: c.id_cnae,
          numero: c.value,
          nome: c.label,
        })),
        cnpj: fakeCnpj,
        fantasyName: formData.get("fantasyName") as string,
        description: formData.get("description") as string,
        enderecoEmpresa: useDifferentAddress
          ? { cep, street, number, complement, district, city, state: stateUf }
          : null,
      };

      localStorage.setItem("tempUserData", JSON.stringify(activityData));

      setIsSuccess(true);
      setTimeout(() => router.push("/admin/generate-links"), 2000);
    } catch (err) {
      console.error(err);
      setError("Erro ao criar ou associar o CNPJ fictício.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCnaes = allCnaes.filter((opt) => {
    const lower = opt.label.toLowerCase();
    return lower.includes(cnaeSearch.toLowerCase()) || opt.value.includes(cnaeSearch);
  });

  const handleSelectChange = (
    sel: SingleValue<CnaeOption> | MultiValue<CnaeOption> | null
  ) => setSelectedCnaes(Array.isArray(sel) ? [...sel] : sel ? [sel] : []);

  const handleClientChange = (sel: SingleValue<ClientesOption> | null) =>
    setSelectedClient(sel);

  // Card de sucesso
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center px-4">
        <Card className="shadow-lg border-0 max-w-md w-full bg-white text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Empresa criada com sucesso!
            </CardTitle>
            <CardDescription>
              Você será redirecionado em instantes...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled className="mt-4 w-full">
              Redirecionando...
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Barra de progresso */}
            <div className="mb-8">
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="text-blue-600 font-medium">Etapa 3 de 4</span>
                <span className="mx-2">•</span>
                <span>Atividade</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "75%" }}
                />
              </div>
            </div>

            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Atividade da Empresa</CardTitle>
                <CardDescription>
                  Defina o cliente e as atividades (CNAEs) da empresa
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert className="mb-6" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* CLIENTE */}
                  <div className="space-y-2">
                    <Label htmlFor="cliente">Selecione o Cliente responsável pela Empresa *</Label>
                    <Select
                      options={allClientes}
                      value={selectedClient}
                      onChange={handleClientChange}
                      placeholder="Selecione um cliente"
                      className="z-50"
                    />
                  </div>

                  {/* Nome Fantasia */}
                  <div className="space-y-2">
                    <Label htmlFor="fantasyName">Nome da Empresa *</Label>
                    <Input
                      id="fantasyName"
                      name="fantasyName"
                      type="text"
                      placeholder="Nome da sua empresa"
                      required
                    />
                  </div>

                  {/* CNPJ */}
                  <div className="space-y-2">
                    <Label htmlFor="CNPJ">CNPJ da Empresa *</Label>
                    <Input
                      id="CNPJ"
                      name="CNPJ"
                      type="text"
                      placeholder="Número do CNPJ"
                      required
                    />
                  </div>

                  {/* CNAEs */}
                  <div className="space-y-2">
                    <Label htmlFor="cnaes">Atividades (CNAEs) *</Label>
                    <Select
                      isMulti
                      options={filteredCnaes}
                      value={selectedCnaes}
                      onChange={handleSelectChange}
                      className="z-50"
                      placeholder="Selecione uma ou mais atividades"
                    />
                  </div>

                  {/* Descrição */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição da Atividade</Label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Descreva brevemente a atividade"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  {/* Checkbox endereço diferente */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={useDifferentAddress}
                        onChange={(e) => setUseDifferentAddress(e.target.checked)}
                      />
                      <span>
                        A empresa não se localiza na residência do cliente
                      </span>
                    </label>
                  </div>

                  {/* Endereço */}
                  {useDifferentAddress && (
                    <div className="mt-6 border-t pt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Endereço da Empresa
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP *</Label>
                        <Input
                          id="cep"
                          type="text"
                          placeholder="Digite o CEP"
                          value={cep}
                          onChange={(e) => setCep(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="street">Rua *</Label>
                          <Input
                            id="street"
                            type="text"
                            placeholder="Rua"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="number">Número *</Label>
                          <Input
                            id="number"
                            type="text"
                            placeholder="Número"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          type="text"
                          placeholder="Apto, Bloco, Sala..."
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">Bairro *</Label>
                        <Input
                          id="district"
                          type="text"
                          placeholder="Bairro"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade *</Label>
                          <Input
                            id="city"
                            type="text"
                            placeholder="Cidade"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">Estado (UF) *</Label>
                          <Input
                            id="state"
                            type="text"
                            placeholder="SP, RJ..."
                            value={stateUf}
                            onChange={(e) => setStateUf(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botões */}
                  <div className="flex justify-between pt-6">
                    <Link href="/abrir-empresa/dados-pessoais">
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
