# CHANGELOG

## [1.1.0] - 2025-11-27

### 📋 Resumen

Implementación de 4 Historias de Usuario enfocadas en mejoras operacionales y nuevo panel RRHH. **HU9 integra completamente HU6, HU7 y HU8**, facilitando merge sin conflictos.

### ✨ Nuevas Funcionalidades

#### HU6 - Ajustar layout del botón "Limpiar" en dashboard
**Objetivo:** Eliminar solapamiento entre botón "Limpiar" y barra de búsqueda en distintas resoluciones.

**Cambios Técnicos:**
- Optimización CSS Flexbox en `FiltrosRutas.js`
- Propiedades: `flex: 1 1 500px`, `minWidth: 350px`, `gap: 12px`
- Botón con `flex: 0 0 auto` para prevenir solapamiento
- Validación responsiva: 1366×768 ✅ y 1920×1080 ✅

**Archivos Modificados:**
- `Frontend/pruebas/src/components/Dashboard/FiltrosRutas.js`

---

#### HU7 - Alinear tipos de carga al dominio de productos de lujo
**Objetivo:** Cambiar tipos de carga genéricos a categorías alineadas con mercado de lujo.

**Cambios Técnicos:**
- **Tipos actualizados:** `normal`, `fragil`, `alto_valor` (eliminados: `refrigerada`, `peligrosa`)
- **Ejemplos de lujo:** Joyas de diseñador, Cristalería fina, Ropa premium y accesorios
- **Validación Backend:** `cargasController.js` lista blanca de tipos
- **UI mejorada:** Colores/iconos dinámicos (👔, 🔴, 💎)
- **Seed automático:** Ejecutado en `server.js` al iniciar (idempotente)

**Archivos Modificados:**
- `Backend/src/controllers/cargasController.js`
- `Backend/prisma/seed.js`
- `Frontend/pruebas/src/components/Cargas/CargaCard.js`
- `Frontend/pruebas/src/components/Cargas/FormularioCarga.js`
- `Backend/src/server.js` (seed automático)

---

#### HU8 - Mejorar indicador de rutas asociadas a una carga
**Objetivo:** Reemplazar contador numérico confuso con indicador booleano claro.

**Cambios Técnicos:**
- **Lógica:** Función `isAsignada()` valida estado de ruta (`planificada` o `en_curso`)
- **Visualización:** ✅ Asignada (verde) / ❌ No asignada (rojo)
- **Validación:** Basada en estado real de ruta, no solo cantidad

**Archivos Modificados:**
- `Frontend/pruebas/src/components/Cargas/CargaCard.js`

---

#### HU9 - Crear panel de RRHH para registrar capacitaciones
**Objetivo:** Panel integral de gestión de capacitaciones por trabajador con trazabilidad.

**✅ Integración de HU6, HU7, HU8:**
- HU6: Layout responsive aplicado en componentes de capacitaciones
- HU7: Tipos de categoría alineados a empresa de lujo (seguridad, logística, atención premium)
- HU8: Indicadores booleanos de estado de capacitación

**Funcionalidades CRUD:**
- ➕ Crear capacitación
- 📖 Leer historial por trabajador
- ✏️ Actualizar datos de capacitación
- 🗑️ Eliminar registros

**Filtros Avanzados:**
- Por trabajador
- Por categoría (seguridad, logística, atención al cliente)
- Por rango de fechas (desde/hasta)
- Identificar trabajadores sin capacitaciones en último año

**Campos por Capacitación:**
- Tema, Fecha, Categoría, Institución, Duración (horas)
- Calificación (0-100), Estado, Certificación
- Notas

**Archivos Creados:**
- Backend: Controlador, rutas, migraciones Prisma
- Frontend: Componentes (principal, formulario, cards), servicio API

**Archivos Modificados:**
- `Backend/prisma/schema.prisma` (modelo + relación)
- `Backend/src/server.js` (rutas integradas + seed)
- `Frontend/pruebas/src/components/Trabajadores/Trabajadores.js` (nueva pestaña)
- `Frontend/pruebas/src/services/index.js` (export servicio)

---

### 🔧 Cambios Técnicos Globales

**Base de Datos:**
- Tabla `Capacitacion` con 11 campos
- Relación 1:N con tabla `Usuario` (onDelete: Cascade)
- Migraciones Prisma automáticas

**API REST:**
- Endpoints CRUD completos
- Filtros complejos con validación
- Respuestas estructuradas `{success, data}`
- Middleware de autenticación JWT

**Frontend:**
- Componentes React con manejo de estado
- Validaciones de entrada en formularios
- Manejo de errores y loading states
- Estilos inline consistentes

**DevOps:**
- Seed automático integrado (no requiere `npm run seed` manual)
- Migraciones Prisma automáticas
- Variables de entorno soportadas

---

### 📦 Compatibilidad

- ✅ Node.js v18+
- ✅ npm v9+
- ✅ SQLite (desarrollo)
- ✅ Prisma 5.22.0
- ✅ Express + JWT
- ✅ React 19.2.0

---

### 🚀 Instalación (Sin Cambios)

```bash
# Paso 1
git clone https://github.com/Proyectoingsoft1/ERP_LuxChile.git
cd ERP_LuxChile

# Paso 2: Backend
cd Backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev

# Paso 3: Frontend (otra terminal)
cd Frontend/pruebas
npm install
npm start
```

---

### 👤 Credenciales de Prueba

```
Email:    juan.perez@luxchile.com
Password: password123
Rol:      logistica
```

---

### 📊 Resumen de Cambios

| Métrica | Valor |
|---------|-------|
| Archivos Creados | 7 |
| Archivos Modificados | 13 |
| Líneas Agregadas | ~1760 |
| Commits | 4 |
| Historias Completadas | 4 (HU6, HU7, HU8, HU9) |

---

### ✅ Checklist de Validación

- ✅ HU6: Sin solapamiento en 1366×768 y 1920×1080
- ✅ HU7: Tipos alineados a productos de lujo
- ✅ HU8: Indicador booleano funcionando
- ✅ HU9: CRUD completo + filtros + seed automático
- ✅ Instalación sin cambios en procedimiento
- ✅ Credenciales funcionan
- ✅ Seed automático al iniciar servidor
- ✅ Sin errores de compilación Frontend
- ✅ Sin errores en Backend API
- ✅ Migraciones Prisma aplicadas correctamente

---

### 📝 Notas de Merge

**Importante:** HU9 contiene todas las dependencias de HU6, HU7, HU8. Se recomienda mergear rama completa para evitar conflictos parciales.

**Sin Breaking Changes:** La instalación y uso siguen siendo idénticos.
