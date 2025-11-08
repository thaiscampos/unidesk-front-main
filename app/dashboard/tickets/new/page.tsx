// app/dashboard/tickets/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockTickets } from "@/lib/mock-tickets";

export default function NovoTicket() {
  const [enviado, setEnviado] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    const novoTicket = {
      ticketNumber: `TK${String(mockTickets.length + 1000).padStart(4, '0')}`,
      title: f.get("titulo") as string,
      reporter: f.get("nome") as string,
      assignee: null,
      registrationDate: new Date().toLocaleDateString('pt-BR'),
      priority: (f.get("prioridade") as string) || "Média",
      status: "Em aberto",
      slaN1: "24h",
      emailCliente: f.get("email") as string,
      descricao: f.get("descricao") as string,
    };

    // ADICIONA NO MOCK
    mockTickets.push(novoTicket);

    // ENVIA E-MAIL VIA API SEGURA
    const res = await fetch('/api/enviar-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ticket: novoTicket,
    acao: 'aberto',
  }),
});

if (!res.ok) {
  alert("Erro ao enviar e-mail");
  return;
}

    setEnviado(true);
    setTimeout(() => router.push("/dashboard/mytickets"), 2000);
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="text-green-600 text-6xl mb-4">Check</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chamado criado!</h2>
          <p className="text-gray-600">E-mail enviado com sucesso!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Abrir Novo Chamado</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
            <input
              name="nome"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="joao@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título do chamado</label>
            <input
              name="titulo"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Erro no login"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
            <input
              name="prioridade"
              type="text"
              required
              defaultValue="Média"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Baixa, Média ou Alta"
            />
            <p className="text-xs text-gray-500 mt-1">Digite: Baixa, Média ou Alta</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descreva o problema</label>
            <textarea
              name="descricao"
              rows={6}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Explique o problema com detalhes..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            ABRIR CHAMADO
          </button>
        </form>
      </div>
    </div>
  );
}