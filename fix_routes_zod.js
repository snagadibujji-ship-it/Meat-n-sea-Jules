const fs = require('fs');

let content = fs.readFileSync('apps/backend/src/routes/index.ts', 'utf8');

content = content.replace(
    'import { placeOrderSchema, completeDeliverySchema } from "../schemas/order";',
    'import { placeOrderSchema, completeDeliverySchema, advanceOrderStatusSchema } from "../schemas/order";\nimport { toggleVendorStatusSchema } from "../schemas/vendor";'
);

content = content.replace(
    "router.patch('/vendors/:vendorId/status', toggleVendorStatus);",
    "router.patch('/vendors/:vendorId/status', validateRequest(toggleVendorStatusSchema), toggleVendorStatus);"
);

content = content.replace(
    "router.post('/orders/:orderId/advance', advanceOrderStatus);",
    "router.post('/orders/:orderId/advance', validateRequest(advanceOrderStatusSchema), advanceOrderStatus);"
);

fs.writeFileSync('apps/backend/src/routes/index.ts', content, 'utf8');
