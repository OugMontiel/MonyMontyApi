const { Resend } = require('resend');
const HttpError = require("../../utils/HttpError");

const resend = new Resend(process.env.EMAIL_API_KEY);

const enviosDeCorreo = async(alias,tos,subject, reactComponent) => {

    try {
      const { data, error } = await resend.emails.send({
        from: `Monteflor <${alias}@monteflor.co>`,
        to: tos,
        subject,
        react: reactComponent,
      });
    
      if (error) throw new HttpError(500, "Error enviando correo");
      return data;
    } catch (error) {
      throw new HttpError(500, "Error inesperado enviando correo");
    }
}

module.exports = { enviosDeCorreo };
