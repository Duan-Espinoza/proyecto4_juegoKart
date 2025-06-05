// Rutas relacionadas con las pistas
import { Router } from 'express';
import { getPistas, getPistaById, createPista, updatePista, deletePista } from '../controllers/pistasController.js';

const router = Router();

router.get('/', getPistas);
router.get('/:id', getPistaById);
router.post('/', createPista);
router.put('/:id', updatePista);
router.delete('/:id', deletePista);

export default router;