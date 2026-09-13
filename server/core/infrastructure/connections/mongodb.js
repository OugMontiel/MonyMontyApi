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
      const usuarioEncoded = encodeURIComponent(this.#usuario || "");
      const pwdEncoded = encodeURIComponent(this.#contraseña || "");
      const host = process.env.MONGO_HOST;
      const port = process.env.MONGO_PORT;
      const dbName = process.env.MONGO_DB_NAME;

      const urlConexion = usaSrv
        ? `${process.env.MONGO_ACCESS}${usuarioEncoded}:${pwdEncoded}@${host}/${dbName || ""}?retryWrites=true&w=majority`
        : `${process.env.MONGO_ACCESS}${usuarioEncoded}:${pwdEncoded}@${host}:${port}/${dbName || ""}`;

      // Configuración de conexión segura (TLS/SSL) y pool de conexiones para MongoDB Atlas
      const clientOptions = {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
        minPoolSize: 5,
        maxPoolSize: 50,
        tls: process.env.MONGO_TLS !== "false", // TLS obligatorio por defecto para Atlas
        tlsAllowInvalidCertificates: false, // Prevenir ataques MITM (no permitir certificados inválidos)
      };

      this.cliente = new MongoClient(urlConexion, clientOptions);

      await this.cliente.connect();
      this.db = this.cliente.db(dbName);

      return this.db;
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error.message);
      this.cliente = undefined;
      this.db = undefined;
      const dbError = new Error("Error al conectar con la base de datos");
      dbError.status = 503;
      dbError.metadata = {
        tipo: "conexion_bd",
        errorOriginal: process.env.NODE_ENV === "production" ? "Fallo de conexión" : error.message,
      };

      throw dbError;
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
      const disconnectError = new Error("Error al cerrar la conexión con la base de datos");
      disconnectError.status = 500;
      disconnectError.metadata = {
        tipo: "desconexion_bd",
        errorOriginal: error.message,
      };

      throw disconnectError;
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
