import { Router } from 'express';
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menu.controller';
import { auth, checkRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/menu:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: List of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                     type: string
 */
router.get('/', getMenuItems);

/**
 * @swagger
 * /api/v1/menu/{id}:
 *   get:
 *     summary: Get menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item details
 *       404:
 *         description: Menu item not found
 */
router.get('/:id', getMenuItemById);

// Защищенные маршруты
/**
 * @swagger
 * /api/v1/menu:
 *   post:
 *     summary: Create new menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu item created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.post('/', auth, checkRole(['admin', 'restaurant']), createMenuItem);

/**
 * @swagger
 * /api/v1/menu/{id}:
 *   put:
 *     summary: Update menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Menu item updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Menu item not found
 */
router.put('/:id', auth, checkRole(['admin', 'restaurant']), updateMenuItem);

/**
 * @swagger
 * /api/v1/menu/{id}:
 *   delete:
 *     summary: Delete menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Menu item not found
 */
router.delete('/:id', auth, checkRole(['admin', 'restaurant']), deleteMenuItem);

export default router; 