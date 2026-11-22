# Arquitectura Hexagonal + Vertical Slices

Esta estructura combina:

- Arquitectura Hexagonal (Ports & Adapters)
- Organización vertical por módulo
- Enfoque práctico para APIs Node.js escalables

## 📦 Estructura base

```text
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

## 1. Capa Application (Entrada)

Gestiona la comunicación con el mundo exterior (HTTP). Aquí **no vive la lógica del negocio**, solo coordinación.

### `routes/`

- Define rutas HTTP
- Conecta endpoint → validator → controller

### `validator/`

- Valida `req.body`, `req.params`, `req.query`
- Evita que datos inválidos entren al sistema

### `controllers/`

- Reciben la petición HTTP
- Llaman al servicio
- Devuelven la respuesta
- No acceden a la base de datos
- No contienen reglas de negocio

### `services/`

- Implementan casos de uso
- Coordinan repositorios y modelos
- Manejan flujos y decisiones

📌 Si tu lógica involucra múltiples pasos, reglas o decisiones, debería vivir aquí, no en el controlador.

## 2. Capa Domain (Núcleo del negocio)

Es independiente de tecnología.

### `models/`

- Entidades del negocio (`Usuario`, `Movimiento`, etc.)
- Contienen reglas propias

### `repositories/`

- Son interfaces hacia los datos
- Definen operaciones como:

```text
findById
save
update
delete
```

Aquí no se escribe Mongo, SQL ni detalles técnicos.

## 🟡 3. Capa Infrastructure (Adaptadores técnicos)

Implementa lo que el dominio necesita, pero sin lógica de negocio.

### `mongodb.js`

- Configura conexión a MongoDB
- Maneja cliente y configuración

Si se cambia la base de datos, el impacto se queda aquí.

## 🔄 Flujo de una petición

```text
HTTP Request
   ↓
Route
   ↓
Validator
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Infrastructure (DB)
```

## 🚫 Reglas importantes

| Capa           | No debe hacer               |
| -------------- | --------------------------- |
| Controller     | Lógica de negocio           |
| Service        | Acceso directo a Mongo      |
| Domain         | Depender de Express o Mongo |
| Infrastructure | Reglas del negocio          |

## 🎯 Beneficios

- Escalable
- Mantenible
- Bajo acoplamiento
- Fácil de testear
- Cambios tecnológicos sin romper negocio
