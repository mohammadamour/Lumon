# 🛍️ Lumon — Full-Stack E-Commerce Platform

A modern, full-stack e-commerce platform built with **Laravel 13** and **React 19** using **Inertia.js** for seamless server-driven SPA navigation. Lumon features role-based access for buyers and sellers, real product data sourced from the DummyJSON API, a fully functional shopping cart, checkout flow, wishlist system, and product reviews — all wrapped in a polished, responsive UI.

---

## 📸 Screenshots

> _Coming soon — swap this section with actual screenshots of the storefront, product detail page, and seller dashboard._

---

## ✨ Features

### 🛒 Buyer Experience

- **Product Browsing** — Browse products across 4 categories with filtering by category, price range, and rating
- **Search & Sort** — Full-text search with sorting options (price, newest, rating)
- **Pagination** — Server-side paginated product listings for fast load times
- **Product Detail Pages** — Detailed product views with image gallery, description, stock info, and average rating
- **Shopping Cart** — Add/remove items, adjust quantities, view running total via a slide-out cart drawer
- **Checkout** — Complete orders with shipping address input; cart items are converted into order records
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
| **MySQL**           | Relational database (SQLite also supported)                 |
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

---

## 🗂️ Project Structure

```
Lumon/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # 9 controllers (Auth, Cart, Product, Order, etc.)
│   │   └── Resources/          # API resource transformers
│   └── Models/                 # 8 Eloquent models
├── database/
│   ├── factories/              # Model factories (fallback seeding)
│   ├── migrations/             # 15 migration files
│   └── seeders/                # DatabaseSeeder + ReviewSeeder (DummyJSON API)
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

### Prerequisites

- **PHP** ≥ 8.3
- **Composer** ≥ 2.x
- **Node.js** ≥ 18.x
- **MySQL** 8.x (or SQLite for quick setup)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mohammadamour/Lumon.git
cd Lumon

# 2. Install PHP dependencies
composer install

# 3. Install JS dependencies
npm install

# 4. Set up environment
cp .env.example .env
php artisan key:generate
```

### Database Setup

Configure your database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lumon_db
DB_USERNAME=root
DB_PASSWORD=
```

Then run migrations and seed:

```bash
php artisan migrate:fresh --seed
```

> The seeder fetches **real product data** (images, descriptions, prices, reviews) from the [DummyJSON API](https://dummyjson.com/). If the API is unreachable, it gracefully falls back to factory-generated placeholder data.

### Running Locally

```bash
# Terminal 1: Start the Laravel backend
php artisan serve

# Terminal 2: Start the Vite dev server
npm run dev
```

Visit **http://localhost:8000** in your browser.

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

<!--


running it locally (temp steps):

php artisan serve
npm run dev
turn on sql xampp

for bagisto
just turn on herd

todo list:
- [x] fixed static bestseller products in landing page
- [x] remove electronics as a category
- [x] make clicking on landing page cateogries lead you to products page with search for that specific category
change the kid image in landing page to electronic
reconfigure what needs to before deployment
dockerize and containerzie the application to be ready for deployment
write a thorough documentation for the application
figure out what integration and end to end tests mean and how to implement them -->
