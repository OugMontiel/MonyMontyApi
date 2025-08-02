const {ObjectId} = require("mongodb");
const ConnectToDatabase = require("../../../core/infrastructure/connections/mongodb");

class User {
  constructor() {
    // Crear una única instancia de conexión a la base de datos
    this.dbConnection = ConnectToDatabase;
  }
  async createUser(userData) {
    try {
      // console.log("Datos del usuario a insertar:", userData);
      await this.dbConnection.connectOpen(); // Abrir la conexión a la BD
      // console.log("Conexión abierta:", this.dbConnection.db?.databaseName);
      const collection = this.dbConnection.db.collection("user");
      const res = await collection.insertMany([userData]);
      return res;
    } catch (error) {
      throw new Error(`Error al insertar usuario: ${error.message}`);
    } finally {
      await this.dbConnection.connectClose(); // Cerrar la conexión en el bloque finally
    }
  }
  async findById(id) {
    try {
      await this.dbConnection.connectOpen(); // Abrir la conexión a la BD
      const collection = this.dbConnection.db.collection("user");
      const [res] = await collection.find({_id: new ObjectId(id)}).toArray();
      return res;
    } catch (error) {
      throw new Error(`Error al insertar usuario: ${error.message}`);
    } finally {
      await this.dbConnection.connectClose(); // Cerrar la conexión en el bloque finally
    }
  }
  async updateById(id, updateData) {
    try {
      await this.dbConnection.connectOpen(); // Abrir la conexión a la BD
      const collection = this.dbConnection.db.collection("user");
      const res = await collection.updateOne({_id: new ObjectId(id)}, {$set: updateData}, {upsert: false});
      // console.log("Resultado de la actualización:", res);
      return res;
    } catch (error) {
      throw new Error(JSON.stringify({status: 500, message: "Error updating user"}));
    } finally {
      await this.dbConnection.connectClose(); // Cerrar la conexión en el bloque finally
    }
  }
  async deleteUser(id) {
    try {
      await this.dbConnection.connectOpen(); // Abrir la conexión a la BD
      const collection = this.dbConnection.db.collection("user");
      const res = await collection.deleteMany({_id: new ObjectId(id)});
      return res;
    } catch (error) {
      throw new Error(JSON.stringify({status: 500, message: "Error updating user"}));
    } finally {
      await this.dbConnection.connectClose(); // Cerrar la conexión en el bloque finally
    }
  }
}

module.exports = User;
