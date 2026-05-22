const fs = require('fs');
let content = fs.readFileSync('apps/backend/src/routes/index.ts', 'utf8');

const limiterCode = `
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per window
  message: { error: 'Too many OTP requests from this IP, please try again later' }
});
`;

if (!content.includes('otpLimiter')) {
    content = content.replace('const router = Router();', 'const router = Router();\n' + limiterCode);
}

content = content.replace(
    "router.post('/auth/otp/request', validateRequest(requestOtpSchema), requestOtp);",
    "router.post('/auth/otp/request', otpLimiter, validateRequest(requestOtpSchema), requestOtp);"
);

content = content.replace(
    "router.post('/orders/place', validateRequest(placeOrderSchema), placeOrder);",
    "router.post('/orders/place', requireAuth, validateRequest(placeOrderSchema), placeOrder);"
);

fs.writeFileSync('apps/backend/src/routes/index.ts', content, 'utf8');
