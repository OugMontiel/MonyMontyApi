const validador = require("../../../core/application/validador/Validador");

class CategoriaValidator {
  noBodyNoQuery() {
    return [validador.noBodyData(), validador.noQueryParams()];
  }
}

module.exports = new CategoriaValidator();
