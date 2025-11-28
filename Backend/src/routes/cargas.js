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

/**
 * @swagger
 * /api/cargas:
 *   get:
 *     tags:
 *       - Cargas
 *     summary: Obtener lista de cargas
 *     description: Retorna todas las cargas registradas en el sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cargas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carga'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error en el servidor
 */
router.get('/', obtenerCargas);

/**
 * @swagger
 * /api/cargas/{id}:
 *   get:
 *     tags:
 *       - Cargas
 *     summary: Obtener carga por ID
 *     description: Retorna los detalles de una carga específica
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
 *         description: Datos de la carga
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carga'
 *       404:
 *         description: Carga no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.get('/:id', obtenerCargaPorId);

/**
 * @swagger
 * /api/cargas:
 *   post:
 *     tags:
 *       - Cargas
 *     summary: Crear nueva carga
 *     description: Crea una nueva carga en el sistema (requiere rol logística)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - peso
 *               - tipo
 *               - prioridad
 *               - origen
 *               - destino
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Perfumes de lujo"
 *               peso:
 *                 type: number
 *                 example: 150
 *               tipo:
 *                 type: string
 *                 enum: [normal, fragil, alto_valor]
 *                 example: "alto_valor"
 *               prioridad:
 *                 type: string
 *                 enum: [baja, media, alta]
 *                 example: "alta"
 *               origen:
 *                 type: string
 *                 example: "Bodega Centro"
 *               destino:
 *                 type: string
 *                 example: "Tienda Providencia"
 *     responses:
 *       201:
 *         description: Carga creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carga'
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No tiene permisos para crear cargas
 *       500:
 *         description: Error en el servidor
 */
router.post('/', verificarRol('logistica'), crearCarga);

/**
 * @swagger
 * /api/cargas/{id}:
 *   put:
 *     tags:
 *       - Cargas
 *     summary: Actualizar carga
 *     description: Actualiza los datos de una carga existente (requiere rol logística)
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
 *               descripcion:
 *                 type: string
 *               peso:
 *                 type: number
 *               tipo:
 *                 type: string
 *                 enum: [normal, fragil, alto_valor]
 *               prioridad:
 *                 type: string
 *                 enum: [baja, media, alta]
 *               estado:
 *                 type: string
 *                 enum: [pendiente, asignada, en_transito, entregada]
 *     responses:
 *       200:
 *         description: Carga actualizada exitosamente
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Carga no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.put('/:id', verificarRol('logistica'), actualizarCarga);

/**
 * @swagger
 * /api/cargas/{id}:
 *   delete:
 *     tags:
 *       - Cargas
 *     summary: Eliminar carga
 *     description: Elimina una carga del sistema (requiere rol logística o rrhh)
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
 *         description: Carga eliminada exitosamente
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Carga no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', verificarRol('logistica', 'rrhh'), eliminarCarga);

export default router;
