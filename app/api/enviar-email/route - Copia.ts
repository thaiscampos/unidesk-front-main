// app/api/enviar-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { ticket } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'UniDesk <no-reply@unidesk.site>',
      to: [ticket.emailCliente],
      subject: `Chamado #${ticket.ticketNumber} Aberto!`,
      html: `
        <h2 style="color:#1d4ed8">Chamado Aberto!</h2>
        <p><b>#${ticket.ticketNumber}</b> - ${ticket.title}</p>
        <p><b>Cliente:</b> ${ticket.reporter}</p>
        <p><b>Prioridade:</b> ${ticket.priority}</p>
        <hr>
        <p>${ticket.descricao.replace(/\n/g, '<br>')}</p>
        <p style="margin-top:20px">
          <a href="http://localhost:3000/dashboard/tickets/${ticket.ticketNumber}" 
             style="background:#1d4ed8;color:white;padding:12px 24px;text-decoration:none;border-radius:8px">
            Ver no Sistema
          </a>
        </p>
        <small>UniDesk Helpdesk – Faculdade</small>
      `,
    });

    if (error) {
      console.error("Erro Resend:", error);
      return NextResponse.json({ erro: error }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true, data });
  } catch (err) {
    console.error("Erro fatal:", err);
    return NextResponse.json({ erro: 'Falha interna' }, { status: 500 });
  }
}