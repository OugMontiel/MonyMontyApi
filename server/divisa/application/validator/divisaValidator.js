const validador = require("../../../core/application/validador/Validador");

class DivisaValidator {
  noBodyNoQuery() {
    return [validador.noBodyData(), validador.noQueryParams()];
  }
}

module.exports = new DivisaValidator();
