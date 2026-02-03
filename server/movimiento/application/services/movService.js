const _ = require("lodash");
const {ObjectId} = require("mongodb");
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
      const referencia = `TXN-${year}${month + 1}-${sequence}`;

      // Preparar datos completos
      const nuevoMovimiento = {
        ...data,
        usuarioId: new ObjectId(usuario._id), // Asegurar que el usuarioId venga de la sesión como ObjectId
        categoriaId: new ObjectId(data.categoriaId),
        subcategoriaId: new ObjectId(data.subcategoriaId),
        fecha: new Date(data.fecha), // Asegurar que la fecha sea un objeto Date
        referencia,
        createdAt: fechaActual,
        auditoria: {
          creadoPor: {
            usuarioId: new ObjectId(usuario._id),
            nombre: usuario.nombre,
          },
        },
      };

      if (data.tipo === "TRANSFERENCIA") {
        if (data.transferencia) {
          nuevoMovimiento.transferencia = {
            origenEntidadId: new ObjectId(data.transferencia.origenEntidadId),
            destinoEntidadId: new ObjectId(data.transferencia.destinoEntidadId),
          };
        }
      } else {
        // Corregir entidadId a ObjectId si existe (INGRESO/EGRESO)
        nuevoMovimiento.entidadId = new ObjectId(data.entidadId);
      }

      return await this.movimientoRepository.crear(nuevoMovimiento);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError("Error al intentar crear el movimiento");
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
        throw new HttpError(404, "Movimiento no encontrado");
      }

      return movimiento;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError("Error al obtener el movimiento");
    }
  }

  /**
   * Actualiza un movimiento existente
   * @param {string} id - ID del movimiento a actualizar
   * @param {object} data - Datos a actualizar
   * @param {object} usuario - Usuario de la sesión
   * @returns {Promise<object>} - Movimiento actualizado
   * @throws {object} - Error con formato {status, message}
   */
  async actualizar(id, data, usuario) {
    try {
      // Preparar datos para actualización
      const datosActualizacion = {
        ...data,
        fecha: new Date(data.fecha),
        categoriaId: new ObjectId(data.categoriaId),
        subcategoriaId: new ObjectId(data.subcategoriaId),
        divisaId: data.divisaId,
        monto: data.monto,
        updatedAt: new Date(),
        "auditoria.actualizadoPor": {
          usuarioId: new ObjectId(usuario._id),
          nombre: usuario.nombre,
        },
      };

      if (data.tipo === "TRANSFERENCIA") {
        if (data.transferencia) {
          datosActualizacion.transferencia = {
            origenEntidadId: new ObjectId(data.transferencia.origenEntidadId),
            destinoEntidadId: new ObjectId(data.transferencia.destinoEntidadId),
          };
        }
        delete datosActualizacion.entidadId;
      } else {
        datosActualizacion.entidadId = new ObjectId(data.entidadId);
        delete datosActualizacion.transferencia;
      }

      // Eliminar campos undefined para no sobrescribir con null/undefined accidentalmente
      Object.keys(datosActualizacion).forEach((key) => {
        if (datosActualizacion[key] === undefined) {
          delete datosActualizacion[key];
        }
      });

      const resultado = await this.movimientoRepository.actualizar(id, datosActualizacion);

      if (!resultado) {
        throw new HttpError(404, "Movimiento no encontrado o no se pudo actualizar");
      }

      return resultado;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError("Error al actualizar el movimiento");
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
        throw new HttpError(404, "Movimiento no encontrado o no se pudo eliminar");
      }

      return resultado;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError("Error al eliminar el movimiento");
    }
  }

  /**
   * Obtiene todos los movimientos paginados
   * @returns {Promise<object>} - Lista de movimientos y metadatos
   * @throws {object} - Error con formato {status, message}
   */
  async obtenerTodos(id, page, limit) {
    try {
      return await this.movimientoRepository.obtenerTodos(id, page, limit);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError("Error al obtener la lista de movimientos");
    }
  }

  /**
   * Calculos para Estadisticas
   *
   */
  async estadisticasDashBoard(id) {
    try {
      //optenemos todo los movimientos
      const {totales} = await this.movimientoRepository.estadisticasMovimientosDelUsuario(id);

      const totalIngresos = _.get(totales, "[0].totalIngresos", 0);
      const totalGastos = _.get(totales, "[0].totalGastos", 0);

      const estadisticas = {
        totalIngresado: totalIngresos,
        totalEgresado: totalGastos,
        totalDisponible: totalIngresos - totalGastos,
      };
      return estadisticas;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError("Error al generar las estadísticas del dashboard");
    }
  }

  /**
   * Obtiene el ranking de categorías para el usuario
   * @param {string} usuarioId - ID del usuario
   * @returns {Promise<Array>} - Ranking de categorías
   */
  async rankingCategorias(usuarioId) {
    try {
      return await this.movimientoRepository.rankingCategorias(usuarioId);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new ServiceError("Error al obtener el ranking de categorías");
    }
  }
}

module.exports = new MovimientoService();
