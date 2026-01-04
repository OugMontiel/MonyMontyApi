const categoriaModel = require("../models/categoriaModel");

class CategoriaRepository {
  constructor() {
    this.categoriaModel = categoriaModel;
  }

  async obtenerTodos(usuarioId) {
    try {
      return await this.categoriaModel.buscarTodos(usuarioId);
    } catch (error) {
      console.error("Error en repositorio - obtener todas las categorías:", error);
      throw {
        status: 500,
        message: "Error al obtener las categorías de la base de datos",
      };
    }
  }
}

module.exports = new CategoriaRepository();
