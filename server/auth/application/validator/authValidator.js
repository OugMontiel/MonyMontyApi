const {body} = require("express-validator");

const Validador = require("../../../core/validador/Validador.js");
class AuthValidator {
  validatorSessionLogin = () => {
    return [
      // Validación de password
      body("password")
        .notEmpty()
        .withMessage("send a password")
        .isLength({min: 8})
        .withMessage("password must be at least 8 characters long"),

      // Validación de email
      body("email").notEmpty().withMessage("send a email").isEmail().withMessage("Please enter a valid email address"),

      Validador.noQueryParams(),
    ];
  };
}

module.exports = new AuthValidator();
