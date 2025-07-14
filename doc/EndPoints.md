<!-- un .md para todo los EndPoints Tipo Documentacion -->

# Módulo Usuarios

Aquí encontrarás los endpoints para:

## 🚀 Crear usuario

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

## 🔎 Consultar usuario por ID

- **📍 URL del endpoint:** `http://localhost:3000/user/{id}` _Reemplaza `{id}` por el ID válido del usuario (ejemplo:
  `6842fbf0bac8bf1ebaca56ca`)._

- **🧾 Método HTTP:** `GET`

- **📦 Cuerpo de la solicitud:** No se requiere body.

- **📝 Descripción:** Obtiene la información de un usuario específico usando su ID. El ID debe ser un `ObjectId` válido de MongoDB.

## ✏️ Actualizar usuario

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

## 🗑️ Eliminar usuario

- **📍 URL del endpoint:** `http://localhost:3000/user/{id}` _Reemplaza `{id}` por el ID válido del usuario a eliminar (ejemplo:
  `684318f26166601f0b5d115b`)._

- **🧾 Método HTTP:** `DELETE`

- **📦 Cuerpo de la solicitud:** No se requiere body.

- **📝 Descripción:** Elimina un usuario existente identificado por su ID. La solicitud no debe incluir ningún dato adicional en el cuerpo
  ni en la URL (excepto el ID).

- **📤 Respuesta exitosa:** Código HTTP `204 No Content` indicando que la eliminación fue exitosa y que no se devuelve contenido en la
  respuesta.

# Módulo de Auth

Aquí encontrarás los endpoints para:

## ✅ Verificar autenticación

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

## 🔐 Iniciar sesión

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
