# 🚚 ERP LuxChile - Sistema de Gestión Logística

Sistema ERP desarrollado para la gestión de operaciones logísticas de LuxChile, incluyendo administración de vehículos, rutas, cargas y trabajadores.

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Git

## 🚀 Instalación y Ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/Proyectoingsoft1/ERP_LuxChile.git
cd ERP_LuxChile
```

### 2️⃣ Configurar y ejecutar el Backend
```bash
cd Backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run seed

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

## 🔐 HU4 - Configuración Segura de Google Maps API

⚠️ **IMPORTANTE**: A partir de la HU4, la API key de Google Maps **NO** debe estar hardcodeada en el código.

### ✅ Configurar API Key de forma segura

1. **Crear archivo `.env.local` en la carpeta Frontend/pruebas:**

```bash
cd Frontend/pruebas
cp .env.example .env.local
```

2. **Editar `.env.local` y agregar tu API key:**

```env
REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

3. **Obtener tu API Key:**
   - Ir a [Google Cloud Console](https://console.cloud.google.com/)
   - Crear un nuevo proyecto o seleccionar uno existente
   - Habilitar las APIs necesarias:
     - ✅ Maps JavaScript API
     - ✅ Places API
     - ✅ Directions API
   - Crear una clave de API (API Key)
   - Aplicar restricciones de seguridad:
     - **Restricción de aplicaciones**: HTTP referrers
     - **Sitios autorizados**: `localhost` (desarrollo), tu dominio (producción)

4. **Verificar que funciona:**
   - El archivo `.env.local` está en `.gitignore` ✅
   - Al iniciar el servidor (`npm start`), el mapa debe cargar correctamente
   - Abrir Dev Tools (F12) y verificar que NO aparece la API key en el HTML

### ⚠️ Seguridad

- ❌ **NUNCA** commits la API key al repositorio
- ❌ **NUNCA** dejes la API key expuesta en el código frontend
- ✅ Usa siempre variables de entorno (`.env.local`)
- ✅ Aplica restricciones de API key en Google Cloud Console
- ✅ Documenta el archivo `.env.example` con placeholders

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
