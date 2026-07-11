// server/iniciosesion/infrastructure/middleware/isAuthenticated.js

const authService = require("../../application/services/authService");

const isAuthenticated = async (req, res, next) => {
  try {
    // Validar token y sesión en BD
    const resultado = await authService.validarSesion(req.session.token);

    // Si hubo renovación, actualizamos sesión
    if (resultado.renewed) {
      req.session.token = resultado.token;
      req.session.usuario = resultado.usuario;
    }

    // El usuario está autenticado, continuar
    return next();
  } catch (error) {
    console.log("Error autenticación:", error.message);
    // Sesión inválida, destruir y responder 401
    req.session.destroy();
    return res.status(401).json({
      message: "Sesión expirada o inválida. Por favor inicie sesión nuevamente.",
      success: false,
    });
  }
};

module.exports = isAuthenticated;
