import { Router } from 'express';
import { createComplaint, getUserComplaints, getComplaint } from '../controllers/complaint.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/requireAuth.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

// Publicly accessible if anonymous handling is desired without JWT
// But typically requireAuth protects routes. To support complete anonymity, you can make auth optional.
// Here we expect front-end to log anonymous users via some guest token or handle it separately.
router.post('/', optionalAuth, createComplaint);

router.use(requireAuth);

router.get('/my-complaints', requireRole('user'), getUserComplaints);
router.get('/:id', getComplaint);

export default router;
