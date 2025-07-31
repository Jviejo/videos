'use server';

import nodemailer from 'nodemailer';

// Configuración del transporter de email
const createTransporter = () => {
  // Para MailHog (desarrollo) - solo si NODE_ENV es development Y EMAIL_HOST es localhost
  if (process.env.NODE_ENV === 'development' && 
      (process.env.EMAIL_HOST === 'localhost' || process.env.EMAIL_HOST === '127.0.0.1' || !process.env.EMAIL_HOST)) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'localhost',
      port: parseInt(process.env.EMAIL_PORT || '1025'),
      secure: false,
      // MailHog no requiere autenticación
      ignoreTLS: true,
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  
  // Para producción: usa Resend SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.resend.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: true, // true para 465, false para otros puertos
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY, // tu API key de Resend
    },
  });
};

// Generar código de verificación aleatorio de 6 dígitos
export async function generateVerificationCode(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Enviar código de verificación por email
export async function sendVerificationCode(email: string, code: string, type: 'login' | 'register' = 'login') {
  try {
    const transporter = createTransporter();

    const subject = type === 'register' 
      ? '🔐 Código de verificación - Crear cuenta'
      : '🔐 Código de verificación - Iniciar sesión';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Formación Tecnológica</h1>
              <p>Tu código de verificación está listo</p>
            </div>
            <div class="content">
              <h2>Hola 👋</h2>
              <p>Has solicitado ${type === 'register' ? 'crear una nueva cuenta' : 'iniciar sesión'} en nuestra plataforma de formación.</p>
              
              <div class="code-box">
                <p style="margin: 0; font-size: 18px; color: #666;">Tu código de verificación es:</p>
                <div class="code">${code}</div>
              </div>

              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0;">
                  <li>Este código expira en <strong>10 minutos</strong></li>
                  <li>No compartas este código con nadie</li>
                  <li>Si no solicitaste este código, ignora este email</li>
                </ul>
              </div>

              <p>Una vez que tengas el código, vuelve a la aplicación e introdúcelo para completar ${type === 'register' ? 'el registro' : 'el inicio de sesión'}.</p>
              
              <p style="margin-top: 30px;">
                <strong>¿Necesitas ayuda?</strong><br>
                Si tienes problemas, contacta con nuestro equipo de soporte.
              </p>
            </div>
            <div class="footer">
              <p>Este email fue enviado por el sistema de Formación Tecnológica</p>
              <p>🤖 Potenciado por IA para una mejor experiencia de aprendizaje</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
      Código de verificación - Formación Tecnológica
      
      Hola,
      
      Has solicitado ${type === 'register' ? 'crear una nueva cuenta' : 'iniciar sesión'} en nuestra plataforma.
      
      Tu código de verificación es: ${code}
      
      IMPORTANTE:
      - Este código expira en 10 minutos
      - No compartas este código con nadie
      - Si no solicitaste este código, ignora este email
      
      Una vez que tengas el código, vuelve a la aplicación e introdúcelo para completar ${type === 'register' ? 'el registro' : 'el inicio de sesión'}.
      
      Saludos,
      Equipo de Formación Tecnológica
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Formación Tecnológica <noreply@yourdomain.com>',
      to: email,
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    // En desarrollo, mostrar el código en consola para testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n📧 CÓDIGO DE VERIFICACIÓN PARA ${email}: ${code}\n`);
    }

    // Intentar enviar el email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado correctamente a ${email}`);
      return { success: true, message: 'Código enviado correctamente' };
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      // En desarrollo con MailHog, si hay error de auth, seguir funcionando
      if (process.env.NODE_ENV === 'development' && process.env.EMAIL_HOST === 'localhost') {
        console.log('⚠️ Error con MailHog, pero código generado correctamente');
        return { success: true, message: 'Código generado (MailHog error)' };
      }
      
      // En desarrollo sin MailHog, permitir que funcione
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Email no enviado (desarrollo), pero código generado correctamente');
        return { success: true, message: 'Código generado (modo desarrollo)' };
      }
      
      return { success: false, message: 'Error al enviar el código por email' };
    }

  } catch (error) {
    console.error('Error in sendVerificationCode:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
}

// Verificar si un código es válido (tiempo y valor)
export async function isCodeValid(storedCode: string, storedTimestamp: Date, inputCode: string): Promise<boolean> {
  if (!storedCode || !storedTimestamp || !inputCode) {
    return false;
  }

  // Verificar si el código coincide
  if (storedCode !== inputCode) {
    return false;
  }

  // Verificar si el código no ha expirado (10 minutos)
  const now = new Date();
  const expirationTime = 10 * 60 * 1000; // 10 minutos en milisegundos
  const timeDiff = now.getTime() - storedTimestamp.getTime();

  return timeDiff <= expirationTime;
}