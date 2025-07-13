¡Claro, Jaks! Aquí tienes un `README.md` completo, sencillo y presentable para tu repositorio `prueba-desempe-o-javascript`, ideal para tu entrega de prueba de desempeño:

---

### 📄 `README.md`

```markdown
# 🧑‍💻 Prueba de Desempeño – Gestión de Empleados (SPA)

Este proyecto fue desarrollado como parte de la prueba de desempeño del Módulo 3 (JavaScript). Consiste en una **Single Page Application (SPA)** que permite gestionar empleados, con autenticación básica, rutas protegidas y control de roles.

---

## 🚀 Funcionalidades

- ✅ Inicio de sesión con validación de usuario (usando json-server)
- 🔒 Rutas protegidas según autenticación y rol (`admin` o `user`)
- 👨‍💼 CRUD de empleados (crear, leer, editar, eliminar)
- 🔍 Búsqueda dinámica de empleados
- ✍️ Formulario compartido para crear y editar
- 🧭 Navegación SPA sin recargar la página
- 🎨 Estilos con TailwindCSS
- ⚠️ Página 404 personalizada

---

## 👥 Roles

| Rol    | Acceso                                        |
|--------|-----------------------------------------------|
| admin  | Acceso a todo: empleados, usuarios, inicio    |
| user   | Acceso a inicio y empleados                   |

---

## 🗂️ Estructura del Proyecto

```

src/
├── controllers/
│   ├── crudEmployees.js
│   └── login.js
├── views/
│   ├── login.html
│   ├── home.html
│   ├── managmentEmployee.html
│   ├── users.html
│   └── 404.html
├── router.js
├── main.js
├── style.css

````

---

## 📦 Requisitos

- Node.js
- json-server

---

## ▶️ Instrucciones de uso

1. Instalar dependencias (si las hay):

   ```bash
   npm install
````

2. Iniciar json-server:

   ```bash
   npx json-server --watch db.json --port 3000
   ```

3. Correr el proyecto:

   ```bash
   npm run dev
   ```

> 💡 Si no usas Vite, puedes abrir `index.html` directamente en el navegador (aunque sin SPA completa).

---

## 📁 Base de datos (`db.json`)

```json
{
  "users": [
    {
      "id": 1,
      "name": "Admin",
      "email": "admin@mail.com",
      "password": "123",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "User",
      "email": "user@mail.com",
      "password": "123",
      "role": "user"
    }
  ],
  "employees": []
}
```

---

## 👤 Autor

**Jaks Acevedo**
Estudiante | Prueba M3 – JavaScript
GitHub: [@Jaks-Nova](https://github.com/Jaks-Nova)

---

## 📝 Licencia

Proyecto académico para uso educativo – no comercial.

```

---

Puedes guardar ese contenido como archivo `README.md` en la raíz de tu proyecto, subirlo con GitHub Desktop y hacer `push`.

¿Quieres también el `.zip` para Classroom o lo dejamos así?
```
