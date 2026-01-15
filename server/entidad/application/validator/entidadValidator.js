const validador = require("../../../core/application/validador/Validador");

class EntidadValidator {
  noBodyNoQuery() {
    return [validador.noBodyData(), validador.noQueryParams()];
  }

  validarCreacion() {
    return [
      validador.requiredString("nombre"),
      validador.requiredEnum("tipo", ["BANCO", "EFECTIVO", "COOPERATIVA"]),
      validador.requiredNumber("saldoInicial"),
      validador.requiredString("divisaId"),
    ];
  }
}

module.exports = new EntidadValidator();
