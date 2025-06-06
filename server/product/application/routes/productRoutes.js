// Define las rutas de la aplicación y mapea las URLs a los controladores.
const express = require("express");
const router = express.Router(); // Crea un enrutador de Express que manejará las sub rutas específicas para la ruta /users

const ProductController = require("../controllers/productController"); // Importa el controlador
const productController = new ProductController(); // Instancia el controlador de usuarios
const ProductValidator = require("../validator/productValidator"); // Importa el validador
const productValidator = new ProductValidator(); // Instancia el validador de usuarios

// Obtener todos los productos  (GET /api/products)
router.get("/", (req, res) => productController.getAllProducts(req, res));

// Define la ruta para obtener un product por ID.
router.get("/:id", productValidator.validateProductId(), (req, res) => productController.getProduct(req, res));

// Define la ruta para crear un nuevo product.
router.post("/", productValidator.validateProductData(), (req, res) => productController.createProduct(req, res));

// Define la ruta para actualizar un product por ID.
router.put("/:id", productValidator.validateProductId(), (req, res) => productController.updateProduct(req, res));

// Define la ruta para eliminar un product por ID.
router.delete("/:id", productValidator.validateProductId(), (req, res) => productController.deleteProduct(req, res));

module.exports = router;
