import { Router } from 'express';
import {
  updateProfile,
  getOrderHistory,
  addFavoriteRestaurant,
  removeFavoriteRestaurant,
  getFavoriteRestaurants,
  getUsers,
} from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 */
router.get('/', getUsers);

// Все остальные маршруты требуют аутентификации
router.use(auth);

/**
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', updateProfile);

/**
 * @swagger
 * /api/v1/users/orders:
 *   get:
 *     summary: Get user's order history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */
router.get('/orders', getOrderHistory);

/**
 * @swagger
 * /api/v1/users/favorites:
 *   get:
 *     summary: Get user's favorite restaurants
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite restaurants
 *       401:
 *         description: Unauthorized
 */
router.get('/favorites', getFavoriteRestaurants);

/**
 * @swagger
 * /api/v1/users/favorites:
 *   post:
 *     summary: Add restaurant to favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurantId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant added to favorites
 *       401:
 *         description: Unauthorized
 */
router.post('/favorites', addFavoriteRestaurant);

/**
 * @swagger
 * /api/v1/users/favorites/{restaurantId}:
 *   delete:
 *     summary: Remove restaurant from favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant removed from favorites
 *       401:
 *         description: Unauthorized
 */
router.delete('/favorites/:restaurantId', removeFavoriteRestaurant);

export default router; 