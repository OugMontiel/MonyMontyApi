
const HttpError = require("../../utils/HttpError");

class modelsError extends HttpError {
  constructor(message = "Error en la lógica de dominio") {
    super(422, message); // 422 = Unprocessable Entity
  }
}

module.exports = modelsError;
