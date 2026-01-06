const validador = require("../../../core/application/validador/Validador");

class EntidadValidator {
  noBodyNoQuery() {
    return [validador.noBodyData(), validador.noQueryParams()];
  }
}

module.exports = new EntidadValidator();
