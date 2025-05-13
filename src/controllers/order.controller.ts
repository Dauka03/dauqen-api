import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = new Order({
      user: user._id,
      items,
      deliveryAddress,
      paymentMethod,
      status: 'pending',
    });

    await order.save();

    // Обновление истории заказов пользователя
    user.orderHistory.push(order._id);
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    // Если пользователь не админ, показываем только его заказы
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Проверка прав доступа
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Только админ или ресторан может менять статус
    if (req.user.role !== 'admin' && req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Проверка прав доступа
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Проверка возможности отмены
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel order in current status' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order' });
  }
}; 