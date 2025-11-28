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

/**
 * @swagger
 * /api/rutas:
 *   get:
 *     tags:
 *       - Rutas
 *     summary: Obtener lista de rutas
 *     description: Retorna todas las rutas registradas en el sistema, opcionalmente filtradas por estado
 *     parameters:
 *       - name: estadoRuta
 *         in: query
 *         schema:
 *           type: string
 *           enum: [planificada, en_curso, completada, cancelada]
 *         description: Filtrar por estado de la ruta
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de rutas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ruta'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error en el servidor
 */
router.get('/', obtenerRutas);

/**
 * @swagger
 * /api/rutas/{id}:
 *   get:
 *     tags:
 *       - Rutas
 *     summary: Obtener ruta por ID
 *     description: Retorna los detalles de una ruta específica con información del vehículo, carga y conductor
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos de la ruta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ruta'
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.get('/:id', obtenerRutaPorId);

/**
 * @swagger
 * /api/rutas:
 *   post:
 *     tags:
 *       - Rutas
 *     summary: Crear nueva ruta
 *     description: Crea una nueva ruta en el sistema (requiere rol logística)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origen
 *               - destino
 *               - vehiculoId
 *               - cargaId
 *               - conductorId
 *             properties:
 *               origen:
 *                 type: string
 *                 example: "Bodega Centro"
 *               destino:
 *                 type: string
 *                 example: "Tienda Providencia"
 *               vehiculoId:
 *                 type: integer
 *                 example: 1
 *               cargaId:
 *                 type: integer
 *                 example: 1
 *               conductorId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Ruta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ruta'
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No tiene permisos para crear rutas
 *       500:
 *         description: Error en el servidor
 */
router.post('/', verificarRol('logistica'), crearRuta);

/**
 * @swagger
 * /api/rutas/{id}:
 *   put:
 *     tags:
 *       - Rutas
 *     summary: Actualizar ruta
 *     description: Actualiza el estado y datos de una ruta existente (requiere rol logística o seguridad). HU2 - Cuando se cancela una ruta, la carga vuelve a estado pendiente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estadoRuta:
 *                 type: string
 *                 enum: [planificada, en_curso, completada, cancelada]
 *                 description: "Cambio de estado de la ruta. HU2: cancelada libera la carga"
 *               distanciaKm:
 *                 type: number
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Ruta actualizada exitosamente
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.put('/:id', verificarRol('logistica', 'seguridad'), actualizarRuta);

/**
 * @swagger
 * /api/rutas/{id}:
 *   delete:
 *     tags:
 *       - Rutas
 *     summary: Eliminar ruta
 *     description: Elimina una ruta del sistema (requiere rol logística)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ruta eliminada exitosamente
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', verificarRol('logistica'), eliminarRuta);

export default router;
