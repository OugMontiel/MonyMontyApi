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
      // Obtener el token desde la sesión
      const token = req.session?.token;

      if (!token) {
        return res.status(401).json({authenticated: false, message: "Not authenticated"});
      }

      // Verificamos el token JWT
      const esValido = await authService.ValidarUnTocken(token);
      return esValido
        ? res.status(200).json({authenticated: true, token})
        : res.status(401).json({authenticated: false, message: "Token inválido o expirado"});
    } catch (error) {
      handleError(res, error);
    }
  }

  // --- Inicio de sesión con email/contraseña ---
  async sessionLogin(req, res) {
    try {
      const {email, password} = req.body;
      const token = await authService.getUserByEmail(password, email);

      req.session.token = token;

      return res.status(201).json({token});
    } catch (error) {
      handleError(res, error, 400, "Error al iniciar sesión");
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
      // Verificamos el token JWT
      const esValido = await authService.ValidarUnTocken(token);
      console.log("esValido", esValido);
      if (!esValido) {
        return res.status(401).json({
          authenticated: false,
          message: "Token inválido o expirado",
        });
      }
      const userDelTocken = await authService.getUserFromToken(token);
      console.log("userDelTocken", userDelTocken);

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
      console.log("userMasked", userMasked);

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
      const {email, password} = req.body;

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
