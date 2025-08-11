const {body} = require("express-validator");

const validador = require("../../../core/validador/Validador"); // Importa el validador genérico

class MovimientoValidator {
  validarCreacion() {
    return [
      validador.requiredObjectId("IdUsuario"),
      validador.requiredDate("fecha"),
      validador.requiredObject("categoria"),
      validador.requiredObject("entidad"),
      validador.requiredObject("divisa"),
      validador.noQueryParams(),

      // Validación de ingreso/egreso
      body().custom((body) => {
        const {ingreso, egreso} = body;

        if (!ingreso && !egreso) {
          throw new Error("Debe especificar un ingreso o egreso");
        }

        if (ingreso && egreso) {
          throw new Error("No puede tener ingreso y egreso simultáneamente");
        }

        const monto = ingreso || egreso;

        if (typeof monto !== "number" || monto <= 0) {
          throw new Error("El monto debe ser un número positivo");
        }

        return true;
      }),
    ];
  }

  validarActualizacionMovimiento() {
    return [
      validador.requiredString("usuario"),
      validador.requiredDate("fecha"),

      body().custom((body) => {
        if (body.ingreso && body.egreso) {
          throw new Error("No puede actualizar a ingreso y egreso simultáneamente");
        }
        return true;
      }),
    ];
  }

  validarId() {
    return [validador.isValidObjectId("id")];
  }
}

module.exports = new MovimientoValidator();
