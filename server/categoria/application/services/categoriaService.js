const categoriaRepository = require("../../domain/repositories/categoriaRepository");

class CategoriaService {
  constructor() {
    this.categoriaRepository = categoriaRepository;
  }

  async obtenerTodos(usuarioId) {
    try {
      return await this.categoriaRepository.obtenerTodos(usuarioId);
    } catch (error) {
      console.error("Error en servicio - obtener todas las categorías:", error);
      throw {
        status: 500,
        message: "Error interno al obtener las categorías",
      };
    }
  }
}

module.exports = new CategoriaService();
