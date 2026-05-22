const fs = require('fs');

let content = fs.readFileSync('apps/backend/src/routes/index.ts', 'utf8');

// The file currently has:
// export default router;
// // Auth Routes
// router.post('/auth/otp/request', validateRequest(requestOtpSchema), requestOtp);
// ...
// This means the routes below `export default router` are unreachable. We need to move the export to the very bottom.

const parts = content.split('export default router;');
if (parts.length === 2 && parts[1].trim() !== '') {
    content = parts[0] + parts[1] + '\nexport default router;\n';
    fs.writeFileSync('apps/backend/src/routes/index.ts', content, 'utf8');
    console.log('Fixed routes/index.ts');
} else {
    console.log('No fix needed or unable to parse.');
}
