/**
 * Componente para conectar a MongoDB.
 * Utiliza el patrón Singleton para asegurar una única instancia de conexión.
 * Permite abrir y cerrar la conexión de forma controlada.
 */
const {MongoClient} = require("mongodb");

/**
 * Clase para manejar conexiones a MongoDB con patrón Singleton
 */
class ConnectToDatabase {
  /**
   * Instancia única de la clase ConnectToDatabase.
   * Utiliza el patrón Singleton para evitar múltiples conexiones.
   * @type {ConnectToDatabase}
   */
  static instancia;
  db;
  cliente;
  #usuario;
  #contraseña;

  /**
   * Crea una instancia única
   * @param {object} credenciales - Credenciales de conexión.
   * @param {string} credenciales.usuario - Usuario para la conexión.
   * @param {string} credenciales.contraseña - Contraseña para la conexión.
   * @returns
   */
  constructor(
    {usuario, contraseña} = {
      usuario: process.env.MONGO_USER,
      contraseña: process.env.MONGO_PWD,
    }
  ) {
    if (ConnectToDatabase.instancia) {
      return ConnectToDatabase.instancia;
    }

    this.#usuario = usuario;
    this.#contraseña = contraseña;

    ConnectToDatabase.instancia = this;
  }

  /**
   * Abre la conexión con la base de datos
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async conectar() {
    if (this.estaConectado()) return this.db;

    try {
      const usaSrv = process.env.MONGO_ACCESS.includes("+srv");
      const urlConexion = usaSrv
        ? `${process.env.MONGO_ACCESS}${this.#usuario}:${this.#contraseña}@${process.env.MONGO_HOST}`
        : `${process.env.MONGO_ACCESS}${this.#usuario}:${this.#contraseña}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;

      this.cliente = new MongoClient(urlConexion, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });

      await this.cliente.connect();
      this.db = this.cliente.db(process.env.MONGO_DB_NAME);

      // console.log("Conexión a MongoDB establecida correctamente");
      return this.db;
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error);
      this.cliente = undefined;
      this.db = undefined;

      throw {
        status: 503,
        message: "Error al conectar con la base de datos",
        metadata: {
          tipo: "conexion_bd",
          errorOriginal: error.message,
          host: process.env.MONGO_HOST,
        },
      };
    }
  }

  /**
   * Cierra la conexión con la base de datos
   * @throws {object} - Error con formato {status, message, metadata}
   */
  async desconectar() {
    if (!this.cliente) {
      console.warn("No hay conexión activa para cerrar");
      return;
    }

    try {
      await this.cliente.close();
      // console.log("Conexión a MongoDB cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar conexión con MongoDB:", error);
      throw {
        status: 500,
        message: "Error al cerrar la conexión con la base de datos",
        metadata: {
          tipo: "desconexion_bd",
          errorOriginal: error.message,
        },
      };
    } finally {
      this.cliente = undefined;
      this.db = undefined;
    }
  }

  /**
   * Verifica el estado de la conexión
   * @returns {boolean} - True si hay conexión activa
   */
  estaConectado() {
    return !!this.cliente && !!this.db;
  }
}

module.exports = new ConnectToDatabase();
