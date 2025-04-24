// Contiene la interfaz para interactuar con la base de datos o cualquier otro tipo de almacenamiento de datos.
const ProductModel = require('../models/productModel');


class UserRepository {
  constructor() {
    this.productModel = new ProductModel();
  }
  async createProduct(userData) {
    try {
      return await this.productModel.createProduct(userData);
    } catch (error) {
      // console.error("Error:", error);
      throw new Error(
        JSON.stringify({ status: 500, message: 'Error saving user' })
      );
    }
  }
  async getById(id) {
    try {
      return await this.productModel.findById(id);
    } catch (error) {
      throw new Error(
        JSON.stringify({ status: 400, message: 'Error retrieving user' })
      );
    }
  }
  async updateById(id, updateData) {
    try {
      return await this.productModel.updateById(id, updateData);
    } catch (error) {
      throw new Error(
        JSON.stringify({ status: 500, message: 'Error updating user' })
      );
    }
  }
  async deleteProduct(id) {
    try {
      return await this.productModel.deleteProduct(id);
    } catch (error) {
      console.error("Error:", error);
      throw new Error(
        JSON.stringify({ status: 404, message: 'Error deleting user' })
      );
    }
  }
  async getAllProducts() {
    try {
        return await this.productModel.findAll();
    } catch (error) {
        console.error('Error al obtener productos de la base de datos:', error);
        throw new Error('No se pudieron obtener los productos');
    }
}

}

module.exports = UserRepository;
