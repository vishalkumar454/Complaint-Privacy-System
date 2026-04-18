import { Router } from 'express';
import { getUnverifiedAdvocates, verifyAdvocate, getSystemStats, getVerifiedAdvocates, getAllComplaints } from '../controllers/admin.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/advocates/unverified', getUnverifiedAdvocates);
router.patch('/advocates/:id/verify', verifyAdvocate);
router.get('/advocates', getVerifiedAdvocates);
router.get('/complaints', getAllComplaints);
router.get('/stats', getSystemStats);

export default router;
