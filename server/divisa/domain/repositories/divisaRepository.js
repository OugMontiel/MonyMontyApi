const divisaModel = require("../models/divisaModel");

class DivisaRepository {
  constructor() {
    this.divisaModel = divisaModel;
  }

  async obtenerTodos() {
    try {
      return await this.divisaModel.buscarTodos();
    } catch (error) {
      console.error("Error en repositorio - obtener todas las divisas:", error);
      throw {
        status: 500,
        message: "Error al obtener las divisas de la base de datos",
      };
    }
  }
}

module.exports = new DivisaRepository();
