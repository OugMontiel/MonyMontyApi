const {ObjectId} = require("mongodb");
const ConnectToDatabase = require("../../../core/infrastructure/connections/mongodb");

class CategoriaModel {
  constructor() {
    this.dbConnection = ConnectToDatabase;
  }

  async buscarTodos(usuarioId) {
    try {
      const collection = this.dbConnection.db.collection("categorias");
      const categorias = await collection
        .aggregate([
          {
            $match: {
              $or: [{usuarioId: new ObjectId(usuarioId)}, {usuarioId: null}],
              esSistema: {$ne: true},
            },
          },
          {
            $project: {
              _id: {$toString: "$_id"},
              value: {$toString: "$_id"},
              label: "$categoria",
              subcategorias: {
                $map: {
                  input: {
                    $filter: {
                      input: "$subcategorias",
                      as: "sub",
                      cond: {$ne: ["$$sub.esSistema", true]},
                    },
                  },
                  as: "sub",
                  in: {
                    value: {$toString: "$$sub._id"},
                    label: "$$sub.subcategoria",
                  },
                },
              },
            },
          },
        ])
        .toArray();
      return categorias;
    } catch (error) {
      console.error("ErrorModelo: buscarTodos categorias", error);
      throw {
        status: 500,
        message: "Error al obtener las categorías",
        metadata: {errorOriginal: error.message},
      };
    }
  }
}

module.exports = new CategoriaModel();
