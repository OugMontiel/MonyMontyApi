# Arquitectura hexagonal y vertical *Slecer*

```bash
/application
│   ├── controllers      # Controladores: manejan las solicitudes HTTP
│   ├── routes           # Rutas: definen las URLs y enlazan con los controladores
│   ├── validator        # Validadores: validan los datos de entrada (req.body, req.params, etc.)
│   └── services         # Servicios: orquestan operaciones, acceden a la lógica del dominio
/domain
│   ├── models           # Modelos: definen las entidades del negocio (estructura y reglas)
│   └── repositories     # Repositorios: acceso abstracto a la fuente de datos
/infrastructure
    └── mongodb.js       # Conexión técnica a la base de datos (MongoDB)
```

## 📁 `/application` – Capa de aplicación

Contiene la lógica para manejar flujos de caso de uso. No contiene reglas de negocio, sino coordinación entre las capas y validación de datos externos.

### 🔹 `/controllers`

* Reciben las peticiones HTTP desde las rutas.
* Delegan la lógica al servicio correspondiente.
* Devuelven la respuesta al cliente (`res.json`, `res.status()`, etc.).
* No deben tener lógica de negocio ni acceso directo a la base de datos.

### 🔹 `/routes`

* Define las rutas HTTP expuestas al exterior.
* Asocia cada endpoint con su controlador y validador.
* Se mantiene libre de lógica de negocio.

### 🔹 `/validator`

* Validan los datos de entrada (`req.body`, `req.params`, `req.query`) antes de que lleguen al servicio o dominio.
* Usualmente se implementan con `express-validator`, `Joi`, `Yup`, etc.
* Garantizan que los datos malformados nunca entren al sistema.

### 🔹 `/services`

* Contienen la lógica de coordinación de casos de uso.
* Orquestan llamadas a los repositorios del dominio.
* Aplican reglas de negocio a nivel de flujo (no de entidad).
* Sirven de puente entre los controladores (entrada) y los repositorios/modelos (dominio).

📌 Si tu lógica involucra múltiples pasos, reglas o decisiones, debería vivir aquí, no en el controlador.

## 📁 `/domain` – Capa del dominio

Representa el **núcleo del negocio**. Es independiente de la tecnología (framework, DB, protocolo).

### 🔹 `/models`

* Representan las **entidades y objetos de valor** de tu dominio.
* En Mongo, pueden incluir la definición del esquema (si usas Mongoose).
* Contienen reglas de validación internas o métodos propios del modelo.

📌 Ejemplo: `Movimiento`, `Usuario`, `Cuenta`, etc.

### 🔹 `/repositories`

* Actúan como **interfaces** entre la lógica del dominio y la fuente de datos (base de datos, API, etc.).
* Permiten desacoplar la lógica del negocio de la infraestructura.
* Implementan métodos como `findById`, `save`, `update`, etc.

📌 Si en el futuro cambias Mongo por PostgreSQL, deberías modificar solo esta parte.

## 📁 `/infrastructure` – Capa de infraestructura

Contiene la implementación de recursos técnicos que se usan en el sistema.

### 🔹 `mongodb.js`

* Configura la conexión a la base de datos (MongoDB en este caso).
* Exporta la instancia del cliente o base de datos para ser usada por los repositorios.
* Puede incluir lógica para reconexión, logging o configuración avanzada.


## 🧠 Notas

* Esta estructura combina principios de **arquitectura hexagonal (puertos y adaptadores)** y **arquitectura vertical por módulo**.
* Permite **escalar el proyecto** sin perder el orden, facilitando testing, mantenimiento y separación de responsabilidades.

