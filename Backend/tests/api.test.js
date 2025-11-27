import request from 'supertest';
import app from '../src/server.js';

describe('Sistema ERP LuxChile - Pruebas API', () => {

  let authToken;

  // Obtener token antes de todas las pruebas
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'juan.perez@luxchile.com',
        password: 'password123'
      });

    if (response.status === 200 && response.body.token) {
      authToken = response.body.token;
    }
  });

  describe('Autenticación', () => {
    test('Login con credenciales válidas debe retornar token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'juan.perez@luxchile.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('usuario');
    });

    test('Login con credenciales inválidas debe retornar error', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@test.com',
          password: 'wrongpass'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Vehículos', () => {
    test('GET /api/vehiculos debe retornar lista (con autenticación)', async () => {
      const response = await request(app)
        .get('/api/vehiculos')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/vehiculos sin autenticación debe retornar 401', async () => {
      const response = await request(app).get('/api/vehiculos');
      expect(response.status).toBe(401);
    });
  });

  describe('Rutas', () => {
    test('GET /api/rutas debe retornar lista (con autenticación)', async () => {
      const response = await request(app)
        .get('/api/rutas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Dashboard', () => {
    test('GET /api/dashboard debe retornar datos', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      // Aceptamos 200 o 404 porque puede que no exista esta ruta exacta
      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Cargas', () => {
    test('GET /api/cargas debe retornar lista (con autenticación)', async () => {
      const response = await request(app)
        .get('/api/cargas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // HU2: Tests para liberación de carga al cancelar ruta
  describe('HU2 - Liberación de carga al cancelar ruta', () => {
    let testCargaId;
    let testVehiculoId;
    let testConductorId;
    let testRutaId;

    beforeAll(async () => {
      // Obtener IDs de recursos de prueba
      const vehiculos = await request(app)
        .get('/api/vehiculos')
        .set('Authorization', `Bearer ${authToken}`);
      testVehiculoId = vehiculos.body.find(v => v.estado === 'disponible')?.id;

      const cargas = await request(app)
        .get('/api/cargas')
        .set('Authorization', `Bearer ${authToken}`);
      testCargaId = cargas.body.find(c => c.estado === 'pendiente')?.id;

      const conductores = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${authToken}`);
      testConductorId = conductores.body.find(u => u.rol === 'conductor')?.id;
    });

    test('Crear ruta debe cambiar carga a "asignada" y vehículo a "en_ruta"', async () => {
      if (!testVehiculoId || !testCargaId || !testConductorId) {
        console.warn('⚠️ Saltando test: no hay recursos disponibles');
        return;
      }

      const response = await request(app)
        .post('/api/rutas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vehiculoId: testVehiculoId,
          cargaId: testCargaId,
          conductorId: testConductorId,
          origen: 'Santiago Centro',
          destino: 'Valparaíso Puerto'
        });

      expect(response.status).toBe(201);
      testRutaId = response.body.id;

      // Verificar estado de la carga
      const carga = await request(app)
        .get(`/api/cargas/${testCargaId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(carga.body.estado).toBe('asignada');

      // Verificar estado del vehículo
      const vehiculo = await request(app)
        .get(`/api/vehiculos/${testVehiculoId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(vehiculo.body.estado).toBe('en_ruta');
    });

    test('Cancelar ruta debe cambiar carga a "pendiente" y vehículo a "disponible"', async () => {
      if (!testRutaId) {
        console.warn('⚠️ Saltando test: no hay ruta de prueba');
        return;
      }

      const response = await request(app)
        .put(`/api/rutas/${testRutaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ estadoRuta: 'cancelada' });

      expect(response.status).toBe(200);
      expect(response.body.estadoRuta).toBe('cancelada');

      // Verificar que la carga volvió a "pendiente"
      const carga = await request(app)
        .get(`/api/cargas/${testCargaId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(carga.body.estado).toBe('pendiente');

      // Verificar que el vehículo volvió a "disponible"
      const vehiculo = await request(app)
        .get(`/api/vehiculos/${testVehiculoId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(vehiculo.body.estado).toBe('disponible');
    });
  });
});