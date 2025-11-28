import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ERP LuxChile - API REST',
      version: '1.0.0',
      description: 'Sistema de gestión logística - Documentación de API con Swagger',
      contact: {
        name: 'Equipo ERP LuxChile',
        email: 'support@luxchile.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.luxchile.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtenido al hacer login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@example.com' },
            rol: { type: 'string', enum: ['admin', 'logistica', 'rrhh', 'conductor'], example: 'logistica' },
            departamento: { type: 'string', example: 'Logística' },
          },
        },
        Vehiculo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            patente: { type: 'string', example: 'ABC-1234' },
            marca: { type: 'string', example: 'Mercedes Benz' },
            modelo: { type: 'string', example: 'Sprinter' },
            capacidadKg: { type: 'number', example: 5000 },
            estado: { type: 'string', enum: ['disponible', 'en_ruta', 'mantenimiento'], example: 'disponible' },
          },
        },
        Carga: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            descripcion: { type: 'string', example: 'Perfumes de lujo' },
            peso: { type: 'number', example: 150 },
            tipo: { type: 'string', enum: ['normal', 'fragil', 'alto_valor'], example: 'alto_valor' },
            prioridad: { type: 'string', enum: ['baja', 'media', 'alta'], example: 'alta' },
            estado: { type: 'string', enum: ['pendiente', 'asignada', 'en_transito', 'entregada'], example: 'pendiente' },
            origen: { type: 'string', example: 'Bodega Centro' },
            destino: { type: 'string', example: 'Tienda Providencia' },
          },
        },
        Ruta: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            origen: { type: 'string', example: 'Bodega Centro' },
            destino: { type: 'string', example: 'Tienda Providencia' },
            distanciaKm: { type: 'number', example: 15.5 },
            estadoRuta: { type: 'string', enum: ['planificada', 'en_curso', 'completada', 'cancelada'], example: 'planificada' },
            vehiculoId: { type: 'integer', example: 1 },
            cargaId: { type: 'integer', example: 1 },
            conductorId: { type: 'integer', example: 2 },
            fechaInicio: { type: 'string', format: 'date-time' },
            fechaFin: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'juan.perez@luxchile.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            usuario: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                nombre: { type: 'string', example: 'Juan Pérez' },
                email: { type: 'string', example: 'juan@example.com' },
                rol: { type: 'string', example: 'logistica' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensaje de error' },
            status: { type: 'integer', example: 400 },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/auth.js',
    './src/routes/vehiculos.js',
    './src/routes/cargas.js',
    './src/routes/rutas.js',
    './src/routes/dashboard.js',
    './src/routes/usuarios.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
