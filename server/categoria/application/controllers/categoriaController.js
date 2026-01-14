const {validationResult} = require("express-validator");
const categoriaService = require("../services/categoriaService");
const handleError = require("../../../core/application/controllers/handleError.js");

class CategoriaController {
  constructor() {
    this.categoriaService = categoriaService;
  }

  async obtenerCategorias(req, res) {
    try {
      const {_id} = req.session.usuario;
      const categorias = await this.categoriaService.obtenerTodos(_id);

      res.status(200).json({
        success: true,
        message: "Categorías obtenidas exitosamente",
        data: categorias,
      });
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new CategoriaController();
