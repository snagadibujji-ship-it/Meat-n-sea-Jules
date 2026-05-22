const fs = require('fs');

function fixFile(file) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace const queryClient = new QueryClient(); outside component
    // with const [queryClient] = useState(() => new QueryClient()); inside component

    if (content.includes('const queryClient = new QueryClient();')) {
        content = content.replace('const queryClient = new QueryClient();\n', '');
        content = content.replace(
            'export default function AppWrapper() {',
            'export default function AppWrapper() {\n    const [queryClient] = React.useState(() => new QueryClient());'
        );
        fs.writeFileSync(file, content, 'utf8');
    }
}

fixFile('apps/admin-web/src/app/admin/page.tsx');
fixFile('apps/admin-web/src/app/vendor/page.tsx');
