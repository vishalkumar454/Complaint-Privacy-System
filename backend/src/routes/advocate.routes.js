import { Router } from 'express';
import { getOpenComplaints, acceptComplaint, getMyCases, updateCaseStatus } from '../controllers/advocate.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('advocate'));

router.get('/marketplace', getOpenComplaints);
router.post('/complaints/:id/accept', acceptComplaint);
router.get('/cases', getMyCases);
router.patch('/cases/:id/status', updateCaseStatus);

export default router;
