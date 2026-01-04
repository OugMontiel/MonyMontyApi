const {validationResult} = require("express-validator");
const entidadService = require("../services/entidadService");

const handleError = require("../../../core/application/controllers/handleError.js");

class EntidadController {
  constructor() {
    this.entidadService = entidadService;
  }

  async obtenerEntidades(req, res) {
    try {
      const {_id} = req.session.usuario;
      const entidades = await this.entidadService.obtenerTodos(_id);

      res.status(200).json({
        success: true,
        message: "Entidades obtenidas exitosamente",
        data: entidades,
      });
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new EntidadController();
