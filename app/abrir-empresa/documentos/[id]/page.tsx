"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

type Uploaded = { file: File; preview: string } | null;

export default function DocumentosPageDinamic() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, Uploaded>>(
    {}
  );

  // 🚨 1) Buscar documentos do backend usando o ID do link
// useEffect que pega os documentos salvos no localStorage
  // 1) Buscar documentos usando os IDs salvos no localStorage
  useEffect(() => {
    const savedDocIds = localStorage.getItem("documentos_ids");

    if (!savedDocIds) {
      setError("Nenhum documento selecionado foi encontrado.");
      setLoadingDocs(false);
      return;
    }

    const ids: string[] = JSON.parse(savedDocIds);

    const fetchDocs = async () => {
      setLoadingDocs(true);
      try {
        const token = localStorage.getItem("token");

        // Envia o array de IDs para a rota de documentos solicitados
        const resp = await fetch("https://projeto-back-ten.vercel.app/documentos_solicitados", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids }),
        });

        const data = await resp.json();

        const docs: string[] = Array.isArray(data)
          ? data.map((doc) => doc.nome ?? doc)
          : [];

        setRequiredDocuments(docs);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar documentos solicitados.");
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDocs();
  }, []);


  useEffect(() => {
  if (!id || requiredDocuments.length === 0) return;

  const savedDocIds = localStorage.getItem(`docs_processo_${id}`);
  const savedDocNames = localStorage.getItem(`docs_processo_nomes_${id}`);

  if (savedDocIds && savedDocNames) {    const ids: string[] = JSON.parse(savedDocIds);
    const names: string[] = JSON.parse(savedDocNames);

    const initialFiles: Record<string, Uploaded> = {};
    requiredDocuments.forEach((doc) => {
      const idx = names.indexOf(doc);
      if (idx >= 0) {
        initialFiles[doc] = { file: new File([], names[idx]), preview: "" };
      }
    });

    setUploadedFiles(initialFiles);
  }
}, [id, requiredDocuments]);



  // 🚨 2) Upload
  const handleFileChange = (document: string, file: File | null) => {
    setError("");

    if (!file) return;

    const prev = uploadedFiles[document];
    if (prev?.preview) URL.revokeObjectURL(prev.preview);

    const previewURL = URL.createObjectURL(file);

    setUploadedFiles((prev) => ({
      ...prev,
      [document]: { file, preview: previewURL },
    }));
  };

  // 🚨 3) Remover arquivo
  const handleRemove = (document: string) => {
    const prev = uploadedFiles[document];
    if (prev?.preview) URL.revokeObjectURL(prev.preview);

    setUploadedFiles((prev) => {
      const copy = { ...prev };
      delete copy[document];
      return copy;
    });
  };

  // 🚨 4) Envio
const handleSubmit = async () => {
  setError("");
  setIsLoading(true);

  const allUploaded = requiredDocuments.every(
    (doc) => Boolean(uploadedFiles[doc]?.file)
  );

  if (!allUploaded) {
    setError("Por favor, envie todos os documentos obrigatórios.");
    setIsLoading(false);
    return;
  }

  try {
    const formData = new FormData();

    // Para cada arquivo, adiciona ao FormData com campo 'arquivo'
    requiredDocuments.forEach((doc) => {
      const item = uploadedFiles[doc];
      if (item?.file) {
        formData.append("arquivo", item.file, item.file.name);
      }
    });

    // Adiciona o geracao_link_id se necessário pelo backend
    formData.append("geracao_link_id", id);

    const token = localStorage.getItem("token");

    const resp = await fetch(
      `https://projeto-back-ten.vercel.app/uploadarquivo/${id}`, // aqui vai o cliente_id
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!resp.ok) throw new Error("Erro ao enviar documentos");

    router.push("/abrir-empresa/concluido");
  } catch (err) {
    console.error(err);
    setError("Erro ao enviar documentos.");
  } finally {
    setIsLoading(false);
  }
};



  if (loadingDocs) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Carregando documentos necessários...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <Image
            src="/Facilitajs.svg"
            alt="Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Envio de Documentos</CardTitle>
              <CardDescription>
                Envie os documentos solicitados para continuar seu processo.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {requiredDocuments.map((document) => (
                  <div
                    key={document}
                    className="border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{document}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          id={`file-${document}`}
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleFileChange(
                              document,
                              e.target.files ? e.target.files[0] : null
                            )
                          }
                        />
                        <label htmlFor={`file-${document}`}>
                          <Button asChild variant="outline" size="sm">
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              {uploadedFiles[document]
                                ? "Trocar arquivo"
                                : "Upload"}
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    {uploadedFiles[document] && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-green-600 flex items-center text-sm">
                            <CheckCircle className="w-5 h-5 mr-1" />
                            Arquivo carregado ({uploadedFiles[document]!.file.name})
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemove(document)}
                            className="text-sm text-red-500 underline"
                          >
                            Remover
                          </button>
                        </div>

                        <div className="border rounded-lg p-3 bg-white">
                          <p className="text-sm font-medium mb-2">
                            Pré-visualização:
                          </p>

                          {uploadedFiles[document]!.file.type.startsWith(
                            "image/"
                          ) && (
                            <img
                              src={uploadedFiles[document]!.preview}
                              alt="preview"
                              className="max-h-60 rounded-md border"
                            />
                          )}

                          {uploadedFiles[document]!.file.type ===
                            "application/pdf" && (
                            <iframe
                              src={uploadedFiles[document]!.preview}
                              className="w-full h-60 border rounded-md"
                              title={`${document}-preview`}
                            />
                          )}

                          {!uploadedFiles[document]!.file.type.startsWith(
                            "image/"
                          ) &&
                            uploadedFiles[document]!.file.type !==
                              "application/pdf" && (
                              <p className="text-sm">
                                {uploadedFiles[document]!.file.name}
                              </p>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={
                    isLoading ||
                    !requiredDocuments.every(
                      (d) => Boolean(uploadedFiles[d]?.file)
                    )
                  }
                >
                  {isLoading ? "Enviando..." : "Finalizar Envio"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

