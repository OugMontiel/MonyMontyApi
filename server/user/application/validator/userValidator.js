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
      body("nombre").notEmpty().withMessage("El nombre es obligatorio").isString(),

      // Validación de Apellido
      body("apellido").notEmpty().withMessage("El apellido es obligatorio").isString(),

      // Validación de email
      body("email").notEmpty().withMessage("Agregar un correo electrónico").isEmail().withMessage("Por favor, introduce una dirección de correo electrónico válida"),

      // Validación para el plan de usuario
      body("planId")
        .exists()
        .withMessage("planId is required")
        .custom((value) => ["free", "basic", "premium"].includes(value?.toLowerCase()))
        .withMessage("Plan debe ser una opcion valida"),

      // para el genero
      body("genero")
        .exists()
        .withMessage("El genero es requerido")
        .isIn(["Femenino", "Masculino"])
        .withMessage("Género debe ser Femenino o Masculino"),

      // Validación para la fecha de nacimiento
      body("fechaNacimiento")
        .notEmpty()
        .withMessage("La fecha nacimiento es requerida")
        .isISO8601()
        .withMessage("La fecha Nacimiento debe ser una fecha válida"),

      // Validación para el avatar
      body("avatar")
        .optional()
        .isURL({protocols: ["http", "https"], require_protocol: true})
        .withMessage("El avatar debe ser una URL válida")
        .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
        .withMessage("El avatar debe ser un formato de imagen valido"),

      // Validación de password (asegurarse que la contraseña no esté en texto plano)
      body("password")
        .notEmpty()
        .withMessage("Agregar una contraseña")
        .isLength({min: 8})
        .withMessage("La contraseña debe tener al menos 8 caracteres"),

      body("acceptLegal").isBoolean().withMessage("Debes aceptar la política de privacidad y términos y condiciones"),

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
      body("nombre").notEmpty().withMessage("El nombre es obligatorio").isString(),

      // Validación de email
      body("email").notEmpty().withMessage("Agregar un correo electrónico").isEmail().withMessage("Por favor, introduce una dirección de correo electrónico válida"),

      // para el plan
      body("planId")
        .exists()
        .withMessage("planId is required")
        .custom((value) => ["free", "basic", "premium"].includes(value?.toLowerCase()))
        .withMessage("Plan debe ser una opcion valida"),

      // para el avatar
      body("avatar")
        .optional()
        .isURL({protocols: ["http", "https"], require_protocol: true})
        .withMessage("avatar must be a valid URL")
        .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
        .withMessage("El avatar debe ser un enlace de imagen"),

      // Validación de password (asegurarse que la contraseña no esté en texto plano)
      body("password")
        .notEmpty()
        .withMessage("Agregar una contraseña")
        .isLength({min: 8})
        .withMessage("La contraseña debe tener al menos 8 caracteres"),

      // Reglas reutilizables desde el Validador global
      Validador.isValidObjectId(),
    ];
  };

  validateUser = () => {
    return [Validador.noBodyData(), Validador.noQueryParams()];
  };
}

module.exports = new UserValidator();
