import express from 'express';
import { login, registro, perfil } from '../controllers/authController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y retorna un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "juan.perez@luxchile.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Email o contraseña faltante
 *         content:
 *           application/json:
 *             example:
 *               error: "Email y contraseña son requeridos"
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             example:
 *               error: "Credenciales inválidas"
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registrar nuevo usuario
 *     description: Crea un nuevo usuario en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nombre
 *               - rol
 *             properties:
 *               email:
 *                 type: string
 *                 example: "nuevo@luxchile.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secure123"
 *               nombre:
 *                 type: string
 *                 example: "Nuevo Usuario"
 *               rol:
 *                 type: string
 *                 enum: [admin, logistica, rrhh, conductor]
 *                 example: "logistica"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario registrado exitosamente"
 *               usuario:
 *                 id: 10
 *                 email: "nuevo@luxchile.com"
 *                 nombre: "Nuevo Usuario"
 *       400:
 *         description: Datos inválidos o usuario ya existe
 *       500:
 *         description: Error en el servidor
 */
router.post('/registro', registro);

// Rutas protegidas

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     tags:
 *       - Autenticación
 *     summary: Obtener perfil del usuario autenticado
 *     description: Retorna los datos del usuario actualmente autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             example:
 *               error: "Token no proporcionado"
 *       500:
 *         description: Error en el servidor
 */
router.get('/perfil', verificarToken, perfil);

export default router;
