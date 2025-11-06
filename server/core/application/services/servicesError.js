const HttpError = require("../../utils/HttpError");

class ServicesError extends HttpError {
  constructor(message = "Error en el servicio") {
    super(422, message); // 422 = Unprocessable Entity
  }
}

module.exports = ServicesError;
