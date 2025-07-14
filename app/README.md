# Event Management (SPA)

This project was developed as part of the performance test for Module 3 (JavaScript). It consists of a **Single Page Application (SPA)** that allows managing events and users, with basic authentication, protected routes, and role control.

---

## 🚀 Features

- Login with user validation (using json-server)
- Protected routes based on authentication and role (`admin` or `user`)
- CRUD for events (create, read, edit, delete)
- CRUD for users (create, read, edit, delete)
- Dynamic search for users and events
- SPA navigation without reloading the page
- Styles with TailwindCSS
- Custom 404 page

---

## 👥 Roles

| Role | Access |
|--------|------------------------------------------------------------|
| admin | Access to everything: events, users, home |
| user | Login and Events |

---

## 🗂️ Project Structure

```
app/
├── database/
│ └── db.json
├──src/
├── controllers/
│ ├── login.js
| ├── crudEvents.js 
│ └── login.js 
├── views/ 
│ ├── login.html 
│ ├── register.html 
│ ├── admin.html 
│ ├── home.html 
│ ├── managementEvents.html 
│ ├── users.html 
│ └── 404.html 
├── router.js 
├── main.js 
├── style.css
├── index.html

````

---

## 📦 Requirements

- Node.js
- json-server

---

## ▶️ Instructions for use

1. Install dependencies (if any):

```bash
npm install
````

2. Start json-server:

```bash
npx json-server --watch db.json --port 3000
```

3. Run the project:

```bash
npm run dev
```

> 💡 If you're not using Vite, you can open `index.html` directly in the browser (although without the full SPA).

---

## 📁 Database (`db.json`)

```json

  "users": [
    {
      "id": "1",
      "name": "Jason Acevedo",
      "email": "jason@admin.com",
      "password": "jason123",
      "role": "admin"
    },
    {
      "id": "2",
      "name": "Laura Gonzalez",
      "email": "laura@user.com",
      "password": "laura123",
      "role": "user"
    },
    {
      "name": "Valentina Rubio",
      "email": "valentina@user.com",
      "role": "user",
      "password": "valentina123",
      "id": "22c7"
    },
    {
      "id": "8a29",
      "name": "Ellen Manjarres",
      "email": "ellen@user.com",
      "password": "ellen123",
      "role": "user"
    },
    {
      "id": "6439",
      "name": "Daniel Chalarca",
      "email": "daniel@admin.com",
      "password": "daniel123",
      "role": "user"
    }
  ],
  "events": [
    {
      "id": 1,
      "title": "Hackatón 2025",
      "description": "Evento de programación colaborativa",
      "date": "2025-09-10",
      "capacity": 30,
      "registeredUsers": []
    },
    {
      "id": "9125",
      "title": "Comer",
      "description": "ir a comer",
      "date": "2025-07-14",
      "capacity": 20,
      "registeredUsers": [
        "valentina@user.com"
      ]
    }
  ]
}
```

---