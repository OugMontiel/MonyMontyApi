// server/iniciosesion/application/controllers/inicioSesionController.js
const {validationResult} = require("express-validator");
const AuthService = require("../services/authService.js");

class authController {
  constructor() {
    this.authService = new AuthService();
  }
  // Controlador para manejar el inicio de sesión con Google, GitHub o Discord
  iniciarSesion = (req, res) => {
    res.send("Inicia sesión con tu proveedor de identidad.");
  };

  // Controlador para cerrar sesión
  cerrarSesion = (req, res) => {
    req.logout(() => {
      res.status(200).json({
        message: "Sesión cerrada correctamente",
      });
    });
  };

  // Controlador para el callback después de la autenticación
  callback = (req, res) => {
    res.redirect("/tablero");
  };

  // Validar la session
  async checkSession(req, res) {
    // Comprobamos si el usuario tiene una sesión activa
    // console.log('Session:', req.session, 'token:', req.session.token);

    if (req.session && req.session.token) {
      // Si la sesión es válida, respondemos con authenticated: true
      return res.status(200).json({authenticated: true, token: req.session.token});
    }
    // Si no tiene sesión activa, devolvemos un error 401 (no autorizado)
    res.status(401).json({authenticated: false, message: "Not authenticated"});
  }

  // Controlador: Maneja el inicio de sesión mediante cookies
  async sessionLogin(req, res) {
    try {
      // Verificación de errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      // Busca el usuario en la base de datos por email y Comparar la contraseña
      const token = await this.authService.getUserByEmail(req.body.password, req.body.email);

      // Almacena el token en la sesión
      req.session.token = token;

      // Enviar respuesta de éxito con el token
      res.status(201).json({token});
    } catch (error) {
      // console.log(error);
      // Si el error contiene un mensaje específico
      if (error.message) {
        try {
          const errorData = JSON.parse(error.message); // Intentar parsear el mensaje de error
          return res.status(errorData.status || 500).json({message: errorData.message});
        } catch (parseError) {
          // Si no se puede parsear, enviar un error genérico
          return res.status(500).json({message: "Error en el servidor"});
        }
      } else {
        // Si el error no tiene mensaje, lanzamos un error genérico
        throw new Error(JSON.stringify({status: 400, message: "Error in auth repository"}));
      }
    }
  }

  async recuperarPassword(req, res) {
    try {
      // Verifica que el email exista en la BD
      // Genera un token aleatorio
      // Guarda el token y fecha de expiración en el usuario
      // Envía el email con el enlace
    } catch (error) {
      res.status(500).json({message: "Error en el servidor"});
    }
  }

  async checkToken(req, res) {
    try {
      // Verifica que el token sea válido y no haya expirado
    } catch (error) {
      res.status(500).json({message: "Error en el servidor"});
    }
  }

  async updatePassword(req, res) {
    try {
      // Verifica el token
      // Hashea la nueva contraseña
      // Actualiza la contraseña en la BD
      // Invalida el token de recuperación
    } catch (error) {
      res.status(500).json({message: "Error en el servidor"});
    }
}

module.exports = new authController();
