const {ObjectId} = require("mongodb");

const ConnectToDatabase = require("../../../core/infrastructure/connections/mongodb");
const HttpError = require("../../../core/utils/HttpError");
const modelsError = require("../../../core/domain/models/modelsError.js");

class authModel {
  constructor() {
    // Crear una única instancia de conexión a la base de datos
    this.dbConnection = ConnectToDatabase;
  }
  // Obtener un usuario por su 'email'
  async getUserByEmail(Email) {
    try {
      const collection = this.dbConnection.db.collection("user");
      const [res] = await collection
        .find(
          {email: Email},
          {
            projection: {
              password: 0,
              auditoria: 0,
              tokenRecuperacion: 0,
              tokenSesion: 0,
              createdAt: 0,
              deletedAt: 0,
              updatedAt: 0,
            },
          }
        )
        .toArray();
      return res;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError();
    }
  }
  async upDateUsuario(filtro, datosSet = {}, datosUnset = {}) {
    try {
      const collection = this.dbConnection.db.collection("user");
      const resultado = await collection.updateOne(filtro, {$set: datosSet, $unset: datosUnset});

      return {
        matched: resultado.matchedCount,
        modified: resultado.modifiedCount,
      };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError();
    }
  }
  async getUserFromToken(token) {
    try {
      const collection = this.dbConnection.db.collection("user");
      const [res] = await collection.find({tokenRecuperacion: token}).toArray();
      return res;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError();
    }
  }
  async getUserByIdAndSessionToken(userId, token) {
    try {
      const collection = this.dbConnection.db.collection("user");

      const [res] = await collection
        .find(
          {
            _id: new ObjectId(userId),
            tokenSesion: token,
          },
          {
            projection: {
              tokenSesion: 1,
            },
          }
        )
        .toArray();
      return res;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError();
    }
  }
}

module.exports = new authModel();
