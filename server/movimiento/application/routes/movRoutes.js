// Define las rutas de la aplicación y mapea las URLs a los controladores.
const express = require("express");
const router = express.Router(); // Crea un enrutador de Express que manejará las sub rutas específicas para la ruta /users

const TransaccionController = require("../controllers/movController"); // Importa el controlador
const transaccionController = new TransaccionController(); // Instancia el controlador de usuarios
const TransaccionValidator = require("../validator/movValidator"); // Importa el validador
const transaccionValidator = new TransaccionValidator(); // Instancia el validador de usuarios

router.get("/", (req, res) => {
  res.send("¡Bienvenido a MonyMonty transacciones !");
});

// Obtener todas transacciones para un usuario específico
router.get("/user/:id", transaccionValidator.validateIdTransacciones(), (req, res) =>
  transaccionController.getAllTransaccionesByUser(req, res)
);

// Define la ruta para obtener un product por ID.
router.get("/:id", transaccionValidator.validateIdTransacciones(), (req, res) => transaccionController.getProduct(req, res));

// Define la ruta para crear un nuevo product.
router.post("/", transaccionValidator.validateNewTransacciones(), (req, res) => transaccionController.createProduct(req, res));

// Define la ruta para actualizar un product por ID.
router.put("/:id", transaccionValidator.validateIdTransacciones(), (req, res) => transaccionController.updateProduct(req, res));

// Define la ruta para eliminar un product por ID.
router.delete("/:id", transaccionValidator.validateIdTransacciones(), (req, res) => transaccionController.deleteProduct(req, res));

module.exports = router;
