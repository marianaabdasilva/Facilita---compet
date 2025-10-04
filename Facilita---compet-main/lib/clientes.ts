import axios from "axios";

// Buscar todos os clientes do usuário autenticado
export async function getClientes() {
  const res = await axios.get("/clientes");
  return res.data;
}
