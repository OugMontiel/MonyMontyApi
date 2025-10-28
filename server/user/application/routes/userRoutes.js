// Define las rutas de la aplicación y mapea las URLs a los controladores.
const express = require("express");
const router = express.Router(); // Crea un enrutador de Express que manejará las sub rutas específicas para la ruta /users

const UserController = require("../controllers/userController"); // Importa el controlador
const insUserController = new UserController(); // Instancia el controlador de usuarios
const UserValidator = require("../validator/userValidator"); // Importa el validador

const isAuthenticated = require("../../../../server/auth/infrastructure/middleware/isAuthenticated");

router.get("/", (req, res) => {
  res.send("¡Bienvenido a MonyMonty user!");
});

// obtener el usuario actual (por ejemplo, el usuario autenticado).
router.get("/me", isAuthenticated, UserValidator.validateUser(), (req, res) => insUserController.getCurrentUser(req, res));

// obtener un usuario por ID.
router.get("/:id", isAuthenticated, UserValidator.validateUserId(), (req, res) => insUserController.getUser(req, res));

// crear un nuevo usuario.
router.post("/", UserValidator.validateUserData(), (req, res) => insUserController.createUser(req, res));

// actualizar un usuario por ID.
router.put("/:id", isAuthenticated, UserValidator.validateUserUpdateById(), (req, res) => insUserController.updateUser(req, res));

// eliminar un usuario por ID.
router.delete("/:id", isAuthenticated, UserValidator.validateUserId(), (req, res) => insUserController.deleteUser(req, res));

module.exports = router;
