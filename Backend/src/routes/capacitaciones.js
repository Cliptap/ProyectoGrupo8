import express from 'express';
import capacitacionesController from '../controllers/capacitacionesController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarToken);

// ============ CRUD BÁSICO ============

// Obtener todas las capacitaciones
router.get('/', capacitacionesController.obtenerCapacitaciones);

// Obtener capacitaciones de un trabajador
router.get('/trabajador/:usuarioId', capacitacionesController.obtenerCapacitacionesPorTrabajador);

// Crear capacitación
router.post('/', capacitacionesController.crearCapacitacion);

// Actualizar capacitación
router.put('/:id', capacitacionesController.actualizarCapacitacion);

// Eliminar capacitación
router.delete('/:id', capacitacionesController.eliminarCapacitacion);

// ============ FILTROS Y ANÁLISIS ============

// Obtener trabajadores sin capacitaciones en el último año
router.get('/filtros/sin-capacitaciones', capacitacionesController.obtenerTrabajadoresSinCapacitaciones);

// Obtener estadísticas de capacitaciones
router.get('/estadisticas/por-categoria', capacitacionesController.obtenerEstadisticasCapacitaciones);

// Obtener capacitaciones con filtros complejos
router.get('/filtros/buscar', capacitacionesController.obtenerCapacitacionesPorFiltros);

export default router;
