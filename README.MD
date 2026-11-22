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

## 🛠️ Información técnica

Esta API está desarrollada utilizando **Node.js v22.15.0**, una versión reciente que aprovecha mejoras en rendimiento y seguridad. Asegúrate
de tener esta versión (o superior compatible) instalada para evitar errores de compatibilidad.

### 🔧 Requisitos previos

- Tener instalado [Node.js v22.15.0](https://nodejs.org) o una versión compatible.
- Tener instalado [npm](https://www.npmjs.com/) (v10 o superior recomendado, se instala junto con Node.js).

### 🚀 Instalación y ejecución en entorno local

Para ejecutar el proyecto localmente, sigue estos pasos desde la raíz del repositorio:

```bash
# Instala las dependencias del proyecto
npm install

# Ejecuta el servidor en modo desarrollo (usa nodemon si está configurado)
npm run dev
```

Una vez iniciado el servidor, la API estará disponible en:

```
http://localhost:3000
```

### 🔄 Formato de datos

- Los datos se intercambian en formato **JSON**.
- Para todas las operaciones de escritura (`POST`, `PUT`, `DELETE`), asegúrate de incluir el encabezado:

  ```
  Content-Type: application/json
  ```

### ✅ Respuestas de la API

- La API utiliza **códigos de estado HTTP estándar** para indicar el resultado de las operaciones (ej. `200 OK`, `201 Created`,
  `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, etc.).
- Las respuestas incluyen, cuando aplica, un mensaje descriptivo o datos relevantes del recurso afectado.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
