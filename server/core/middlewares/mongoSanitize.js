/**
 * Middleware de Sanitización contra Inyecciones NoSQL
 *
 * Limpia recursivamente objetos eliminando operadores que comiencen con '$'
 * (operadores de consulta y agregación en MongoDB) y claves que contengan '.' (notación de puntos).
 */

function sanitize(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = sanitize(value[i]);
    }
    return value;
  }

  const keys = Object.keys(value);
  for (const key of keys) {
    if (key.startsWith("$") || key.includes(".")) {
      delete value[key];
    } else {
      value[key] = sanitize(value[key]);
    }
  }

  return value;
}

const mongoSanitize = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    sanitize(req.body);
  }

  if (req.params && typeof req.params === "object") {
    sanitize(req.params);
  }

  if (req.query && typeof req.query === "object") {
    sanitize(req.query);
  }

  next();
};

module.exports = mongoSanitize;
