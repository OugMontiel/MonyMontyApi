/**
 * Componente para conectar a MongoDB.
 * Utiliza el patrón Singleton para asegurar una única instancia de conexión.
 * Permite abrir y cerrar la conexión de forma controlada.
 */
const fs = require("node:fs");
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
      const modoAutenticacion = process.env.MONGO_AUTH_MODE?.toLowerCase();
      const host = process.env.MONGO_HOST;
      const port = process.env.MONGO_PORT;
      const dbName = process.env.MONGO_DB_NAME;
      const nombreBaseDatos = dbName || "";

      if (!host) {
        throw new Error("MONGO_HOST no está configurado");
      }

      let urlConexion;
      const clientOptions = {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
        minPoolSize: 5,
        maxPoolSize: 50,
        tls: true, // TLS obligatorio por defecto para Atlas
        tlsAllowInvalidCertificates: false, // Prevenir ataques MITM (no permitir certificados inválidos)
      };

      if (modoAutenticacion === "password") {
        const usaSrv = process.env.MONGO_ACCESS.includes("+srv");
        const usuarioEncoded = encodeURIComponent(this.#usuario || "");
        const pwdEncoded = encodeURIComponent(this.#contraseña || "");

        if (!this.#usuario || !this.#contraseña) {
          throw new Error("MONGO_USER y MONGO_PWD son obligatorios en modo password");
        }

        urlConexion = usaSrv
        ? `${process.env.MONGO_ACCESS}${usuarioEncoded}:${pwdEncoded}@${host}/${nombreBaseDatos}?retryWrites=true&w=majority`
        : `${process.env.MONGO_ACCESS}${usuarioEncoded}:${pwdEncoded}@${host}:${port}/${nombreBaseDatos}`;
      } else if (modoAutenticacion === "certificate") {
        const rutaCertificado = process.env.MONGO_CERT_PATH;

        if (!rutaCertificado) {
          throw new Error("MONGO_CERT_PATH es obligatorio en modo certificate");
        }

        const certificado = fs.readFileSync(rutaCertificado);
        if (certificado.length === 0) {
          throw new Error(`El certificado está vacío: ${rutaCertificado}`);
        }

        urlConexion = `mongodb+srv://${host}/${nombreBaseDatos}?authMechanism=MONGODB-X509`;
        clientOptions.authMechanism = "MONGODB-X509";
        clientOptions.tlsCertificateKeyFile = rutaCertificado;
      } else {
        throw new Error("MONGO_AUTH_MODE debe ser 'password' o 'certificate'");
      }

      this.cliente = new MongoClient(urlConexion, clientOptions);

      await this.cliente.connect();
      this.db = this.cliente.db(dbName);

      return this.db;
    } catch (error) {
      const detalle = error.code === "ENOENT"
        ? `No se encontró el certificado configurado en MONGO_CERT_PATH: ${process.env.MONGO_CERT_PATH}`
        : error.message;
      console.error(`Error al conectar a MongoDB (${process.env.MONGO_AUTH_MODE || "modo no configurado"}): ${detalle}`);
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
