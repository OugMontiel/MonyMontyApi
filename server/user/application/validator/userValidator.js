const {body} = require("express-validator");

const Validador = require("../../../core/application/validador/Validador"); // Importa el validador genérico

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

  /**
   * Valida datos para crear un usuario
   * @returns {import("express-validator").ValidationChain[]} Lista de validaciones
   */
  validateUserData = () => {
    return [
      // Validación de FullName
      body("nombre").notEmpty().withMessage("The name is mandatory").isString(),

      // Validación de email
      body("email").notEmpty().withMessage("send a email").isEmail().withMessage("Please enter a valid email address"),

      // para el plan
      body("plan")
        .exists()
        .withMessage("plan is required")
        .isIn(["free", "basic", "premium"])
        .withMessage("Plan debe ser una Opcion valida"),

      // para el avatar
      body("avatar")
        .optional()
        .isURL({protocols: ["http", "https"], require_protocol: true})
        .withMessage("avatar must be a valid URL")
        .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
        .withMessage("avatar must be an image link"),

      // Validación de password (asegurarse que la contraseña no esté en texto plano)
      body("password")
        .notEmpty()
        .withMessage("send a password")
        .isLength({min: 8})
        .withMessage("password must be at least 8 characters long"),

      // Reglas reutilizables desde el Validador global
      Validador.noQueryParams(),
    ];
  };

  validateUserId = () => {
    return [
      // Reglas reutilizables desde el Validador global
      Validador.noBodyData(),
      Validador.noQueryParams(),
      Validador.isValidObjectId(),
    ];
  };

  validateUserUpdateById = () => {
    return [
      // Validación de FullName
      body("nombre").notEmpty().withMessage("The name is mandatory").isString(),

      // Validación de email
      body("email").notEmpty().withMessage("send a email").isEmail().withMessage("Please enter a valid email address"),

      // para el plan
      body("plan")
        .exists()
        .withMessage("plan is required")
        .isIn(["free", "basic", "premium"])
        .withMessage("Plan debe ser una Opcion valida"),

      // para el avatar
      body("avatar")
        .optional()
        .isURL({protocols: ["http", "https"], require_protocol: true})
        .withMessage("avatar must be a valid URL")
        .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
        .withMessage("avatar must be an image link"),

      // Validación de password (asegurarse que la contraseña no esté en texto plano)
      body("password")
        .notEmpty()
        .withMessage("send a password")
        .isLength({min: 8})
        .withMessage("password must be at least 8 characters long"),

      // Reglas reutilizables desde el Validador global
      Validador.isValidObjectId(),
    ];
  };

  validateUser = () => {
    return [Validador.noBodyData(), Validador.noQueryParams()];
  };
}

module.exports = new UserValidator();
