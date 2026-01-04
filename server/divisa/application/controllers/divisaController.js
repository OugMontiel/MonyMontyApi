const {validationResult} = require("express-validator");
const divisaService = require("../services/divisaService");
const handleError = require("../../../core/application/controllers/handleError.js");

class DivisaController {
  constructor() {
    this.divisaService = divisaService;
  }

  async obtenerDivisas(req, res) {
    try {
      const divisas = await this.divisaService.obtenerTodos();

      res.status(200).json({
        success: true,
        message: "Divisas obtenidas exitosamente",
        data: divisas,
      });
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new DivisaController();
