# ��� Backend ERP LuxChile

API REST parnpm run dev          # Inicia servidor con nodemon (auto-reload) - Ejecuta seed automáticamente
npm start            # Inicia servidor en producción - Ejecuta seed automáticamente
npm run seed         # Puebla la base de datos con datos de ejemplo (solo si es necesario)
npx prisma studio    # Abre interfaz visual de la base de datos
npx prisma migrate dev  # Crea nueva migración
```

## HU1 - Documentación API en Swagger

La API está completamente documentada en **Swagger/OpenAPI** con especificación interactiva.

### Acceder a Swagger UI

Una vez que el servidor esté corriendo:

```
http://localhost:3000/api-docs
```

Swagger UI permite:
- Ver todos los endpoints documentados
- Probar los endpoints directamente desde el navegador
- Ver ejemplos de request/response
- Autenticarse con tokens JWT
- Consultar esquemas de datos

**Documentación automática desde**: `src/swagger.config.js` y comentarios JSDoc en rutas

## Endpoints de la APIa de gestión logística - Proyecto universitario Ingeniería de Software I

## ���️ Stack Tecnológico

- **Node.js** + **Express** - Servidor y rutas
- **Prisma** - ORM y migraciones
- **SQLite** - Base de datos (desarrollo)
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

## ��� Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/Proyectoingsoft1/ERP_LuxChile.git
cd ERP_LuxChile/Backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Generar cliente de Prisma
npx prisma generate

# 5. Crear base de datos y tablas
npx prisma migrate dev --name init

# 6. Iniciar servidor (seed se ejecutará automáticamente)
npm run dev
# O para producción:
npm start
```

**✨ NOTA HU7:** El seed se ejecuta automáticamente al iniciar el servidor, poblando la BD con datos de ejemplo de productos de lujo (joyas, cristalería, ropa premium). No es necesario ejecutar `npm run seed` manualmente (aunque sigue disponible para reiniciar los datos).

## 📚 Comandos Disponibles

```bash
npm run dev          # Inicia servidor con nodemon (auto-reload) - Ejecuta seed automáticamente
npm start            # Inicia servidor en producción - Ejecuta seed automáticamente
npm run seed         # Puebla la base de datos con datos de ejemplo (solo si es necesario)
npx prisma studio    # Abre interfaz visual de la base de datos
npx prisma migrate dev  # Crea nueva migración
```

## ��� Endpoints de la API

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/registro` | Registrar usuario | No |
| GET | `/api/auth/perfil` | Obtener perfil | Sí |

**Ejemplo Login:**
```json
POST /api/auth/login
{
  "email": "juan.perez@luxchile.com",
  "password": "password123"
}
```

### Vehículos (`/api/vehiculos`)

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/vehiculos` | Listar vehículos | Todos |
| GET | `/api/vehiculos/:id` | Ver detalle | Todos |
| POST | `/api/vehiculos` | Crear vehículo | Logística, RRHH |
| PUT | `/api/vehiculos/:id` | Actualizar | Logística |
| DELETE | `/api/vehiculos/:id` | Eliminar | RRHH |

**Ejemplo Crear Vehículo:**
```json
POST /api/vehiculos
Authorization: Bearer {token}
{
  "patente": "XYAB99",
  "marca": "Mercedes-Benz",
  "modelo": "Actros",
  "capacidadCarga": 25000
}
```

### Cargas (`/api/cargas`)

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/cargas` | Listar cargas | Todos |
| GET | `/api/cargas/:id` | Ver detalle | Todos |
| POST | `/api/cargas` | Crear carga | Logística |
| PUT | `/api/cargas/:id` | Actualizar | Logística |
| DELETE | `/api/cargas/:id` | Eliminar | Logística, RRHH |

**Ejemplo Crear Carga:**
```json
POST /api/cargas
Authorization: Bearer {token}
{
  "descripcion": "Alimentos refrigerados",
  "peso": 15000,
  "tipo": "refrigerada",
  "prioridad": "alta",
  "origen": "Santiago Centro",
  "destino": "Valparaíso"
}
```

### Rutas (`/api/rutas`)

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/rutas` | Listar rutas | Todos |
| GET | `/api/rutas/:id` | Ver detalle | Todos |
| POST | `/api/rutas` | Crear ruta | Logística |
| PUT | `/api/rutas/:id` | Actualizar | Logística, Seguridad |
| DELETE | `/api/rutas/:id` | Eliminar | Logística |

