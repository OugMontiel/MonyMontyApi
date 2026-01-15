const {ObjectId} = require("mongodb");
const ConnectToDatabase = require("../../../core/infrastructure/connections/mongodb");

class EntidadModel {
  constructor() {
    this.dbConnection = ConnectToDatabase;
  }

  async buscarTodos(usuarioId) {
    try {
      const collection = this.dbConnection.db.collection("entidades");
      const entidades = await collection
        .aggregate([
          {
            $match: {
              usuarioId: new ObjectId(usuarioId),
            },
          },
          {
            $project: {
              _id: {$toString: "$_id"},
              value: {$toString: "$_id"},
              label: {
                $cond: {
                  if: {$and: [{$ne: ["$numero", null]}, {$ne: ["$numero", ""]}]},
                  then: {$concat: ["$tipo", " - ", "$nombre", " - ", "$numero"]},
                  else: "$nombre",
                },
              },
            },
          },
        ])
        .toArray();
      return entidades;
    } catch (error) {
      console.error("ErrorModelo: buscarTodos entidades", error);
      throw {
        status: 500,
        message: "Error al obtener las entidades",
        metadata: {errorOriginal: error.message},
      };
    }
  }

  async insertar(datos) {
    try {
      const collection = this.dbConnection.db.collection("entidades");
      const result = await collection.insertOne(datos);
      return result.acknowledged ? {...datos, _id: result.insertedId.toString()} : null;
    } catch (error) {
      console.error("ErrorModelo: insertar entidad", error);
      throw {
        status: 500,
        message: "Error al crear la entidad",
        metadata: {errorOriginal: error.message},
      };
    }
  }
}

module.exports = new EntidadModel();
