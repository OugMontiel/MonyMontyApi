// server/iniciosesion/application/controllers/inicioSesionController.js
const MaskData = require("maskdata");

const authService = require("../services/authService.js");
const handleError = require("../../../core/application/controllers/handleError.js");

class AuthController {
  // --- Inicio de sesión con proveedor externo (Google) ---
  iniciarSesion = (_req, res) => {
    try {
      res.send("Inicia sesión con tu proveedor de identidad.");
    } catch (error) {
      handleError(res, error);
    }
  };

  // --- Cierre de sesión ---
  logout = async (req, res) => {
    try {
      const idUser = req.session?.usuario?._id;

      if (idUser) {
        // Invalidar sesión en BD logic
        await authService.logout(idUser);
      }

      req.logout((err) => {
        if (err) return handleError(res, err);

        // Session destroy
        req.session.destroy((err) => {
          if (err) return handleError(res, err);
          res.clearCookie(process.env.SESSION_COOKIE_NAME); // Explicitly clear cookie
          return res.status(200).json({message: "Sesión cerrada correctamente"});
        });
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
      // Obtener el token desde la sesión
      const token = req.session?.token;

      // Validar existencia del token
      if (!token) {
        return res.status(401).json({authenticated: false, message: "Not authenticated"});
      }

      // Verificamos el token JWT y estado en BD (incluye renovación)
      const resultado = await authService.validarSesion(token);

      // Manejar renovación de token si aplica
      if (resultado.renewed) {
        // Si se renovó, actualizar sesión
        req.session.token = resultado.token;
        req.session.save();
      }

      // Responder con éxito
      return res.status(200).json({
        authenticated: true,
        token: resultado.token,
      });
    } catch (error) {
      // Si falla validación (token inválido, expirado, revocado)
      req.session.destroy();
      return res.status(401).json({authenticated: false, message: "Sesión inválida o expirada"});
    }
  }

  // --- Inicio de sesión con email/contraseña ---
  async sessionLogin(req, res) {
    try {
      const {email, password} = req.body;
      const {token, usuario} = await authService.loginWithCredentials(email, password);

      // Guardamos el token en la sesión y forzamos guardado antes de responder.
      req.session.token = token;
      req.session.usuario = usuario;

      req.session.save((err) => {
        if (err) {
          return handleError(res, err, 500, "Ocurrió un error inesperado. Intenta nuevamente más tarde.");
        }
        return res.status(201).json({token});
      });
    } catch (error) {
      handleError(res, error, 500, "Ocurrió un error inesperado. Intenta nuevamente más tarde.");
    }
  }

  // --- Recuperación de contraseña: solicitar token ---
  async recuperarPassword(req, res) {
    try {
      const envio = await authService.generarTokenRecuperacion(req.body.email);

      if (envio) {
        return res.status(200).json({message: "Correo de recuperación enviado"});
      }
    } catch (error) {
      handleError(res, error);
    }
  }

  // --- Verificar token de recuperación ---
  async checkToken(req, res) {
    try {
      const {token} = req.query;
      // Verificamos el token JWT (Firma solamente)
      const esValido = await authService.validarTokenRecuperacion(token);

      if (!esValido) {
        return res.status(401).json({
          authenticated: false,
          message: "Token inválido o expirado",
        });
      }
      const userDelTocken = await authService.getUserFromToken(token);

      const userMasked = {
        email: MaskData.maskEmail2(userDelTocken.email, {
          maskWith: "*",
          unmaskedStartCharactersBeforeAt: 2,
          unmaskedEndCharactersAfterAt: 200,
          maskAtTheRate: false,
        }),

        nombre: userDelTocken.nombre.split(" ").reduce((resultado, palabra, index, arr) => {
          const masked = MaskData.maskStringV2(palabra, {
            maskWith: "*",
            unmaskedStartCharacters: 2,
            unmaskedEndCharacters: 0,
            maxMaskedCharacters: palabra.length,
          });
          return resultado + masked + (index < arr.length - 1 ? " " : "");
        }, ""),
      };

      return res.status(200).json({
        authenticated: true,
        userDelTocken: userMasked,
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  // --- Actualizar contraseña ---
  async updatePassword(req, res) {
    try {
      const {token, password} = req.body;

      const {email} = await authService.getUserFromToken(token);

      const SeActualizo = await authService.updatePassword(email, password);

      return SeActualizo
        ? res.status(200).json({message: "Contraseña actualizada correctamente"})
        : res.status(500).json({message: "Error al actualizar la contraseña"});
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new AuthController();
