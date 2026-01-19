const express = require("express");
const router = express.Router();

const categoriaController = require("../controllers/categoriaController");
const categoriaValidator = require("../validator/categoriaValidator");
const handleValidation = require("../../../core/middlewares/handleValidation");

router.get("/", categoriaValidator.noBodyNoQuery(), handleValidation, (req, res) => categoriaController.obtenerCategorias(req, res));

router.post("/", categoriaValidator.validateCrear(), handleValidation, (req, res) => categoriaController.crearCategoria(req, res));

router.post("/:id/subcategoria", categoriaValidator.validateAgregarSubcategoria(), handleValidation, (req, res) =>
  categoriaController.crearSubcategoria(req, res)
);

module.exports = router;
