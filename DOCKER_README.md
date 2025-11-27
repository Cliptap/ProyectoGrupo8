# 🐳 ERP LuxChile - Docker Setup

Sistema ERP de logística dockerizado con SQLite (ideal para demostraciones y pruebas).

## 📋 Requisitos

- Docker Desktop instalado
- 2 GB de espacio libre
- Puertos 80 y 3000 disponibles

## 🚀 Inicio Rápido

### 1. Clonar repositorio
```bash
git clone https://github.com/Proyectoingsoft1/ERP_LuxChile.git
cd ERP_LuxChile
```

### 2. Iniciar con un comando
```bash
./start.sh
```

### 3. Esperar 30 segundos y acceder
- Frontend: **http://localhost**
- Backend API: **http://localhost:3000**

### 4. Login de prueba
- Email: `juan.perez@luxchile.com`
- Password: `password123`

## 🎮 Comandos
```bash
# Iniciar
./start.sh

# Detener
./stop.sh

# Ver logs
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Reiniciar
docker-compose restart

# Ver estado
docker-compose ps
```

## 🗄️ Base de Datos

La base de datos SQLite se guarda en:
- `Backend/prisma/dev.db`

Es solo un archivo, fácil de:
- ✅ Respaldar (copiar el archivo)
- ✅ Compartir
- ✅ Resetear (borrar y reiniciar)

### Resetear base de datos
```bash
docker-compose down
rm Backend/prisma/dev.db
./start.sh
```

## 📦 Para llevar a otra PC

### Opción 1: Solo código (recomendado)
```bash
# En la PC original
git push

# En la nueva PC
git clone https://github.com/Proyectoingsoft1/ERP_LuxChile.git
cd ERP_LuxChile
./start.sh
```

### Opción 2: Con datos existentes
```bash
# Copiar también el archivo de base de datos
Backend/prisma/dev.db
```

## 🐛 Solución de Problemas

### Puerto 80 ocupado
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8080:3000"  # En lugar de "80:3000"

# Acceder en http://localhost:8080
```

### "Cannot find module prisma"
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Base de datos corrupta
```bash
rm Backend/prisma/dev.db
docker-compose restart backend
```

## 📊 Capacidad

- ✅ Hasta 20-30 usuarios simultáneos
- ✅ Ideal para demostraciones
- ✅ Perfecto para desarrollo y pruebas
- ✅ Sin configuración compleja

## 🎯 Demo Rápida

Para una demo en otra PC:
1. Instalar Docker Desktop
2. Clonar repo
3. `./start.sh`
4. Abrir http://localhost
5. ¡Listo! 🚀

## 💾 Backup
```bash
# Backup manual
cp Backend/prisma/dev.db backup_$(date +%Y%m%d).db

# Restaurar
cp backup_20241021.db Backend/prisma/dev.db
docker-compose restart backend
```
