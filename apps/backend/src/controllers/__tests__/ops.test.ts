import { Request, Response } from 'express';
import { getOrderWhatsAppLink } from '../ops';
import Order from '../../models/Order';

// Mock the Order model
jest.mock('../../models/Order');

describe('ops controller - getOrderWhatsAppLink', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    req = {
      params: {
        orderId: 'mockOrderId',
      },
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('should return 404 if order is not found', async () => {
    const mockPopulate = jest.fn().mockResolvedValue(null);
    (Order.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

    await getOrderWhatsAppLink(req as Request, res as Response);

    expect(Order.findById).toHaveBeenCalledWith('mockOrderId');
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Order not found' });
  });

  it('should return 404 if vendor contact information is not available', async () => {
    const mockOrder = { _id: 'mockOrderId', vendorId: null };
    const mockPopulate = jest.fn().mockResolvedValue(mockOrder);
    (Order.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

    await getOrderWhatsAppLink(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Vendor contact information not available' });
  });

  it('should return 404 if vendor has no phone', async () => {
    const mockOrder = { _id: 'mockOrderId', vendorId: { name: 'Test Vendor' } }; // No phone
    const mockPopulate = jest.fn().mockResolvedValue(mockOrder);
    (Order.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

    await getOrderWhatsAppLink(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Vendor contact information not available' });
  });

  it('should return correct WhatsApp link without +91 prefix in db', async () => {
    const mockOrder = {
      _id: 'mockOrderId',
      vendorId: { name: 'Test Vendor', phone: '9876543210' },
    };
    const mockPopulate = jest.fn().mockResolvedValue(mockOrder);
    (Order.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

    await getOrderWhatsAppLink(req as Request, res as Response);

    const expectedText = encodeURIComponent('Hello Test Vendor, I am checking on Order #mockOrderId.');
    const expectedLink = `https://wa.me/919876543210?text=${expectedText}`;

    expect(jsonMock).toHaveBeenCalledWith({ link: expectedLink });
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should return correct WhatsApp link with +91 prefix in db', async () => {
    const mockOrder = {
      _id: 'mockOrderId',
      vendorId: { name: 'Test Vendor', phone: '+919876543210' },
    };
    const mockPopulate = jest.fn().mockResolvedValue(mockOrder);
    (Order.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

    await getOrderWhatsAppLink(req as Request, res as Response);

    const expectedText = encodeURIComponent('Hello Test Vendor, I am checking on Order #mockOrderId.');
    const expectedLink = `https://wa.me/919876543210?text=${expectedText}`;

    expect(jsonMock).toHaveBeenCalledWith({ link: expectedLink });
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should handle internal server error', async () => {
    const mockError = new Error('Database error');
    (Order.findById as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    // Suppress console.error in tests to keep output clean
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getOrderWhatsAppLink(req as Request, res as Response);

    expect(consoleErrorSpy).toHaveBeenCalledWith('WhatsApp Link Error:', mockError);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal Server Error' });

    consoleErrorSpy.mockRestore();
  });
});
