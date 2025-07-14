const {body, query, param} = require("express-validator");
const {ObjectId} = require("mongodb");

class TransaccionValidator {
  validateNewTransacciones = () => {
    return [
      // Validación de nombre
      body("usuario").notEmpty().withMessage("The usuario is mandatory").isString(),

      // validación de fecha
      body("fecha").notEmpty().withMessage("La fecha es obligatoria").isString().withMessage("La fecha debe ser un string"),

      // Validación de categoría
      body("categoría").notEmpty().withMessage("The categoría is mandatory").isObject(),

      // Validación de entidad
      body("entidad").notEmpty().withMessage("The entidad is mandatory").isObject(),

      // Validación de ingreso o egreso
      body().custom((body) => {
        const {ingreso, egreso} = body;

        if (!ingreso && !egreso) {
          throw new Error("Debe existir ingreso o egreso");
        }

        if (ingreso && egreso) {
          throw new Error("No se permite tener ingreso y egreso al mismo tiempo");
        }

        const valor = ingreso || egreso;

        if (isNaN(valor)) {
          throw new Error("El valor de ingreso o egreso debe ser numérico");
        }

        return true;
      }),

      // validacion de divisa
      body("divisa").notEmpty().withMessage("The divisa is mandatory").isObject(),

      // Validación para asegurarse de que no haya ningún query en la URL
      query().custom((value, {req}) => {
        if (Object.keys(req.query).length > 0) {
          throw new Error(`Don't send anything in the url`);
        }
        return true;
      }),
    ];
  };

  validateIdTransacciones = () => {
    return [
      // Validación del ID
      param("id").custom((value, {req}) => {
        if (!ObjectId.isValid(value)) {
          throw new Error("Submit a valid ID");
        }
        return true;
      }),

      // Validación para asegurarse de que no haya ningún query en la URL
      query().custom((value, {req}) => {
        if (Object.keys(req.query).length > 0) {
          throw new Error(`Don't send anything in the url`);
        }
        return true;
      }),

      // Validación para asegurarse de que no haya ningún dato en el body
      body().custom((value, {req}) => {
        if (Object.keys(req.body).length > 0) {
          throw new Error("Do not send anything in the body");
        }
        return true;
      }),
    ];
  };
}

module.exports = TransaccionValidator;
