const fs = require('fs');

let content = fs.readFileSync('apps/backend/src/controllers/ops.ts', 'utf8');
content = content.replace(
`    // Create Order
    const order = await Order.create({
      customerId: userId,
      vendorId: vendor._id,
      totalAmountPaise: finalTotalPaise,
      paymentMethod: req.body.paymentMethod || 'online',
      sourceMode: req.body.sourceMode || 'bazaar',
      deliveryTier: req.body.deliveryTier || 'standard',
      deliveryOtp,
      customerNote
    });`,
`    // Create Order
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
    });`
);
fs.writeFileSync('apps/backend/src/controllers/ops.ts', content, 'utf8');
