const { Resend } = require('resend');

const resend = new Resend(process.env.EMAIL_API_KEY);

const enviosDeCorreo = async(alias,tos,subject, html) => {

    try {
      const { data, error } = await resend.emails.send({
        from: `Monteflor <${alias}@monteflor.co>`,
        to: tos,
        subject,
        html,
      });
    
      if (error) {
        console.error('❌ Error enviando correo:', error);
        return;
      }
    
      console.log('✅ Correo enviado:', data);
    } catch (err) {
      console.error('❌ Error inesperado:', err);
    }
}

module.exports = { enviosDeCorreo };
