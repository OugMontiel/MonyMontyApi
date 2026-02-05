const authModel = require("../models/authModel.js");
const HttpError = require("../../../core/utils/HttpError");
const RepositoryError = require("../../../core/Domain/Repository/RepositoryError.js");

class authRepository {
  // Obtener un usuario basado en su 'email' y comparar Su contraseña
  async getUserByEmail(email) {
    try {
      // Ejecutamos el pipeline de agregación en el modelo Auth
      const usuario = await authModel.getUserByEmail(email);

      // Validamos que el resultado no sea undefined o un array vacío
      if (!usuario) throw new HttpError(404, "Usuario o contraseña incorrecta.");
      if (usuario.length === 0) throw new HttpError(404, "Credenciales inválidas");
      if (usuario.length > 1) throw new HttpError(500, "Múltiples usuarios encontrados con el mismo email. Contacte al soporte.");

      // Si se encontró un usuario, devolvemos el primer (y único) resultado en el array
      return usuario;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new RepositoryError();
    }
  }
  async guardarTokenRecuperacion(email, token) {
    try {
      const filtro = {email}; // Filtro para buscar el usuario
      const datosSet = {tokenRecuperacion: token}; // Dato a actualizar

      const resultado = await authModel.upDateUsuario(filtro, datosSet);
      if (resultado.matched > 1) throw new HttpError(500, "Múltiples usuarios encontrados con el mismo email. Contacte al soporte.");

      return resultado;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new RepositoryError();
    }
  }
  async guardarNewContraseña(email, newpassword) {
    try {
      const filtro = {email}; // Filtro para buscar el usuario
      const datosSet = {password: newpassword}; // Dato a actualizar
      const datosUnset = { tokenRecuperacion: 1 }; // Campo a eliminar

      const resultado = await authModel.upDateUsuario(filtro, datosSet, datosUnset);
      if (resultado.matched > 1) throw new HttpError(500, "Múltiples usuarios encontrados con el mismo email. Contacte al soporte.");

      return resultado;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new RepositoryError();
    }
  }
  async getUserFromToken(token) {
    try {
      const usuario = await authModel.getUserFromToken(token);
      if (!usuario) throw new HttpError(404, "Usuario no encontrado para el token proporcionado");
      delete usuario.password;
      return usuario;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new RepositoryError();
    }
  }
}

module.exports = new authRepository();
