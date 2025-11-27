import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/estadisticas', dashboardController.obtenerEstadisticas);
router.get('/rutas-activas', dashboardController.obtenerRutasActivas);

export default router;
