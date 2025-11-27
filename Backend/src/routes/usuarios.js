import express from 'express';
import { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, obtenerPerfil, actualizarPerfil, cambiarContrasena, obtenerConductores } from '../controllers/usuariosController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, actualizarPerfil);
router.put('/perfil/contrasena', verificarToken, cambiarContrasena);
router.get('/conductores', verificarToken, obtenerConductores);
router.get('/', verificarToken, obtenerUsuarios);
router.post('/', verificarToken, crearUsuario);
router.put('/:id', verificarToken, actualizarUsuario);
router.delete('/:id', verificarToken, eliminarUsuario);

export default router;