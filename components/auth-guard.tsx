"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button"; // Importe o Button do Shadcn

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: "client" | "admin";
  fallback?: ReactNode;
}

export function AuthGuard({
  children,
  requiredRole,
  fallback,
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 🔹 Redireciona para a página de login se o usuário não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // 🔹 Lógica para o botão de Logout
  const handleLogout = async () => {
    await logout(); // Chama o logout
    router.push("/"); // Redireciona para a página inicial (ou página de login)
  };

  // 🔹 Carregando
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🔹 Verifica se o usuário está autenticado e possui a permissão necessária
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
          {/* Botão de Logout visível quando não tem permissão */}
          <Button
            onClick={handleLogout}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-lg py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            disabled={isLoading} // Desabilita o botão durante o carregamento
          >
            Sair
          </Button>
        </div>
      </div>
    );
  }

  // 🔹 Conteúdo protegido (se o usuário tiver acesso)
  return <>{children}</>;
}
