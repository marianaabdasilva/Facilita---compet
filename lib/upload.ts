import axios from "axios"

export async function uploadArquivoCliente(
  cliente_id: number,
  arquivo: File,
  tipo_documento_id: number,
  cnpj_id: number
) {
  const formData = new FormData()
  formData.append("arquivo", arquivo)
  formData.append("tipo_documento_id", String(tipo_documento_id))
  formData.append("cnpj_id", String(cnpj_id))

  const response = await axios.post(`/upload-arquivos/${cliente_id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return response.data
}
