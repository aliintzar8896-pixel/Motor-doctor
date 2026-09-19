import { Router } from 'express';
import billController from '../controllers/billController.js';

const router = Router();

router.post('/analyze', billController.analyze);
router.post('/consultation', billController.createConsultation);

export default router;
