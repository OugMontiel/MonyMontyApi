// server/core/errors/RepositoryError.js
const HttpError = require("../../utils/HttpError");

class RepositoryError extends HttpError {
  constructor(message = "Error en el repositorio o fuente de datos") {
    super(500, message);
  }
}

module.exports = RepositoryError;
