const {body, query, param} = require("express-validator");
const {ObjectId} = require("mongodb");

class MovimientoValidator {
  validarCreacion() {
    return [
      // Validación de usuario
      body("usuario").notEmpty().withMessage("El usuario es obligatorio").isString().withMessage("El usuario debe ser texto"),

      // Validación de fecha
      body("fecha").notEmpty().withMessage("La fecha es obligatoria").isISO8601().withMessage("La fecha debe tener formato ISO8601"),

      // Validación de categoría
      body("categoria").notEmpty().withMessage("La categoría es obligatoria").isObject().withMessage("La categoría debe ser un objeto"),

      // Validación de entidad
      body("entidad").notEmpty().withMessage("La entidad es obligatoria").isObject().withMessage("La entidad debe ser un objeto"),

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

      // Validación de divisa
      body("divisa").notEmpty().withMessage("La divisa es obligatoria").isObject().withMessage("La divisa debe ser un objeto"),

      // Validación de query vacío
      query().custom((value, {req}) => {
        if (Object.keys(req.query).length > 0) {
          throw new Error("No se permiten parámetros en la URL");
        }
        return true;
      }),
    ];
  }

  validarActualizacionMovimiento() {
    return [
      ...this.validarIdMovimiento(),

      // Validación de campos opcionales para actualización
      body("usuario").optional().isString().withMessage("El usuario debe ser texto"),

      body("fecha").optional().isISO8601().withMessage("La fecha debe tener formato ISO8601"),

      body().custom((body) => {
        if (body.ingreso && body.egreso) {
          throw new Error("No puede actualizar a ingreso y egreso simultáneamente");
        }
        return true;
      }),
    ];
  }

  validarId() {
    return [
      param("id").custom((value) => {
        if (!ObjectId.isValid(value)) {
          throw new Error("El ID de usuario no es válido");
        }
        return true;
      }),
    ];
  }
}

module.exports = new MovimientoValidator();
