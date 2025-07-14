# 📘 Guía: Uso de Git Flow

## 🛠️ 1. Instalación

### 🔹 Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install git-flow
```

### 🔹 macOS (usando Homebrew)

```bash
brew install git-flow-avh
```

> Verifica con: `git flow version`

### 🔹 Windows Git Bash

```bash
scoop install git-flow
```


## 🚀 2. Inicialización del repositorio con Git Flow

Ubícate dentro del proyecto:

```bash
cd /ruta/a/tu/repositorio
git flow init
```

Responde así a las preguntas:

| Pregunta                                    | Respuesta recomendada   |
| ------------------------------------------- | ----------------------- |
| Branch name for production releases:        | `main` (Enter)          |
| Branch name for "next release" development: | `develop` (Enter)       |
| Feature branches prefix:                    | `feature/` (Enter)      |
| Bugfix branches prefix:                     | `bugfix/` (Enter)       |
| Release branches prefix:                    | `release/` (Enter)      |
| Hotfix branches prefix:                     | `hotfix/` (Enter)       |
| Support branches prefix:                    | `support/` (Enter)      |
| Version tag prefix:                         | `0.0.1` (o `v` o vacío) |
| Hooks and filters directory:                | (Deja ruta por defecto) |

## 🌿 3. Estructura de ramas con Git Flow

| Rama | Propósito | | -- | | | `main` | Código en producción estable | | `develop` | Desarrollo activo e integración de nuevas
funcionalidades | | `feature/*` | Nuevas funcionalidades o tareas (ej. `feature/login`) | | `release/*` | Preparación para lanzar una
versión (ej. `release/1.0.0`) | | `hotfix/*` | Correcciones urgentes sobre `main` | | `bugfix/*` | Correcciones de errores detectados en
desarrollo |

## 🧑‍💻 4. Flujo de una nueva funcionalidad (feature)

### 🔸 Iniciar una nueva feature:

```bash
git flow feature start crud-movimientos
```

### 🔸 Trabajar normalmente:

```bash
git add .
git commit -m "Crea estructura base del CRUD de movimientos"
```

### 🔸 Finalizar la feature:

```bash
git flow feature finish crud-movimientos
```

> Esto hace merge a `develop` y borra la rama **local** `feature/crud-movimientos`.

## ☁️ 5. (Opcional) Subir una feature al remoto

Si estás en equipo y quieres revisión antes de finalizar:

```bash
git push origin feature/crud-movimientos
```
