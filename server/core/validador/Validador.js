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
}
// Exportamos una sola instancia (Singleton)
module.exports = new Validador();
