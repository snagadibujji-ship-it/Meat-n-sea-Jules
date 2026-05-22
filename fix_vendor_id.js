const fs = require('fs');
let content = fs.readFileSync('apps/admin-web/src/app/vendor/page.tsx', 'utf8');
content = content.replace(
    "const vendorId = typeof window !== 'undefined' ? localStorage.getItem('vendorId') || 'vendor-123' : 'vendor-123'; // Mock vendor ID",
    "const vendorId = typeof window !== 'undefined' ? localStorage.getItem('vendorId') || 'vendor-123' : 'vendor-123';"
);
content = content.replace(
    "const vendorId = 'vendor-123'; // Mock vendor ID",
    "const vendorId = typeof window !== 'undefined' ? localStorage.getItem('vendorId') || 'vendor-123' : 'vendor-123';"
);
fs.writeFileSync('apps/admin-web/src/app/vendor/page.tsx', content, 'utf8');
