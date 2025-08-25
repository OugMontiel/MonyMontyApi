const {body} = require("express-validator");

const Validador = require("../../../core/validador/Validador"); // Importa el validador genérico

class UserValidator {
  /**
   * Instancia única de la clase (Singleton).
   * @type {Validador}
   * @private
   */
  static instancia;

  /**
   * Si ya existe una instancia, devuelve la misma.
   * @constructor
   * @returns {Validador} Instancia única de la clase
   */
  constructor() {
    if (Validador.instancia) return Validador.instancia;
    Validador.instancia = this;
  }

  validateProductData = () => {
    return [
      // Reglas reutilizables desde el Validador global
      Validador.requiredString("nombre"),
      Validador.requiredString("categoría"),
      Validador.requiredNumber("calorías", "send a calorías"),
      Validador.requiredNumber("promedioValoración", "send a promedioValoración"),
      Validador.noQueryParams(),

      // Validación de ingredientes
      body("ingredientes").optional().isArray().withMessage("ingredientes must be an array"),

      // Validación de valoraciones
      body("valoraciones").optional().isArray().withMessage("valoraciones must be an array"),
    ];
  };

  validateProductId = () => {
    return [
      // Reglas reutilizables desde el Validador global
      Validador.noBodyData(),
      Validador.noQueryParams(),
      Validador.isValidObjectId(),
    ];
  };
}

module.exports = new UserValidator();
