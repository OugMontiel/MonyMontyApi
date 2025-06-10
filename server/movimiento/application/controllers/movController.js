// Gestiona las peticiones HTTP y las respuestas, delegando la lógica de negocio a los servicios.
const {validationResult} = require("express-validator");
const TransaccionService = require("../services/movService");

class transaccionesController {
  constructor() {
    this.TransaccionService = new TransaccionService();
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
  // crear un transaccion 
  async newTransaccion(req, res) {
    try {
      // Validar si hay errores
      if (!this.validarExpres(req, res)) return;

      // Crear el usuario
      const product = await this.TransaccionService.createProduct(req.body);

      // Responder con éxito
      res.status(201).json(product);
    } catch (error) {
      // console.error("Error:", error);

      const errorObj = JSON.parse(error.message);
      res.status(errorObj.status).json({message: errorObj.message});
    }
  }
  // obtener un Product
  async getProduct(req, res) {
    try {
      // Validar si hay errores
      if (!this.validarExpres(req, res)) return;
      // Optner el Product
      const product = await this.TransaccionService.getProductById(req.params.id);
      // respoder con exito
      res.status(200).json(product);
    } catch (error) {
      const errorObj = JSON.parse(error.message);
      res.status(errorObj.status).json({message: errorObj.message});
    }
  }
  // actualizar un Usuario
  async updateProduct(req, res) {
    try {
      // Validar si hay errores
      if (!this.validarExpres(req, res)) return;
      // Actualizar el Usuario
      const product = await this.TransaccionService.updateProduct(req.params.id, req.body);
      // Responder con éxito
      res.status(200).json(product);
    } catch (error) {
      const errorObj = JSON.parse(error.message);
      res.status(errorObj.status).json({message: errorObj.message});
    }
  }
  async deleteProduct(req, res) {
    try {
      // Validar si hay errores
      if (!this.validarExpres(req, res)) return;
      // Borrar el Usuario
      const product = await this.TransaccionService.deleteProduct(req.params.id);
      // Este código indica que la solicitud fue exitosa y que el recurso ha sido eliminado, pero no hay contenido adicional para enviar en la respuesta.
      res.status(204).json(product);
      // En algunos casos, 200 OK también puede ser utilizado si la respuesta incluye información adicional o confirmación sobre la eliminación. Sin embargo, 204 No Content es la opción más estándar para indicar que un recurso ha sido eliminado y no hay contenido adicional en la respuesta.
      // res.status(200).json(user);
    } catch (error) {
      const errorObj = JSON.parse(error.message);
      res.status(errorObj.status).json({message: errorObj.message});
    }
  }
  async getAllProducts(req, res) {
    try {
      const products = await this.TransaccionService.getAllProducts(); // Cambia aquí
      res.status(200).json(products);
    } catch (error) {
      console.error("Error al obtener productos:", error); // Agrega un log para el error
      res.status(500).json({error: error.message});
    }
  }
}

module.exports = transaccionesController;
