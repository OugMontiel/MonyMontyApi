const {ObjectId} = require("mongodb");
const ConnectToDatabase = require("../../../core/infrastructure/connections/mongodb");
const HttpError = require("../../../core/utils/HttpError");
const modelsError = require("../../../core/Domain/models/modelsError.js");

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
    }
  }

  /**
   * Obtiene todos los movimientos
   * @returns {Promise<Array>} - Lista de movimientos
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async buscarTodos(id) {
    try {
      const collection = this.dbConnection.db.collection("movimiento");
      const movimientos = await collection
        .aggregate([
          {$match: {usuarioId: new ObjectId(id)}},
            // Lookup Entidad
          {
            $lookup: {
              from: "entidades",
              localField: "entidadId",
              foreignField: "_id",
              as: "entidadInfo",
            },
          },
          {
            $unwind: {
              path: "$entidadInfo",
              preserveNullAndEmptyArrays: true,
            },
          },
          // Lookup Categoria
          {
            $lookup: {
              from: "categorias",
              localField: "categoriaId",
              foreignField: "_id",
              as: "categoriaInfo",
            },
          },
          {
            $unwind: {
              path: "$categoriaInfo",
              preserveNullAndEmptyArrays: true,
            },
          },
          // Extract Subcategoria
          {
            $addFields: {
              subcategoriaInfo: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: {$ifNull: ["$categoriaInfo.subcategorias", []]},
                      as: "sub",
                      cond: {$eq: ["$$sub._id", "$subcategoriaId"]},
                    },
                  },
                  0,
                ],
              },
            },
          },
          // Populate final fields
          {
            $addFields: {
              entidad: "$entidadInfo",
              categoria: "$categoriaInfo",
              subcategoria: "$subcategoriaInfo",
            },
          },
          // Cleanup
          {
            $project: {
              entidadInfo: 0,
              categoriaInfo: 0,
              subcategoriaInfo: 0,
            },
          },
        ])
        .toArray();

      return movimientos;
    } catch (error) {
      console.error("ErrorModelo: buscarTodos movimientos", error);
      throw {
        status: 500,
        message: "Error al obtener los movimientos",
        metadata: {errorOriginal: error.message},
      };
    }
  }

  /**
   * estadisticas movimientos por ID de usuario
   * @param {string} usuarioId - ID del usuario
   * @returns {Promise<Array>} - estadisticas movimientos del usuario
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async estadisticasMovimientos(usuarioId) {
    try {
      const collection = this.dbConnection.db.collection("movimiento");
      const movimientos = await collection
        .aggregate([
          {$match: {usuarioId: new ObjectId(usuarioId)}},
          {
            $facet: {
              totales: [
                {
                  $group: {
                    _id: null,
                    totalIngresos: {
                      $sum: {
                        $cond: [{$eq: ["$tipo", "INGRESO"]}, "$monto", 0],
                      },
                    },
                    totalGastos: {
                      $sum: {
                        $cond: [{$eq: ["$tipo", "EGRESO"]}, "$monto", 0],
                      },
                    },
                  },
                },
              ],
              ultimo: [{$sort: {fecha: -1}}, {$limit: 1}],
            },
          },
        ])
        .toArray();
      return movimientos;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError();
    }
  }
  /**
   * Cuenta los movimientos de un usuario
   * @param {string} usuarioId - ID del usuario
   * @returns {Promise<number>} - Cantidad de movimientos
   */
  async contarMovimientos(usuarioId) {
    try {
      const collection = this.dbConnection.db.collection("movimiento");
      const count = await collection.countDocuments({
        usuarioId: new ObjectId(usuarioId),
      });
      return count;
    } catch (error) {
      console.error("ErrorModelo: contarMovimientos", error);
      throw {
        status: 500,
        message: "Error al contar los movimientos",
        metadata: {errorOriginal: error.message},
      };
    }
  }
}

module.exports = new MovimientoModel();
