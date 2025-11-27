import express from 'express';
import {
  obtenerCargas,
  obtenerCargaPorId,
  crearCarga,
  actualizarCarga,
  eliminarCarga,
} from '../controllers/cargasController.js';
import { verificarToken, verificarRol } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener todas las cargas (todos los roles)
router.get('/', obtenerCargas);

// Obtener carga por ID (todos los roles)
router.get('/:id', obtenerCargaPorId);

// Crear carga (solo logística)
router.post('/', verificarRol('logistica'), crearCarga);

// Actualizar carga (solo logística)
router.put('/:id', verificarRol('logistica'), actualizarCarga);

// Eliminar carga (solo logística y RRHH)
router.delete('/:id', verificarRol('logistica', 'rrhh'), eliminarCarga);

export default router;
