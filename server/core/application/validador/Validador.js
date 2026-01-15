const {body, query, param} = require("express-validator");
const {ObjectId} = require("mongodb");

/**
 * Clase Validador
 *
 * Proporciona validaciones reutilizables para endpoints Express,
 * utilizando `express-validator`. Implementada como Singleton
 * para evitar múltiples instancias.
 */
class Validador {
  /**
   * Instancia única de la clase (Singleton).
   * @type {Validador}
   * @private
   */
  static instancia;

  /**
   * Crea una instancia única de Validador.
   * Si ya existe una instancia, devuelve la misma.
   * @constructor
   * @returns {Validador} Instancia única de la clase
   */
  constructor() {
    if (Validador.instancia) return Validador.instancia;
    Validador.instancia = this;
  }

  // --------------------
  // Reglas atómicas
  // --------------------

  /**
   * Valida que no se envíen parámetros query
   * @param {string} [mensaje="No envíes parámetros en la URL"] - Mensaje de error personalizado
   * @returns {import("express-validator").ValidationChain} Cadena de validación para Express
   */
  noQueryParams = (mensaje = "No envíes parámetros en la URL") =>
    query().custom((_, {req}) => {
      if (Object.keys(req.query).length > 0) {
        throw new Error(mensaje);
      }
      return true;
    });

  /**
   * Valida que el body esté vacío
   * @param {string} [mensaje="No envíes datos en el cuerpo"] - Mensaje de error personalizado
   * @returns {import("express-validator").ValidationChain} Cadena de validación para Express
   */
  noBodyData = (mensaje = "No envíes datos en el cuerpo") =>
    body().custom((_, {req}) => {
      if (req.body && Object.keys(req.body).length > 0) {
        throw new Error(mensaje);
      }
      return true;
    });

  /**
   * Valida que el parámetro sea un ObjectId válido
   * @param {string} [field="id"] - Nombre del parámetro de ruta
   * @param {string} [mensaje="Envía un ID válido"] - Mensaje de error personalizado
   * @returns {import("express-validator").ValidationChain} Cadena de validación para Express
   */
  isValidObjectId = (field = "id", mensaje = "Envía un ID válido") =>
    param(field).custom((value) => {
      if (!ObjectId.isValid(value)) {
        throw new Error(mensaje);
      }
      return true;
    });

  /**
   * Valida que un campo obligatorio en el cuerpo sea un ObjectId válido.
   *
   * @param {string} field - Nombre del campo en el cuerpo a validar.
   * @param {string} [mensaje="El campo es obligatorio"] - Mensaje de error personalizado.
   * @param {string} [mensajeTipo="El campo debe ser ObjectId"] - Mensaje de error personalizado.
   * @returns {import("express-validator").ValidationChain} Cadena de validación para Express.
   */
  requiredObjectId = (field, mensaje = `El campo ${field} es obligatorio`, mensajeTipo = `El campo ${field} debe ser ObjectId`) =>
    body(field).notEmpty().withMessage(mensaje).custom((value) => {
      if (!ObjectId.isValid(value)) {
        throw new Error(mensajeTipo);
      }
      return true;
    });

  /**
   * Valida que un campo obligatorio sea de tipo string y no esté vacío.
   *
   * @param {string} field - Nombre del campo a validar.
   * @param {string} [mensaje=`El campo ${field} es obligatorio`] - Mensaje de error personalizado.
   * @param {string} [mensajeTipo=`El campo ${field} debe ser string`] - Mensaje de error si el valor no es string.
   * @returns {import("express-validator").ValidationChain} Cadena de validación de express-validator.
   */
  requiredString = (field, mensaje = `El campo ${field} es obligatorio`, mensajeTipo = `El campo ${field} debe ser texto`) =>
    body(field).notEmpty().withMessage(mensaje).isString().withMessage(mensajeTipo);

  /**
   * Valida que un campo obligatorio sea numérico.
   *
   * @param {string} field - Nombre del campo a validar.
   * @param {string} [mensaje=`El campo ${field} es obligatorio`] - Mensaje de error si el campo está vacío.
   * @param {string} [mensajeTipo=`El campo ${field} debe ser numérico`] - Mensaje de error si el valor no es numérico.
   * @returns {import("express-validator").ValidationChain} Cadena de validación de express-validator.
   */
  requiredNumber = (field, mensaje = `El campo ${field} es obligatorio`, mensajeTipo = `El campo ${field} debe ser numérico`) =>
    body(field).notEmpty().withMessage(mensaje).isFloat().withMessage(mensajeTipo);

  /**
   * Valida que un campo obligatorio sea un array.
   *
   * @param {string} field - Nombre del campo a validar.
   * @param {string} [mensaje=`El campo ${field} es obligatorio`] - Mensaje de error si el campo está vacío.
   * @param {string} [mensajeTipo=`El campo ${field} debe ser un array`] - Mensaje de error si el valor no es un array.
   * @returns {import("express-validator").ValidationChain} Cadena de validación de express-validator.
   */
  requiredArray = (field, mensaje = `El campo ${field} es obligatorio`, mensajeTipo = `El campo ${field} debe ser un array`) =>
    body(field).notEmpty().withMessage(mensaje).isArray().withMessage(mensajeTipo);

  /**
   * Valida que un campo obligatorio sea una fecha en formato ISO8601.
   *
   * @param {string} field - Nombre del campo a validar.
   * @param {string} [mensaje=`El campo ${field} es obligatorio`] - Mensaje de error si el campo está vacío.
   * @param {string} [mensajeTipo=`El campo ${field} debe tener formato ISO8601`] - Mensaje de error si el valor no es una fecha válida.
   * @returns {import("express-validator").ValidationChain} Cadena de validación de express-validator.
   */
  requiredDate = (field, mensaje = `El campo ${field} es obligatorio`, mensajeTipo = `El campo ${field} debe tener formato ISO8601`) =>
    body(field).notEmpty().withMessage(mensaje).isISO8601().withMessage(mensajeTipo);

  /**
   * Valida que un campo obligatorio sea un objeto.
   *
   * @param {string} field - Nombre del campo a validar.
   * @param {string} [mensaje=`El campo ${field} es obligatorio`] - Mensaje de error si el campo está vacío.
   * @param {string} [mensajeTipo=`El campo ${field} debe ser un objeto`] - Mensaje de error si el valor no es un objeto.
   * @returns {import("express-validator").ValidationChain} Cadena de validación de express-validator.
   */
  requiredObject = (field, mensaje = `El campo ${field} es obligatorio`, mensajeTipo = `El campo ${field} debe ser un objeto`) =>
    body(field).notEmpty().withMessage(mensaje).isObject().withMessage(mensajeTipo);

  /**
   * Valida que un campo obligatorio esté dentro de una lista de valores permitidos.
   *
   * @param {string} field - Nombre del campo a validar.
   * @param {Array} allowedValues - Lista de valores permitidos.
   * @param {string} [mensaje=`El campo ${field} es obligatorio`] - Mensaje si está vacío.
   * @param {string} [mensajeTipo=`El valor no es válido para ${field}`] - Mensaje si no está en la lista.
   * @returns {import("express-validator").ValidationChain} Cadena de validación.
   */
  requiredEnum = (
    field,
    allowedValues,
    mensaje = `El campo ${field} es obligatorio`,
    mensajeTipo = `El valor no es válido para ${field}`
  ) => body(field).notEmpty().withMessage(mensaje).isIn(allowedValues).withMessage(mensajeTipo);
}
// Exportamos una sola instancia (Singleton)
module.exports = new Validador();