**Ejemplo Crear Ruta:**
```json
POST /api/rutas
Authorization: Bearer {token}
{
  "vehiculoId": 1,
  "cargaId": 2,
  "conductorId": 1,
  "origen": "Santiago",
  "destino": "Valparaíso",
  "distanciaKm": 120
}
```

## ��� Autenticación

Todas las rutas (excepto `/api/auth/login` y `/api/auth/registro`) requieren un token JWT en el header:

```
Authorization: Bearer {tu_token_aqui}
```

## ��� Usuarios de Prueba

Después de ejecutar `npm run seed`, puedes usar:

| Email | Password | Rol |
|-------|----------|-----|
| juan.perez@luxchile.com | password123 | Logística |
| maria.gonzalez@luxchile.com | password123 | Logística |
| carlos.rojas@luxchile.com | password123 | Logística |
| ana.martinez@luxchile.com | password123 | RRHH |
| pedro.silva@luxchile.com | password123 | RRHH |
| diego.morales@luxchile.com | password123 | Seguridad |
| laura.fernandez@luxchile.com | password123 | Seguridad |

## ��� Estructura de la Base de Datos

### Modelos principales:

- **Usuario** - Empleados del sistema (logística, RRHH, seguridad)
- **Vehiculo** - Camiones con capacidad de carga y ubicación GPS
- **Carga** - Mercancía a transportar (con peso, tipo, prioridad)
- **Ruta** - Asignación de carga a vehículo con conductor
- **Sensor** - Lecturas de sensores (temperatura, humedad, etc.)
- **Camara** - Cámaras de seguridad en vehículos
- **Incidente** - Reportes de problemas en rutas

## ���️ Estructura del Proyecto

```
Backend/
├── prisma/
│   ├── schema.prisma      # Esquema de la base de datos
│   └── seed.js            # Datos de ejemplo
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vehiculosController.js
│   │   ├── cargasController.js
│   │   └── rutasController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vehiculos.js
│   │   ├── cargas.js
│   │   └── rutas.js
│   └── server.js          # Servidor Express
├── .env                   # Variables de entorno (no en git)
├── .env.example           # Ejemplo de variables
├── .gitignore
├── package.json
└── README.md
```

## ��� Flujo de Trabajo Git

```bash
# 1. Actualizar código
git pull origin main

# 2. Crear rama para tu tarea
git checkout -b SCRUM-XX-descripcion

# 3. Hacer cambios y commit
git add .
git commit -m "SCRUM-XX: Descripción del cambio"

# 4. Subir cambios
git push origin SCRUM-XX-descripcion

# 5. Crear Pull Request en GitHub
```

## ��� Probar la API

### Opción 1: Con cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan.perez@luxchile.com","password":"password123"}'

# Obtener vehículos (reemplazar TOKEN)
curl http://localhost:3000/api/vehiculos \
  -H "Authorization: Bearer TOKEN"
```

### Opción 2: Con Postman/Insomnia

1. Importa la colección de endpoints
2. Configura variable de entorno `BASE_URL = http://localhost:3000`
3. Realiza login y copia el token
4. Agrega el token en Authorization → Bearer Token

### Opción 3: Con Prisma Studio

```bash
npx prisma studio
```

Abre http://localhost:5555 para ver y editar datos visualmente.

## ��� Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
npx prisma generate
```

### Error: "PrismaClientInitializationError"
```bash
# Eliminar base de datos
rm -f prisma/dev.db

# Recrear
npx prisma migrate dev --name init
npm run seed
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env
PORT=3001
```

### Ver logs detallados
```bash
# Abrir archivo de logs si los tienes configurados
tail -f logs/app.log
```

## ��� Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus valores
nano .env
```

**Variables disponibles:**

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | Ruta de la base de datos SQLite | `file:./dev.db` |
| `JWT_SECRET` | Clave secreta para JWT | `cambiar_en_produccion` |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:3001` |
| `FRONTEND_URL` | URL del frontend | `http://localhost:3001` |

