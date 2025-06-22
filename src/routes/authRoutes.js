import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { isGuest, isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/register', isGuest, (req, res) => res.render('register', { title: 'Register' }));
router.post('/register', isGuest, register);

router.get('/login', isGuest, (req, res) => res.render('login', { title: 'Login' }));
router.post('/login', isGuest, login);

router.get('/logout', isAuthenticated, logout);

export default router;
