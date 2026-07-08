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


