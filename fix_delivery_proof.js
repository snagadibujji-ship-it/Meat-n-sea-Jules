const fs = require('fs');
let content = fs.readFileSync('apps/rider-app/screens/DeliveryProof.tsx', 'utf8');

// Replace mock order with useLocalSearchParams
content = content.replace(
    "import * as ImagePicker from 'expo-image-picker';",
    "import * as ImagePicker from 'expo-image-picker';\nimport { useLocalSearchParams } from 'expo-router';"
);

content = content.replace(
    "const order = typeof window !== \"undefined\" && window.location ? new URLSearchParams(window.location.search).get(\"orderId\") ? { id: new URLSearchParams(window.location.search).get(\"orderId\"), sourceMode: new URLSearchParams(window.location.search).get(\"mode\") || \"studio\" } : { id: \"123\", sourceMode: \"studio\" } : { id: \"123\", sourceMode: \"studio\" };",
    "const params = useLocalSearchParams<{ orderId: string; mode: string }>();\n  const order = { id: params.orderId || '123', sourceMode: params.mode || 'studio' };"
);

fs.writeFileSync('apps/rider-app/screens/DeliveryProof.tsx', content, 'utf8');
