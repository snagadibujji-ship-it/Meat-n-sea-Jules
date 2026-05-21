const fs = require('fs');
const path = require('path');
const opsPath = path.join(__dirname, 'apps/backend/src/controllers/ops.ts');
let opsContent = fs.readFileSync(opsPath, 'utf8');

// The placeOrder method's geoNear has a 'query: { _id: vendor._id },' that got mangled by the sed command:
// 'isMnsStudio: mode === 'studio',' was added there but 'mode' doesn't exist in that scope.

opsContent = opsContent.replace(
`                spherical: true,
                query: { _id: vendor._id },
            isMnsStudio: mode === 'studio',
            }`,
`                spherical: true,
                query: { _id: vendor._id },
            }`
);

fs.writeFileSync(opsPath, opsContent, 'utf8');
