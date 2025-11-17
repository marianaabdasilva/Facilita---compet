import axios from "axios"

// URL base da sua API (ajuste conforme o ambiente)
const baseURL = "https://projeto-back-ten.vercel.app"

// Interface do cliente
export interface Cliente {
  Nome: string
  Fone: string
  CPF: string
}

// Função para cadastrar cliente
export const cadastrarCliente = async (cliente: Cliente) => {
  try {
    const response = await axios.post(`${baseURL}/cadastrarcliente`, cliente)
    return response.data // deve retornar { message, id }
  } catch (error: any) {
    console.error("Erro ao cadastrar cliente:", error)
    throw new Error(error.response?.data?.message || "Erro ao cadastrar cliente")
  }
}

// Função para excluir cliente
export const excluirCliente = async (id: number) => {
  try {
    const response = await axios.delete(`${baseURL}/excluircliente/${id}`)
    return response.data
  } catch (error: any) {
    console.error("Erro ao excluir cliente:", error)
    throw new Error(error.response?.data?.message || "Erro ao excluir cliente")
  }
}
