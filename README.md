# 📦 Product Hub Console - Premium E-commerce Admin Panel

A state-of-the-art, high-fidelity full-stack administrative panel designed with **Laravel 11**, **React JS**, and **Inertia.js**. Featuring a beautiful dark glassmorphic console UI, advanced product inventory workflows, multi-image upload streams, and real-time server-side intelligence.

---

## ✨ Features Breakdown

### 🔐 1. Split-Screen SaaS Authentication Portal
* **Split-Screen Layout**: Designed with a high-fidelity dark-themed marketing hero on the left showing dynamic interactive stats, mini-product widgets, and neon pulsing ambient orbs.
* **Modern Secure Auth**: Dynamic signup and login components powered by secure Laravel Breeze token validation.
* **Live Indicators**: Seamless state management that redirects non-logged-in traffic while validating cookies through stateful CORS session middleware.

### 📊 2. High-Performance Dashboard Shell
* **Glassmorphic Navigation Console**: Unified dark console navigation with an active glowing neon fuchsia-violet-cyan top border.
* **Live Server-Side Search**: Debounced keystroke querying filtering through records instantly.
* **Advanced Multi-Filter Controls**: 
  * Price bounding queries (Minimum & Maximum price controls).
  * 5 Sorting orders (Latest first, oldest, price low-to-high, price high-to-low, name alphabetical).
  * Server-side paginated grid layout displaying 6 optimized cards per page.

### 🛍️ 3. Premium CRUD Workflows & Asset Management
* **Cloud Upload Dashed Modals**: Overhauled native buttons into dotted upload panels featuring cloud upload icons, file count updates, and format indicators.
* **Relative Dollar ($) Overlays**: Sleek text input overlays matching high-end SaaS dashboards.
* **Smart Asset Storage**: Validated server uploads saving JPEG, PNG, JPG, GIF, or WEBP up to 5MB, with an automatic physical storage cleaner that deletes abandoned images from disk upon record update or destruction.
* **React Client-Side Validation**: Stripped browser-native HTML5 validation tooltips to support clean React-driven red error labels under missing fields.
* **Unified API Format**: Standardized JSON envelopes across all operations:
  ```json
  { "status": "success", "message": "...", "data": {...} }
  ```

---

## 🛠️ Technology Stack

* **Backend**: Laravel 11.x (PHP 8.2+)
* **Frontend**: React 19, Tailwind CSS 4.x
* **Glue Layer**: Inertia.js (Bypasses traditional REST requirements for unified client props delivery)
* **Database**: SQLite (Configured to automatically migrate and seed)
* **Assets Compiler**: Vite 6

---

## 🚀 Setup & Installation Guide

To run this application locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/bansal222223/Product_hub_admin_panel.git
cd Product_hub_admin_panel
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Install NPM Dependencies & Build Assets
```bash
npm install
npm run build
```

### 4. Setup Environment Config
Duplicate `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 5. Generate Application Key
```bash
php artisan key:generate
```

### 6. Run Database Migrations & Seed Default Admin
Initialize the SQLite database and seed the default administrator user:
```bash
php artisan migrate:fresh --seed
```

### 7. Link Uploads Storage Disk
Expose uploaded product images to the web client:
```bash
php artisan storage:link
```

### 8. Run Development Servers
Open two terminal windows to run both servers concurrently:

* **Laravel Backend Server**:
  ```bash
  php artisan serve
  ```
* **Vite Frontend HMR Compiler**:
  ```bash
  npm run dev
  ```

Visit **`http://127.0.0.1:8000`** in your browser!

---

## 🔑 Default Seeded Admin Credentials

You can bypass registration and log in immediately using the pre-seeded admin credentials:

* **Email**: `admin@hub.com`
* **Password**: `password`

---

## 📁 Key Folder Architecture

* `app/Http/Controllers/ProductController.php` — Command center handling search, filter queries, file saving, and file deletion.
* `app/Models/Product.php` — Eloquent database model carrying a `hasMany` relationship to ProductImage.
* `resources/js/Pages/Dashboard.jsx` — Core React application screen housing the products grid and form modals.
* `resources/js/Layouts/AuthenticatedLayout.jsx` — Premium dark application navbar.
* `routes/web.php` & `routes/api.php` — Application routing definitions.

---

*Developed with ❤️ using Laravel and React.*
