// src/lib/resend-client.ts
export async function enviarEmailFrontend(ticket: {
  id: string;
  titulo: string;
  descricao: string;
  nome: string;
  email: string;
}) {
  const RESEND_KEY = "re_CzPkqbHD_4qbSzPF8x6xohKx4cocF4KHH"; // VAI SUBSTITUIR
  const FROM = "UniDesk <no-reply@unidesk.site>";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [ticket.email],
      subject: `Chamado #${ticket.id} Aberto!`,
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 12px; padding: 20px; text-align: center;">
          <h1 style="color: #1a73e8;">Chamado Aberto!</h1>
          <h2>#${ticket.id} - ${ticket.titulo}</h2>
          <p><strong>Cliente:</strong> ${ticket.nome}</p>
          <p><strong>E-mail:</strong> ${ticket.email}</p>
          <hr>
          <p style="background:#f0f8ff; padding:15px; border-left:4px solid #1a73e8;">
            ${ticket.descricao.replace(/\n/g, '<br>')}
          </p>
          <p style="margin-top: 30px;">
            <a href="http://localhost:3000/dashboard/tickets/${ticket.id}" 
               style="background:#1a73e8; color:white; padding:12px 24px; text-decoration:none; border-radius:8px;">
               Ver no Sistema
            </a>
          </p>
          <small>UniDesk Helpdesk - Projeto da Faculdade</small>
        </div>
      `,
    }),
  });
}