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
      return {token, usuario};
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
      const token = jwt.sign({id: usuario._id.toString()}, process.env.KEY_SECRET, {
        expiresIn: process.env.EMAIL_EXPIRATION_TIME,
      });

      // Guardar el token en la base de datos
      const seGuardo = await authRepository.guardarTokenRecuperacion(email, token);
      if (!seGuardo) throw new HttpError(500, "Error al guardar el token de recuperación");

      // Enviar el email con el enlace de recuperación
      const resetLink = `https://monymonty.monteflor.co/resetPassword?token=${token}`;
      const element = React.createElement(PasswordResetEmail, {usuario, resetLink});
      const envio = await enviosDeCorreo("no-reply", email, "Recuperación de contraseña", element);

      return envio;

      // TODO: Implementar lógica (generar token, guardar, enviar email)
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError();
    }
  }
  async validarToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.KEY_SECRET);
      return decoded;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError();
    }
  }

  async logout(userId) {
    try {
      await authRepository.eliminarTokenSesion(userId);
      return true;
    } catch (error) {
      throw new ServiceError();
    }
  }

  async validarSesion(token) {
    try {
      // 1. Validar firma y expiración del JWT
      const decoded = await this.validarToken(token);
      if (!decoded) throw new HttpError(401, "Token inválido o expirado");

      // 2. Validar existencia en Base de Datos (Integridad y Revocación)
      const usuario = await authRepository.validarTokenSesion(decoded.id, token);
      if (!usuario) throw new HttpError(401, "Sesión revocada o inválida");

      // 3. Renovación Silenciosa (Silent Refresh)
      // Si el token está próximo a vencer (ej. < 15 minutos), generamos uno nuevo
      const expTimestamp = decoded.exp * 1000; // Convertir a ms
      const now = Date.now();
      const timeUntilExp = expTimestamp - now;
      const refreshThreshold = ms(process.env.JWT_REFRESH_THRESHOLD || "15m");

      let newToken = token;

      if (timeUntilExp < refreshThreshold) {
        // Generar nuevo token
        const newPayload = {id: decoded.id, role: decoded.role};
        newToken = jwt.sign(newPayload, process.env.KEY_SECRET, {
          expiresIn: process.env.EXPRESS_EXPIRE,
        });

        // Actualizar en BD
        await authRepository.guardarTokenSesion(decoded.id, newToken);
      }

      // Retornar usuario y el token (puede ser el mismo o uno renovado)
      // Eliminamos password por seguridad
      delete usuario.password;
      return {usuario, token: newToken, renewed: newToken !== token};
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError();
    }
  }
  async getUserFromToken(token) {
    try {
      // Optenemos el usuario
      const usuario = await authRepository.getUserFromToken(token);
      if (!usuario) throw new HttpError(404, "Usuario no encontrado");
      return usuario;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError();
    }
  }
  async updatePassword(email, Password) {
    try {
      const newpassword = await bcrypt.hash(Password, 10);

      const resultado = await authRepository.guardarNewContraseña(email, newpassword);
      return resultado;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError();
    }
  }
}

module.exports = new authService();
