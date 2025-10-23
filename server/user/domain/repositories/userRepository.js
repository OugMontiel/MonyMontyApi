// Contiene la interfaz para interactuar con la base de datos o cualquier otro tipo de almacenamiento de datos.
const UserModelo = require("../models/userModel");

class UserRepository {
  constructor() {
    this.insUserModelo = new UserModelo();
  }
  async createUser(userData) {
    try {
      return await this.insUserModelo.createUser(userData);
    } catch (error) {
      // console.error("Error:", error);
      throw new Error(JSON.stringify({status: 500, message: "Error saving user"}));
    }
  }
  async getById(id) {
    try {
      const user = await this.insUserModelo.findById(id);
      if (!user) return null;

      return {
        nombre: user.nombre,
        email: user.email,
      };
    } catch (error) {
      throw new Error(JSON.stringify({status: 400, message: "Error retrieving user"}));
    }
  }
  async updateById(id, updateData) {
    try {
      return await this.insUserModelo.updateById(id, updateData);
    } catch (error) {
      throw new Error(JSON.stringify({status: 500, message: "Error updating user"}));
    }
  }
  async deleteUser(id) {
    try {
      return await this.insUserModelo.deleteUser(id);
    } catch (error) {
      console.error("Error:", error);
      throw new Error(JSON.stringify({status: 404, message: "Error deleting user"}));
    }
  }
  async getByEmail(email) {
    try {
      return await this.insUserModelo.findByEmail(email);
    } catch (error) {
      throw new Error(JSON.stringify({status: 400, message: "Error retrieving user by email"}));
    }
  }
  // async getNickByNickAndPassword(nick, password) {
  //   try {
  //     const user = new User();

  //     // Definimos el pipeline para la agregación
  //     let query = [
  //       {
  //         $match: { nick, password }, // Filtramos por nick y password
  //       },
  //       {
  //         $project: {
  //           _id: 0, // Excluimos el _id
  //           nick: 1,
  //         },
  //       },
  //     ];

  //     // Ejecutamos la agregación en el modelo de usuario
  //     const result = await user.aggregate(query);

  //     // Devuelve el resultado si se encuentra, de lo contrario un error
  //     // console.log('resultado Encontrado', result.length);
  //     if (result.length === 0) {
  //       throw new Error(
  //         JSON.stringify({ status: 404, message: 'Invalid credentials' })
  //       );
  //     }
  //     // console.log(result[0]);

  //     return result[0]; // Retornamos el primer (y único) resultado
  //   } catch (error) {
  //     // Si el error ya tiene un mensaje específico, lo relanzamos
  //     if (error.message.includes('Invalid credentials')) {
  //       throw error; // Propaga el error original
  //     } else {
  //       // Si es un error inesperado, lanzamos uno genérico
  //       throw new Error(
  //         JSON.stringify({ status: 400, message: 'Error in user repository' })
  //       );
  //     }
  //   }
  // }
  // async getNick(body) {
  //   try {
  //     const user = new User();
  //     let { nick } = body;
  //     let query = [
  //       {
  //         $match: { nick },
  //       },
  //       {
  //         $project: {
  //           _id: 0,
  //           role: 0,
  //           email: 0,
  //         },
  //       },
  //     ];
  //     return await user.aggregate(query);
  //   } catch (error) {
  //     throw new Error(
  //       JSON.stringify({ status: 400, message: 'usuarios repository' })
  //     );
  //   }
  // }
  // async getPassword(passaword, user) {
  //   let { passaword: pass } = user;
  //   delete user.passaword;
  //   const isMatch = await bcrypt.compare(passaword, pass);
  //   if (!isMatch)
  //     throw new Error(
  //       JSON.stringify({ status: 401, message: 'No autorizzado' })
  //     );
  //   return jwt.sign(user, process.env.KEY_SECRET, {
  //     expiresIn: `${process.env.EXPRESS_EXPIRE}ms`,
  //   });
  // }
  // async searchByName(name) {
  //   try {
  //     return await User.find({ name: new RegExp(name, 'i') });
  //   } catch (error) {
  //     throw new Error('Error searching for users');
  //   }
  // }
}

module.exports = UserRepository;
