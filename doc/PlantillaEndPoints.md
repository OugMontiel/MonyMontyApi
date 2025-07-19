# 📘 Plantilla Completa de Documentación para API REST

## 🧾 Descripción general

Breve descripción de lo que hace la API.

* **Base URL:** `https://api.ejemplo.com/v1`
* **Formato de respuesta:** JSON
* **Versión:** 1.0.0
* **Autenticación requerida:** Sí (Bearer Token)

---

## 🔐 Autenticación

* **Método:** Token Bearer
* **Header:** `Authorization: Bearer <token>`

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## 📌 Endpoints

### 🟢 `GET /recurso`

* **Descripción:** Recupera una lista de recursos.
* **Autenticación:** ✅ Sí

#### Parámetros de URL

| Parámetro | Tipo   | Requerido | Descripción               |
| --------- | ------ | --------- | ------------------------- |
| `id`      | string | ❌         | ID específico del recurso |

#### Parámetros de consulta (Query Params)

| Parámetro | Tipo | Requerido | Descripción                      |
| --------- | ---- | --------- | -------------------------------- |
| `page`    | int  | ❌         | Página actual                    |
| `limit`   | int  | ❌         | Cantidad de elementos por página |

#### Headers

| Nombre          | Valor            | Requerido |
| --------------- | ---------------- | --------- |
| `Authorization` | Bearer `<token>` | ✅         |
| `Accept`        | application/json | ❌         |

#### Ejemplo de solicitud

```http
GET /recurso?page=1&limit=10 HTTP/1.1
Host: api.ejemplo.com
Authorization: Bearer <token>
```

#### Ejemplo de respuesta

```json
{
  "data": [
    {
      "id": "1",
      "nombre": "Ejemplo"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1
  }
}
```

#### Códigos de estado

| Código | Descripción                |
| ------ | -------------------------- |
| 200    | OK                         |
| 401    | No autorizado              |
| 404    | No encontrado              |
| 500    | Error interno del servidor |

---

### 🟡 `POST /recurso`

* **Descripción:** Crea un nuevo recurso.
* **Autenticación:** ✅ Sí

#### Headers

| Nombre          | Valor            | Requerido |
| --------------- | ---------------- | --------- |
| `Content-Type`  | application/json | ✅         |
| `Authorization` | Bearer `<token>` | ✅         |

#### Cuerpo de la solicitud (JSON)

| Campo    | Tipo    | Requerido | Descripción         |
| -------- | ------- | --------- | ------------------- |
| `nombre` | string  | ✅         | Nombre del recurso  |
| `activo` | boolean | ❌         | Si está activo o no |

#### Ejemplo de solicitud

```http
POST /recurso HTTP/1.1
Host: api.ejemplo.com
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Nuevo Recurso",
  "activo": true
}
```

#### Ejemplo de respuesta

```json
{
  "id": "abc123",
  "nombre": "Nuevo Recurso",
  "activo": true,
  "fecha_creacion": "2025-07-19T15:00:00Z"
}
```

#### Códigos de estado

| Código | Descripción                |
| ------ | -------------------------- |
| 201    | Creado exitosamente        |
| 400    | Solicitud mal formada      |
| 401    | No autorizado              |
| 409    | Conflicto (ya existe)      |
| 422    | Error de validación        |
| 500    | Error interno del servidor |

---

### 🔴 `DELETE /recurso/:id`

* **Descripción:** Elimina un recurso específico.
* **Autenticación:** ✅ Sí

#### Ejemplo de solicitud

```http
DELETE /recurso/123 HTTP/1.1
Host: api.ejemplo.com
Authorization: Bearer <token>
```

#### Ejemplo de respuesta

```json
{
  "mensaje": "Recurso eliminado correctamente"
}
```

#### Códigos de estado

| Código | Descripción                |
| ------ | -------------------------- |
| 200    | Eliminado exitosamente     |
| 404    | Recurso no encontrado      |
| 401    | No autorizado              |
| 500    | Error interno del servidor |

---

## ❌ Códigos de error comunes

| Código | Error          | Descripción                             |
| ------ | -------------- | --------------------------------------- |
| 400    | Bad Request    | El cuerpo de la solicitud tiene errores |
| 401    | Unauthorized   | Token inválido o ausente                |
| 403    | Forbidden      | No tienes permiso                       |
| 404    | Not Found      | Recurso no encontrado                   |
| 409    | Conflict       | Ya existe un recurso igual              |
| 422    | Unprocessable  | Validación fallida de campos            |
| 500    | Internal Error | Error inesperado del servidor           |

---

## 🧪 Ejemplos con curl

```bash
curl -X POST https://api.ejemplo.com/v1/recurso \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{ "nombre": "Nuevo", "activo": true }'
```

---

## 🧼 Buenas prácticas

* Usa HTTPS siempre.
* Usa status codes adecuados.
* No expongas datos sensibles.
* Valida el input del cliente.
* Usa paginación y filtros en consultas masivas.

---

## 📞 Contacto del desarrollador

* Email: [soporte@ejemplo.com](mailto:soporte@ejemplo.com)
* Teléfono: +57 300 000 0000
* Documentación adicional: [docs.api.ejemplo.com](https://docs.api.ejemplo.com)
