# 🛍️ Lumon — Full-Stack E-Commerce Platform

A modern, full-stack e-commerce platform built with **Laravel 13** and **React 19** using **Inertia.js** for seamless server-driven SPA navigation. Lumon features role-based access for buyers and sellers, real product data sourced from the DummyJSON API, a fully functional shopping cart, checkout flow, wishlist system, and product reviews — all wrapped in a polished, responsive UI.

The project goes beyond the typical CRUD application and implements production-grade infrastructure: **Dockerized containers**, **automated CI/CD**, **background job processing**, **Redis caching**, **rate limiting**, **fuzzy search with Meilisearch**, **database transactions with row-level locking**, and **real-time error tracking with Sentry**.

> **Disclaimer:** This is a portfolio project. It is not a real store, none of the data or products are real, and it is made purely for practice and demonstration purposes.

---

## 📸 Screenshots

> _Coming soon — swap this section with actual screenshots of the storefront, product detail page, and seller dashboard._

---

## ✨ Features

### 🛒 Buyer Experience

- **Product Browsing** — Browse products across 4 categories with filtering by category, price range, and rating
- **Fuzzy Search** — Typo-tolerant search powered by Meilisearch (e.g., "laptpp" still finds "Laptop")
- **Search & Sort** — Sorting options by price, newest, and rating
- **Pagination** — Server-side paginated product listings for fast load times
- **Product Detail Pages** — Detailed product views with image gallery, description, stock info, and average rating
- **Shopping Cart** — Add/remove items, adjust quantities, view running total via a slide-out cart drawer
- **Checkout** — Complete orders with shipping address input; the entire checkout flow is wrapped in a database transaction with row-level locking to prevent race conditions and partial failures
- **Wishlist** — Toggle products in/out of a personal wishlist with heart button animations
- **Reviews & Ratings** — Read and write product reviews with 1–5 star ratings; edit or delete your own reviews
- **Order History** — View past orders with itemized details and order status

### 🏪 Seller Experience

- **Product Management** — Full CRUD for your own products (create, edit, delete) with image upload support
- **My Products Dashboard** — View all your listed products with ratings and review counts
- **Order Management** — View incoming orders and update their status (pending → processing → shipped → delivered)
- **Seller Profile Pages** — Public-facing seller pages displaying their product catalog

### 🔐 Authentication

- **Registration** — Sign up as either a Buyer or Seller with role selection
- **Login / Logout** — Session-based authentication with CSRF protection
- **One-Click Demo Login** — Instantly log in as a demo buyer or demo seller to explore the platform without registration
- **Role-Based Access Control** — Sellers can manage products and orders; buyers can shop, review, and checkout
- **Rate Limiting** — Login endpoint is rate-limited to 5 attempts per minute (by email + IP) to prevent brute-force attacks

### 🎨 UI / UX

- **Responsive Design** — Fully responsive layout built with Tailwind CSS
- **Hero Slider** — Animated hero carousel on the landing page
- **Editor's Pick** — Curated category grid with visual cards
- **Featured Products** — Best-selling products section on the homepage
- **Testimonials** — Customer testimonial carousel
- **Toast Notifications** — Non-intrusive feedback for cart, wishlist, and form actions
- **Loading Skeletons** — Skeleton placeholder cards while products load
- **Breadcrumb Navigation** — Context-aware breadcrumbs on product and category pages

---

## 🛠️ Tech Stack

### Backend

| Technology          | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| **Laravel 13**      | PHP framework — routing, ORM, authentication, API           |
| **Inertia.js**      | Server-driven SPA adapter (replaces traditional API + SPA)  |
| **Laravel Sanctum** | Session-based authentication with CSRF tokens               |
| **Laravel Scout**   | Search abstraction layer integrated with Meilisearch        |
| **MySQL**           | Relational database (SQLite also supported for testing)     |
| **Redis**           | Cache backend, queue driver, and session store              |
| **DummyJSON API**   | External API for seeding realistic product data and reviews |

### Frontend

| Technology         | Purpose                                     |
| ------------------ | ------------------------------------------- |
| **React 19**       | UI component library                        |
| **TypeScript**     | Type-safe JavaScript                        |
| **Tailwind CSS 3** | Utility-first CSS framework                 |
| **Vite 8**         | Build tool and dev server                   |
| **Zustand**        | Lightweight state management (cart, toasts) |
| **Lucide React**   | Icon library                                |
| **Axios**          | HTTP client for API calls                   |

### DevOps & Infrastructure

