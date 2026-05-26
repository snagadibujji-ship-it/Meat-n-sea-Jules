import request from 'supertest';
import express from 'express';
import { requestOtp } from './auth';

const app = express();
app.use(express.json());
app.post('/api/auth/otp/request', requestOtp);

describe('Auth Controller', () => {
  describe('POST /api/auth/otp/request', () => {
    it('should return 400 when phone number is missing in requestOtp', async () => {
      const response = await request(app)
        .post('/api/auth/otp/request')
        .send({}); // Empty body

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Phone number is required' });
    });
  });
});
