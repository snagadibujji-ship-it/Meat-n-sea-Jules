const fs = require('fs');
let content = fs.readFileSync('apps/backend/src/controllers/ops.ts', 'utf8');

// We need to replace the entire $or array logic inside getNearbyVendors with the prompt's exact Javascript string logic... wait, the prompt says:
// "In the isOpen logic, REPLACE the string $gte/$lte check with:
// const now = new Date();
// const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
// const isOpen = closeTime < openTime
//  ? currentTime >= openTime || currentTime <= closeTime
//  : currentTime >= openTime && currentTime <= closeTime;"

// Wait, MongoDB `$geoNear` doesn't run JS. But the prompt specifically says "In the isOpen logic, REPLACE the string $gte/$lte check with:". This implies they want the logic evaluated BEFORE the DB query (or they expect us to fetch and filter). Let's see what ops.ts has. Currently it has `$or` inside the `$geoNear` match query.
// If we literally replace the `$gte/$lte` check, we might break it or we just filter post-query. Or perhaps we just insert that snippet in `toggleVendorStatus`? The prompt says "Midnight Business Hours Fix (controllers/ops.ts)". Wait, `toggleVendorStatus` has an `isOpen` property. Let's look at `getNearbyVendors`.

const regex = /const currentHourMin =.*?;/s;
const newTimeLogic = `const now = new Date();
    const currentTime = \`\${now.getHours().toString().padStart(2, '0')}:\${now.getMinutes().toString().padStart(2, '0')}\`;`;

content = content.replace(regex, newTimeLogic);
// The exact instruction: "REPLACE the string $gte/$lte check with: ... const isOpen = ..."
// It's likely they want us to fetch all vendors and then filter them using that JS logic, because Mongoose aggregates can't easily run that specific JS ternary inline without $expr, which might be what they mean, but they provided raw JS. Let's do post-filtering.

content = content.replace(
`          query: {
            isOpen: true,
            $or: [
              { 'businessHours': { $exists: false } },
              {
                $and: [
                  { 'businessHours.openTime': { $lte: 'businessHours.closeTime' } },
                  { 'businessHours.openTime': { $lte: currentHourMin } },
                  { 'businessHours.closeTime': { $gte: currentHourMin } }
                ]
              },
              {
                $and: [
                  { 'businessHours.openTime': { $gt: 'businessHours.closeTime' } },
                  {
                    $or: [
                      { 'businessHours.openTime': { $lte: currentHourMin } },
                      { 'businessHours.closeTime': { $gte: currentHourMin } }
                    ]
                  }
                ]
              }
            ]
          },`,
`          query: { isOpen: true },`
);

// Add post filtering
const returnLogic = `
    const openVendors = vendors.filter(v => {
        if (!v.businessHours) return true;
        const { openTime, closeTime } = v.businessHours;
        return closeTime < openTime
          ? currentTime >= openTime || currentTime <= closeTime
          : currentTime >= openTime && currentTime <= closeTime;
    });

    res.json(openVendors);`;

content = content.replace('res.json(vendors);', returnLogic);

fs.writeFileSync('apps/backend/src/controllers/ops.ts', content, 'utf8');
