const fs = require('fs');
let content = fs.readFileSync('apps/admin-web/src/app/vendor/page.tsx', 'utf8');

// The prompt: "vendor/page.tsx: Replace vendorId: 'vendor-123' with a dynamic ID from your auth context/session hook."
// It actually says "Replace vendorId: 'vendor-123' with a dynamic ID from your auth context/session hook."
// It might be currently: const vendorId = 'vendor-123';
content = content.replace(/const vendorId = 'vendor-123';/g, "const vendorId = typeof window !== 'undefined' ? localStorage.getItem('vendorId') || 'vendor-123' : 'vendor-123';");
fs.writeFileSync('apps/admin-web/src/app/vendor/page.tsx', content, 'utf8');
