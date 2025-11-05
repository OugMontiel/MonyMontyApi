const HttpError = require("../../utils/HttpError");

class servicesError extends HttpError {
  constructor(message = "Error en el servicio") {
    super(422, message); // 422 = Unprocessable Entity
  }
}

module.exports = servicesError;
