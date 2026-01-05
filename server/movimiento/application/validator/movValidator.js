const {body} = require("express-validator");

const validador = require("../../../core/application/validador/Validador"); // Importa el validador genérico

class MovimientoValidator {
  validarCreacion() {
    return [
      validador.requiredObjectId("usuarioId"),
      // validador.optionalString("referencia"), // Se crea aqui en el back, no se recive desde el front
      validador.requiredString("origen"),

      // Clasificación
      validador.requiredString("divisaId"),
      validador.requiredObjectId("categoriaId"),
      validador.requiredObjectId("subcategoriaId"),

      // Datos Transacción
      validador.requiredDate("fecha"),
      body("tipo")
        .exists()
        .withMessage("tipo es requerido")
        .isIn(["INGRESO", "EGRESO", "TRANSFERENCIA"])
        .withMessage("Tipo inválido. Valores permitidos: INGRESO, EGRESO, TRANSFERENCIA"),
      validador.requiredNumber("monto"),

      // Concepto
      body("concepto").optional().isObject(),

      // Lógica de Transferencia

      // ─────────────────────────────────────────────
      // ES UNA TRANSFERENCIA
      // ─────────────────────────────────────────────

      body("transferencia")
        .if(body("tipo").equals("TRANSFERENCIA"))
        .exists()
        .withMessage("Datos de transferencia requeridos para tipo TRANSFERENCIA"),

      body("transferencia.origenEntidadId")
        .if(body("tipo").equals("TRANSFERENCIA"))
        .custom(validador.requiredObjectId("transferencia.origenEntidadId")),

      body("transferencia.destinoEntidadId")
        .if(body("tipo").equals("TRANSFERENCIA"))
        .custom(validador.requiredObjectId("transferencia.destinoEntidadId")),

      // ─────────────────────────────────────────────
      // NO ES UNA TRANSFERENCIA
      // ─────────────────────────────────────────────

      body("entidadId")
        .if((value, {req}) => req.body.tipo !== "TRANSFERENCIA")
        .exists()
        .withMessage("entidadId es requerido cuando no es TRANSFERENCIA")
        .bail()
        .custom(validador.requiredObjectId("entidadId")),

      // Metadatos
      body("estado").optional().isString(),
      body("tags").optional().isArray(),
      body("esRecurrente").optional().isBoolean(),
      body("adjuntos").optional().isArray(),
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

  noBodyNoQuery() {
    return [
      validador.noBodyData(),
      validador.noQueryParams(),
    ]
  }
}

module.exports = new MovimientoValidator();
