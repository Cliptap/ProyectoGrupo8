import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);

/**
 * @swagger
 * /api/dashboard/estadisticas:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Obtener estadísticas generales
 *     description: Retorna estadísticas agregadas del sistema (total de rutas, cargas, vehículos, etc.)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del sistema
 *         content:
 *           application/json:
 *             example:
 *               totalRutas: 45
 *               rutasActivas: 12
 *               rutasCompletadas: 28
 *               rutasCanceladas: 5
 *               totalCargas: 150
 *               cargasPendientes: 30
 *               cargasEntregadas: 100
 *               totalVehiculos: 10
 *               vehiculosDisponibles: 7
 *               vehiculosEnRuta: 2
 *               vehiculosMantenimiento: 1
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error en el servidor
 */
router.get('/estadisticas', dashboardController.obtenerEstadisticas);

/**
 * @swagger
 * /api/dashboard/rutas-activas:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Obtener rutas activas
 *     description: Retorna las rutas que están actualmente en progreso (estado en_curso o planificada con fecha próxima)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de rutas a retornar
 *     responses:
 *       200:
 *         description: Lista de rutas activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   origen:
 *                     type: string
 *                   destino:
 *                     type: string
 *                   estadoRuta:
 *                     type: string
 *                   vehiculo:
 *                     type: object
 *                   carga:
 *                     type: object
 *                   conductor:
 *                     type: object
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error en el servidor
 */
router.get('/rutas-activas', dashboardController.obtenerRutasActivas);

export default router;
