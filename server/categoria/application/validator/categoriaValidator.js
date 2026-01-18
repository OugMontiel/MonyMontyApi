const validador = require("../../../core/application/validador/Validador");

class CategoriaValidator {
  noBodyNoQuery() {
    return [validador.noBodyData(), validador.noQueryParams()];
  }

  validateCrear() {
    return [
      validador.requiredString("nombreCategoria", "El nombre de la categoría es obligatorio"),
      validador.optionalString("icono", "El icono debe ser texto"),
      validador.optionalString("color", "El color debe ser texto"),
      validador.optionalString("nota", "La nota debe ser texto"),
    ];
  }

  validateAgregarSubcategoria() {
    return [
      validador.isValidObjectId("id", "El ID de la categoría no es válido"),
      validador.requiredString("nombreSubcategoria", "El nombre de la subcategoría es obligatorio"),
      validador.optionalString("icono", "El icono debe ser texto"),
      validador.optionalString("color", "El color debe ser texto"),
      validador.optionalString("nota", "La nota debe ser texto"),
    ];
  }
}

module.exports = new CategoriaValidator();
