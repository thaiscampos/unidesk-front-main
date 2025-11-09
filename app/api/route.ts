import type { NextApiRequest, NextApiResponse } from 'next'
import {Resend} from 'resend'
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: 'Thais@unidesk.com',
      to: 'thaisc.carvalho4@gmail.com',
      subject: 'Teste simples do Resend via Vercel',
      text: 'Olá! Este e-mail foi enviado por uma função serverless da Vercel 🚀',
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ success: false });
  }

}

