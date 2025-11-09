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
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #f9fafb; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
  <!-- Header com ícone -->
  <div style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 16px;">
    <img src="https://i.postimg.cc/1tp2Y0cB/icon.png" height="40" alt="UniDesk Logo" style="display: block;" />
  </div>

  
  <h2 style="color: #cc1b36; text-align: center; margin: 0 0 20px; font-size: 22px; font-weight: 600; letter-spacing: -0.3px;">
    Chamado ${info.status}!
  </h2>

  
  <div style="background: #ffffff; padding: 18px; border-radius: 10px; margin: 18px 0; border: 1px solid #f0f0f0; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
    <p style="margin: 8px 0; font-size: 15px; color: #374151;"><strong>Ticket:</strong> #${ticket.ticketNumber}</p>
    <p style="margin: 8px 0; font-size: 15px; color: #374151;"><strong>Título:</strong> ${ticket.title}</p>
    <p style="margin: 8px 0; font-size: 15px; color: #374151;"><strong>Cliente:</strong> ${ticket.reporter}</p>
    <p style="margin: 8px 0; font-size: 15px; color: #374151;">
      <strong>Status:</strong> 
      <span style="color: #cc1b36; font-weight: 600;">${info.status}</span>
    </p>
  </div>

  
  <div style="background: #f8f9fa; padding: 18px; border-radius: 10px; border-left: 4px solid #cc1b36;">
    <p style="margin: 0 0 10px; font-weight: 600; color: #1f2937; font-size: 15px;">Descrição:</p>
    <p style="margin: 0; font-size: 14.5px; color: #4b5563; line-height: 1.55; white-space: pre-wrap;">${ticket.descricao}</p>
  </div>

  
  <p style="text-align: center; margin: 28px 0 0;">
    <a href="https://unidesk.site/dashboard/tickets/${ticket.ticketNumber}"
       style="background-color: #cc1b36; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(204,27,54,0.15); transition: background-color 0.2s ease;">
      Ver no Sistema
    </a>
  </p>

  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 20px;" />
  <p style="text-align: center; font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.4;">
    <strong>UniDesk Helpdesk</strong> – Projeto da Faculdade
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