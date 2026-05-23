const fs = require('fs');
let content = fs.readFileSync('apps/backend/src/controllers/dispatch.ts', 'utf8');
content = content.replace('await redisClient.setex(redisKey, 60, selectedRiderId);', 'await redisClient.set(redisKey, selectedRiderId, { ex: 60 });');
fs.writeFileSync('apps/backend/src/controllers/dispatch.ts', content, 'utf8');
