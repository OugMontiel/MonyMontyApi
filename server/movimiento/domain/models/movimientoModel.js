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
      if (error instanceof HttpError) throw error;
      throw new modelsError("Error al crear el movimiento en la base de datos");
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
      const resultados = await collection
        .aggregate([
          {$match: {_id: new ObjectId(id)}},
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
              entidad: {
                _id: "$entidadInfo._id",
                nombre: "$entidadInfo.nombre",
                tipo: "$entidadInfo.tipo",
                numero: "$entidadInfo.numero",
              },
              categoria: {
                _id: "$categoriaInfo._id",
                categoria: "$categoriaInfo.categoria",
                icono: "$categoriaInfo.icono",
                color: "$categoriaInfo.color",
              },
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

      return resultados.length > 0 ? resultados[0] : null;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError("Error al buscar el movimiento");
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
      if (error instanceof HttpError) throw error;
      throw new modelsError("Error al actualizar el movimiento");
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
      if (error instanceof HttpError) throw error;
      throw new modelsError("Error al eliminar el movimiento");
    }
  }

  /**
   * Obtiene todos los movimientos
   * @returns {Promise<Array>} - Lista de movimientos
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async buscarTodos(id, page, limit) {
    try {
      const collection = this.dbConnection.db.collection("movimiento");
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const limitParsed = parseInt(limit);

      const resultados = await collection
        .aggregate([
          {$match: {usuarioId: new ObjectId(id)}},
          {
            $facet: {
              metadata: [{$count: "total"}],
              data: [
                {$sort: {fecha: -1}},
                {$skip: skip},
                {$limit: limitParsed},
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
                    entidad: {
                      _id: "$entidadInfo._id",
                      nombre: "$entidadInfo.nombre",
                      tipo: "$entidadInfo.tipo",
                      numero: "$entidadInfo.numero",
                    },
                    categoria: {
                      _id: "$categoriaInfo._id",
                      categoria: "$categoriaInfo.categoria",
                      icono: "$categoriaInfo.icono",
                      color: "$categoriaInfo.color",
                    },
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
              ],
            },
          },
        ])
        .toArray();

      const data = resultados[0].data;
      const total = resultados[0].metadata[0] ? resultados[0].metadata[0].total : 0;
      const totalPages = Math.ceil(total / limitParsed);

      return {
        data,
        total,
        page: parseInt(page),
        totalPages,
        limit: limitParsed,
      };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError("Error al obtener los movimientos");
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
              ultimo: [
                {$sort: {fecha: -1}},
                {$limit: 1},
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
                {
                  $addFields: {
                    entidad: "$entidadInfo",
                  },
                },
              ],
            },
          },
        ])
        .toArray();
      return movimientos;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError("Error al obtener estadísticas de movimientos");
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
      if (error instanceof HttpError) throw error;
      throw new modelsError("Error al contar los movimientos");
    }
  }
  /**
   * Obtiene el ranking de gastos por categoría para el usuario
   * @param {string} usuarioId - ID del usuario
   * @returns {Promise<Array>} - Ranking de categorías
   */
  async rankingCategorias(usuarioId) {
    try {
      const collection = this.dbConnection.db.collection("movimiento");
      const ahora = new Date();
      const inicioMesActual = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

      const ranking = await collection
        .aggregate([
          {
            $match: {
              usuarioId: new ObjectId(usuarioId),
              tipo: "EGRESO",
              fecha: {$gte: inicioMesActual},
            },
          },
          {
            $group: {
              _id: {
                categoriaId: "$categoriaId",
                subcategoriaId: "$subcategoriaId",
              },
              monto: {$sum: "$monto"},
            },
          },
          {
            $group: {
              _id: "$_id.categoriaId",
              monto: {$sum: "$monto"},
              subcategorias: {
                $push: {
                  subcategoriaId: "$_id.subcategoriaId",
                  monto: "$monto",
                },
              },
            },
          },
          // Obtener el total general para calcular porcentajes
          {
            $facet: {
              totalGeneral: [
                {
                  $group: {
                    _id: null,
                    montoTotal: {$sum: "$monto"},
                  },
                },
              ],
              rankingCategorias: [
                // Lookup Categoria
                {
                  $lookup: {
                    from: "categorias",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoriaInfo",
                  },
                },
                {$unwind: "$categoriaInfo"},
                // Procesar subcategorías y obtener nombres
                {
                  $project: {
                    categoriaId: "$_id",
                    labelCategoria: "$categoriaInfo.categoria",
                    iconoCategoria: "$categoriaInfo.icono",
                    colorCategoria: "$categoriaInfo.color",
                    montoCategoria: "$monto",
                    subcategorias: {
                      $map: {
                        input: {
                          $slice: [
                            {
                              $sortArray: {
                                input: "$subcategorias",
                                sortBy: {monto: -1},
                              },
                            },
                            3,
                          ],
                        },
                        as: "sub",
                        in: {
                          subcategoriaId: "$$sub.subcategoriaId",
                          montoSubcategoria: "$$sub.monto",
                          labelSubcategoria: {
                            $let: {
                              vars: {
                                subInfo: {
                                  $arrayElemAt: [
                                    {
                                      $filter: {
                                        input: "$categoriaInfo.subcategorias",
                                        as: "sc",
                                        cond: {$eq: ["$$sc._id", "$$sub.subcategoriaId"]},
                                      },
                                    },
                                    0,
                                  ],
                                },
                              },
                              in: "$$subInfo.subcategoria",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
          {$unwind: "$totalGeneral"},
          {$unwind: "$rankingCategorias"},
          {
            $project: {
              _id: "$rankingCategorias.categoriaId",
              categoriaId: "$rankingCategorias.categoriaId",
              labelCategoria: "$rankingCategorias.labelCategoria",
              montoCategoria: "$rankingCategorias.montoCategoria",
              porcentajeCategoria: {
                $cond: [
                  {$eq: ["$totalGeneral.montoTotal", 0]},
                  0,
                  {
                    $round: [
                      {
                        $multiply: [{$divide: ["$rankingCategorias.montoCategoria", "$totalGeneral.montoTotal"]}, 100],
                      },
                      0,
                    ],
                  },
                ],
              },
              iconoCategoria: "$rankingCategorias.iconoCategoria",
              colorCategoria: "$rankingCategorias.colorCategoria",
              subcategorias: "$rankingCategorias.subcategorias",
            },
          },
          {$sort: {montoCategoria: -1}},
        ])
        .toArray();
      return ranking;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError("Error al obtener el ranking de categorías");
    }
  }
}

module.exports = new MovimientoModel();
