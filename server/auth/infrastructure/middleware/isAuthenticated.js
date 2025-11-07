// server/iniciosesion/infrastructure/middleware/isAuthenticated.js

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.token) {
    // El usuario está autenticado, continuar con el siguiente middleware o ruta
    return next();
  } else {
    // El usuario NO está autenticado
    console.log("Nooo paso isAuthenticated - Respondiendo con 401");

    // 1. Establecer el código de estado HTTP a 401 (Unauthorized)
    res.status(401).json({
      // 2. Enviar una respuesta JSON con un mensaje
      message: "Acceso denegado. No está autenticado.",
      success: false,
    });
  }
};

module.exports = isAuthenticated;
