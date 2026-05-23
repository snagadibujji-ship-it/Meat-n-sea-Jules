const fs = require('fs');
let authContent = fs.readFileSync('apps/backend/src/controllers/auth.ts', 'utf8');
let midContent = fs.readFileSync('apps/backend/src/middlewares/auth.ts', 'utf8');

const regex = /const JWT_SECRET = process\.env\.JWT_SECRET;\s*if \(\!JWT_SECRET\) {\s*throw new Error\('JWT_SECRET is missing'\);\s*}/g;
const replacement = 'const secret = process.env.JWT_SECRET; if (!secret) throw new Error("CRITICAL: JWT_SECRET missing in production");';

authContent = authContent.replace(regex, replacement).replace(/JWT_SECRET/g, 'secret');
midContent = midContent.replace(regex, replacement).replace(/JWT_SECRET/g, 'secret');

fs.writeFileSync('apps/backend/src/controllers/auth.ts', authContent, 'utf8');
fs.writeFileSync('apps/backend/src/middlewares/auth.ts', midContent, 'utf8');
