import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'eddy.hamam@gmail.com';

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function generateEmailHTML(name, email, subject, message, lang) {
  return `
    <!DOCTYPE html>
    <html lang="${lang === 'en' ? 'en' : 'fr'}">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin: 15px 0; }
        .label { font-weight: 600; color: #667eea; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #667eea; }
        .message { margin-top: 20px; padding: 15px; background: white; border-radius: 4px; }
        .footer { margin-top: 20px; font-size: 12px; color: #999; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${lang === 'en' ? 'New Contact Message' : 'Nouveau message de contact'}</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">${lang === 'en' ? 'Name' : 'Nom'}</div>
            <div class="value">${escapeHtml(name)}</div>
          </div>
          <div class="field">
            <div class="label">${lang === 'en' ? 'Email' : 'Email'}</div>
            <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
          </div>
          <div class="field">
            <div class="label">${lang === 'en' ? 'Subject' : 'Objet'}</div>
            <div class="value">${escapeHtml(subject)}</div>
          </div>
          <div class="message">
            <div class="label">${lang === 'en' ? 'Message' : 'Message'}</div>
            <div class="value">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
          </div>
          <div class="footer">
            ${lang === 'en' ? 'Sent via Portfolio Contact Form' : 'Envoyé via le formulaire de contact du Portfolio'}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateConfirmationHTML(name, lang) {
  return `
    <!DOCTYPE html>
    <html lang="${lang === 'en' ? 'en' : 'fr'}">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .message { background: #f0f7ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="greeting">
          ${lang === 'en' ? `Hello ${escapeHtml(name)},` : `Bonjour ${escapeHtml(name)},`}
        </div>
        <div class="message">
          ${lang === 'en' 
            ? 'Thank you for your message. I have received it and will get back to you as soon as possible. I typically respond within 24-48 hours.'
            : 'Merci pour votre message. Je l\'ai bien reçu et je vous repondrai dès que possible. Je réponds généralement dans les 24-48 heures.'}
        </div>
        <p>
          ${lang === 'en' ? 'Best regards,' : 'Cordialement,'}  <br/>
          Mohamed-El-Eddy Hamam
        </p>
      </div>
    </body>
    </html>
  `;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;
  const lang = req.query.lang || 'fr';

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: lang === 'en' 
        ? 'All fields are required.' 
        : 'Tous les champs sont requis.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: lang === 'en'
        ? 'Invalid email address.'
        : 'Adresse email invalide.',
    });
  }

  try {
    // Send email to admin
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: adminEmail,
      replyTo: email,
      subject: `[Portfolio] ${subject} - from ${name}`,
      html: generateEmailHTML(name, email, subject, message, lang),
    });

    // Send confirmation to user
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: email,
      subject: lang === 'en' ? 'Message received' : 'Message reçu',
      html: generateConfirmationHTML(name, lang),
    }).catch(() => null);

    return res.json({
      success: true,
      message: lang === 'en'
        ? 'Message sent successfully. I will get back to you soon.'
        : 'Message envoyé avec succès. Je vous repondrai rapidement.',
    });
  } catch (error) {
    console.error('[Contact Form Error]', error);

    return res.status(500).json({
      success: false,
      message: lang === 'en'
        ? 'Failed to send message. Please try again or contact me on LinkedIn.'
        : 'Impossible d\'envoyer le message. Réessayez ou contactez-moi via LinkedIn.',
    });
  }
}
