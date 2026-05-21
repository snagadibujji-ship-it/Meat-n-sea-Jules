import { Request, Response } from 'express';
import Vendor from '../models/Vendor';
import Product from '../models/Product';
import mongoose from 'mongoose';

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const { q, lat, lng, radiusKm = '5' } = req.query;

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const maxDistanceMeters = parseFloat(radiusKm as string) * 1000;

    // Search Vendors within radius
    const vendors = await Vendor.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance',
          maxDistance: maxDistanceMeters,
          spherical: true,
        }
      },
      {
        $match: {
          $text: { $search: q as string }
        }
      },
      {
        $project: {
          score: { $meta: 'textScore' },
          name: 1,
          description: 1,
          distance: 1,
          isOpen: 1
        }
      },
      { $sort: { score: { $meta: 'textScore' } } }
    ]);

    // To search products within radius, we first need vendors in radius
    const vendorsInRadius = await Vendor.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [longitude, latitude] },
            distanceField: 'distance',
            maxDistance: maxDistanceMeters,
            spherical: true,
          }
        },
        { $project: { _id: 1, distance: 1 } }
    ]);

    const vendorIds = vendorsInRadius.map(v => v._id);
    const vendorDistances = vendorsInRadius.reduce((acc, v) => {
      acc[v._id.toString()] = v.distance;
      return acc;
    }, {} as Record<string, number>);

    // Search Products linked to nearby vendors
    const products = await Product.aggregate([
      {
        $match: {
          vendorId: { $in: vendorIds },
          $text: { $search: q as string }
        }
      },
      {
        $project: {
          score: { $meta: 'textScore' },
          name: 1,
          category: 1,
          pricePaise: 1,
          vendorId: 1
        }
      },
      { $sort: { score: { $meta: 'textScore' } } }
    ]);

    // Map distances onto products for frontend rendering
    const productsWithDistances = products.map(p => ({
        ...p,
        distance: vendorDistances[p.vendorId.toString()]
    }));

    res.json({
      vendors,
      products: productsWithDistances
    });

  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
