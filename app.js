// server/app.js
const express = require("express");
const session = require("express-session");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger');

// Configuración para login
const passport = require("passport");
// Cargar las configuraciones de Passport para Google
require("./server/auth/infrastructure/config/passportGoogle");

// Middlewares y routers
const isAuthenticated = require("./server/auth/infrastructure/middleware/isAuthenticated");
const authRouter = require("./server/auth/application/routes/authRouter");
const userRoutes = require("./server/user/application/routes/userRoutes");
const movRoutes = require("./server/movimiento/application/routes/movRoutes");
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
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(---));
app.use("/user", userRoutes);
app.use("/auth", authRouter);
app.use("/movimiento", isAuthenticated, movRoutes);
// app.use('/product', isAuthenticated, productRoutes);
app.use("/rutaProtegida", isAuthenticated, (req, res) => res.json({message: " accedio a Ruta protegida"}));
// Ruta raíz (debe ir al final)
app.use("/", (req, res) => {
  res.send("¡Bienvenido a MonyMonty!");
});

// Configuración del servidor
const config = {
  port: process.env.EXPRESS_PORT || 3000,
  host: process.env.EXPRESS_HOST || "localhost",
};

// Iniciar el servidor
app.listen(config.port, config.host, () => {
  console.log(`Servidor corriendo en http://${config.host}:${config.port}`);
});
