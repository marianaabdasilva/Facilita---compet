"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Select from "react-select";

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
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CnaeOption {
  value: string;
  label: string;
  id_cnae: number;
}

export default function AtividadePage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

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

  // Carregar dados temporários do usuário
  useEffect(() => {
    const tempData = localStorage.getItem("tempUserData");
    if (!tempData) {
      router.push("/abrir-empresa/conta");
      return;
    }
    setUserData(JSON.parse(tempData));
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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

    const formData = new FormData(e.currentTarget);
    const activityData = {
      cnaes: selectedCnaes.map((c) => ({
        id_cnae: c.id_cnae,
        numero: c.value,
        nome: c.label,
      })),
      fantasyName: formData.get("fantasyName") as string,
      description: formData.get("description") as string,
      enderecoEmpresa: useDifferentAddress
        ? {
            cep,
            street,
            number,
            complement,
            district,
            city,
            state: stateUf,
          }
        : null,
    };

    try {
      const combinedData = { ...userData, ...activityData };
      localStorage.setItem("tempUserData", JSON.stringify(combinedData));
      router.push("/admin/generate-links");
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) return <div>Carregando...</div>;

  const filteredCnaes = allCnaes.filter((opt) => {
    const lower = opt.label.toLowerCase();
    return (
      lower.includes(cnaeSearch.toLowerCase()) || opt.value.includes(cnaeSearch)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-blue-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img
              src="/Facilitaj.png"
              alt="Logo da Empresa"
              width={20}
              height={20}
              className="w-16 h-16 text-blue-600"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
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
                Defina as atividades (CNAEs) que a empresa irá exercer
              </CardDescription>
            </CardHeader>
            <CardContent>+
              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* CNAEs */}
                <div className="space-y-2">
                  <Label htmlFor="cnaes">Atividades (CNAEs) *</Label>
                  <Select
                    isMulti
                    options={filteredCnaes}
                    value={selectedCnaes}
                    onChange={(sel) =>
                      Array.isArray(sel)
                        ? setSelectedCnaes(sel)
                        : setSelectedCnaes(sel ? [sel] : [])
                    }
                    className="z-50"
                    placeholder="Selecione uma ou mais atividades"
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

                {/* Checkbox para endereço diferente */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={useDifferentAddress}
                      onChange={(e) => setUseDifferentAddress(e.target.checked)}
                    />
                    <span>
                      A empresa não se localiza na residência do titular
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
                        required={useDifferentAddress}
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
                          required={useDifferentAddress}
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
                          required={useDifferentAddress}
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
                        required={useDifferentAddress}
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
                          required={useDifferentAddress}
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
                          required={useDifferentAddress}
                        />
                      </div>
                    </div>
                  </div>
                )}

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
    </div>
  );
}
