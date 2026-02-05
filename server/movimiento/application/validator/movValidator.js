const {body, query} = require("express-validator");
const {ObjectId} = require("mongodb");

const validador = require("../../../core/application/validador/Validador"); // Importa el validador genérico

class MovimientoValidator {
  validarCreacionyActualizacion() {
    return [
      // validador.requiredObjectId("usuarioId"), // Usuario injectado desde session
      // validador.optionalString("referencia"), // Se crea aqui en el back, no se recive desde el front
      validador.requiredString("origen"),

      // Clasificación
      validador.requiredString("divisaId"),

      body("categoriaId")
        .if((value, {req}) => req.body.tipo !== "TRANSFERENCIA")
        .notEmpty()
        .withMessage("El campo categoriaId es obligatorio")
        .custom((value) => {
          if (!ObjectId.isValid(value)) throw new Error("El campo categoriaId debe ser ObjectId");
          return true;
        }),

      body("subcategoriaId")
        .if((value, {req}) => req.body.tipo !== "TRANSFERENCIA")
        .notEmpty()
        .withMessage("El campo subcategoriaId es obligatorio")
        .custom((value) => {
          if (!ObjectId.isValid(value)) throw new Error("El campo subcategoriaId debe ser ObjectId");
          return true;
        }),

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
        .notEmpty()
        .withMessage("La cuenta de origen es obligatoria")
        .custom((value) => {
          if (!ObjectId.isValid(value)) throw new Error("La cuenta de origen debe ser ObjectId");
          return true;
        }),

      body("transferencia.destinoEntidadId")
        .if(body("tipo").equals("TRANSFERENCIA"))
        .notEmpty()
        .withMessage("La cuenta de destino es obligatoria")
        .custom((value) => {
          if (!ObjectId.isValid(value)) throw new Error("La cuenta de destino debe ser ObjectId");
          return true;
        }),

      // ─────────────────────────────────────────────
      // NO ES UNA TRANSFERENCIA
      // ─────────────────────────────────────────────

      body("entidadId")
        .if((value, {req}) => req.body.tipo !== "TRANSFERENCIA")
        .exists()
        .withMessage("entidadId es requerido cuando no es TRANSFERENCIA")
        .bail()
        .custom((value) => {
          if (!ObjectId.isValid(value)) throw new Error("entidadId debe ser ObjectId");
          return true;
        }),

      // Metadatos
      body("estado").optional().isString(),
      body("tags").optional().isArray(),
      body("esRecurrente").optional().isBoolean(),
      body("adjuntos").optional().isArray(),
    ];
  }

  validarId() {
    return [validador.isValidObjectId("id")];
  }

  noBodyNoQuery() {
    return [validador.noBodyData(), validador.noQueryParams()];
  }

  validarPaginacion() {
    return [
      validador.noBodyData(),
      query("page")
        .notEmpty()
        .withMessage("El parametro page es obligatorio")
        .isInt({min: 1})
        .withMessage("El parametro page debe ser un numero entero mayor a 0"),
      query("limit")
        .notEmpty()
        .withMessage("El parametro limit es obligatorio")
        .isInt({min: 1, max: 100})
        .withMessage("El parametro limit debe ser un numero entero entre 1 y 100"),
      query("tipo").optional().isString().isIn(["INGRESO", "EGRESO", "TRANSFERENCIA", "STANDARD"]),
    ];
  }
}

module.exports = new MovimientoValidator();
