const entidadRepository = require("../../domain/repositories/entidadRepository");

class EntidadService {
  constructor() {
    this.entidadRepository = entidadRepository;
  }

  async obtenerTodos(usuarioId) {
    try {
      return await this.entidadRepository.obtenerTodos(usuarioId);
    } catch (error) {
      console.error("Error en servicio - obtener todas las entidades:", error);
      throw {
        status: 500,
        message: "Error interno al obtener las entidades",
      };
    }
  }
}

module.exports = new EntidadService();
