// server/iniciosesion/application/controllers/inicioSesionController.js

const {validationResult} = require("express-validator");
const AuthService = require("../services/authService.js");
const handleError = require("../../../core/application/controllers/handleError.js");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  // --- Inicio de sesión con proveedor externo (Google) ---
  iniciarSesion = (_req, res) => {
    try {
      res.send("Inicia sesión con tu proveedor de identidad.");
    } catch (error) {
      handleError(res, error);
    }
  };

  // --- Cierre de sesión ---
  cerrarSesion = (req, res) => {
    try {
      req.logout((err) => {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json({message: "Sesión cerrada correctamente"});
      });
    } catch (error) {
      handleError(res, error);
    }
  };

  // --- Callback luego de autenticación ---
  callback = (_req, res) => {
    try {
      return res.redirect("/tablero");
    } catch (error) {
      handleError(res, error);
    }
  };

  // --- Validar si hay sesión activa ---
  async checkSession(req, res) {
    try {
      if (req.session?.token) {
        return res.status(200).json({
          authenticated: true,
          token: req.session.token,
        });
      }

      return res.status(401).json({
        authenticated: false,
        message: "Not authenticated",
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  // --- Inicio de sesión con email/contraseña ---
  async sessionLogin(req, res) {
    try {
      const {email, password} = req.body;
      const token = await this.authService.getUserByEmail(password, email);

      req.session.token = token;

      return res.status(201).json({token});
    } catch (error) {
      handleError(res, error, 400, "Error al iniciar sesión");
    }
  }

  // --- Recuperación de contraseña: solicitar token ---
  async recuperarPassword(req, res) {
    try {
      // TODO: Implementar lógica (generar token, guardar, enviar email)
      return res.status(200).json({message: "Proceso de recuperación iniciado"});
    } catch (error) {
      handleError(res, error);
    }
  }

  // --- Verificar token de recuperación ---
  async checkToken(req, res) {
    try {
      // TODO: Verificar que el token sea válido y no esté expirado
      return res.status(200).json({message: "Token válido"});
    } catch (error) {
      handleError(res, error);
    }
  }

  // --- Actualizar contraseña ---
  async updatePassword(req, res) {
    try {
      // TODO: Verificar token, hashear contraseña y actualizar
      return res.status(200).json({message: "Contraseña actualizada correctamente"});
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new AuthController();
