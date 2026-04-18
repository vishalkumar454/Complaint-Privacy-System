import { Router } from 'express';
import authRoutes from './auth.routes.js';
import complaintRoutes from './complaint.routes.js';
import advocateRoutes from './advocate.routes.js';
import adminRoutes from './admin.routes.js';
import chatRoutes from './chat.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/complaints', complaintRoutes);
router.use('/advocates', advocateRoutes);
router.use('/admin', adminRoutes);
router.use('/chat', chatRoutes);

export default router;
