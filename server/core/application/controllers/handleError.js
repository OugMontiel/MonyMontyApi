// --- Utilidad privada para manejo uniforme de errores En el controlador ---
const handleError = (res, error, defaultStatus = 500, defaultMessage = "Error en el Controlador") => {
  if (typeof error.message === "string") {
    try {
      const errorData = JSON.parse(error.message);
      return res.status(errorData.status || defaultStatus).json({
        message: errorData.message || defaultMessage,
      });
    } catch (_) {
      // Si no se puede parsear, sigue abajo
    }
  }

  // Error genérico
  res.status(defaultStatus).json({message: defaultMessage});
};

module.exports = {handleError};