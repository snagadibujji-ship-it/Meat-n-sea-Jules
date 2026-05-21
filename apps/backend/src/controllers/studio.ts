import { Request, Response } from 'express';
import MnsCollection from '../models/MnsCollection';
import StudioFreshness from '../models/StudioFreshness';

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections = await MnsCollection.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCollectionBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const collection = await MnsCollection.findOne({ slug, isActive: true }).populate('products');
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getFreshness = async (req: Request, res: Response) => {
  try {
    // Return latest record
    const freshness = await StudioFreshness.findOne().sort({ createdAt: -1 });
    res.json(freshness || null);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getStudioHome = async (req: Request, res: Response) => {
  try {
    const [freshness, collections] = await Promise.all([
      StudioFreshness.findOne().sort({ createdAt: -1 }),
      MnsCollection.find({ isActive: true }).sort({ sortOrder: 1 }).populate('products'),
    ]);
    res.json({ freshness, collections });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Admin Endpoints
export const createCollection = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, slug, imageUrl, sortOrder, products } = req.body;
    const collection = await MnsCollection.create({
      title, subtitle, slug, imageUrl, sortOrder, products
    });
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateFreshness = async (req: Request, res: Response) => {
  try {
    const { catchTime, harbourArrivalTime, processedTime } = req.body;
    const freshness = await StudioFreshness.create({
      catchTime, harbourArrivalTime, processedTime
    });
    res.status(201).json(freshness);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
