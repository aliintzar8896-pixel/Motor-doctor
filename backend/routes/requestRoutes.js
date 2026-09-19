import { Router } from 'express';
import requestController from '../controllers/requestController.js';

const router = Router();

router.get('/', requestController.getAll);
router.get('/:id', requestController.getById);
router.post('/', requestController.create);
router.patch('/:id/status', requestController.updateStatus);
router.patch('/:id/payment', requestController.updatePayment);
router.delete('/:id', requestController.cancel);

export default router;
