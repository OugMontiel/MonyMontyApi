const express = require("express");
const router = express.Router();

const movimientoValidator = require("../validator/movValidator");
const movimientoController = require("../controllers/movController");

// Ruta raíz
router.get("/", (req, res) => {
  res.send("¡Bienvenido a MonyMonty Movimientos!");
});

// Obtener todos los movimientos de un usuario
router.get(
  "/user/:id",
  movimientoValidator.validarId(),
  movimientoController.obtenerTodosLosMovimientos,
);

// Obtener un movimiento específico
router.get(
  "/:id",
  movimientoValidator.validarId(),
  movimientoController.obtenerMovimiento,
);

// Crear nuevo movimiento
router.post(
  "/",
  movimientoValidator.validarCreacion(),
  movimientoController.crearMovimiento(),
);

// Actualizar movimiento
router.put(
  "/:id",
  movimientoValidator.validarId(),
  movimientoValidator.validarActualizacionMovimiento(),
  movimientoController.actualizarMovimiento(),
);

// Eliminar movimiento
router.delete(
  "/:id",
  movimientoValidator.validarId(),
  movimientoController.eliminarMovimiento,
);

module.exports = router;
