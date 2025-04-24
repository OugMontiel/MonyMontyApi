// server/app.js
const express = require("express");
const session = require("express-session");
const path = require("path");

// Configuración para login
const passport = require("passport");
// Cargar las configuraciones de Passport para Google
require("./auth/infrastructure/config/passportGoogle");

// Middlewares y routers
const isAuthenticated = require("./auth/infrastructure/middleware/isAuthenticated");
const authRouter = require("./auth/application/routes/authRouter");
const userRoutes = require("./user/application/routes/userRoutes");
// const productRoutes = require('./product/application/routes/productRoutes');

// Inicializar la app Express
const app = express();
app.use(express.json());

// Configurar la sesión
app.use(
  session({
    secret: process.env.KEY_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // True en producción
      maxAge: parseInt(process.env.EXPRESS_EXPIRE),
    },
  })
);

// Inicialización de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Rutas API
app.use("/user", userRoutes);
app.use("/auth", authRouter);
// app.use('/product', isAuthenticated, productRoutes);
app.use("/rutaProtegida", isAuthenticated, (req, res) => res.json({message: "Ruta protegida"}));

// Configuración del servidor
const config = {
  port: process.env.EXPRESS_PORT || 3000,
  host: process.env.EXPRESS_HOST || "localhost",
};

// Iniciar el servidor
app.listen(config.port, config.host, () => {
  console.log(`Servidor corriendo en http://${config.host}:${config.port}`);
});
