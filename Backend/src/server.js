import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Importar rutas
import authRoutes from './routes/auth.js';
import vehiculosRoutes from './routes/vehiculos.js';
import cargasRoutes from './routes/cargas.js';
import rutasRoutes from './routes/rutas.js';
import dashboardRoutes from './routes/dashboard.js';
import usuariosRoutes from './routes/usuarios.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🚚 API ERP LuxChile - Sistema de Logística',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      vehiculos: '/api/vehiculos',
      cargas: '/api/cargas',
      rutas: '/api/rutas',
    },
    docs: 'Consulta el README.md para más información',
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/cargas', cargasRoutes);
app.use('/api/rutas', rutasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta de test (sin autenticación)
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Función para inicializar la BD con seed automático (HU7)
async function initializeSeed() {
  try {
    const cargasExistentes = await prisma.carga.count();
    if (cargasExistentes === 0) {
      console.log('🌱 Inicializando base de datos con datos de ejemplo...');
      
      // Limpiar datos existentes
      await prisma.ruta.deleteMany();
      await prisma.carga.deleteMany();
      await prisma.vehiculo.deleteMany();
      await prisma.usuario.deleteMany();

      const hashedPassword = await bcrypt.hash('password123', 10);

      // Crear usuarios
      await prisma.usuario.createMany({
        data: [
          { email: 'juan.perez@luxchile.com', password: hashedPassword, nombre: 'Juan Pérez', rol: 'logistica' },
          { email: 'maria.gonzalez@luxchile.com', password: hashedPassword, nombre: 'María González', rol: 'logistica' },
          { email: 'carlos.rojas@luxchile.com', password: hashedPassword, nombre: 'Carlos Rojas', rol: 'logistica' },
          { email: 'ana.martinez@luxchile.com', password: hashedPassword, nombre: 'Ana Martínez', rol: 'rrhh' },
          { email: 'pedro.silva@luxchile.com', password: hashedPassword, nombre: 'Pedro Silva', rol: 'rrhh' },
          { email: 'diego.morales@luxchile.com', password: hashedPassword, nombre: 'Diego Morales', rol: 'seguridad' },
          { email: 'laura.fernandez@luxchile.com', password: hashedPassword, nombre: 'Laura Fernández', rol: 'seguridad' },
          { email: 'conductor1@luxchile.com', password: hashedPassword, nombre: 'Roberto Sánchez', rol: 'conductor' },
          { email: 'conductor2@luxchile.com', password: hashedPassword, nombre: 'Patricia Muñoz', rol: 'conductor' },
          { email: 'conductor3@luxchile.com', password: hashedPassword, nombre: 'Luis Torres', rol: 'conductor' },
          { email: 'conductor4@luxchile.com', password: hashedPassword, nombre: 'Carmen Vega', rol: 'conductor' },
          { email: 'conductor5@luxchile.com', password: hashedPassword, nombre: 'Alberto Díaz', rol: 'conductor' },
        ],
      });

      // Obtener usuarios
      const usuariosCreados = await prisma.usuario.findMany();
      const conductor1 = usuariosCreados.find(u => u.email === 'juan.perez@luxchile.com');
      const conductor2 = usuariosCreados.find(u => u.email === 'carlos.rojas@luxchile.com');

      // Crear vehículos
      const vehiculo1 = await prisma.vehiculo.create({
        data: {
          patente: 'ABCD12',
          marca: 'Mercedes-Benz',
          modelo: 'Actros 2651',
          capacidadCarga: 25000,
          estado: 'disponible',
          ubicacionActualLat: -33.4489,
          ubicacionActualLng: -70.6693,
        },
      });

      const vehiculo2 = await prisma.vehiculo.create({
        data: {
          patente: 'EFGH34',
          marca: 'Volvo',
          modelo: 'FH16',
          capacidadCarga: 30000,
          estado: 'en_ruta',
          ubicacionActualLat: -33.0361,
          ubicacionActualLng: -71.6270,
        },
      });

      const vehiculo3 = await prisma.vehiculo.create({
        data: {
          patente: 'IJKL56',
          marca: 'Scania',
          modelo: 'R450',
          capacidadCarga: 20000,
          estado: 'mantenimiento',
          ubicacionActualLat: -33.4489,
          ubicacionActualLng: -70.6693,
        },
      });

      // Crear cargas (HU7: Alineadas a productos de lujo)
      const carga1 = await prisma.carga.create({
        data: {
          descripcion: 'Joyas de diseñador',
          peso: 2500,
          tipo: 'alto_valor',
          prioridad: 'urgente',
          estado: 'en_transito',
          origen: 'Santiago Centro',
          destino: 'Valparaíso',
        },
      });

      const carga2 = await prisma.carga.create({
        data: {
          descripcion: 'Cristalería fina',
          peso: 1200,
          tipo: 'fragil',
          prioridad: 'alta',
          estado: 'pendiente',
          origen: 'Pudahuel',
          destino: 'Viña del Mar',
        },
      });

      const carga3 = await prisma.carga.create({
        data: {
          descripcion: 'Ropa premium y accesorios',
          peso: 5500,
          tipo: 'normal',
          prioridad: 'media',
          estado: 'asignada',
          origen: 'Quilicura',
          destino: 'Rancagua',
        },
      });

      // Crear rutas
      await prisma.ruta.create({
        data: {
          vehiculoId: vehiculo2.id,
          cargaId: carga1.id,
          conductorId: conductor1.id,
          origen: 'Santiago Centro',
          destino: 'Valparaíso',
          distanciaKm: 120,
          estadoRuta: 'en_curso',
          fechaInicio: new Date(),
          puntosIntermedio: JSON.stringify([
            { lat: -33.4489, lng: -70.6693 },
            { lat: -33.0361, lng: -71.6270 },
          ]),
        },
      });

      await prisma.ruta.create({
        data: {
          vehiculoId: vehiculo1.id,
          cargaId: carga3.id,
          conductorId: conductor2.id,
          origen: 'Quilicura',
          destino: 'Rancagua',
          distanciaKm: 87,
          estadoRuta: 'planificada',
          puntosIntermedio: JSON.stringify([
            { lat: -33.3618, lng: -70.7262 },
            { lat: -34.1705, lng: -70.7407 },
          ]),
        },
      });

      console.log('✅ Base de datos inicializada con datos de ejemplo (HU7)');
    } else {
      console.log('✅ Base de datos ya contiene datos');
    }
  } catch (error) {
    console.error('⚠️  Error al inicializar base de datos:', error);
  }
}

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal',
  });
});

// Solo iniciar servidor si NO está en modo test
if (process.env.NODE_ENV !== 'test') {
  // Inicializar seed y luego iniciar servidor
  initializeSeed().then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación: http://localhost:${PORT}/`);
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
      console.log(`🌐 CORS habilitado para: ${corsOptions.origin}`);
      console.log(`⚙️  Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n👤 Credenciales de prueba:`);
      console.log(`   Email: juan.perez@luxchile.com`);
      console.log(`   Password: password123\n`);
    });
  }).catch((error) => {
    console.error('❌ Error fatal al inicializar:', error);
    process.exit(1);
  });
}

// Exportar app para testing
export default app;