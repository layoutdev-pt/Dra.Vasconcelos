/**
 * Email HTML templates for Dra. Alexandra Vasconcelos
 * Used by Edge Functions to send branded emails
 */

const BRAND_COLOR = '#7CB0B0'; // secondary
const PRIMARY_COLOR = '#0f172a';
const ACCENT_COLOR = '#F97316';
const SITE_URL = 'https://draalexandravasconcelos.pt';
const LOGO_URL = `${SITE_URL}/logo.png`; // Will fallback to text if not available

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dra. Alexandra Vasconcelos</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f9fa;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f9fa;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:${PRIMARY_COLOR};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
                Dra. Alexandra Vasconcelos
              </h1>
              <p style="margin:8px 0 0;color:${BRAND_COLOR};font-size:11px;text-transform:uppercase;letter-spacing:3px;font-weight:600;">
                Medicina Integrativa & Longevidade
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f9fa;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;color:#9ca3af;font-size:11px;">
                © ${new Date().getFullYear()} Clínica Dra. Alexandra Vasconcelos. Todos os direitos reservados.
              </p>
              <p style="margin:0;color:#9ca3af;font-size:11px;">
                <a href="${SITE_URL}/privacidade" style="color:${BRAND_COLOR};text-decoration:none;">Política de Privacidade</a>
                &nbsp;·&nbsp;
                <a href="${SITE_URL}" style="color:${BRAND_COLOR};text-decoration:none;">Visitar Website</a>
              </p>
              <p style="margin:12px 0 0;color:#d1d5db;font-size:10px;">
                Se não deseja receber mais emails, responda a este email com "CANCELAR".
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Lead Magnet Email — Sent when someone downloads the free ebook
 */
export function leadMagnetEmail(pdfUrl: string): string {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:64px;height:64px;background-color:${BRAND_COLOR}15;border-radius:16px;line-height:64px;font-size:28px;">
        📖
      </div>
    </div>
    <h2 style="margin:0 0 16px;color:${PRIMARY_COLOR};font-size:24px;font-weight:700;text-align:center;line-height:1.3;">
      O seu guia gratuito está pronto!
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.7;text-align:center;">
      Obrigada por subscrever a nossa newsletter. Aqui está o seu exemplar gratuito de 
      <strong style="color:${PRIMARY_COLOR};">"Os Probióticos que vão Revolucionar a Sua Vida"</strong>.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${pdfUrl}" 
         style="display:inline-block;background-color:${ACCENT_COLOR};color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-weight:700;font-size:15px;letter-spacing:0.5px;">
        ⬇ Descarregar Guia Gratuito
      </a>
    </div>
    <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-top:32px;">
      <p style="margin:0;color:#166534;font-size:13px;line-height:1.6;">
        <strong>O que vai encontrar neste guia:</strong><br>
        ✓ Os melhores probióticos para a sua saúde intestinal<br>
        ✓ Como escolher o suplemento certo<br>
        ✓ Dicas práticas para o dia-a-dia
      </p>
    </div>
    <p style="margin:32px 0 0;color:#9ca3af;font-size:13px;text-align:center;line-height:1.6;">
      A partir de agora, receberá também os nossos novos artigos sobre saúde integrativa diretamente no seu email.
    </p>
  `;
  return baseLayout(content);
}

/**
 * Newsletter Email — Sent when a new blog post is published
 */
export function newsletterEmail(post: {
  title: string;
  slug: string;
  summary: string | null;
  image_url: string | null;
  content: string | null;
}): string {
  // Extract first ~200 chars of clean text from HTML content
  const excerpt = post.summary || 
    (post.content 
      ? post.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().substring(0, 250) + '...'
      : 'Leia o novo artigo no nosso blog.');

  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  const imageBlock = post.image_url ? `
    <div style="margin-bottom:24px;border-radius:12px;overflow:hidden;">
      <img src="${post.image_url}" alt="${post.title}" 
           style="width:100%;max-height:280px;object-fit:cover;display:block;" />
    </div>
  ` : '';

  const content = `
    <div style="text-align:center;margin-bottom:16px;">
      <span style="display:inline-block;background-color:${BRAND_COLOR}20;color:${BRAND_COLOR};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:6px 16px;border-radius:20px;">
        Novo Artigo
      </span>
    </div>

    ${imageBlock}

    <h2 style="margin:0 0 16px;color:${PRIMARY_COLOR};font-size:22px;font-weight:700;line-height:1.3;">
      ${post.title}
    </h2>

    <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.75;">
      ${excerpt}
    </p>

    <div style="text-align:center;margin:32px 0 16px;">
      <a href="${postUrl}" 
         style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-weight:700;font-size:15px;letter-spacing:0.5px;">
        Continuar a Ler →
      </a>
    </div>

    <p style="margin:24px 0 0;color:#d1d5db;font-size:12px;text-align:center;">
      Este email foi enviado porque subscreveu a newsletter da Dra. Alexandra Vasconcelos.
    </p>
  `;
  return baseLayout(content);
}
