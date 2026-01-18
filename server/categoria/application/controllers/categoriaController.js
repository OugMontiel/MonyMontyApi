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

  async crearCategoria(req, res) {
    try {
      const {_id, nombre} = req.session.usuario;
      const datos = {...req.body, usuarioNombre: nombre};
      const categoriaId = await this.categoriaService.crearCategoria(_id, datos);

      res.status(201).json({
        success: true,
        message: "Categoría creada exitosamente",
        data: {categoriaId},
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  async crearSubcategoria(req, res) {
    try {
      const {id} = req.params;
      const {_id, nombre} = req.session.usuario;
      const datos = {...req.body, usuarioNombre: nombre};
      await this.categoriaService.crearSubcategoria(_id, id, datos);

      res.status(201).json({
        success: true,
        message: "Subcategoría agregada exitosamente",
      });
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new CategoriaController();
