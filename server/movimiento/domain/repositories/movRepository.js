const movimientoModel = require("../models/movimientoModel");
const HttpError = require("../../../core/utils/HttpError");
const RepositoryError = require("../../../core/Domain/Repository/RepositoryError.js");

class MovimientoRepository {
  constructor() {
    this.movimientoModel = movimientoModel;
  }

  /**
   * Crea un nuevo movimiento en la base de datos
   * @param {object} movimientoData - Datos del movimiento
   * @returns {Promise<object>} - Movimiento creado
   * @throws {object} - Error con formato {status, message}
   */
  async crear(movimientoData) {
    try {
      return await this.movimientoModel.crear(movimientoData);
    } catch (error) {
      console.error("Error en repositorio - crear movimiento:", error);
      throw {
        status: 500,
        message: "Error al guardar el movimiento en la base de datos",
      };
    }
  }

  /**
   * Obtiene un movimiento por su ID
   * @param {string} id - ID del movimiento
   * @returns {Promise<object>} - Movimiento encontrado
   * @throws {object} - Error con formato {status, message}
   */
  async obtenerPorId(id) {
    try {
      const movimiento = await this.movimientoModel.buscarPorId(id);
      if (!movimiento) {
        throw this.crearError(404, `Movimiento con ID ${id} no encontrado`, {
          id,
        });
      }
      return movimiento;
    } catch (error) {
      console.error(`ErrorRepositorio: obtenerPorId ${id}`, error);
      throw this.normalizarError(error, `Error al buscar movimiento ID ${id}`);
    }
  }

  // Métodos auxiliares para manejo de errores
  crearError(status, message, metadata = {}) {
    const error = new Error(message);
    error.status = status;
    error.metadata = metadata;
    return error;
  }

  normalizarError(error, mensajeDefault) {
    // Si ya es un error normalizado
    if (error.status) return error;

    return this.crearError(error.status || 500, error.message || mensajeDefault, {originalError: error});
  }

  /**
   * Actualiza un movimiento existente
   * @param {string} id - ID del movimiento
   * @param {object} datosActualizacion - Datos a actualizar
   * @returns {Promise<object>} - Movimiento actualizado
   * @throws {object} - Error con formato {status, message}
   */
  async actualizar(id, datosActualizacion) {
    try {
      const resultado = await this.movimientoModel.actualizar(id, datosActualizacion);
      if (!resultado) {
        throw {
          status: 404,
          message: "Movimiento no encontrado o no se pudo actualizar",
        };
      }
      return resultado;
    } catch (error) {
      console.error(`Error en repositorio - actualizar movimiento ID ${id}:`, error);
      throw {
        status: error.status || 500,
        message: error.message || "Error al actualizar el movimiento",
      };
    }
  }

  /**
   * Elimina un movimiento
   * @param {string} id - ID del movimiento
   * @returns {Promise<object>} - Resultado de la operación
   * @throws {object} - Error con formato {status, message}
   */
  async eliminar(id) {
    try {
      const resultado = await this.movimientoModel.eliminar(id);
      if (!resultado) {
        throw {
          status: 404,
          message: "Movimiento no encontrado o no se pudo eliminar",
        };
      }
      return resultado;
    } catch (error) {
      console.error(`Error en repositorio - eliminar movimiento ID ${id}:`, error);
      throw {
        status: error.status || 500,
        message: error.message || "Error al eliminar el movimiento",
      };
    }
  }

  /**
   * Obtiene todos los movimientos
   * @returns {Promise<Array>} - Lista de movimientos
   * @throws {object} - Error con formato {status, message}
   */
  async obtenerTodos(id) {
    try {
      return await this.movimientoModel.buscarTodos(id);
    } catch (error) {
      console.error("Error en repositorio - obtener todos los movimientos:", error);
      throw {
        status: 500,
        message: "Error al obtener los movimientos de la base de datos",
      };
    }
  }

  /**
   * Obtiene movimientos por usuario
   * @param {string} usuarioId - ID del usuario
   * @returns {Promise<Array>} - Lista de movimientos del usuario
   * @throws {object} - Error con formato {status, message}
   */
  async estadisticasMovimientosDelUsuario(usuarioId) {
    try {
      const movimientos = await this.movimientoModel.estadisticasMovimientos(usuarioId);

      if (!movimientos || movimientos.length === 0) throw new HttpError(404, "No se encontraron movimientos para este usuario");

      return movimientos[0];
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new RepositoryError();
    }
  }
  /**
   * Cuenta los movimientos de un usuario en un mes específico
   * @param {string} usuarioId - ID del usuario
   * @returns {Promise<number>} - Cantidad de movimientos
   */
  async contarMovimientos(usuarioId) {
    try {
      return await this.movimientoModel.contarMovimientosPorMes(usuarioId);
    } catch (error) {
      console.error("Error en repositorio - contar movimientos mes:", error);
      throw {
        status: 500,
        message: "Error al contar los movimientos del mes",
      };
    }
  }
}

module.exports = new MovimientoRepository();
