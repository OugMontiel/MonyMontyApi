// Implementa la lógica de negocio y coordina las interacciones entre el dominio y la infraestructura.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const React = require("react");

const authRepository = require("../../domain/repositories/authRepository");

const HttpError = require("../../../core/utils/HttpError");
const ServiceError = require("../../../core/application/services/servicesError.js");
const {enviosDeCorreo} = require("../../../core/application/services/EnvioDeEmail");
const PasswordResetEmail = require("../../../core/infrastructure/emails/PasswordResetEmail.jsx");

class authService {
  async getUserByEmail(password, email) {
    try {
      // Verificar si el usuario existe
      const usuario = await authRepository.getUserByEmail(email);
      if (!usuario) throw new HttpError(404, "Usuario no encontrado");

      // Verificar si la contraseña es correcta
      const isMatch = await bcrypt.compare(password, usuario.password);
      if (!isMatch) throw new HttpError(401, "No autorizado, contraseña incorrecta");

      // Generamos el token
      const token = jwt.sign(usuario, process.env.KEY_SECRET, {
        expiresIn: process.env.EXPRESS_EXPIRE,
      });

      // Retornamos el token
      return token;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError();
    }
  }
  async generarTokenRecuperacion(email) {
    try {
      // Verificar si el usuario existe
      const usuario = await authRepository.getUserByEmail(email);
      if (!usuario) throw new HttpError(404, "Usuario no encontrado");

      // Generamos el token
      const token = jwt.sign(usuario, process.env.KEY_SECRET, {
        expiresIn: process.env.EMAIL_EXPIRATION_TIME,
      });

      // Guardar el token en la base de datos
      const seGuardo = await authRepository.guardarTokenRecuperacion(email, token);
      if (!seGuardo) throw new HttpError(500, "Error al guardar el token de recuperación");

      // Enviar el email con el enlace de recuperación
      const resetLink = `https://monymonty.monteflor.co/reset-password?token=${token}`;
      const element = React.createElement(PasswordResetEmail, {usuario, resetLink});
      const envio = await enviosDeCorreo("no-reply", email, "Recuperación de contraseña", element);

      return envio;

      // TODO: Implementar lógica (generar token, guardar, enviar email)
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError();
    }
  }
  ValidarUnTocken(token) {
    try {
      jwt.verify(token, process.env.KEY_SECRET);
      return true;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError();
    }
  }
}

module.exports = new authService();
