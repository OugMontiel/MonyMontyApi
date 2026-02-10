# Convenciones de Ramas y Flujo de Trabajo Git

Este documento define el **flujo oficial de trabajo con Git** para el proyecto.

> ⚠️ Este equipo **no utiliza Git Flow CLI**.
> El flujo se basa en ramas manuales + Pull Requests.

## 🧠 1. Ramas permanentes

| Rama      | Uso                                   |
| --------- | ------------------------------------- |
| `main`    | Código estable en producción          |
| `develop` | Integración de nuevas funcionalidades |

🚫 Ninguna otra rama es permanente.

## 🌿 2. Tipos de ramas

Todas las tareas deben crearse usando uno de estos prefijos:

```text
feature/
fix/
hotfix/
refactor/
docs/
```

**Ejemplos**

```text
feature/login-google
fix/error-crear-movimiento
hotfix/pago-duplicado
refactor/estructura-errores
docs/swagger-endpoints
```

## ⏳ 3. Ciclo de vida de una rama

Cada rama sigue este ciclo:

**Se crea → Se trabaja →  Se hace Pull Request → Se merge → Se elimina**

> ❌ Una rama no debe vivir más de un Pull Request.

Después del merge:

```bash
git branch -d nombre-rama
git push origin --delete nombre-rama
```

## 🚦 4. Flujo de trabajo estándar

### 🔹 Crear una nueva tarea

```bash
git checkout develop
git pull
git checkout -b feature/nombre-claro
```

### 🔹 Al terminar el desarrollo

```bash
git push origin feature/nombre-claro
```

Luego crear Pull Request hacia `develop`.

### 🔹 Después de aprobar y hacer merge

```bash
git checkout develop
git pull
git branch -d feature/nombre-claro
git push origin --delete feature/nombre-claro
```

## 🚨 5. Corrección urgente en producción (Hotfix)

```bash
git checkout main
git pull
git checkout -b hotfix/error-critico
```

Después se debe hacer PR hacia:

* `main`
* `develop`

Luego la rama se elimina.

## 🧹 6. Limpieza periódica
Revisión recomendada semanal:

```bash
git fetch --prune
git branch -r --merged origin/main
```

Toda rama mergeada que no sea `main` o `develop` debe eliminarse.

## 🧭 7. Reglas de oro

* ✔ Nombre claro y corto
* ✔ Una tarea por rama
* ✔ Pull Request obligatorio
* ✔ No hacer commits directos a `main`
* ✔ Borrar la rama después del merge

## ℹ️ Nota sobre Git Flow

El modelo Git Flow clásico y la herramienta `git-flow` **no forman parte del flujo oficial** del proyecto.
Si un desarrollador decide usar esa herramienta localmente, debe respetar estas mismas reglas y estructura de ramas.
