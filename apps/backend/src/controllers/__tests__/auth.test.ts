import { verifyOtp } from '../auth';
import { Request, Response } from 'express';

describe('Auth Controller', () => {
  describe('verifyOtp', () => {
    it('should return 400 when both phone and code are missing', async () => {
      const req = {
        body: {}
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await verifyOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Phone and code are required' });
    });

    it('should return 400 when code is missing', async () => {
      const req = {
        body: { phone: '1234567890' }
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await verifyOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Phone and code are required' });
    });

    it('should return 400 when phone is missing', async () => {
      const req = {
        body: { code: '123456' }
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await verifyOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Phone and code are required' });
    });
  });
});
