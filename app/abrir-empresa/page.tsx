"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {ArrowRight, User, FileText, Activity } from "lucide-react"
import Link from "next/link"

export default function AbrirEmpresaPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: "account",
      title: "Criar Conta",
      description: "Informações básicas para acesso",
      icon: User,
      completed: false,
    },
    {
      id: "personal",
      title: "Dados Pessoais",
      description: "Informações do responsável",
      icon: User,
      completed: false,
    },
    {
      id: "business",
      title: "Atividade",
      description: "Tipo, categoria, CNAE e nome fantasia",
      icon: Activity,
      completed: false,
    },
    {
      id: "documents",
      title: "Documentos",
      description: "Upload dos documentos necessários",
      icon: FileText,
      completed: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-blue-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <img src="/Facilitaj.png"
                  alt="Logo da Empresa"
                  width={30}
                  height={30}
                  className="w-16 h-16 " 
                  />
              </div>
            </Link>
           
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Abrir Empresa</h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = step.completed

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : isCompleted
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-400">{step.description}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-4 mt-6" />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current Step Content */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Bem-vindo ao FACILITA JÁ</CardTitle>
              <CardDescription>
                Vamos começar o processo de abertura da empresa. Este processo é dividido em 4 etapas simples.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-between pt-6">
                <Link href="/admin/clients">
                  <Button variant="outline">Voltar ao Início</Button>
                </Link>
                <Link href="/abrir-empresa/conta">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Começar Processo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
