import { Router } from 'express';
import { getMessagesForComplaint, sendMessage } from '../controllers/chat.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.get('/:complaintId', getMessagesForComplaint);
router.post('/:complaintId', sendMessage);

export default router;
