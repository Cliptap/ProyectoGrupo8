import express from 'express';
import {
  obtenerRutas,
  obtenerRutaPorId,
  crearRuta,
  actualizarRuta,
  eliminarRuta,
} from '../controllers/rutasController.js';
import { verificarToken, verificarRol } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener todas las rutas (todos los roles)
router.get('/', obtenerRutas);

// Obtener ruta por ID (todos los roles)
router.get('/:id', obtenerRutaPorId);

// Crear ruta (solo logística)
router.post('/', verificarRol('logistica'), crearRuta);

// Actualizar ruta (logística y seguridad pueden actualizar)
router.put('/:id', verificarRol('logistica', 'seguridad'), actualizarRuta);

// Eliminar ruta (solo logística)
router.delete('/:id', verificarRol('logistica'), eliminarRuta);

export default router;
