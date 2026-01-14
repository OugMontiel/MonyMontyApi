const express = require("express");
const router = express.Router();

const entidadValidator = require("../validator/entidadValidator");
const entidadController = require("../controllers/entidadController");
const handleValidation = require("../../../core/middlewares/handleValidation");

router.get("/", entidadValidator.noBodyNoQuery(), handleValidation, 
    (req, res) => entidadController.obtenerEntidades(req, res));

module.exports = router;
