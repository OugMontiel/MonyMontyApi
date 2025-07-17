const {validationResult} = require("express-validator");
const movimientoService = require("../services/movService");

class MovimientoController {
  constructor() {
    this.movimientoService = movimientoService;
  }

  /**
   * Valida los resultados de express-validator
   * @param {object} req - Objeto de petición
   * @param {object} res - Objeto de respuesta
   * @returns {boolean} - True si la validación es exitosa
   */
  validarResultados(req, res) {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Errores de validación",
          errors: errores.array(),
          data: null,
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error en validarResultados:", error);
      res.status(500).json({
        success: false,
        message: "Error interno al validar los datos",
        data: null,
      });
      return false;
    }
  }

  /**
   * Maneja errores y envía respuesta consistente
   * @param {object} res - Objeto de respuesta
   * @param {Error} error - Objeto de error
   * @param {string} accion - Descripción de la acción fallida
   */
  manejarError(res, error, accion) {
    console.error(`Error al ${accion}:`, error);

    let status = 500;
    let message = error.message || `Error interno al ${accion}`;

    if (error.status) {
      status = error.status;
    } else if (error.name === "ValidationError") {
      status = 400;
    } else if (error.name === "NotFoundError") {
      status = 404;
    }

    res.status(status).json({
      success: false,
      message,
      data: null,
    });
  }

  async crearMovimiento(req, res) {
    try {
      if (!this.validarResultados(req, res)) return;

      const movimiento = await this.movimientoService.crear(req.body);

      res.status(201).json({
        success: true,
        message: "Movimiento creado exitosamente",
        data: movimiento,
      });
    } catch (error) {
      this.manejarError(res, error, "crear movimiento");
    }
  }

  async obtenerMovimiento(req, res) {
    try {
      if (!this.validarResultados(req, res)) return;

      const movimiento = await this.movimientoService.obtenerPorId(req.params.id);

      res.status(200).json({
        success: true,
        message: "Movimiento obtenido exitosamente",
        data: movimiento,
      });
    } catch (error) {
      this.manejarError(res, error, "obtener movimiento");
    }
  }

  async actualizarMovimiento(req, res) {
    try {
      if (!this.validarResultados(req, res)) return;

      const movimiento = await this.movimientoService.actualizar(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "Movimiento actualizado exitosamente",
        data: movimiento,
      });
    } catch (error) {
      this.manejarError(res, error, "actualizar movimiento");
    }
  }

  async eliminarMovimiento(req, res) {
    try {
      if (!this.validarResultados(req, res)) return;

      await this.movimientoService.eliminar(req.params.id);

      res.status(204).end();
    } catch (error) {
      this.manejarError(res, error, "eliminar movimiento");
    }
  }

  async obtenerTodosLosMovimientos(req, res) {
    try {
      const movimientos = await this.movimientoService.obtenerTodos();

      res.status(200).json({
        success: true,
        message: "Movimientos obtenidos exitosamente",
        data: movimientos,
      });
    } catch (error) {
      this.manejarError(res, error, "obtener movimientos");
    }
  }
}

module.exports = new MovimientoController();
