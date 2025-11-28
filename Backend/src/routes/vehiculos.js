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

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     tags:
 *       - Vehículos
 *     summary: Obtener lista de vehículos
 *     description: Retorna todos los vehículos registrados en el sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error en el servidor
 */
router.get('/', obtenerVehiculos);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     tags:
 *       - Vehículos
 *     summary: Obtener vehículo por ID
 *     description: Retorna los detalles de un vehículo específico
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
 *         description: Datos del vehículo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/:id', obtenerVehiculoPorId);

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     tags:
 *       - Vehículos
 *     summary: Crear nuevo vehículo
 *     description: Crea un nuevo vehículo en el sistema (requiere rol logística o rrhh)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patente
 *               - marca
 *               - modelo
 *               - capacidadKg
 *             properties:
 *               patente:
 *                 type: string
 *                 example: "ABC-1234"
 *               marca:
 *                 type: string
 *                 example: "Mercedes Benz"
 *               modelo:
 *                 type: string
 *                 example: "Sprinter"
 *               capacidadKg:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       400:
 *         description: Datos inválidos o vehículo ya existe
 *       403:
 *         description: No tiene permisos para crear vehículos
 *       500:
 *         description: Error en el servidor
 */
router.post('/', verificarRol('logistica', 'rrhh'), crearVehiculo);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     tags:
 *       - Vehículos
 *     summary: Actualizar vehículo
 *     description: Actualiza los datos de un vehículo existente (requiere rol logística)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patente:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               capacidadKg:
 *                 type: number
 *               estado:
 *                 type: string
 *                 enum: [disponible, en_ruta, mantenimiento]
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente
 *       403:
 *         description: No tiene permisos para actualizar vehículos
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put('/:id', verificarRol('logistica'), actualizarVehiculo);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     tags:
 *       - Vehículos
 *     summary: Eliminar vehículo
 *     description: Elimina un vehículo del sistema (requiere rol rrhh)
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
 *         description: Vehículo eliminado exitosamente
 *       403:
 *         description: No tiene permisos para eliminar vehículos
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', verificarRol('rrhh'), eliminarVehiculo);

export default router;
