import { Router } from 'express';
import contactController from '../controllers/contactController.js';

const router = Router();

router.post('/', contactController.submitMessage);

export default router;
