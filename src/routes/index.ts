import { Router } from 'express';
import authRoutes from './auth.routes';
import restaurantRoutes from './restaurant.routes';
import menuRoutes from './menu.routes';
import orderRoutes from './order.routes';
import userRoutes from './user.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);

export default router; 