| Technology             | Purpose                                                     |
| ---------------------- | ----------------------------------------------------------- |
| **Docker & Compose**   | Containerized development environment (7 services)          |
| **GitHub Actions**     | Automated CI/CD pipeline — runs Pest tests on every push    |
| **Laravel Queues**     | Background job processing for emails & heavy tasks          |
| **Meilisearch**        | Full-text search engine with typo tolerance                 |
| **Sentry**             | Real-time error tracking, performance monitoring, and alerts |
| **Pest PHP**           | Testing framework for integration and feature tests         |
| **Laravel Dusk**       | Browser-based E2E testing with Selenium                     |

---

## 🏗️ Architecture Highlights

### 🔍 Fuzzy Search (Meilisearch + Laravel Scout)
Product search is powered by **Meilisearch**, a blazing-fast search engine that runs as a Docker container. When a user types a search query, it's sent to Meilisearch instead of the database, enabling:
- **Typo tolerance** — based on Levenshtein distance, scaled by word length
- **Instant results** — Meilisearch returns results in single-digit milliseconds
- **Filterable attributes** — category, seller, price, and active status are configured as filterable at the engine level

Product data is kept in sync with Meilisearch via the `Searchable` trait on the `Product` model. When products are created, updated, or deleted, Scout automatically syncs the changes.

### 🛡️ Database Transactions & Row-Level Locking
The checkout flow (`OrderController@store`) is wrapped in `DB::transaction()` with `lockForUpdate()` on the cart, cart items, and product rows. This prevents:
- **Race conditions** — Two concurrent checkouts can't both claim the last item in stock
- **Partial failures** — If stock deduction fails mid-checkout, the entire order rolls back (no orphaned records)

### ⚡ Caching Strategy (Redis)
- **Cache invalidation** via a `ProductObserver` that flushes the `products` cache tag whenever a product is created, updated, or deleted
- **Redis** is used as the unified backend for caching, queues, and sessions

### 🚦 Rate Limiting
Two custom rate limiters are defined in `AppServiceProvider`:
- **Login** — 5 attempts per minute, keyed by `email + IP` to prevent brute-force attacks
- **Checkout** — 10 attempts per hour, keyed by user ID (or IP for guests) to prevent spam orders

### 🔭 Observability (Sentry)
All unhandled exceptions are automatically reported to **Sentry** with:
- **Full stack traces** and request context
- **Authenticated user info** (ID, email, name) attached to every error
- **Performance tracing** to identify slow endpoints

### 🔄 Background Jobs
Order confirmation emails are dispatched to a **Redis-backed queue** after checkout. The job runs asynchronously so the user gets an instant response. Failed jobs are logged and retried automatically.

---

## 🐳 Docker Services

The application runs as **7 containerized services** orchestrated by Docker Compose:

| Service        | Container            | Image                              | Port   | Purpose                          |
| -------------- | -------------------- | ---------------------------------- | ------ | -------------------------------- |
| **App**        | `lumon-app`          | Custom (PHP 8.4 + extensions)      | —      | Laravel PHP application          |
| **Webserver**  | `lumon-webserver`    | `nginx:alpine`                     | `8000` | Reverse proxy / HTTP server      |
| **Database**   | `lumon-db`           | `mysql:8.0`                        | `3307` | MySQL database                   |
| **Node**       | `lumon-node`         | `node:20-alpine`                   | `5173` | Vite dev server with HMR         |
| **Redis**      | `lumon-redis`        | `redis:alpine`                     | `6379` | Cache, queues, and sessions      |
| **Meilisearch**| `lumon-meilisearch`  | `getmeili/meilisearch:latest`      | `7700` | Full-text search engine          |
| **Selenium**   | `lumon-selenium`     | `selenium/standalone-chrome:latest`| `4444` | Browser automation for E2E tests |

---

## 🗂️ Project Structure

