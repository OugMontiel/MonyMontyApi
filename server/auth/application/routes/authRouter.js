// server/iniciosesion/application/routes/inicioSesionRouter.js

const express = require("express");
const passport = require("passport");
const router = express.Router();

const authValidator = require("../validator/authValidator.js");
const authController = require("../controllers/authController.js");
const handleValidation = require("../../../core/middlewares/handleValidation");

// --- RUTA RAÍZ ---
router.get("/", (req, res) => res.send("¡Bienvenido a MonyMonty auth!"));

// --- SESIÓN ---
router.get("/check", (req, res) => authController.checkSession(req, res));
router.get("/logout", (req, res) => authController.cerrarSesion(req, res));

// --- LOGIN LOCAL ---
router.post("/login", authValidator.validatorSessionLogin(), handleValidation, (req, res) => authController.sessionLogin(req, res));

// --- AUTENTICACIÓN CON GOOGLE ---
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}), (req, res) =>
  authController.callback(req, res)
);

// --- RECUPERACIÓN DE CONTRASEÑA ---
router.post("/recuperar", authValidator.validatorEmail(), handleValidation, (req, res) => authController.recuperarPassword(req, res));
router.get("/checkToken", authValidator.checkToken(), handleValidation, (req, res) => authController.checkToken(req, res));
router.post("/updatePassword", authValidator.validatorPassword(), handleValidation, (req, res) => authController.updatePassword(req, res));

module.exports = router;
