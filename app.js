// server/app.js
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

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

// Configuración básica (cors)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // Permitir cookies y autenticación
  })
);

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
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter);
app.use("/user", userRoutes);
app.use("/movimiento", isAuthenticated, movRoutes);
// app.use('/product', isAuthenticated, productRoutes);
app.use("/rutaProtegida", isAuthenticated, (req, res) => res.json({message: " accedio a Ruta protegida"}));
app.get("/health", (req, res) => {
  res.status(200).json({status: "ok", timestamp: new Date().toISOString()});
});
// Ruta raíz (debe ir al final)
app.use("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bienvenido a MonyMonty API</title>
      <style>
        body {
          margin: 0;
          font-family: 'Segoe UI', Roboto, sans-serif;
          background-color: #121212;
          color: #f5f5f5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }

        h1 {
          font-size: 2.2rem;
          margin-bottom: 1rem;
          color: #00d1b2;
        }

        p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          color: #ccc;
        }

        a {
          text-decoration: none;
          background: #00d1b2;
          color: #121212;
          padding: 0.8rem 1.6rem;
          border-radius: 8px;
          font-weight: bold;
          transition: 0.3s;
        }

        a:hover {
          background: #00b09b;
          transform: scale(1.05);
        }

        footer {
          position: absolute;
          bottom: 1rem;
          font-size: 0.9rem;
          color: #777;
        }
      </style>
    </head>
    <body>
      <h1> Bienvenido a la API de MonyMonty</h1>
      <p>Tu backend está funcionando correctamente.</p>
      <a href="/swagger" target="_blank">Ver Documentación Swagger</a>
      <footer>© ${new Date().getFullYear()} MonyMonty</footer>
    </body>
    </html>
  `);
});

// Configuración del servidor
const config = {
  port: process.env.EXPRESS_PORT || 3000,
  host: process.env.EXPRESS_HOST || "0.0.0.0",
};

// Iniciar el servidor
app.listen(config.port, config.host, () => {
  console.log(`Servidor corriendo en http://${config.host}:${config.port}`);
});