```
Lumon/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # 9 controllers (Auth, Cart, Product, Order, etc.)
│   │   ├── Middleware/          # SellerMiddleware, HandleInertiaRequests
│   │   └── Resources/          # API resource transformers
│   ├── Jobs/                   # SendOrderConfirmationMail (queued)
│   ├── Models/                 # 8 Eloquent models (Product uses Searchable trait)
│   ├── Observers/              # ProductObserver (cache invalidation)
│   └── Providers/              # AppServiceProvider (rate limiters, observers)
├── bootstrap/
│   └── app.php                 # Exception handler with Sentry integration
├── config/
│   ├── scout.php               # Meilisearch filterable/sortable attributes
│   └── sentry.php              # Sentry DSN and tracing configuration
├── database/
│   ├── factories/              # Model factories (fallback seeding)
│   ├── migrations/             # 15 migration files
│   └── seeders/                # DatabaseSeeder + ReviewSeeder (DummyJSON API)
├── docker/
│   └── nginx/app.conf          # Nginx configuration
├── resources/
│   └── js/
│       ├── Components/         # Reusable React components
│       │   ├── cart/            # CartDrawer
│       │   ├── common/         # ProductCard, StarRating, Breadcrumb, Toast, etc.
│       │   ├── home/           # HeroSlider, EditorsPick, FeaturedProducts, etc.
│       │   ├── layout/         # Navbar, Footer, Layout wrapper
│       │   ├── product/        # ProductGallery, ReviewSection, QuantitySelector
│       │   └── shop/           # FilterSidebar, SortDropdown, Pagination
│       └── Pages/              # 11 Inertia page components
│           ├── Home.tsx         # Landing page
│           ├── Shop.tsx         # Product listing with filters
│           ├── ProductDetail.tsx # Single product view
│           ├── Cart.tsx         # Cart page
│           ├── Checkout.tsx     # Checkout flow
│           ├── Wishlist.tsx     # Wishlist page
│           ├── Login.tsx        # Login page (with demo login)
│           ├── Register.tsx     # Registration page
│           ├── MyProducts.tsx   # Seller product dashboard
│           ├── ProductForm.tsx  # Create/edit product form
│           └── SellerProfile.tsx # Public seller page
├── routes/
│   ├── web.php                 # Inertia page routes
│   └── api.php                 # RESTful API routes
├── tests/
│   ├── Feature/                # 9 Pest integration test files
│   └── Browser/                # Laravel Dusk E2E tests
├── .github/
│   └── workflows/tests.yml     # CI/CD pipeline (GitHub Actions)
├── docker-compose.yml          # 7-service Docker orchestration
├── Dockerfile                  # PHP 8.4 application image
└── public/                     # Static assets
```

---

## 🗄️ Database Schema

```
users           → id, name, email, password, role (buyer/seller)
categories      → id, name, slug, description
products        → id, seller_id, category_id, name, slug, description, price, stock, is_active, image_url
carts           → id, user_id
cart_items      → id, cart_id, product_id, quantity
orders          → id, user_id, total, status, shipping_address
order_items     → id, order_id, product_id, quantity, price
wishlists       → id, user_id, product_id
reviews         → id, product_id, user_id, rating, comment (unique: product_id + user_id)
```

---

## 🧪 Testing

Lumon has a comprehensive test suite covering both backend logic and browser interactions:

### Integration Tests (Pest PHP)

| Test File                    | What it covers                                         |
| ---------------------------- | ------------------------------------------------------ |
| `AuthTest.php`               | Registration, login, logout, validation                |
| `ProductTest.php`            | Listing, filtering, sorting, single product retrieval  |
| `CartTest.php`               | Add/remove/update cart items, edge cases               |
| `CheckoutTest.php`           | Order creation, stock deduction, cart clearing          |
| `CheckoutTransactionTest.php`| Transaction rollback on insufficient stock             |
| `OrderTest.php`              | Order history, authorization, status updates           |
| `CategoryTest.php`           | Category listing and retrieval                         |
| `AdminProductTest.php`       | Seller CRUD operations and authorization               |

### E2E Tests (Laravel Dusk)

| Test File                | What it covers                                     |
| ------------------------ | -------------------------------------------------- |
| `CheckoutFlowTest.php`   | Full browser checkout flow from cart to order       |

### Running Tests

```bash
# Run all Pest integration tests
docker exec lumon-app vendor/bin/pest

# Run Laravel Dusk browser tests (requires Selenium container)
docker exec lumon-app php artisan dusk
```

### CI/CD Pipeline

Tests run automatically on every push to `main` and on pull requests via **GitHub Actions**. The pipeline:
1. Sets up PHP 8.4 with required extensions
2. Installs Composer and NPM dependencies
3. Builds frontend assets
4. Runs migrations against an SQLite database
5. Executes the full Pest test suite

---

## 🔌 API Routes

### Public

| Method | Endpoint                       | Description                                     |
| ------ | ------------------------------ | ----------------------------------------------- |
| `GET`  | `/api/products`                | List products (filterable, sortable, paginated) |
| `GET`  | `/api/products/{slug}`         | Get single product details                      |
| `GET`  | `/api/products/{slug}/reviews` | Get reviews for a product                       |
| `GET`  | `/api/categories`              | List all categories                             |
| `GET`  | `/api/categories/{id}`         | Get single category                             |

### Authenticated (Buyer)

