const fs = require('fs');
let content = fs.readFileSync('apps/backend/src/controllers/ops.ts', 'utf8');

// Replace placeOrder create section
const searchStr = `    // Create Order
    const order = await Order.create({
      customerId: userId,
      vendorId: vendor._id,
      totalAmountPaise: finalTotalPaise,
      paymentMethod: req.body.paymentMethod || 'online',
      sourceMode: req.body.sourceMode || 'bazaar',
      deliveryTier: req.body.deliveryTier || 'standard',
      deliveryOtp,
      customerNote,
      items: items || []
    });`;

const replaceStr = `    // Create Order
    const order = await Order.create({
      customerId: userId,
      vendorId: vendor._id,
      totalAmountPaise: finalTotalPaise,
      paymentMethod: req.body.paymentMethod || 'online',
      sourceMode: req.body.sourceMode || 'bazaar',
      deliveryTier: req.body.deliveryTier || 'standard',
      deliveryOtp,
      customerNote,
      items: items || []
    });

    // Explicitly assigning user ID to bypass the Hollow Order Bug
    const newOrder = await Order.create({ ...req.body, userId: userId });
`;

// However, the prompt says: "Inside placeOrder, DELETE the stub comment and the 201 response. REPLACE it with: const newOrder = await Order.create({ ...req.body, userId: req.user.id }); return res.status(201).json({ message: 'Order created successfully', order: newOrder });"
// So we just replace the response.
content = content.replace(
    "res.status(201).json({ message: 'Order created successfully', order, discountPaise, finalTotalPaise, platformFeePaise });",
    "const newOrder = await Order.create({ ...req.body, userId: userId });\n    return res.status(201).json({ message: 'Order created successfully', order: newOrder });"
);

// We also need to add the dummy exports if they are missing (actually they are there, but let's check).
if (!content.includes('export const getProducts')) {
    content += '\nexport const getProducts = async (req: Request, res: Response) => { res.status(200).json([]); };\n';
}
if (!content.includes('export const completeOrderDelivery')) {
    content += '\nexport const completeOrderDelivery = async (req: Request, res: Response) => { res.status(200).json({ message: "Delivered" }); };\n';
}

fs.writeFileSync('apps/backend/src/controllers/ops.ts', content, 'utf8');
