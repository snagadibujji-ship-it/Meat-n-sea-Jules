# Meat N Sea Ecosystem

## Overview

Meat N Sea is a production-grade multi-app food, fish, and meat delivery ecosystem built to scale. This monorepository houses the complete architectural suite powering the customer, vendor, rider, and administrative layers of the platform. Designed with dual web/mobile clients, robust geospatial tracking, and automated real-time operations, the platform acts as a high-performance logistics command center.

## Monorepo Architecture

The system operates out of a highly modular `pnpm` workspace, unifying cross-platform logic and streamlining simultaneous development across all services.

```
/
├── apps/
│   ├── admin-app/       # Admin web command center
│   ├── delivery-app/    # Rider logistics app
│   ├── user-app/        # Customer ordering app
│   └── vendor-app/      # Merchant dashboard
├── server/              # Centralized Node.js/Express Backend
└── shared/              # Reusable React components, types, API clients, and Socket.IO hooks
```

## Core Engineering Milestones

### V1.0 - Core MVP
- **Role-Based JWT Auth**: Secure authentication and role-based access control natively supporting Customer, Vendor, Delivery Partner, and Admin profiles.
- **Geospatial Proximity Matching**: Highly accurate vendor-to-user mappings using PostGIS and custom queries.
- **Dual Web/Mobile Client Architecture**: Write-once API integration sharing types and React hooks across all web clients and the core mobile application.
- **One-Vendor Cart Lock**: Strict cart isolation enforced on the server to prevent multi-vendor orders, streamlining delivery lifecycle tracking.
- **Secure WebSockets**: Real-time event telemetry with Redis buffering for instantaneous live order tracking and live updates without breaking state.
- **OpenStreetMap Integration**: Implementation of Leaflet maps and OSRM routing for riders and users.
- **Integer-based Multi-party Wallet Routing**: Currency stored safely as integers (paise/cents) solving floating point issues, effectively managing payout split ledgers.

### V1.1 - Scale & Profitability Upgrades
- **Atomic Order Batching**: Seamless bulk-order management backed by Drizzle transactions, allowing complex inserts with robust concurrency rollbacks.
- **Automated Hysteresis-driven Surge Pricing**: Live pricing engine factoring localized demand matrices over predefined windows to combat order velocity limits dynamically.
- **Platform-absorbed Coupon Engine**: Powerful discounting capability where promos are transparently distributed without impacting absolute vendor payout integrity.

## Quick Start

1. Install dependencies: `pnpm install`
2. Start the development server locally: `pnpm run dev`