| Method   | Endpoint                       | Description                |
| -------- | ------------------------------ | -------------------------- |
| `GET`    | `/api/cart`                    | View current cart          |
| `POST`   | `/api/cart`                    | Add item to cart           |
| `PUT`    | `/api/cart/items/{id}`         | Update cart item quantity  |
| `DELETE` | `/api/cart/items/{id}`         | Remove item from cart      |
| `POST`   | `/api/checkout`                | Place an order from cart   |
| `GET`    | `/api/orders`                  | List buyer's orders        |
| `GET`    | `/api/orders/{id}`             | View order details         |
| `POST`   | `/api/wishlist`                | Toggle wishlist item       |
| `GET`    | `/api/wishlist/ids`            | Get wishlisted product IDs |
| `POST`   | `/api/products/{slug}/reviews` | Write a review             |
| `PUT`    | `/api/reviews/{id}`            | Edit your review           |
| `DELETE` | `/api/reviews/{id}`            | Delete your review         |

### Authenticated (Seller)

| Method   | Endpoint                         | Description                              |
| -------- | -------------------------------- | ---------------------------------------- |
| `GET`    | `/api/seller/products`           | List seller's own products               |
| `POST`   | `/api/seller/products`           | Create a new product                     |
| `PUT`    | `/api/seller/products/{id}`      | Update a product                         |
| `DELETE` | `/api/seller/products/{id}`      | Delete a product                         |
| `GET`    | `/api/seller/orders`             | View orders containing seller's products |
| `PATCH`  | `/api/seller/orders/{id}/status` | Update order status                      |

---

## 🚀 Getting Started

Lumon uses **Docker** to provide a zero-configuration, containerized development environment. You do not need PHP, Node, or MySQL installed on your host machine.

### Prerequisites

- **Docker Desktop** (or Docker Engine + Compose)
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mohammadamour/Lumon.git
cd Lumon

# 2. Set up environment file
cp .env.example .env

# 3. Build and spin up the containers
docker-compose up -d --build
```

### Initial Setup

Once the containers are running, run these commands inside the `app` container to finish setup:

```bash
# Install PHP dependencies
docker-compose exec app composer install

# Generate application key
docker-compose exec app php artisan key:generate

# Run migrations and seed the database with API data
docker-compose exec app php artisan migrate:fresh --seed

# Sync Meilisearch index settings (filterable/sortable attributes)
docker-compose exec app php artisan scout:sync-index-settings

# Import existing products into Meilisearch
docker-compose exec app php artisan scout:import "App\Models\Product"
```

### Running the Application

The application is now fully running! 

- **Storefront:** Visit **http://localhost:8000** in your browser.
- **Vite (Frontend):** Running automatically in the `node` container with HMR via port 5173.
- **Database:** Accessible on port `3307` via standard MySQL clients (username: `root`, no password).
- **Meilisearch Dashboard:** Visit **http://localhost:7700** to inspect the search index.

#### Starting the Queue Worker
To process background jobs (like sending order confirmation emails), run the worker inside the app container:
```bash
docker-compose exec app php artisan queue:work
```

---

## 🔑 Demo Accounts

The seeder creates demo accounts for instant access. You can also use the **one-click demo login** buttons on the login page.

| Role   | Email               | Password   |
| ------ | ------------------- | ---------- |
| Buyer  | `buyer@lumon.demo`  | `password` |
| Seller | `seller@lumon.demo` | `password` |

---

## 🌱 Seeding Architecture

The database seeder uses a two-tier strategy:

1. **Primary (API)** — Fetches 194 products from the DummyJSON API, maps them into 4 curated categories (Men's Clothing, Women's Clothing, Accessories, Electronics), and imports ~87 products with real CDN-hosted images. Reviews are imported directly from the API and supplemented with template reviews for variety (~390 total).

2. **Fallback (Factory)** — If the API is unreachable (no internet, API down), the seeder catches the exception and generates 50 products using Laravel factories with DummyJSON placeholder images. Template-based reviews are created as a substitute.

**Categories & Mapping:**

| Lumon Category   | DummyJSON Sources                                                                 |
| ---------------- | --------------------------------------------------------------------------------- |
| Men's Clothing   | `mens-shirts`, `mens-shoes`                                                       |
| Women's Clothing | `tops`, `womens-dresses`, `womens-shoes`                                          |
| Accessories      | `womens-bags`, `womens-jewellery`, `womens-watches`, `mens-watches`, `sunglasses` |
| Electronics      | `laptops`, `smartphones`, `tablets`, `mobile-accessories`                         |

---

## 📄 License

This project is open-sourced under the [MIT License](https://opensource.org/licenses/MIT).
