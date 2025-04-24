const {body, query, param} = require("express-validator");
const {ObjectId} = require("mongodb");

class UserValidator {
  validateProductData = () => {
    return [
      // Validación de nombre
      body("nombre").notEmpty().withMessage("The nombre is mandatory").isString(),

      // Validación de categoría
      body("categoría").notEmpty().withMessage("The categoría is mandatory").isString(),

      // Validación de calorías
      body("calorías").notEmpty().withMessage("send a calorías").isNumeric(),

      // Validación de ingredientes
      body("ingredientes").optional().isArray().withMessage("ingredientes must be an array"),

      // Validación de valoraciones
      body("valoraciones").optional().isArray().withMessage("valoraciones must be an array"),

      // Validación de promedioValoración
      body("promedioValoración").notEmpty().withMessage("send a promedioValoración").isNumeric(),

      // Validación para asegurarse de que no haya ningún query en la URL
      query().custom((value, {req}) => {
        if (Object.keys(req.query).length > 0) {
          throw new Error(`Don't send anything in the url`);
        }
        return true;
      }),
    ];
  };

  validateProductId = () => {
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

module.exports = UserValidator;
