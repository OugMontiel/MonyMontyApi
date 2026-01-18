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

  async crear(datos) {
    try {
      return await this.categoriaModel.crear(datos);
    } catch (error) {
      console.error("Error en repositorio - crear categoría:", error);
      throw error;
    }
  }

  async agregarSubcategoria(categoriaId, subcategoria) {
    try {
      return await this.categoriaModel.agregarSubcategoria(categoriaId, subcategoria);
    } catch (error) {
      console.error("Error en repositorio - agregar subcategoría:", error);
      throw error;
    }
  }
}

module.exports = new CategoriaRepository();
