const express = require("express");
const router = express.Router();

const movimientoValidator = require("../validator/movValidator");
const movimientoController = require("../controllers/movController");
const handleValidation = require("../../../core/middlewares/handleValidation");

// Obtener todos los movimientos de un usuario
// router.get("/user/:id", movimientoValidator.validarId(), (req, res) => movimientoController.obtenerTodosLosMovimientos(req, res));

// Data para Dashboard
router.get("/Dashboard", movimientoValidator.noBodyNoQuery(), handleValidation, (req, res) =>
  movimientoController.dataParaDashboard(req, res)
);

// Obtener un movimiento específico
// router.get("/:id", movimientoValidator.validarId(), (req, res) => movimientoController.obtenerMovimiento(req, res));

// Crear nuevo movimiento
router.post("/", movimientoValidator.validarCreacion(), handleValidation, (req, res) => 
  movimientoController.crearMovimiento(req, res));

// Actualizar movimiento
//router.put("/:id", movimientoValidator.validarId(), movimientoValidator.validarActualizacionMovimiento(), (req, res) =>
//movimientoController.actualizarMovimiento(req, res)
//);

// Eliminar movimiento
//router.delete("/:id", movimientoValidator.validarId(), (req, res) => movimientoController.eliminarMovimiento(req, res));

// Ruta raíz al Final siempre
router.get("/", (req, res) => {
  res.send("¡Bienvenido a MonyMonty Movimientos!");
});

module.exports = router;
