// Gestiona las peticiones HTTP y las respuestas, delegando la lógica de negocio a los servicios.
const {validationResult} = require("express-validator");
const UserService = require("../services/userService");

class UserController {
  constructor() {
    this.insUserService = new UserService();
  }
  // validar generico
  validarExpres(req, res) {
    const errors = validationResult(req);
    // console.error("errors:", errors);
    if (!errors.isEmpty()) {
      res.status(400).json({errors: errors.array()});
      return; // Detener la ejecución si hay errores
    }
    return true;
  }
  // crear un Usuario
  async createUser(req, res) {
    try {
      // Validar si hay errores
      if (!this.validarExpres(req, res)) return;

      // Crear el usuario
      const user = await this.insUserService.createUser(req.body);

      // Responder con éxito
      res.status(201).json(user);
    } catch (error) {
      // console.error("Error:", error);

      const errorObj = JSON.parse(error.message);
      res.status(errorObj.status).json({message: errorObj.message});
    }
  }
  // obtener un Usuario
  async getUser(req, res) {
    try {
      // Validar si hay errores
      if (!this.validarExpres(req, res)) return;
      // Optner el Usuario
      const user = await this.insUserService.getUserById(req.params.id);
      // respoder con exito
      res.status(200).json(user);
    } catch (error) {
      const errorObj = JSON.parse(error.message);
      res.status(errorObj.status).json({message: errorObj.message});
    }
  }
  // actualizar un Usuario
  async updateUser(req, res) {
    try {
      // Validar si hay errores
      if (!this.validarExpres(req, res)) return;
      // Actualizar el Usuario
      const user = await this.insUserService.updateUser(req.params.id, req.body);
      // Responder con éxito
      res.status(200).json(user);
    } catch (error) {
      const errorObj = JSON.parse(error.message);
      res.status(errorObj.status).json({message: errorObj.message});
    }
  }
  async deleteUser(req, res) {
    try {
      // Validar si hay errores
      if (!this.validarExpres(req, res)) return;
      // Borrar el Usuario
      const user = await this.insUserService.deleteUser(req.params.id);
      // Este código indica que la solicitud fue exitosa y que el recurso ha sido eliminado, pero no hay contenido adicional para enviar en la respuesta.
      res.status(204).json(user);
      // En algunos casos, 200 OK también puede ser utilizado si la respuesta incluye información adicional o confirmación sobre la eliminación. Sin embargo, 204 No Content es la opción más estándar para indicar que un recurso ha sido eliminado y no hay contenido adicional en la respuesta.
      // res.status(200).json(user);
    } catch (error) {
      const errorObj = JSON.parse(error.message);
      res.status(errorObj.status).json({message: errorObj.message});
    }
  }

  // async verifyUser(req, res) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty())
  //       return res.status(400).json({ errors: errors.array() });
  //     const token = await this.insUserService.getUserbyNickAndPassword(res.body);
  //     req.session.token = `Bearer ${token}`;
  //     res.status(200).json(token);
  //   } catch (error) {
  //     const errorObj = JSON.parse(error.message);
  //     res.status(errorObj.status).json({ message: errorObj.message });
  //   }
  // }

  // async searchUsers(req, res) {
  //   try {
  //     const users = await this.insUserService.searchUsersByName(req.query.name);
  //     res.json(users);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }
}

module.exports = UserController;
