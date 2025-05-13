import { Request, Response } from 'express';
import { Restaurant } from '../models/Restaurant';

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant' });
  }
};

export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const { cuisine, rating, priceRange, search } = req.query;
    const query: any = {};

    if (cuisine) query.cuisine = cuisine;
    if (rating) query.rating = { $gte: Number(rating) };
    if (priceRange) query.priceRange = priceRange;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const restaurants = await Restaurant.find(query)
      .populate('menu')
      .sort({ rating: -1 });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('menu')
      .populate('reviews.user', 'name');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant' });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant' });
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant' });
  }
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.reviews.push({
      user: req.user._id,
      rating,
      comment,
      date: new Date()
    });

    // Обновление среднего рейтинга
    const totalRating = restaurant.reviews.reduce((sum, review) => sum + review.rating, 0);
    restaurant.rating = totalRating / restaurant.reviews.length;

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
}; 