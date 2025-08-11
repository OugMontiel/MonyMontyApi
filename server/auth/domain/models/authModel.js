const ConnectToDatabase = require("../../../core/infrastructure/connections/mongodb");

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
      throw new Error(`Error al insertar usuario: ${error.message}`);
    } finally {
      await this.dbConnection.desconectar(); // Cerrar la conexión en el bloque finally
    }
  }
}

module.exports = authModel;
