# 🚚 ERP LuxChile - Sistema de Gestión Logística

Sistema ERP desarrollado para la gestión de operaciones logísticas de LuxChile, incluyendo administración de vehículos, rutas, cargas y trabajadores.

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Git

## 🚀 Instalación y Ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/[tu-usuario]/ERP_LuxChile.git
cd ERP_LuxChile
```

### 2️⃣ Configurar y ejecutar el Backend
```bash
cd Backend
npm install
npx prisma generate
cp .env.example .env
npx prisma migrate dev
npm run dev
```

El backend estará corriendo en: `http://localhost:3000`

### 3️⃣ Configurar y ejecutar el Frontend

**En otra terminal:**
```bash
cd Frontend/pruebas
npm install
npm start
```

El frontend estará corriendo en: `http://localhost:3001`

## 🧪 Ejecutar Pruebas

### Pruebas Unitarias (Backend)
```bash
cd Backend
npm test
```

## 👤 Credenciales de Prueba
```
Email: juan.perez@luxchile.com
Password: password123
```

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js + Express
- Prisma ORM
- SQLite (Desarrollo)
- JWT para autenticación
- Jest + Supertest (Testing)

### Frontend
- React 19
- React Router v7
- Bootstrap 5
- Axios
- Google Maps API

## 📁 Estructura del Proyecto
```
ERP_LuxChile/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── tests/
│   │   └── api.test.js
│   └── package.json
│
└── Frontend/
    └── pruebas/
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   └── App.js
        └── package.json