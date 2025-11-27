import express from 'express';
import {
  obtenerVehiculos,
  obtenerVehiculoPorId,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
} from '../controllers/vehiculosController.js';
import { verificarToken, verificarRol } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener todos los vehículos (todos los roles)
router.get('/', obtenerVehiculos);

// Obtener vehículo por ID (todos los roles)
router.get('/:id', obtenerVehiculoPorId);

// Crear vehículo (solo logística y RRHH)
router.post('/', verificarRol('logistica', 'rrhh'), crearVehiculo);

// Actualizar vehículo (solo logística)
router.put('/:id', verificarRol('logistica'), actualizarVehiculo);

// Eliminar vehículo (solo RRHH)
router.delete('/:id', verificarRol('rrhh'), eliminarVehiculo);

export default router;
