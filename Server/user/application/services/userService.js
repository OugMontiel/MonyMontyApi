// Implementa la lógica de negocio y coordina las interacciones entre el dominio y la infraestructura.
const UserRepository = require("../../domain/repositories/userRepository");
const bcrypt = require("bcryptjs");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async prueva(req, res) {
    return {message: "¡entrando a userRepository de ruraqMaki!"};
  }
  async createUser(data) {
    try {
      // console.log('data.password',data);

      // Encriptar la contraseña
      const newpassword = await bcrypt.hash(data.password, 10);
      // Reemplazar la contraseña original con el hash
      data.password = newpassword;

      // console.log('data.password', data.password);
      return await this.userRepository.createUser(data);
    } catch (error) {
      // console.error("Error:", error.message);
      throw new Error(JSON.stringify({status: 500, message: "Error al crear el usuario"}));
    }
  }
  async getUserById(id) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new Error(JSON.stringify({status: 404, message: "User not found"}));
    }
    delete user.password;
    return user;
  }
  async updateUser(id, data) {
    const updatedUser = await this.userRepository.updateById(id, data);
    if (!updatedUser) {
      throw new Error(
        JSON.stringify({
          status: 404,
          message: "User not found or could not be updated",
        })
      );
    }

    // Verificar si se actualizó algún documento
    if (res.modifiedCount === 0) {
      throw new Error(JSON.stringify({status: 404, message: "User not found"}));
    }
    return updatedUser;
  }
  async deleteUser(id) {
    const deletedUser = await this.userRepository.deleteUser(id);
    if (!deletedUser) {
      throw new Error(
        JSON.stringify({
          status: 404,
          message: "User not found or could not be deleted",
        })
      );
    }
    return deletedUser;
  }
  // async getUserByNickAndPassword(nick, password) {
  //   // Lógica para obtener el usuario desde el repositorio
  //   const user = await this.userRepository.getNickByNickAndPassword(
  //     nick,
  //     password
  //   );

  //   if (!user) {
  //     throw new Error(
  //       JSON.stringify({
  //         status: 404,
  //         message: 'User not found or invalid credentials',
  //       })
  //     );
  //   }

  //   return user.nick; // Devuelve el nickname si las credenciales son correctas
  // }
  // async getUserbyNickAndPassword(body) {
  //   const [user] = await this.userRepository.getNick(body);

  //   if (!user)
  //     throw new Error(
  //       JSON.stringify({ status: 404, message: 'usuario service' })
  //     );
  //   const token = await this.userRepository.getPassword(body.password, user);
  //   if (!token)
  //     throw new Error(
  //       JSON.stringify({ status: 404, message: 'pasword service' })
  //     );
  //   return token;
  // }

  // async searchUsersByName(name) {
  //   return await this.userRepository.searchByName(name);
  // }
}

module.exports = UserService;
