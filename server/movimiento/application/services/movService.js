const _ = require("lodash");
const movimientoRepository = require("../../domain/repositories/movRepository");
const HttpError = require("../../../core/utils/HttpError");
const ServiceError = require("../../../core/application/services/servicesError.js");

class MovimientoService {
  constructor() {
    this.movimientoRepository = movimientoRepository;
  }

  /**
   * Crea un nuevo movimiento
   * @param {object} data - Datos del movimiento a crear
   * @param {object} usuario - Usuario de la sesión
   * @returns {Promise<object>} - Movimiento creado
   * @throws {object} - Error con formato {status, message}
   */
  async crear(data, usuario) {
    try {
      const fechaActual = new Date();
      const year = fechaActual.getFullYear();
      const month = fechaActual.getMonth(); // 0-indexed

      // Obtener conteo para generar referencia
      const count = await this.movimientoRepository.contarMovimientos(usuario._id);
      const sequence = (count + 1).toString().padStart(4, "0");

      // Generar referencia: TXN-YYYYMM-###
      const referencia = `TXN-${year}${month}-${sequence}`;

      // Preparar datos completos
      const nuevoMovimiento = {
        ...data,
        usuarioId: usuario._id, // Asegurar que el usuarioId venga de la sesión
        referencia,
        createdAt: fechaActual,
        auditoria: {
          creadoPor: {
            usuarioId: usuario._id,
            nombre: usuario.nombre,
          },
        },
      };

      return await this.movimientoRepository.crear(nuevoMovimiento);
    } catch (error) {
      console.error("Error en servicio - crear movimiento:", error);
      throw {
        status: 500,
        message: "Error interno al crear el movimiento",
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
      const movimiento = await this.movimientoRepository.obtenerPorId(id);

      if (!movimiento) {
        throw {
          status: 404,
          message: "Movimiento no encontrado",
        };
      }

      return movimiento;
    } catch (error) {
      console.error(`Error en servicio - obtener movimiento ID ${id}:`, error);
      throw {
        status: error.status || 500,
        message: error.message || "Error interno al obtener el movimiento",
      };
    }
  }

  /**
   * Actualiza un movimiento existente
   * @param {string} id - ID del movimiento a actualizar
   * @param {object} data - Datos a actualizar
   * @returns {Promise<object>} - Movimiento actualizado
   * @throws {object} - Error con formato {status, message}
   */
  async actualizar(id, data) {
    try {
      const resultado = await this.movimientoRepository.actualizar(id, data);

      if (!resultado) {
        throw {
          status: 404,
          message: "Movimiento no encontrado o no se pudo actualizar",
        };
      }

      return resultado;
    } catch (error) {
      console.error(`Error en servicio - actualizar movimiento ID ${id}:`, error);
      throw {
        status: error.status || 500,
        message: error.message || "Error interno al actualizar el movimiento",
      };
    }
  }

  /**
   * Elimina un movimiento
   * @param {string} id - ID del movimiento a eliminar
   * @returns {Promise<object>} - Resultado de la operación
   * @throws {object} - Error con formato {status, message}
   */
  async eliminar(id) {
    try {
      const resultado = await this.movimientoRepository.eliminar(id);

      if (!resultado) {
        throw {
          status: 404,
          message: "Movimiento no encontrado o no se pudo eliminar",
        };
      }

      return resultado;
    } catch (error) {
      console.error(`Error en servicio - eliminar movimiento ID ${id}:`, error);
      throw {
        status: error.status || 500,
        message: error.message || "Error interno al eliminar el movimiento",
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
      return await this.movimientoRepository.obtenerTodos(id);
    } catch (error) {
      console.error("Error en servicio - obtener todos los movimientos:", error);
      throw {
        status: 500,
        message: "Error interno al obtener los movimientos",
      };
    }
  }

  /**
   * Calculos para Estadisticas
   *
   */
  async estadisticasDashBoard(id) {
    try {
      //optenemos todo los movimientos
      const {totales, ultimo} = await this.movimientoRepository.estadisticasMovimientosDelUsuario(id);

      const totalIngresos = _.get(totales[0], "totalIngresos");
      const totalGastos = _.get(totales[0], "totalGastos");

      const estadisticas = {
        ultimoMovimientos: ultimo[0],
        totalIngresado: totalIngresos,
        totalEgresado: totalGastos,
        totalDisponible: totalIngresos - totalGastos,
      };
      return estadisticas;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError();
    }
  }
}

module.exports = new MovimientoService();
