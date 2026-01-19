const entidadModel = require("../models/entidadModel");

class EntidadRepository {
  constructor() {
    this.entidadModel = entidadModel;
  }

  async obtenerTodos(usuarioId) {
    try {
      return await this.entidadModel.buscarTodos(usuarioId);
    } catch (error) {
      console.error("Error en repositorio - obtener todas las entidades:", error);
      throw {
        status: 500,
        message: "Error al obtener las entidades de la base de datos",
      };
    }
  }

  async crear(datos) {
    try {
      return await this.entidadModel.insertar(datos);
    } catch (error) {
      console.error("Error en repositorio - crear entidad:", error);
      throw {
        status: 500,
        message: "Error al guardar la entidad en la base de datos",
      };
    }
  }
}

module.exports = new EntidadRepository();
