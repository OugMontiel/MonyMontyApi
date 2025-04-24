const {body, query} = require("express-validator");
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

      // Validación para asegurarse de que no haya ningún query en la URL
      query().custom((value, {req}) => {
        if (Object.keys(req.query).length > 0) {
          throw new Error(`Don't send anything in the url`);
        }
        return true;
      }),
    ];
  };
}

module.exports = AuthValidator;
