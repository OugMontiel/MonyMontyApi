const divisaRepository = require("../../domain/repositories/divisaRepository");

class DivisaService {
  constructor() {
    this.divisaRepository = divisaRepository;
  }

  async obtenerTodos() {
    try {
      return await this.divisaRepository.obtenerTodos();
    } catch (error) {
      console.error("Error en servicio - obtener todas las divisas:", error);
      throw {
        status: 500,
        message: "Error interno al obtener las divisas",
      };
    }
  }
}

module.exports = new DivisaService();
