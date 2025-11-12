const ConnectToDatabase = require("../../../core/infrastructure/connections/mongodb");
const HttpError = require("../../../core/utils/HttpError");
const modelsError = require("../../../core/Domain/models/modelsError.js");

class authModel {
  constructor() {
    // Crear una única instancia de conexión a la base de datos
    this.dbConnection = ConnectToDatabase;
  }
  // Obtener un usuario por su 'email'
  async getUserByEmail(Email) {
    try {
      await this.dbConnection.conectar(); // Abrir la conexión a la BD
      const collection = this.dbConnection.db.collection("user");
      const [res] = await collection.find({email: Email}).toArray();
      // console.log('en modelo',res);
      return res;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError();
    } finally {
      await this.dbConnection.desconectar(); // Cerrar la conexión en el bloque finally
    }
  }
  async upDateUsuario(filtro, datosSet = {}, datosUnset = {}) {
    try {
      await this.dbConnection.conectar();
      const collection = this.dbConnection.db.collection("user");
      const resultado = await collection.updateOne(filtro, {$set: datosSet, $unset: datosUnset});

      return {
        matched: resultado.matchedCount,
        modified: resultado.modifiedCount,
      };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError();
    } finally {
      await this.dbConnection.desconectar();
    }
  }
  async getUserFromToken(token) {
    try {
      await this.dbConnection.conectar();
      const collection = this.dbConnection.db.collection("user");
      const [res] = await collection.find({tokenRecuperacion: token}).toArray();
      return res;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new modelsError();
    }
  }
}

module.exports = new authModel();
