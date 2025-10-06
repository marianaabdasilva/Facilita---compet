"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { EmployeeLayout } from "@/components/employee-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Clock, AlertCircle, CheckCircle, Search } from "lucide-react";
import process from "@/lib/process";

interface Processo {
  id: number;
  tipo: string;
  status: string;
}

export default function EmployeeProcessesPage() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Carregar processos ao montar o componente (Buscar processos)
  const carregarProcessos = async () => {
    try {
      setLoading(true);
      const res = await process.get("/tipos-processo");
      setProcessos(res.data);
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status
  const atualizarStatus = async (id: number, novoTipo: string) => {
    try {
      setUpdatingId(id);
      const res = await process.patch(`/tipos-processo/${id}`, { tipo: novoTipo });

      if (res.status === 200) {
        alert("Status atualizado com sucesso!");
        setProcessos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, tipo: novoTipo } : p))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do processo");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    carregarProcessos();
  }, []);

  // Função para determinar a cor do badge com base no tipo
  const getStatusColor = (tipo: string) => {
    switch (tipo) {
      case "aberto":
        return "bg-green-100 text-green-700";
      case "andamento":
        return "bg-blue-100 text-blue-700";
      case "concluido":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // Renderização do componente
  return (
    <AuthGuard requiredRole="employee">
      <EmployeeLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tipos de Processo</h1>
            <p className="text-gray-600 mt-1">Gerencie o status de cada tipo de processo</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <Input placeholder="Buscar tipos de processo..." className="flex-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Tipos de Processo</CardTitle>
              <CardDescription>Atualize o status diretamente</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Carregando...</p>
              ) : (
                <div className="space-y-4">
                  {processos.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">ID: {p.id}</h3>
                        <p className="text-sm text-gray-600 mt-1">Tipo: {p.tipo}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(p.tipo)}>{p.tipo}</Badge>
                        <Button
                          size="sm"
                          onClick={() => atualizarStatus(p.id, "aberto")}
                          disabled={updatingId === p.id}
                        >
                          {updatingId === p.id ? "Atualizando..." : "Abrir"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </EmployeeLayout>
    </AuthGuard>
  );
}
