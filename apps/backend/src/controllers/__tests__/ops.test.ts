import { Request, Response } from 'express';
import { advanceOrderStatus } from '../ops';
import Order from '../../models/Order';

jest.mock('../../models/Order');

describe('ops controller', () => {
  describe('advanceOrderStatus', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = {
        params: { orderId: 'mockOrderId' },
        body: { newStatus: 'preparing' },
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      jest.clearAllMocks();
    });

    it('should return 404 if order is not found', async () => {
      (Order.findById as jest.Mock).mockResolvedValue(null);

      await advanceOrderStatus(req as Request, res as Response);

      expect(Order.findById).toHaveBeenCalledWith('mockOrderId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Order not found' });
    });

    it('should update order status and return order if found', async () => {
      const mockOrder = {
        _id: 'mockOrderId',
        updateStatus: jest.fn(),
        save: jest.fn().mockResolvedValue(true),
      };
      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      await advanceOrderStatus(req as Request, res as Response);

      expect(Order.findById).toHaveBeenCalledWith('mockOrderId');
      expect(mockOrder.updateStatus).toHaveBeenCalledWith('preparing');
      expect(mockOrder.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should catch error and return 500 when Order.findById throws an error', async () => {
      (Order.findById as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await advanceOrderStatus(req as Request, res as Response);

      expect(Order.findById).toHaveBeenCalledWith('mockOrderId');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should catch error and return 500 when order.save throws an error', async () => {
      const mockOrder = {
        _id: 'mockOrderId',
        updateStatus: jest.fn(),
        save: jest.fn().mockRejectedValue(new Error('Save Error')),
      };
      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      await advanceOrderStatus(req as Request, res as Response);

      expect(Order.findById).toHaveBeenCalledWith('mockOrderId');
      expect(mockOrder.updateStatus).toHaveBeenCalledWith('preparing');
      expect(mockOrder.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});
