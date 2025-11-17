import axios from "axios";

// ==============================
// 🔥 Instância única do Axios
// ==============================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://projeto-back-ten.vercel.app",
  timeout: 15000,
});

// 🔥 Aplica token automaticamente
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ==============================
// 🔥 Tipagens
// ==============================
export interface Processo {
  id_processo: number;
  id_cliente: number;
  id_cnpj: number;
  id_tipo_processo: number;
  data_atualizacao: string;
  geracao_link_id: number;
  tipo: string;
  data_expiracao: string;
  status_link: string;
}

export async function getTiposDeProcesso() {
  try {
    const { data } = await api.get<Processo | Processo[]>("/qtd-tiposProcesso");

    // 🔥 garante que sempre será uma lista
    const lista: Processo[] = Array.isArray(data) ? data : [data];

    const contador: Record<string, number> = {};

    lista.forEach((p) => {
      const tipo = p.tipo || "Não Informado";
      contador[tipo] = (contador[tipo] || 0) + 1;
    });

    const total = Object.values(contador).reduce((a, b) => a + b, 0);

    return Object.entries(contador).map(([tipo, quantidade]) => ({
      tipo,
      quantidade,
      percentual: Number(((quantidade / total) * 100).toFixed(2)),
    }));
  } catch (error) {
    console.error("Erro ao buscar tipos de processo:", error);
    return [];
  }
}
