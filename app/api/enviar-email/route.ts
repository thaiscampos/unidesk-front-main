// app/api/enviar-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { ticket, acao } = await request.json();

    const acoes = {
      aberto: { status: 'Aberto', cor: '#10b981' },
      alterado: { status: 'Alterado', cor: '#f59e0b' },
      finalizado: { status: 'Finalizado', cor: '#ef4444' },
      cancelado: { status: 'Cancelado', cor: '#6b7280' },
    };

    const info = acoes[acao] || acoes.aberto;

    const { data, error } = await resend.emails.send({
      from: 'UniDesk <no-reply@unidesk.site>',
      to: [ticket.emailCliente],
      subject: `Chamado #${ticket.ticketNumber} ${info.status}!`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb">
          <h2 style="color:${info.cor};text-align:center">Chamado ${info.status}!</h2>
          <div style="background:white;padding:16px;border-radius:8px;margin:16px 0">
            <p><strong>Ticket:</strong> #${ticket.ticketNumber}</p>
            <p><strong>Título:</strong> ${ticket.title}</p>
            <p><strong>Cliente:</strong> ${ticket.reporter}</p>
            <p><strong>Status:</strong> <span style="color:${info.cor}">${info.status}</span></p>
          </div>
          <div style="background:#f3f4f6;padding:16px;border-radius:8px">
            <p><strong>Descrição:</strong></p>
            <p style="white-space:pre-wrap">${ticket.descricao}</p>
          </div>
          <p style="text-align:center;margin-top:24px">
            <a href="https://unidesk.site/dashboard/tickets/${ticket.ticketNumber}" 
               style="background:${info.cor};color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block">
              Ver no Sistema
            </a>
          </p>
          <p style="text-align:center;font-size:12px;color:#6b7280;margin-top:32px">
            UniDesk Helpdesk – Projeto da Faculdade
          </p>
        </div>
      `,
    });

    if (error) return NextResponse.json({ erro: error }, { status: 500 });
    return NextResponse.json({ sucesso: true });
  } catch (err) {
    return NextResponse.json({ erro: 'Falha interna' }, { status: 500 });
  }
}