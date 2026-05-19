const nodemailer = require('nodemailer');

/**
 * Helper para el envío de correos electrónicos.
 * Si las variables de entorno SMTP no están configuradas, registra el contenido del correo
 * en la consola para facilitar las pruebas en desarrollo.
 */
const sendResetPasswordEmail = async (email, nombre, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Olimpiadas Especiales Costa Rica" <no-reply@olimpiadasespecialescr.org>',
    to: email,
    subject: 'Recuperación de Contraseña - Olimpiadas Especiales Costa Rica',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #FF0000; font-size: 24px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Olimpiadas Especiales</h1>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Costa Rica</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 30px;" />
        <h2 style="color: #1e293b; font-size: 20px; font-weight: 700; margin-top: 0;">¡Hola, ${nombre}!</h2>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          Has solicitado restablecer tu contraseña para acceder a la plataforma de Olimpiadas Especiales Costa Rica.
        </p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" style="background-color: #FF0000; color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 16px; font-weight: 700; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(255, 0, 0, 0.2), 0 2px 4px -1px rgba(255, 0, 0, 0.1); transition: background-color 0.2s;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          Este enlace de recuperación de contraseña es válido únicamente por <strong>15 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este correo de forma segura; tu contraseña actual seguirá funcionando.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
          Si tienes problemas para hacer clic en el botón, copia y pega el siguiente enlace en tu navegador web:<br/>
          <a href="${resetUrl}" style="color: #FF0000; word-break: break-all;">${resetUrl}</a>
        </p>
      </div>
    `
  };

  // Verificar si hay configuración SMTP disponible en .env
  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (hasSmtpConfig) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465', // true para 465, false para otros puertos
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail(mailOptions);
      console.log(`[EmailHelper] Correo de recuperación enviado a: ${email}`);
      return true;
    } catch (error) {
      console.error('[EmailHelper] Error al enviar correo por SMTP, cayendo en modo consola:', error);
    }
  }

  // Fallback de desarrollo: Imprimir en consola de Node
  console.log('\n========================================================================');
  console.log('📧 [MODO DESARROLLO] CORREO DE RECUPERACIÓN DE CONTRASEÑA');
  console.log(`Para: ${nombre} (${email})`);
  console.log(`Asunto: ${mailOptions.subject}`);
  console.log(`Enlace de restablecimiento: ${resetUrl}`);
  console.log('========================================================================\n');
  return true;
};

module.exports = {
  sendResetPasswordEmail
};
