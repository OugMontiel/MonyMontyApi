const {ObjectId} = require("mongodb");
const ConnectToDatabase = require("../../infrastructure/mongodb");

class User {
  constructor() {
    // Crear una única instancia de conexión a la base de datos
    this.dbConnection = new ConnectToDatabase();
  }
  async createProduct(userData) {
    try {
      
      const collection = this.dbConnection.db.collection("product");
      const res = await collection.insertMany([userData]);
      return res;
    } catch (error) {
      throw new Error(`Error al insertar usuario: ${error.message}`);
    } 
  }
  async findById(id) {
    try {
      
      const collection = this.dbConnection.db.collection("product");
      const [res] = await collection.find({_id: new ObjectId(id)}).toArray();
      return res;
    } catch (error) {
      throw new Error(`Error al insertar usuario: ${error.message}`);
    } 
  }
  async updateById(id, updateData) {
    try {
      
      const collection = this.dbConnection.db.collection("product");
      const res = await collection.updateOne({_id: new ObjectId(id)}, {$set: updateData}, {upsert: false});
      return res;
    } catch (error) {
      throw new Error(JSON.stringify({status: 500, message: "Error updating user"}));
    } 
  }
  async deleteProduct(id) {
    try {
      
      const collection = this.dbConnection.db.collection("product");
      const res = await collection.deleteMany({_id: new ObjectId(id)});
      return res;
    } catch (error) {
      throw new Error(JSON.stringify({status: 500, message: "Error updating user"}));
    } 
  }
  async findAll() {
    try {
      
      const collection = this.dbConnection.db.collection("product");
      const res = await collection.find().toArray(); // Obtener todos los documentos
      return res;
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    } 
  }
}

module.exports = User;
