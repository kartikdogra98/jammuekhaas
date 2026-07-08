# Jammu-e-Khaas 🍛

A MERN-stack food delivery web app themed around Jammu's Dogra cuisine — think Swiggy/Zomato, but local.

## ⚠️ Please read before you dive in

This is a **real, working core** of the platform, not a static mockup — every route below hits an
actual MongoDB-backed API, and the flows (register → verify → login → browse → cart → checkout →
pay → track → review) are wired end-to-end. It intentionally does **not** claim to implement every
single feature a full commercial Swiggy/Zomato clone would need, because that's genuinely months of
work. Here's the honest breakdown:

### ✅ Fully implemented & working
- JWT auth: register, login, logout, email verification, forgot/reset password
- Role-based access control (customer / restaurant / delivery / admin)
- Restaurants, categories, menu items (full CRUD, image upload via Cloudinary)
- Cart (single-restaurant enforcement, quantity updates)
- Coupons (flat/percentage, min order, usage limits, expiry)
- Checkout with Cash on Delivery **and** real Razorpay order-creation + signature verification
- Orders: creation, status lifecycle, cancellation, polling-based status tracking, order history
- Reviews & ratings (tied to delivered orders, auto-recalculates restaurant/food rating)
- Addresses, Wishlist, Notifications
- Admin dashboard: analytics (Recharts: revenue trend, orders by status, top restaurants), user
  management, order oversight, coupon management, restaurant approval
- Restaurant owner dashboard: restaurant setup, menu management, order status updates
- Delivery partner dashboard: profile setup, accepting unassigned orders, marking delivered
- Security: Helmet, CORS, rate limiting, mongo-sanitize, XSS-clean, bcrypt password hashing
- Dark/light theme, responsive mobile-first UI, Framer Motion animations, Dogra-inspired palette

### 🟡 Stubbed / simplified — needs follow-up work for true production use
- **Google OAuth**: the `/api/auth/google` endpoint trusts a client-supplied `googleId`/`email`. In
  production you must verify the Google ID token server-side (e.g. with `google-auth-library`) before
  trusting it — wire this up in `authController.js#googleAuth` before going live.
- **Live order tracking**: implemented via 15-second polling (`OrderDetail.jsx`), not WebSockets/Socket.IO.
  Good enough for a demo; a real-time map view would need Socket.IO + a geolocation feed from the
  delivery partner's app.
- **Banner management**: model + CRUD API exist (`bannerController.js`), but no homepage carousel
  component consumes it yet — trivial to add.
- Email delivery depends on you configuring real SMTP credentials in `.env`; without them, registration
  and password reset still work, they just log a console warning instead of sending mail.

## Project structure
```
jammu-e-khaas/
├── backend/     Express + MongoDB API (MVC: models, controllers, routes, middleware)
└── frontend/    React + Vite + Redux Toolkit SPA
```

## Getting started

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, Cloudinary, Razorpay, email creds
npm run seed            # optional: seeds categories, a sample restaurant, menu, coupons, admin user
npm run dev              # starts on http://localhost:5000
```

Seeded logins (after `npm run seed`):
- Admin: `admin@jammuekhaas.com` / `Admin@123`
- Restaurant owner: `owner@jammuekhaas.com` / `Owner@123`

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env    # optional for local dev; Vite proxies /api to localhost:5000 already
npm run dev               # starts on http://localhost:5173
```

### 3. MongoDB
Make sure a MongoDB instance is running locally (`mongod`) or point `MONGO_URI` at Atlas.

### 4. Razorpay test mode
Use your Razorpay **test** key id/secret in both `.env` files to try the online payment flow without
real money — Razorpay's test cards work out of the box in test mode.

## Tech stack
React 18 · Redux Toolkit · React Router v6 · React Hook Form + Yup · Framer Motion · Recharts ·
Tailwind CSS · Node.js · Express · MongoDB/Mongoose · JWT · bcryptjs · Multer · Cloudinary · Razorpay ·
Helmet · express-rate-limit · express-mongo-sanitize · xss-clean

## Notes on architecture
- **MVC**: `models/` (Mongoose schemas) → `controllers/` (business logic) → `routes/` (Express routers) →
  wired together in `server.js`.
- **Validation**: lightweight custom rule functions in `middleware/validate.js` (kept dependency-free;
  swap in Zod/Joi if you prefer schema-based validation).
- **Error handling**: centralized in `middleware/errorHandler.js`, with a custom `ApiError` class and
  an `asyncHandler` wrapper so controllers can `throw` instead of manually catching.
- **File uploads**: Multer buffers in memory, then streams directly to Cloudinary — no temp files on disk.
