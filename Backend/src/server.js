import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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
}

// Exportar app para testing
export default app;