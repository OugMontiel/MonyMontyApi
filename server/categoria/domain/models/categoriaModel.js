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
              isPrivate: {$ne: ["$usuarioId", null]},
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

  async crear(datos) {
    try {
      const collection = this.dbConnection.db.collection("categorias");
      const result = await collection.insertOne({
        ...datos,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      return result.insertedId;
    } catch (error) {
      console.error("ErrorModelo: crear categoria", error);
      throw {
        status: 500,
        message: "Error al crear la categoría",
        metadata: {errorOriginal: error.message},
      };
    }
  }

  async agregarSubcategoria(categoriaId, subcategoria) {
    try {
      const collection = this.dbConnection.db.collection("categorias");
      const result = await collection.updateOne(
        {_id: new ObjectId(categoriaId)},
        {
          $push: {
            subcategorias: {
              _id: new ObjectId(),
              ...subcategoria,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          $set: {updatedAt: new Date()},
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("ErrorModelo: agregarSubcategoria", error);
      throw {
        status: 500,
        message: "Error al agregar la subcategoría",
        metadata: {errorOriginal: error.message},
      };
    }
  }
}

module.exports = new CategoriaModel();
