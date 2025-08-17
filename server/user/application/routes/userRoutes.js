// Define las rutas de la aplicación y mapea las URLs a los controladores.
const express = require("express");
const router = express.Router(); // Crea un enrutador de Express que manejará las sub rutas específicas para la ruta /users

const UserController = require("../controllers/userController"); // Importa el controlador
const insUserController = new UserController(); // Instancia el controlador de usuarios
const UserValidator = require("../validator/userValidator"); // Importa el validador

router.get("/", (req, res) => {
  res.send("¡Bienvenido a MonyMonty user!");
});

// Define la ruta para obtener el usuario actual (por ejemplo, el usuario autenticado).
router.get("/me", UserValidator.validateUser(), (req, res) => insUserController.getCurrentUser(req, res));

// Define la ruta para obtener un usuario por ID.
router.get("/:id", UserValidator.validateUserId(), (req, res) => insUserController.getUser(req, res));

// Define la ruta para crear un nuevo usuario.
router.post("/", UserValidator.validateUserData(), (req, res) => insUserController.createUser(req, res));

// Define la ruta para actualizar un usuario por ID.
router.put("/:id", UserValidator.validateUserUpdateById(), (req, res) => insUserController.updateUser(req, res));

// Define la ruta para eliminar un usuario por ID.
router.delete("/:id", UserValidator.validateUserId(), (req, res) => insUserController.deleteUser(req, res));

module.exports = router;
