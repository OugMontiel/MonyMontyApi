/**
 * Componente para conectar a MongoDB.
 * Utiliza el patrón Singleton para asegurar una única instancia de conexión.
 * Permite abrir y cerrar la conexión de forma controlada.
 */
const {MongoClient} = require("mongodb");

/**
 * Clase para gestionar la conexión a la base de datos MongoDB.
 * 
 */
class ConnectToDatabase {
  /**
   * Instancia única de la clase ConnectToDatabase.
   * Utiliza el patrón Singleton para evitar múltiples conexiones.
   * @type {ConnectToDatabase}
   */
  static instanceConnect;
  db;
  connection;
  user;
  #password;

  /**
   * Crea una instancia de la clase ConnectToDatabase.
   * @param {user} param - Usuario para la conexión a MongoDB.
   * @param {pwd} param - Contraseña para la conexión a MongoDB.
   * se toman de las variables de entorno MONGO_USER y MONGO_PWD.
   * @returns 
   */
  constructor({user, pwd} = {user: process.env.MONGO_USER, pwd: process.env.MONGO_PWD}) {
    if (ConnectToDatabase.instanceConnect && this.connection) {
      return ConnectToDatabase.instanceConnect;
    }
    this.user = user;
    this.setPassword = pwd;
    
    // this.open();
    ConnectToDatabase.instanceConnect = this;
  }

  /**
   * Abre una conexión a la base de datos MongoDB.
   */
  async connectOpen() {
    if (this.connection) {
      return this.db;
    }

    const isSrv = process.env.MONGO_ACCESS.includes("+srv");

    if (isSrv) {
      // MongoDB Atlas (sin puerto)
      this.connection = new MongoClient(`${process.env.MONGO_ACCESS}${this.user}:${this.getPassword}@${process.env.MONGO_HOST}`);
    } else {
      // MongoDB local (con puerto)
      this.connection = new MongoClient(
        `${process.env.MONGO_ACCESS}${this.user}:${this.getPassword}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
      );
    }

    try {
      await this.connection.connect();
      this.db = this.connection.db(process.env.MONGO_DB_NAME);
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error.message);
      this.connection = undefined;
      throw new Error("Error connecting: " + error.message);
    }
  }

  /**
   * Cierra la conexión a la base de datos MongoDB.
   * Si no hay conexión abierta, muestra un mensaje de advertencia.
   */
  async connectClose() {
    if (this.connection) {
      try {
        await this.connection.close();
      } catch (error) {
        console.error("Error al cerrar la conexión:", error.message);
      } finally {
        this.connection = undefined;
        this.db = undefined;
      }
    } else {
      console.warn("Intento de cerrar una conexión inexistente.");
    }
  }
  
  get getPassword() {
    return this.#password;
  }
  set setPassword(pwd) {
    this.#password = pwd;
  }
}
module.exports = ConnectToDatabase;
