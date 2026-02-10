# Convenciones de Ramas y Flujo de Trabajo Git

## 🧠 1. Ramas permanentes

| Rama      | Uso                            |
| --------- | ------------------------------ |
| `main`    | Producción (código estable)    |
| `develop` | Integración de funcionalidades |

🚫 Ninguna otra rama es permanente.

## 🌿 2. Tipos de ramas

Usar siempre prefijo:

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

Una rama:

**se crea → se hace PR → se mergea → se elimina**

> ❌ Una rama no vive más de 1 Pull Request

Después del merge:

```bash
git branch -d nombre-rama
git push origin --delete nombre-rama
```

## 🚦 4. Flujo de trabajo

### 🔹 Crear nueva tarea

```bash
git checkout develop
git pull
git checkout -b feature/nombre-claro
```

### 🔹 Al terminar

```bash
git push origin feature/nombre-claro
```

Crear PR hacia `develop`.

### 🔹 Después del merge

```bash
git checkout develop
git pull
git branch -d feature/nombre-claro
git push origin --delete feature/nombre-claro
```

## 🚨 5. Hotfix urgente (producción)

```bash
git checkout main
git pull
git checkout -b hotfix/error-critico
```

Se debe mergear en:

* `main`
* `develop`

Luego se elimina.

## 🧹 6. Limpieza semanal

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
