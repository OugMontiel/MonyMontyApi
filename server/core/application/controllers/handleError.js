// --- Utilidad privada para manejo uniforme de errores En el controlador ---
const handleError = (res, error) => {
  if (error.status) {
    return res.status(error.status).json({message: error.message});
  }

  // Error genérico
  return res.status(500).json({message: "Internal Server Error"});
};

module.exports = handleError;
