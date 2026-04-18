import { Router } from 'express';
import { registerUser, registerAdvocate, login, getMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

router.post('/register/user', registerUser);
router.post('/register/advocate', registerAdvocate);
router.post('/login', login);

router.get('/me', requireAuth, getMe);

export default router;
