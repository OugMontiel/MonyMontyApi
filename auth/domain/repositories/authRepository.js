const AuthModel = require('../models/authModel.js');

class authRepository {
  constructor() {
    this.authModel = new AuthModel();
  }
  // Obtener un usuario basado en su 'email' y comparar Su contraseña
  async getUserByEmail(email) {
    try {
      // Ejecutamos el pipeline de agregación en el modelo Auth
      const usuario = await this.authModel.getUserByEmail(email);

      // Validamos que el resultado no sea undefined o un array vacío
      if (!usuario) {
        return false;
      }
      // console.log('resultado Encontrado', usuario.length);
      if (usuario.length === 0) {
        throw new Error(JSON.stringify({ status: 404, message: 'Invalid credentials' }));
      }

      // validación usuarios duplicados
      if (usuario.length > 1) {
        throw new Error(
          JSON.stringify({
            status: 500,
            message: 'Multiple users found with the same email. Contact support.',
          })
        );
      }

      // Si se encontró un usuario, devolvemos el primer (y único) resultado en el array
      return usuario;
    } catch (error) {
      if (error.message) {
        throw new Error(error.message); // Re-lanzamos el error original
      } else {
        // Si ocurre otro tipo de error, lanzamos uno genérico
        throw new Error(JSON.stringify({ status: 400, message: 'Error in auth repository' }));
      }
    }
  }
}

module.exports = authRepository;
