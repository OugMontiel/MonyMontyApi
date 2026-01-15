const validador = require("../../../core/application/validador/Validador");

class EntidadValidator {
  noBodyNoQuery() {
    return [validador.noBodyData(), validador.noQueryParams()];
  }

  validarCreacion() {
    return [
      validador.requiredString("nombre"),
      validador.requiredString("tipo"),
      validador.requiredNumber("saldoInicial"),
      validador.requiredString("divisaId"),
    ];
  }
}

module.exports = new EntidadValidator();
