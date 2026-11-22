# 📘 Guía de Estándares para APIs REST

> Este documento define las **reglas, convenciones y buenas prácticas** para el diseño de APIs dentro del proyecto. No describe endpoints
> específicos. El código es la fuente de verdad.

## 🧱 1. Principios Generales

- La API sigue el estilo **REST**
- Comunicación vía **HTTP + JSON**
- Las rutas representan **recursos**, no acciones
- Las respuestas deben ser **consistentes** en estructura
- El backend es la fuente de verdad, la documentación describe normas

## 🌍 2. Base de la API

| Elemento             | Regla                            |
| -------------------- | -------------------------------- |
| Formato de respuesta | `application/json`               |
| Versionado           | `/v1/` cuando la API sea pública |
| Protocolo            | Siempre HTTPS en producción      |
| Codificación         | UTF-8                            |

## 🔐 3. Autenticación

| Elemento         | Estándar                      |
| ---------------- | ----------------------------- |
| Método           | Sesión (Cookie + JWT interno) |
| Header requerido | `Cookie: connect.sid=...`     |
| Dónde se valida  | Middleware por rutas          |

> **Nota:** El sistema utiliza `express-session` para manejar la autenticación. Internamente se genera un JWT, pero este se almacena en la
> sesión del servidor (`req.session.token`) y no requiere ser enviado manualmente por el cliente en un header `Authorization`.

## 📦 4. Estructura de Respuestas

### ✅ Respuesta exitosa

```json
{
  "data": {},
  "meta": {}
}
```

| Campo  | Uso                                      |
| ------ | ---------------------------------------- |
| `data` | Información solicitada                   |
| `meta` | Paginación, conteos, info extra opcional |

### ❌ Respuesta de error

```json
{
  "error": {
    "message": "Descripción del error",
    "code": 400
  }
}
```

| Campo     | Uso                         |
| --------- | --------------------------- |
| `message` | Mensaje claro para frontend |
| `code`    | Código HTTP                 |

## 🔢 5. Uso de Status Codes

| Código | Uso                                     |
| ------ | --------------------------------------- |
| 200    | Operación exitosa                       |
| 201    | Recurso creado                          |
| 204    | Operación exitosa sin contenido         |
| 400    | Error de validación o datos incorrectos |
| 401    | No autenticado                          |
| 403    | Sin permisos                            |
| 404    | Recurso no encontrado                   |
| 409    | Conflicto de datos                      |
| 422    | Validación de negocio fallida           |
| 500    | Error interno                           |

## 🧾 6. Convenciones de Rutas

| Correcto                | Incorrecto          |
| ----------------------- | ------------------- |
| `/users`                | `/getUsers`         |
| `/movimientos/123`      | `/deleteMovimiento` |
| `/users/45/movimientos` | `/userMovements`    |

Reglas:

- Usar sustantivos, no verbos
- Usar plural para colecciones
- IDs como parámetros de ruta
- Filtros en query params

## 🔍 7. Query Params

Usados para:

- Paginación → `?page=1&limit=10`
- Filtros → `?status=active`
- Búsquedas → `?search=diego`

Nunca usar query params para operaciones destructivas.

## 🧠 8. Validaciones

- Validar datos **antes** de llegar a la lógica de negocio
- Errores de validación → `400`
- Errores de reglas de negocio → `422`

## 🧼 9. Buenas Prácticas Obligatorias

- No exponer datos sensibles
- No devolver stack traces
- Manejo de errores centralizado
- Respuestas consistentes
- Logs solo en backend, no en respuestas

## 📁 10. Fuente de Verdad

| Elemento                     | Fuente oficial                 |
| ---------------------------- | ------------------------------ |
| Estructura real de endpoints | Código                         |
| Reglas de diseño             | Este documento                 |
| Swagger/OpenAPI              | Solo cuando la API sea pública |

## 🚦 11. Cuándo se generará documentación Swagger

Swagger se implementará cuando:

- La API sea pública o usada por terceros
- Exista versión estable
- Se requiera contrato formal

Hasta entonces, **no se mantiene OpenAPI** para evitar documentación falsa.

## 🎯 Objetivo de este documento

Este archivo existe para:

- Mantener coherencia entre equipos
- Evitar discusiones sobre formatos
- Reducir deuda técnica
- Facilitar escalabilidad futura
