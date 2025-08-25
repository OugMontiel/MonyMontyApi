// server/iniciosesion/application/routes/inicioSesionRouter.js

const express = require("express");
const passport = require("passport");
const router = express.Router();

const AuthController = require("../controllers/authController.js");
const authController = new AuthController();
const authvalidator = require("../validator/authValidator.js");

// Ruta raíz
router.get("/", (req, res) => {
  res.send("¡Bienvenido a MonyMonty auth!");
});

// Ruta para validar la sesión
router.get("/check", (req, res) => {
  authController.checkSession(req, res);
});

// Define la ruta para iniciar sesión mediante sesión Express.
router.post("/login", authvalidator.validatorSessionLogin(), (req, res) => authController.sessionLogin(req, res));

// Rutas para autenticación con Google
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}), (req, res) =>
  authController.callback(req, res)
);

// Rutas para autenticación con GitHub
router.get("/github", passport.authenticate("github"));
router.get("/github/callback", passport.authenticate("github", {failureRedirect: "/login"}), (req, res) =>
  authController.callback(req, res)
);

// Rutas para autenticación con Discord
router.get("/discord", passport.authenticate("discord"));
router.get("/discord/callback", passport.authenticate("discord", {failureRedirect: "/login"}), (req, res) =>
  authController.callback(req, res)
);

// Cerrar sesión
router.get("/logout", (req, res) => authController.cerrarSesion(req, res));

module.exports = router;
