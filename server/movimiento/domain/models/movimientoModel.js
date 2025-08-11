const {ObjectId} = require("mongodb");
const ConnectToDatabase = require("../../../core/infrastructure/connections/mongodb");

class MovimientoModel {
  constructor() {
    this.dbConnection = ConnectToDatabase;
  }

  /**
   * Crea un nuevo movimiento en la base de datos
   * @param {object} movimientoData - Datos del movimiento a crear
   * @returns {Promise<object>} - Resultado de la operación
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async crear(movimientoData) {
    try {
      await this.dbConnection.conectar();
      const collection = this.dbConnection.db.collection("movimiento");
      const resultado = await collection.insertOne(movimientoData);
      return resultado;
    } catch (error) {
      console.error("ErrorModelo: crear movimiento", error);
      throw {
        status: 500,
        message: "Error al crear el movimiento en la base de datos",
        metadata: {errorOriginal: error.message},
      };
    } finally {
      await this.dbConnection.desconectar();
    }
  }

  /**
   * Busca un movimiento por su ID
   * @param {string} id - ID del movimiento
   * @returns {Promise<object|null>} - Movimiento encontrado o null
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async buscarPorId(id) {
    try {
      await this.dbConnection.conectar();
      const collection = this.dbConnection.db.collection("movimiento");
      const movimiento = await collection.findOne({_id: new ObjectId(id)});
      return movimiento;
    } catch (error) {
      console.error(`ErrorModelo: buscarPorId ${id}`, error);
      throw {
        status: 400,
        message: "Error al buscar el movimiento",
        metadata: {movimientoId: id, errorOriginal: error.message},
      };
    } finally {
      await this.dbConnection.desconectar();
    }
  }

  /**
   * Actualiza un movimiento existente
   * @param {string} id - ID del movimiento
   * @param {object} datosActualizacion - Campos a actualizar
   * @returns {Promise<object>} - Resultado de la operación
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async actualizar(id, datosActualizacion) {
    try {
      await this.dbConnection.conectar();
      const collection = this.dbConnection.db.collection("movimiento");
      const resultado = await collection.updateOne({_id: new ObjectId(id)}, {$set: datosActualizacion});
      return resultado;
    } catch (error) {
      console.error(`ErrorModelo: actualizar movimiento ${id}`, error);
      throw {
        status: 500,
        message: "Error al actualizar el movimiento",
        metadata: {movimientoId: id, errorOriginal: error.message},
      };
    } finally {
      await this.dbConnection.desconectar();
    }
  }

  /**
   * Elimina un movimiento
   * @param {string} id - ID del movimiento
   * @returns {Promise<object>} - Resultado de la operación
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async eliminar(id) {
    try {
      await this.dbConnection.conectar();
      const collection = this.dbConnection.db.collection("movimiento");
      const resultado = await collection.deleteOne({_id: new ObjectId(id)});
      return resultado;
    } catch (error) {
      console.error(`ErrorModelo: eliminar movimiento ${id}`, error);
      throw {
        status: 500,
        message: "Error al eliminar el movimiento",
        metadata: {movimientoId: id, errorOriginal: error.message},
      };
    } finally {
      await this.dbConnection.desconectar();
    }
  }

  /**
   * Obtiene todos los movimientos
   * @returns {Promise<Array>} - Lista de movimientos
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async buscarTodos(id) {
    try {
      await this.dbConnection.conectar();
      const newID = id.toString();
      const collection = this.dbConnection.db.collection("movimiento");
      const movimientos = await collection.find({IdUsuario: newID}).toArray();

      return movimientos;
    } catch (error) {
      console.error("ErrorModelo: buscarTodos movimientos", error);
      throw {
        status: 500,
        message: "Error al obtener los movimientos",
        metadata: {errorOriginal: error.message},
      };
    } finally {
      await this.dbConnection.desconectar();
    }
  }

  /**
   * Busca movimientos por ID de usuario
   * @param {string} usuarioId - ID del usuario
   * @returns {Promise<Array>} - Lista de movimientos del usuario
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async buscarPorUsuario(usuarioId) {
    try {
      await this.dbConnection.conectar();
      const collection = this.dbConnection.db.collection("movimiento");
      const movimientos = await collection.find({usuarioId}).toArray();
      return movimientos;
    } catch (error) {
      console.error(`ErrorModelo: buscarPorUsuario ${usuarioId}`, error);
      throw {
        status: 500,
        message: "Error al buscar movimientos del usuario",
        metadata: {usuarioId, errorOriginal: error.message},
      };
    } finally {
      await this.dbConnection.desconectar();
    }
  }
}

module.exports = new MovimientoModel();
