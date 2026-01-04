const ConnectToDatabase = require("../../../core/infrastructure/connections/mongodb");

class DivisaModel {
  constructor() {
    this.dbConnection = ConnectToDatabase;
  }

  async buscarTodos() {
    try {
      const collection = this.dbConnection.db.collection("divisas");
      const divisas = await collection
        .aggregate([
          {
            $project: {
              _id: 1,
              id: "$_id", // Keeping 'id' for compatibility if needed, but 'value' is main
              value: "$_id",
              label: {
                $concat: ["$tipo", " - ", "$_id", " - ", "$nombre"],
              },
            },
          },
        ])
        .toArray();
      return divisas;
    } catch (error) {
      console.error("ErrorModelo: buscarTodos divisas", error);
      throw {
        status: 500,
        message: "Error al obtener las divisas",
        metadata: {errorOriginal: error.message},
      };
    }
  }
}

module.exports = new DivisaModel();
