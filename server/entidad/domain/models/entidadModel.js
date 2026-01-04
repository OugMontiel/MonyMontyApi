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
                $concat: ["$tipo", " - ", "$nombre", " - ", "$numero"],
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
}

module.exports = new EntidadModel();
