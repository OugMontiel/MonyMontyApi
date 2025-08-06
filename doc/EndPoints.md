# los EndPoints Tipo Documentacion

## Modulo Movimientos

- **Base URL:** `http://localhost:3000/movimiento`
- **Formato de respuesta:** JSON
- **Autenticación requerida:** Sí (Bearer Token)

### Obtener todos los Movimientos de un Usuario

- **URL del endPoint:** `http://localhost:3000/movimiento/user/:id`
- **Descripción:**
- **Metodo HTTP:** `GET`
- **Parametros de la URL:** Id del usuario
- **Cuerpo de la solicitud:** No
- **Respuesta Exitosa:**
```json 
{
  "success": true,
  "message": "Movimientos obtenidos exitosamente",
  "data": [
    {
      "_id": "68918e8e84dc11191ca408c9",
      "IdUsuario": "688f832d787665c3988b8ea6",
      "fecha": "2025-08-01",
      "categoria": { "Sueldo": "Okorum" },
      "concepto": { "Ingreso": "" },
      "entidad": { "Itau": "7416" },
      "ingreso": 1509620,
      "divisa": { "COP": "Pesos Colombianos" }
    }
  ]
}
```
- **Respuesta Fallida:**

### Obtener un Movimientos por IdMovimiento

- **URL del endPoint:** `http://localhost:3000/movimiento/:id`
- **Descripción:** Para traer un solo Documnto Un movimiento
- **Metodo HTTP:** `GET`
- **Parametros de la URL:** Id del movimiento
- **Cuerpo de la solicitud:** No 
- **Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Movimiento obtenido exitosamente",
  "data": {
    "_id": "68918e8e84dc11191ca408c9",
    "IdUsuario": "688f832d787665c3988b8ea6",
    "fecha": "2025-08-01",
    "categoria": { "Sueldo": "Okorum" },
    "concepto": { "Ingreso": "" },
    "entidad": { "Itau": "7416" },
    "ingreso": 1509620,
    "divisa": { "COP": "Pesos Colombianos" }
  }
}
```
- **Respuesta Fallida:**

### Crear Movimiento

- **URL del endPoint:** `http://localhost:3000/movimiento/`
- **Descripción:**
- **Metodo HTTP:** `POST`
- **Parametros de la URL:** No
- **Cuerpo de la solicitud:**

```json
{
  "IdUsuario": "688f832d787665c3988b8ea6",
  "fecha": "2025-08-01",
  "categoria": {
    "Sueldo": "Okorum"
  },
  "concepto": {
    "Ingreso": ""
  },
  "entidad": {
    "Itau": "7416"
  },
  "ingreso": 1509620,
  "divisa": {
    "COP": "Pesos Colombianos"
  }
}
```

- **Respuesta Exitosa:**

```json
{"success": true, "message": "Movimiento creado exitosamente", "data": {"acknowledged": true, "insertedId": "68918e8e84dc11191ca408c9"}}
```

- **Respuesta Fallida:**

### Actualizar Movimiento

- **URL del endPoint:** `http://localhost:3000/movimiento/:id`
- **Descripción:**
- **Metodo HTTP:** `PUT`
- **Parametros de la URL:** Id del movimiento
- **Cuerpo de la solicitud:**
- **Respuesta Exitosa:**
- **Respuesta Fallida:**

### Eliminar Movimiento

- **URL del endPoint:** `http://localhost:3000/movimiento/:id`
- **Descripción:**
- **Metodo HTTP:** `DELETE`
- **Parametros de la URL:** Id del movimiento
- **Cuerpo de la solicitud:**
- **Respuesta Exitosa:**
204 
- **Respuesta Fallida:**

## Módulo Usuarios

Aquí encontrarás los endpoints para:

### 🚀 Crear usuario

- **📍 URL del endpoint:** `http://localhost:3000/user/`

- **🧾 Método HTTP:** `POST`

- **📦 Cuerpo de la solicitud (JSON):**

```json
{
  "nombre": "Diego Montiel",
  "email": "prueba@prueba.com",
  "password": "123456789"
}
```

- **📝 Descripción:** Registra un nuevo usuario en el sistema. Los datos deben enviarse en formato JSON a través de un método `POST`.

### 🔎 Consultar usuario por ID

- **📍 URL del endpoint:** `http://localhost:3000/user/{id}` _Reemplaza `{id}` por el ID válido del usuario (ejemplo:
  `6842fbf0bac8bf1ebaca56ca`)._

- **🧾 Método HTTP:** `GET`

- **📦 Cuerpo de la solicitud:** No se requiere body.

- **📝 Descripción:** Obtiene la información de un usuario específico usando su ID. El ID debe ser un `ObjectId` válido de MongoDB.

### ✏️ Actualizar usuario

- **📍 URL del endpoint:** `http://localhost:3000/user/{id}` _Reemplaza `{id}` por el ID válido del usuario (ejemplo:
  `6843114a928b3f3d4b5f6da9`)._

- **🧾 Método HTTP:** `PUT`

- **📦 Cuerpo de la solicitud (JSON):**

```json
{
  "nombre": "Cambio Dos",
  "email": "prueba@prueba.com",
  "password": "123456789"
}
```

- **📝 Descripción:** Actualiza los datos de un usuario existente identificado por su ID. Los datos modificados se envían en el cuerpo de la
  solicitud en formato JSON usando el método `PUT`.

- **📤 Respuesta exitosa (JSON):**

```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

- **📝 Notas:**

  - `modifiedCount` indica cuántos documentos fueron realmente modificados.
  - `matchedCount` muestra cuántos documentos coincidieron con el ID proporcionado.
  - Si `modifiedCount` es 0, el usuario pudo no haber sido modificado porque los datos enviados son iguales a los actuales.

### 🗑️ Eliminar usuario

- **📍 URL del endpoint:** `http://localhost:3000/user/{id}` _Reemplaza `{id}` por el ID válido del usuario a eliminar (ejemplo:
  `684318f26166601f0b5d115b`)._

- **🧾 Método HTTP:** `DELETE`

- **📦 Cuerpo de la solicitud:** No se requiere body.

- **📝 Descripción:** Elimina un usuario existente identificado por su ID. La solicitud no debe incluir ningún dato adicional en el cuerpo
  ni en la URL (excepto el ID).

- **📤 Respuesta exitosa:** Código HTTP `204 No Content` indicando que la eliminación fue exitosa y que no se devuelve contenido en la
  respuesta.

## Módulo de Auth

Aquí encontrarás los endpoints para:

### ✅ Verificar autenticación

- **📍 URL del endpoint:** `http://localhost:3000/auth/check`

- **🧾 Método HTTP:** `GET`

- **📦 Cuerpo de la solicitud:** No se requiere body, pero se debe enviar el token en los encabezados (`Authorization: Bearer <token>`).

- **📝 Descripción:** Verifica si el usuario está autenticado. Retorna el mismo token junto con el estado de autenticación.

- **📤 Respuesta exitosa (200 OK):**

  ```json
  {
    "authenticated": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 🔐 Iniciar sesión

- **📍 URL del endpoint:** `http://localhost:3000/auth/login`

- **🧾 Método HTTP:** `POST`

- **📦 Cuerpo de la solicitud (JSON):**

  ```json
  {
    "email": "prueba@casa.com",
    "password": "123456789"
  }
  ```

- **📝 Descripción:** Autentica al usuario con su correo y contraseña. Si las credenciales son correctas, responde con un token JWT válido.

- **📤 Respuesta exitosa (200 OK):**

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
