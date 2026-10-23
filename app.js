// server/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const ms = require("ms");

// Configuración para login
const passport = require("passport");
// Cargar las configuraciones de Passport para Google
require("./server/auth/infrastructure/config/passportGoogle");

// Conexión a base de datos
const ConnectToDatabase = require("./server/core/infrastructure/connections/mongodb.js");

// Middlewares y routers
const mongoSanitize = require("./server/core/middlewares/mongoSanitize");
const isAuthenticated = require("./server/auth/infrastructure/middleware/isAuthenticated");
const authRouter = require("./server/auth/application/routes/authRouter");
const userRoutes = require("./server/user/application/routes/userRoutes");
const movRoutes = require("./server/movimiento/application/routes/movRoutes");
const entidadRoutes = require("./server/entidad/application/routes/entidadRoutes");
const categoriaRoutes = require("./server/categoria/application/routes/categoriaRoutes");
const divisaRoutes = require("./server/divisa/application/routes/divisaRoutes");

// Inicializar la app Express
const app = express();

// Seguridad de cabeceras HTTP con Helmet y ocultación de tecnología
app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {action: "deny"},
    referrerPolicy: {policy: "strict-origin-when-cross-origin"},
    noSniff: true,
  })
);

// Parsing de peticiones con límite de tamaño para mitigar DoS
app.use(express.json({limit: "100kb"}));
app.use(express.urlencoded({extended: true, limit: "100kb"}));

// Sanitización contra inyección NoSQL (operadores $ y notación de puntos)
app.use(mongoSanitize);

// Configuración segura de CORS
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" && (origin.includes("localhost") || origin.includes("127.0.0.1")))
      ) {
        return callback(null, true);
      }
      return callback(new Error("Origen no permitido por la política CORS"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Permitir cookies y autenticación
    maxAge: 86400,
  })
);

// Configurar la sesión
app.use(
  session({
    name: process.env.SESSION_COOKIE_NAME,
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ms(process.env.SESSION_COOKIE_MAX_AGE),
    },
  })
);

// en producción detrás de un proxy (p. ej. nginx in Docker),
// confiar en el primer proxy permite que express-session detecte correctamente
// si la conexión es segura y permita establecer `secure` cookies.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Inicialización de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Documentación Swagger (Protegida: requiere autenticación y solo habilitada en desarrollo o explícitamente)
if (process.env.SWAGGER_ENABLED === "true" || process.env.NODE_ENV !== "production") {
  try {
    const swaggerUi = require("swagger-ui-express");
    const swaggerDocument = require("./swagger.json");
    app.use("/swagger", isAuthenticated, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (err) {
    console.warn("Documentación Swagger no disponible:", err.message);
  }
}

// Rutas API
app.use("/auth", authRouter);
app.use("/user", userRoutes);
app.use("/movimiento", isAuthenticated, movRoutes);
app.use("/entidad", isAuthenticated, entidadRoutes);
app.use("/categoria", isAuthenticated, categoriaRoutes);
app.use("/divisa", isAuthenticated, divisaRoutes);
app.use("/rutaProtegida", isAuthenticated, (req, res) => res.json({message: "accedio a Ruta protegida"}));
app.get("/health", (req, res) => {
  res.status(200).json({status: "ok", timestamp: new Date().toISOString()});
});

// Ruta raíz segura (no expone información sensible ni enlaces de Swagger no autenticados)
app.get("/", (req, res) => {
  res.status(200).json({
    name: "MonyMonty API",
    status: "online",
    version: "1.0.0",
  });
});

// Configuración del servidor
const config = {
  port: process.env.EXPRESS_PORT,
  host: process.env.EXPRESS_HOST,
};

async function bootstrap() {
  await ConnectToDatabase.conectar(); // Aquí conecta al iniciar el servidor solo una vez

  // Iniciar el servidor
  app.listen(config.port, config.host, () => {
    console.log(`Servidor corriendo en http://${config.host}:${config.port}`);
  });
}

bootstrap();
