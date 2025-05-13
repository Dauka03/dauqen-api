import { Request, Response } from 'express';
import { User } from '../models/User';

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const getOrderHistory = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'orderHistory',
        populate: {
          path: 'items.menuItem',
          populate: {
            path: 'restaurant',
            select: 'name',
          },
        },
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.orderHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history' });
  }
};

export const addFavoriteRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favoriteRestaurants.includes(restaurantId)) {
      user.favoriteRestaurants.push(restaurantId);
      await user.save();
    }

    res.json(user.favoriteRestaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite restaurant' });
  }
};

export const removeFavoriteRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favoriteRestaurants = user.favoriteRestaurants.filter(
      (id) => id.toString() !== restaurantId
    );

    await user.save();
    res.json(user.favoriteRestaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite restaurant' });
  }
};

export const getFavoriteRestaurants = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favoriteRestaurants');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favoriteRestaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorite restaurants' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
}; 