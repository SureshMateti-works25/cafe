# AromaCraft Cafe & Bistro — Enterprise Platform

A mobile-friendly, full-featured enterprise web application for single and multi-location artisanal cafes, roasteries, and bistros. Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**.

---

## 🌟 Key Enterprise Features

### 1. 📱 Mobile-First Customer Experience
- **Responsive Navigation**: Adaptive mobile bottom navigation bar (`Home`, `Menu`, `Queue`, `Book`, `Tray`, `Staff Portal`).
- **Interactive Online Menu**: Filter by Category (Espresso & Brews, Artisan Teas, Bakery, Gourmet Mains, Bowls, Desserts).
- **Dietary Preferences (Veg, Vegan, Jain, Gluten-Free)**:
  - 🕊️ **Strict Jain Friendly**: Dedicated cookware, zero onion, garlic, potatoes, carrots, or root vegetables.
  - 🌿 **100% Vegan**: Certified plant-based milks (Swedish oat, almond, soy) and cashew cheeses.
  - 🥗 **Pure Vegetarian**: Clear allergen tagging and ingredients breakdown.
  - **Customization Modal**: Milk selection, sweetness percentage, and strict Jain kitchen instructions.
- **Online Virtual Queue**: Live wait time estimator, digital queue tickets, SMS alert notifications, and cancellation option.
- **Advance Table Reservations**: Date picker, time slot, guest counter, seating preferences (Indoor Lounge, Outdoor Terrace, Window View, Private Roastery Room), and occasion tags.
- **Customer Tray & Checkout**: Dine-In (Table selection), Takeaway, or Delivery with automatic 5% GST and 5% service charge breakdown.
- **Guest Feedback & Dietary Audits**: Multi-criteria star ratings (Taste, Service, Ambience, and Dietary Care) with verified customer review feed.

---

### 2. 🏢 Central Multi-Location Dashboard
- **Consolidated Real-time Telemetry**: Aggregated gross sales, table occupancy %, active queue counts, low-stock warnings, and kitchen wastage drain across all branches.
- **Multi-Location Support**:
  - `Downtown Flagship Roastery` (Metro Central)
  - `Uptown Artisan Bistro` (Galleria Promenade)
  - `Westside Garden Terrace` (Green Park)
- **Interactive SVG Telemetry**: Peak hourly sales distribution and dietary order mix analytics.

---

### 3. 🍽️ Interactive Table Management & Floor Plan
- **Real-Time Visual Floor Plan**: Filter by sections (`Main Hall`, `Window Lounge`, `Outdoor Terrace`, `Private Roastery Room`).
- **Status Badges**: `Available`, `Occupied`, `Reserved`, `Billed`, and `Cleaning`.
- **Queue-to-Table Seating**: 1-click seating of waiting queue tickets directly onto available tables.
- **Table Control Drawer**: Reassign states, view active guest bills, and release cleaned tables.

---

### 4. 👨‍🍳 Kitchen Display System (KDS)
- **4-Stage Kanban Pipeline**: `1. Inbound New` ➔ `2. In Prep` ➔ `3. At Pass / Plated` ➔ `4. Served to Guest`.
- **Prominent High-Contrast Dietary Alerts**:
  - **JAIN ALERT 🕊️**: Flashing banner mandating dedicated clean cookware and zero root vegetables.
  - **VEGAN ALERT 🌿**: Plant-based milk and dairy-free separation alert.
- Preparation timers and single-click ticket advancement.

---

### 5. 📦 Kitchen Inventory & Wastage Tracking
- **Inventory Module**: Category-based tracking of green beans, roasted blends, oat milk, A2 cow milk, Jain paneer, avocados, and compostable packaging.
- **Low Stock & Critical Stock Triggers**: Visual alerts when stock dips below minimum thresholds.
- **Wastage Tracking**: Log incidents with reasons (`Burnt/Prep Error`, `Spoilage`, `Expired`, `Trimming Waste`, `Damaged`). Automatically deducts inventory stock and calculates financial dollar loss.

---

### 6. 🚚 Vendor & Supplier Management
- **Supplier Directory**: Contact info, category, payment terms, and vendor performance ratings (1–5 stars).
- **Purchase Order (PO) Engine**: Create new POs with itemization, unit costs, and expected delivery dates.
- **1-Click Stock Integration**: Receiving a PO automatically updates kitchen inventory levels.

---

### 7. 💳 Billing, POS & Official Tax Invoicing
- **Point of Sale (POS) Terminal**: Table selection, itemized checkout, custom loyalty/manager discounts.
- **Payment Methods**: UPI QR Code / Cashless, Credit/Debit Cards, Cash Drawer, and Split Bills.
- **Official Printable Tax Invoice**: Formatted for standard paper and thermal receipt printers with dual tax breakdown (CGST 2.5% + SGST 2.5%), Cafe GSTIN, invoice number, and QR code.

---

### 8. 📊 HR & Finance Reports
- **Finance Telemetry**: Gross revenue by location, Estimated Cost of Goods Sold (COGS 30%), Operating Margins (69.8%), and Wastage drain.
- **HR & Staff Operations**: Staff roster, monthly hours, base salaries, shift schedules, and live clock-in / clock-out attendance tracking.
- **CSV Export**: Instant download of executive telemetry for corporate accounting.

---

### 9. 🌐 No-Code CMS Manager
- **Empower Non-Technical Teams**: Marketing and cafe managers can publish new campaigns, seasonal roast releases, cupping workshops, and promotions without writing code.
- **Live Sync**: Changes immediately reflect on the customer-facing website and hero carousels.

---

### 10. 🔐 Role-Based Access Control (RBAC)
Switch between 7 dedicated roles with granular view and operational permissions:
1. `customer`: Public storefront, menu, queue, reservations, tray.
2. `admin_hq`: Full unconstrained access across all branches and modules.
3. `store_manager`: Branch-level dashboard, tables, KDS, inventory, billing, CMS.
4. `kitchen_chef`: Kitchen KDS and inventory wastage logging.
5. `cashier`: Billing POS, tables, and tax invoicing.
6. `inventory_mgr`: Stock levels, wastage tracking, suppliers, and purchase orders.
7. `finance_hr`: P&L intelligence, staff attendance, payroll, and billing reports.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation & Run
```bash
# Clone or navigate to the directory
cd d:/workspace/personal/Cafe

# Install dependencies
npm install

# Start development server
npm run dev

# Or build and preview production build
npm run build
npm run preview -- --port 5173 --host
```

Visit **`http://localhost:5173`** in your browser.
