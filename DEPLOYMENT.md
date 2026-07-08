# Deploying Jammu-e-Khaas — Render (backend) + Vercel (frontend)

This guide deploys the **backend** (Express API) to **Render** and the **frontend** (React/Vite)
to **Vercel**, with **MongoDB Atlas** as the database (Render doesn't host MongoDB itself).

> Two small code changes were made to support this cross-domain setup (frontend and backend end
> up on two different domains, e.g. `*.vercel.app` and `*.onrender.com`):
> - `frontend/src/api/axios.js` now reads `VITE_API_URL` for the backend URL in production
>   instead of assuming a same-origin `/api` path.
> - `backend/controllers/authController.js` now sets the auth cookie's `sameSite` to `none` in
>   production (required for cross-domain cookies). Login still works even without this, since
>   the app also sends the JWT as a `Bearer` header on every request — the cookie is a backup.
>
> If you're deploying from a zip that predates this note, grab the updated versions of those two
> files before deploying, or ask for them again.

---

## 0. Prerequisites
- A [GitHub](https://github.com) repo with this project pushed to it (Render and Vercel both deploy from git)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account
- A free [Render](https://render.com) account
- A free [Vercel](https://vercel.com) account
- (Optional) Cloudinary, Razorpay, and SMTP credentials if you want images/payments/emails working in production

---

## 1. Push your code to GitHub
```bash
cd jammu-e-khaas
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/jammu-e-khaas.git
git push -u origin main
```
The `.gitignore` already in the project keeps `node_modules/` and `.env` files out of the repo.

---

## 2. Set up MongoDB Atlas (free tier)

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Database Access** → add a database user (username + password) — save these
3. **Network Access** → add IP address `0.0.0.0/0` (allow access from anywhere — required since Render's IPs aren't static on the free tier)
4. **Database** → Connect → "Drivers" → copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/jammu-e-khaas?retryWrites=true&w=majority
   ```
   Replace `<username>`/`<password>` with your actual credentials, and make sure the database name (`jammu-e-khaas`) is included in the path before the `?`.

Keep this connection string — you'll paste it into Render as `MONGO_URI`.

---

## 3. Deploy the backend to Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service**
2. Connect your GitHub repo, select it
3. Configure:
   | Setting | Value |
   |---|---|
   | **Name** | `jammu-e-khaas-api` (or anything) |
   | **Root Directory** | `backend` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | Free |

4. **Environment Variables** — add these (Render → your service → Environment):
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=<your Atlas connection string from Step 2>
   JWT_SECRET=<a long random string — generate one, don't reuse the example>
   JWT_EXPIRES_IN=7d
   JWT_COOKIE_EXPIRES_DAYS=7
   CLIENT_URL=<your Vercel frontend URL — you'll get this in Step 4, come back and update it>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your email>
   EMAIL_PASS=<your app password>
   EMAIL_FROM=Jammu-e-Khaas <no-reply@jammuekhaas.com>
   CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
   CLOUDINARY_API_KEY=<your Cloudinary API key>
   CLOUDINARY_API_SECRET=<your Cloudinary API secret>
   RAZORPAY_KEY_ID=<your Razorpay test/live key id>
   RAZORPAY_KEY_SECRET=<your Razorpay test/live key secret>
   ```
   You can leave Cloudinary/Razorpay/Email as placeholders for now if you don't have accounts yet — the
   app degrades gracefully (Cash on Delivery still works without Razorpay, forms save without photos
   without Cloudinary), it just won't send real emails/process real payments/store real images.

5. Click **Create Web Service**. Render will build and deploy — first deploy takes a few minutes.
6. Once live, note your backend URL, e.g. `https://jammu-e-khaas-api.onrender.com`
7. Test it: visit `https://jammu-e-khaas-api.onrender.com/api/health` — should return a JSON success message.

**Free tier note:** Render's free web services spin down after ~15 minutes of inactivity and take
~30–60 seconds to wake back up on the next request. This is normal — a paid instance avoids it.

### Seed the production database (optional, one-time)
Render's free tier doesn't give shell access easily, so the simplest way to seed is to **temporarily
run the seed script locally against your Atlas database**:
```bash
cd backend
# temporarily point your local .env's MONGO_URI at the Atlas connection string
npm run seed
```
Then switch your local `.env` back to your local MongoDB if you want to keep developing locally too.

---

## 4. Deploy the frontend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → import the same GitHub repo
2. Configure:
   | Setting | Value |
   |---|---|
   | **Root Directory** | `frontend` |
   | **Framework Preset** | Vite |
   | **Build Command** | `npm run build` (default, should auto-detect) |
   | **Output Directory** | `dist` (default, should auto-detect) |

3. **Environment Variables** — add:
   ```
   VITE_API_URL=https://jammu-e-khaas-api.onrender.com/api
   ```
   (use your actual Render backend URL from Step 3, with `/api` on the end)

4. Click **Deploy**. Vercel builds and gives you a URL like `https://jammu-e-khaas.vercel.app`

---

## 5. Connect the two — update CORS

Go back to **Render** → your backend service → **Environment** → update:
```
CLIENT_URL=https://jammu-e-khaas.vercel.app
```
(your actual Vercel URL from Step 4 — no trailing slash)

Save — Render will automatically redeploy with the new value. This is required because the backend's
CORS middleware only allows requests from whatever `CLIENT_URL` is set to; without this step, the
deployed frontend's API calls will be blocked by CORS errors in the browser console.

---

## 6. Test the live deployment

1. Open your Vercel URL
2. Register a new account, or log in with the seeded admin (`admin@jammuekhaas.com` / `Admin@123`) if you ran the seed script
3. Browse restaurants, add to cart, check out with Cash on Delivery
4. Open browser DevTools → Network tab if anything fails — a CORS error means Step 5 wasn't saved/redeployed yet; a 404 on API calls usually means `VITE_API_URL` is missing or wrong in Vercel

---

## Custom domains (optional)
- **Vercel:** Project → Settings → Domains → add your domain, follow the DNS instructions
- **Render:** Service → Settings → Custom Domains → add your domain, follow the DNS instructions
- After adding custom domains, update `CLIENT_URL` (Render) and `VITE_API_URL` (Vercel) to match the new domains, and redeploy both.

## Redeploying after code changes
Both Render and Vercel auto-deploy on every `git push` to your connected branch by default — no
manual redeploy step needed once this initial setup is done.

## Troubleshooting
| Symptom | Likely cause |
|---|---|
| CORS error in browser console | `CLIENT_URL` on Render doesn't exactly match your Vercel URL |
| Frontend loads but API calls fail / 404 | `VITE_API_URL` missing or wrong in Vercel env vars — remember to include `/api` at the end |
| Login works but "Not authorized" on protected pages | Usually resolves itself since the app uses Bearer tokens as the primary auth method; hard-refresh and check `localStorage` has `jek_token` set |
| Backend takes ~30s to respond on first request | Normal on Render's free tier (cold start after inactivity) |
| `MongooseServerSelectionError` on Render | Atlas Network Access doesn't have `0.0.0.0/0` allowed, or the password in `MONGO_URI` has unescaped special characters (URL-encode `@`, `#`, etc. in the password) |
| Images don't upload in production | Cloudinary env vars still placeholders — see Step 3 |
