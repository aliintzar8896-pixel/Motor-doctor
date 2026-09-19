import { Router } from 'express';
import mechanicController from '../controllers/mechanicController.js';

const router = Router();

router.get('/', mechanicController.getAll);
router.get('/:id', mechanicController.getById);
router.post('/', mechanicController.create);
router.patch('/:id/toggle-online', mechanicController.toggleOnline);
router.patch('/:id/verify', mechanicController.verify);

export default router;
