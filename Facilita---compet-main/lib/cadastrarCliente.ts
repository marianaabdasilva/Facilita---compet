import axios from "axios";

export type RouterLike = { push: (url: string) => void };

export interface SubmitClienteOptions {
  setError: (msg: string) => void;
  setIsLoading: (v: boolean) => void;
  userData?: Record<string, any>;
  address: {
    street: string;
    number: string | number;
    complement?: string;
    city: string;
    state: string;
    cep: string;
  };
  router?: RouterLike;
  apiBase?: string;
  isValidCPF?: (cpf: string) => boolean;
}

function defaultIsValidCPF(cpf: string) {
  const cleaned = (cpf || "").replace(/[\D]/g, "");
  if (!cleaned || cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const calc = (t: number) => {
    let sum = 0;
    for (let i = 0; i < t; i++) sum += parseInt(cleaned[i]) * (t + 1 - i);
    const v = (sum * 10) % 11;
    return v === 10 ? 0 : v;
  };

  return calc(9) === parseInt(cleaned[9]) && calc(10) === parseInt(cleaned[10]);
}

export async function submitClienteFromFormData(
  formData: FormData,
  opts: SubmitClienteOptions
) {
  const {
    setError,
    setIsLoading,
    userData = {},
    address,
    router,
    apiBase,
    isValidCPF = defaultIsValidCPF,
  } = opts;

  setError("");
  setIsLoading(true);

  const cpfValue = String(formData.get("cpf") || "").trim();

  if (!isValidCPF(cpfValue)) {
    setError("CPF inválido");
    setIsLoading(false);
    return;
  }

  const birthDateValue = String(formData.get("birthDate") || "").trim();
  const birthDate = new Date(birthDateValue);

  if (!birthDateValue || isNaN(birthDate.getTime())) {
    setError("Data de nascimento inválida.");
    setIsLoading(false);
    return;
  }

  // Ajustar nomes para o backend
  const payload = {
    Nome: userData.name,
    Fone: userData.phone,
    gmail: userData.email,

    CPF: cpfValue,
    rg: String(formData.get("rg") || "").trim(),
    data_nascimento: birthDateValue,

    cep: address.cep,
    cidade: address.city,
    estado: address.state,
  };

  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    const base = apiBase || process.env.NEXT_PUBLIC_API_BASE || "";
    const url = base.endsWith("/")
      ? `${base}cadastrarcliente`
      : `${base}/cadastrarcliente`;

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("tempUserData");
    }

    if (router) router.push("/admin/clients");

    return response.data;
  } catch (err: any) {
    console.error("Erro completo:", err?.response?.data || err?.message);
    setError(err?.response?.data?.error || "Erro ao cadastrar cliente.");
    throw err;
  } finally {
    setIsLoading(false);
  }
}
