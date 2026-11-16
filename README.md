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

### 3. 📖 Central Menu & Multi-Branch Catalog Management
- **Centralized Master Menu**: Manage all culinary recipes and drink formulations from the central HQ terminal.
- **Per-Branch Menu Allocation**:
  - Select which branches offer each dish (`Downtown Flagship`, `Uptown Bistro`, `Westside Terrace`, or `All Locations`).
  - **1-Click Branch Toggles**: Instantly enable or disable any dish at a specific branch without code redeployment.
- **Full Menu CRUD Operations**:
  - **Add Menu Item**: Name, standard or custom categories, price in Indian Rupees (₹), detailed tasting notes, calorie count, preparation time (mins), ingredients list, and dish image URL with preset photography.
  - **Edit Recipe**: Update selling prices, dietary tags, preparation times, or ingredients anytime.
  - **Delete Recipe**: Permanently remove from the chain catalog or detach from a single branch.
- **Dietary Protocol Certifications**: Full tagging for Strict Jain 🕊️ (zero root veggies/onion/garlic), 100% Vegan 🌿, Pure Veg 🥗, and Gluten-Free.
- **Global Stock Toggles**: Toggle dishes between `In Stock` and `Out of Stock` in real-time.

---

### 4. 🍽️ Interactive Table Management & Dynamic Floor Plan
- **Real-Time Visual Floor Plan**: Filter by preconfigured or custom sections (`Main Hall`, `Window Lounge`, `Outdoor Terrace`, `Private Roastery Room`, or user-added zones).
- **Dynamic Section Management**: Add new custom floor sections (e.g. `Rooftop Terrace`, `VIP Cabana`, `Courtyard Garden`) and delete empty sections with a single click.
- **Full Table CRUD Operations**:
  - **Add Table**: Create new tables with custom numbers (`T-11`, `R-01`), seating capacities (2–12 guests), and target sections.
  - **Edit Table**: Modify table numbers, guest capacities, or reassign sections from the table drawer.
  - **Delete Table**: Remove tables from the floor plan with safety confirmation dialogs.
- **Status Badges**: `Available`, `Occupied`, `Reserved`, `Billed`, and `Cleaning`.
- **Queue-to-Table Seating**: 1-click seating of waiting queue tickets directly onto available tables.
- **Table Control Drawer**: Reassign states, view active guest bills, and release cleaned tables.

---

### 4. 👨‍🍳 Kitchen Display System (KDS) & Error Undo Pipeline
- **4-Stage Kanban Pipeline**: `1. Inbound New` ➔ `2. In Prep` ➔ `3. At Pass / Plated` ➔ `4. Served to Guest`.
- **↩ Undo / Revert Back in Board**: Kitchen staff and baristas can immediately revert an order back to the previous column if tapped by mistake:
  - `In Prep` ➔ `↩ Undo • Send back to Inbound`
  - `At Pass / Ready` ➔ `↩ Undo • Send back to Cooking`
  - `Served to Guest` ➔ `↩ Undo • Send back to Pass`
- **Prominent High-Contrast Dietary Alerts**:
  - **JAIN ALERT 🕊️**: Flashing banner mandating dedicated clean cookware and zero root vegetables.
  - **VEGAN ALERT 🌿**: Plant-based milk and dairy-free separation alert.
- Preparation timers, single-click ticket advancement, and live dietary-only filter.

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

## 🌐 Live Subdomain & Cloudflare DNS Setup

- **Subdomain**: [http://cafe.nistta.com](http://cafe.nistta.com)
- **GitHub Repository**: [https://github.com/SureshMateti-works25/cafe](https://github.com/SureshMateti-works25/cafe)
- **GitHub Pages Origin**: `sureshmateti-works25.github.io` (Serving `HTTP 200 OK` with custom `CNAME: cafe.nistta.com`)

### ⚡ 1-Minute Cloudflare DNS Configuration
Because `nistta.com` is hosted on Cloudflare nameservers (`jasper.ns.cloudflare.com` & `sneh.ns.cloudflare.com`), configure the DNS record in your Cloudflare dashboard:

1. Open **[dash.cloudflare.com](https://dash.cloudflare.com/)** ➔ Select **`nistta.com`** ➔ **DNS Records**.
2. Edit or add the record for the `cafe` subdomain:
   - **Type**: `CNAME`
   - **Name**: `cafe`
   - **Target**: `sureshmateti-works25.github.io`
   - **Proxy status**: **DNS Only (Grey Cloud)** *(Switch to DNS Only so GitHub Pages completes its SSL handshake and provisions the free Let's Encrypt certificate)*
   - **TTL**: Auto
3. In **GitHub Repository**:
   - Go to **[https://github.com/SureshMateti-works25/cafe/settings/pages](https://github.com/SureshMateti-works25/cafe/settings/pages)**.
   - You will see `Custom domain: cafe.nistta.com` is verified. Check **"Enforce HTTPS"**.
4. (Optional) Once HTTPS is verified on GitHub, you can toggle the Cloudflare Proxy icon back to **Proxied (Orange Cloud)** with Cloudflare SSL/TLS set to **Full**.


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