**⚠️ IMPORTANTE:** Genera un JWT_SECRET seguro para producción:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ��� Deploy (Producción)

Para desplegar en Render/Railway:

1. Cambiar `DATABASE_URL` a PostgreSQL
2. Actualizar `JWT_SECRET` con un valor seguro
3. Configurar variables de entorno en el servicio
4. El `package.json` ya tiene los scripts necesarios

## ���‍��� Equipo

- **Backend:** Vicente
- **Frontend:** [Compañero]
- **Proyecto:** Ingeniería de Software I

## ��� Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/)
- [JWT.io](https://jwt.io/)

## ��� Licencia

Proyecto universitario - MIT License# ��� Backend ERP LuxChile

API REST para sistema de gestión logística - Proyecto universitario Ingeniería de Software I

## ���️ Stack Tecnológico

- **Node.js** + **Express** - Servidor y rutas
- **Prisma** - ORM y migraciones
- **SQLite** - Base de datos (desarrollo)
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

## ��� Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/Proyectoingsoft1/ERP_LuxChile.git
cd ERP_LuxChile/Backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Generar cliente de Prisma
npx prisma generate

# 5. Crear base de datos y tablas
npx prisma migrate dev --name init

# 6. Poblar con datos de ejemplo
npm run seed

# 7. Iniciar servidor
npm run dev
```

## ��� Comandos Disponibles

```bash
npm run dev          # Inicia servidor con nodemon (auto-reload)
npm start            # Inicia servidor en producción
npm run seed         # Puebla la base de datos con datos de ejemplo
npx prisma studio    # Abre interfaz visual de la base de datos
npx prisma migrate dev  # Crea nueva migración
```

## ��� Endpoints de la API

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/registro` | Registrar usuario | No |
| GET | `/api/auth/perfil` | Obtener perfil | Sí |

**Ejemplo Login:**
```json
POST /api/auth/login
{
  "email": "juan.perez@luxchile.com",
  "password": "password123"
}
```

### Vehículos (`/api/vehiculos`)

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/vehiculos` | Listar vehículos | Todos |
| GET | `/api/vehiculos/:id` | Ver detalle | Todos |
| POST | `/api/vehiculos` | Crear vehículo | Logística, RRHH |
| PUT | `/api/vehiculos/:id` | Actualizar | Logística |
| DELETE | `/api/vehiculos/:id` | Eliminar | RRHH |

**Ejemplo Crear Vehículo:**
```json
POST /api/vehiculos
Authorization: Bearer {token}
{
  "patente": "XYAB99",
  "marca": "Mercedes-Benz",
  "modelo": "Actros",
  "capacidadCarga": 25000
}
```

### Cargas (`/api/cargas`)

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/cargas` | Listar cargas | Todos |
| GET | `/api/cargas/:id` | Ver detalle | Todos |
| POST | `/api/cargas` | Crear carga | Logística |
| PUT | `/api/cargas/:id` | Actualizar | Logística |
| DELETE | `/api/cargas/:id` | Eliminar | Logística, RRHH |

**Ejemplo Crear Carga:**
```json
POST /api/cargas
Authorization: Bearer {token}
{
  "descripcion": "Alimentos refrigerados",
  "peso": 15000,
  "tipo": "refrigerada",
  "prioridad": "alta",
  "origen": "Santiago Centro",
  "destino": "Valparaíso"
}
```

### Rutas (`/api/rutas`)

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/rutas` | Listar rutas | Todos |
| GET | `/api/rutas/:id` | Ver detalle | Todos |
| POST | `/api/rutas` | Crear ruta | Logística |
| PUT | `/api/rutas/:id` | Actualizar | Logística, Seguridad |
| DELETE | `/api/rutas/:id` | Eliminar | Logística |

**Ejemplo Crear Ruta:**
```json
POST /api/rutas
Authorization: Bearer {token}
{
  "vehiculoId": 1,
  "cargaId": 2,
  "conductorId": 1,
  "origen": "Santiago",
  "destino": "Valparaíso",
  "distanciaKm": 120
}
```

## ��� Autenticación

Todas las rutas (excepto `/api/auth/login` y `/api/auth/registro`) requieren un token JWT en el header:

```
Authorization: Bearer {tu_token_aqui}
```

## ��� Usuarios de Prueba

Después de ejecutar `npm run seed`, puedes usar:

| Email | Password | Rol |
|-------|----------|-----|
| juan.perez@luxchile.com | password123 | Logística |
| maria.gonzalez@luxchile.com | password123 | Logística |
| carlos.rojas@luxchile.com | password123 | Logística |
| ana.martinez@luxchile.com | password123 | RRHH |
| pedro.silva@luxchile.com | password123 | RRHH |
| diego.morales@luxchile.com | password123 | Seguridad |
| laura.fernandez@luxchile.com | password123 | Seguridad |

## ��� Estructura de la Base de Datos

### Modelos principales:

- **Usuario** - Empleados del sistema (logística, RRHH, seguridad)
- **Vehiculo** - Camiones con capacidad de carga y ubicación GPS
- **Carga** - Mercancía a transportar (con peso, tipo, prioridad)
- **Ruta** - Asignación de carga a vehículo con conductor
- **Sensor** - Lecturas de sensores (temperatura, humedad, etc.)
- **Camara** - Cámaras de seguridad en vehículos
- **Incidente** - Reportes de problemas en rutas

## ���️ Estructura del Proyecto

```
Backend/
├── prisma/
│   ├── schema.prisma      # Esquema de la base de datos
│   └── seed.js            # Datos de ejemplo
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vehiculosController.js
│   │   ├── cargasController.js
│   │   └── rutasController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vehiculos.js
│   │   ├── cargas.js
│   │   └── rutas.js
│   └── server.js          # Servidor Express
├── .env                   # Variables de entorno (no en git)
├── .env.example           # Ejemplo de variables
├── .gitignore
├── package.json
└── README.md
```

## ��� Flujo de Trabajo Git

```bash
# 1. Actualizar código
git pull origin main

# 2. Crear rama para tu tarea
git checkout -b SCRUM-XX-descripcion

# 3. Hacer cambios y commit
git add .
git commit -m "SCRUM-XX: Descripción del cambio"

# 4. Subir cambios
git push origin SCRUM-XX-descripcion

# 5. Crear Pull Request en GitHub
```

## ��� Probar la API

### Opción 1: Con cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan.perez@luxchile.com","password":"password123"}'

# Obtener vehículos (reemplazar TOKEN)
curl http://localhost:3000/api/vehiculos \
  -H "Authorization: Bearer TOKEN"
```

### Opción 2: Con Postman/Insomnia

1. Importa la colección de endpoints
2. Configura variable de entorno `BASE_URL = http://localhost:3000`
3. Realiza login y copia el token
4. Agrega el token en Authorization → Bearer Token

### Opción 3: Con Prisma Studio

```bash
npx prisma studio
```

Abre http://localhost:5555 para ver y editar datos visualmente.

## ��� Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
npx prisma generate
```

### Error: "PrismaClientInitializationError"
```bash
# Eliminar base de datos
rm -f prisma/dev.db

# Recrear
npx prisma migrate dev --name init
npm run seed
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env
PORT=3001
```

### Ver logs detallados
```bash
# Abrir archivo de logs si los tienes configurados
tail -f logs/app.log
```

## ��� Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus valores
nano .env
```

**Variables disponibles:**

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | Ruta de la base de datos SQLite | `file:./dev.db` |
| `JWT_SECRET` | Clave secreta para JWT | `cambiar_en_produccion` |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:3001` |
| `FRONTEND_URL` | URL del frontend | `http://localhost:3001` |

**⚠️ IMPORTANTE:** Genera un JWT_SECRET seguro para producción:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ��� Deploy (Producción)

Para desplegar en Render/Railway:

1. Cambiar `DATABASE_URL` a PostgreSQL
2. Actualizar `JWT_SECRET` con un valor seguro
3. Configurar variables de entorno en el servicio
4. El `package.json` ya tiene los scripts necesarios

## ���‍��� Equipo

- **Backend:** Vicente
- **Frontend:** [Compañero]
- **Proyecto:** Ingeniería de Software I

## ��� Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/)
- [JWT.io](https://jwt.io/)

## ��� Licencia

Proyecto universitario - MIT License
