const express = require("express");
const router = express.Router();

const categoriaController = require("../controllers/categoriaController");
const categoriaValidator = require("../validator/categoriaValidator");
const handleValidation = require("../../../core/middlewares/handleValidation");

router.get("/", categoriaValidator.noBodyNoQuery(), handleValidation, 
    (req, res) => categoriaController.obtenerCategorias(req, res));

module.exports = router;
