// Implementa la lógica de negocio y coordina las interacciones entre el dominio y la infraestructura.
const TransaccionRepository = require("../../domain/repositories/movRepository");

class transaccionService {
  constructor() {
    this.TransaccionRepository = new TransaccionRepository();
  }
  async prueva(req, res) {
    return {message: "¡entrando a TransaccionRepository de ruraqMaki!"};
  }
  async createProduct(data) {
    try {
      // console.log('data.password',data);

      return await this.TransaccionRepository.createProduct(data);
    } catch (error) {
      // console.error("Error:", error);
      throw new Error(JSON.stringify({status: 500, message: "Error al crear el Producto createProduct"}));
    }
  }
  async getProductById(id) {
    const product = await this.TransaccionRepository.getById(id);
    if (!product) {
      throw new Error(JSON.stringify({status: 404, message: "User not found"}));
    }

    return product;
  }
  async updateProduct(id, data) {
    const updatedProduct = await this.TransaccionRepository.updateById(id, data);
    if (!updatedProduct) {
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
    return updatedProduct;
  }
  async deleteProduct(id) {
    const deletedProduct = await this.TransaccionRepository.deleteProduct(id);
    if (!deletedProduct) {
      throw new Error(
        JSON.stringify({
          status: 404,
          message: "User not found or could not be deleted",
        })
      );
    }
    return deletedProduct;
  }
  async getAllProducts(req, res) {
    try {
      return await this.TransaccionRepository.getAllProducts(); // Cambia aquí
    } catch (error) {
      console.error("Error al obtener productos:", error); // Agrega un log para el error
      res.status(500).json({error: error.message});
    }
  }
}

module.exports = transaccionService;
