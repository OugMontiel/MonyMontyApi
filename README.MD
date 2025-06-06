# 📚 Documentación API Mony Monty

## Introducción

Bienvenido a la documentación oficial de la API **Mony Monty**, una plataforma diseñada para gestionar usuarios, finanzas y otros servicios
asociados a la administración financiera personal .

Esta API está construida para facilitar la interacción con el backend mediante endpoints RESTful que permiten crear, consultar, actualizar y
eliminar recursos.

## Estructura General

La API se organiza en diferentes módulos, cada uno con sus propios endpoints y funcionalidades específicas. Entre los módulos principales se
encuentran:

- **Usuarios:** Gestión completa de usuarios, incluyendo registro, consulta, actualización y eliminación.

## Cómo usar esta documentación

- Cada módulo contiene una lista de endpoints con sus respectivas descripciones, métodos HTTP, parámetros requeridos y ejemplos de
  solicitudes y respuestas.
- Presta atención a las validaciones y formatos de datos para garantizar el correcto funcionamiento de cada llamada.
- Para autenticarte y acceder a endpoints protegidos, utiliza los tokens o credenciales que se indiquen en la sección correspondiente.

## Información técnica

- La API corre por defecto en `http://localhost:3000`
- Los datos se intercambian en formato JSON.
- Para todas las operaciones de escritura (POST, PUT, DELETE), asegúrate de enviar el cuerpo con el encabezado
  `Content-Type: application/json`.
- Las respuestas incluyen códigos HTTP estándar para indicar éxito o error, junto con mensajes descriptivos.

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
