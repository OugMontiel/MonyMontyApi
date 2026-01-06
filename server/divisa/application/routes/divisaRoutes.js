const express = require("express");
const router = express.Router();

const divisaController = require("../controllers/divisaController");
const divisaValidator = require("../validator/divisaValidator");
const handleValidation = require("../../../core/middlewares/handleValidation");

router.get("/", divisaValidator.noBodyNoQuery(), handleValidation, (req, res) => divisaController.obtenerDivisas(req, res));

module.exports = router;
