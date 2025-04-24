// Implementa la lógica de negocio y coordina las interacciones entre el dominio y la infraestructura.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthRepository = require('../../domain/repositories/authRepository');

class authService {
  constructor() {
    this.authRepository = new AuthRepository();
  }
  // Validar la session
  async getUserByEmail(password, email) {
    try {
      // Lógica para obtener el usuario desde el repositorio
      const usuario = await this.authRepository.getUserByEmail(email);

      // Verificar si el usuario existe
      if (!usuario) {
        throw new Error(
          JSON.stringify({
            status: 404,
            message: 'Usuario no encontrado o credenciales inválidas',
          })
        );
      }

      // Verificar si la contraseña es correcta
      const isMatch = await bcrypt.compare(password, usuario.password);
      if (!isMatch) {
        throw new Error(
          JSON.stringify({
            status: 401,
            message: 'No autorizado, contraseña incorrecta',
          })
        );
      }

      // Retornamos el token
      return jwt.sign(usuario, process.env.KEY_SECRET, {
        expiresIn: `${process.env.EXPRESS_EXPIRE}ms`,
      });
    } catch (error) {
      if (error.message) {
        throw new Error(error.message); // Mostramos el mensaje del error original
      } else {
        // Si el error no tiene mensaje, lanzamos un error genérico
        throw new Error(
          JSON.stringify({
            status: 400,
            message: 'Error en el repositorio de autenticación',
          })
        );
      }
    }
  }
}

module.exports = authService;
