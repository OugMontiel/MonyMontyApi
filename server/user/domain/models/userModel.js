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

      // console.log("Conexión abierta:", this.dbConnection.db?.databaseName);
      const collection = this.dbConnection.db.collection("user");
      const res = await collection.insertMany([userData]);
      return res;
    } catch (error) {
      throw new Error(`Error al insertar usuario: ${error.message}`);
    }
  }
  async findById(id) {
    try {
      const collection = this.dbConnection.db.collection("user");
      const [res] = await collection.find({_id: new ObjectId(id)}).toArray();
      return res;
    } catch (error) {
      throw new Error(`Error al Buscar usuario: ${error.message}`);
    }
  }
  async updateById(id, updateData) {
    try {
      const collection = this.dbConnection.db.collection("user");
      const res = await collection.updateOne({_id: new ObjectId(id)}, {$set: updateData}, {upsert: false});
      // console.log("Resultado de la actualización:", res);
      return res;
    } catch (error) {
      throw new Error(JSON.stringify({status: 500, message: "Error updating user"}));
    }
  }
  async deleteUser(id) {
    try {
      const collection = this.dbConnection.db.collection("user");
      const res = await collection.deleteMany({_id: new ObjectId(id)});
      return res;
    } catch (error) {
      throw new Error(JSON.stringify({status: 500, message: "Error updating user"}));
    }
  }
  async findByEmail(email) {
    try {
      const collection = this.dbConnection.db.collection("user");
      const res = await collection.findOne({email});
      return res;
    } catch (error) {
      throw new Error(`Error al Buscar usuario por email: ${error.message}`);
    }
  }
}

module.exports = User;
