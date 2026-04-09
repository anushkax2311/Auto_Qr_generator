# ⬡ QRFlow

> Auto-refreshing payment QR SaaS for Indian small businesses.
> Built with React · Firebase · Razorpay · Deployed on Vercel.

---

## 💡 What is QRFlow?

Indian businesses using Google Pay / PhonePe have a rotating QR code that expires every 5 minutes. Employees manually send a new QR to customers on WhatsApp — over and over, all day.

**QRFlow fixes this completely.**

- Business owner signs up → adds their UPI ID
- Gets a permanent shareable link
- Sends that link to customers **once** on WhatsApp
- The QR on that page auto-updates every 5 minutes — forever
- Employees never send a QR manually again

---

## 💰 Business Model

| Plan | Price | Features |
|---|---|---|
| Starter | ₹500/month | 1 QR link, auto-refresh every 5 min, WhatsApp shareable link, dashboard |
| Pro | ₹1,500/month | 3 QR links, custom refresh interval, priority support, analytics, custom branding |

- 7-day free trial on signup (no credit card needed)
- Payments handled by Razorpay → money goes directly to your bank account
- Cancel anytime

---

## 🗂 Project Structure

```
qrflow/
├── public/
│   └── index.html
├── src/
│   ├── firebase.js              ← Firebase config (uses .env variables)
│   ├── index.js                 ← React entry point
│   ├── App.js                   ← All routes
│   ├── index.css                ← Global styles + design tokens
│   ├── context/
│   │   └── AuthContext.js       ← Login, register, logout, user session
│   ├── components/
│   │   ├── Navbar.js            ← Top navigation bar
│   │   ├── Navbar.css
│   │   └── PrivateRoute.js      ← Blocks unauthenticated users
│   └── pages/
│       ├── Landing.js / .css    ← Public homepage with pricing
│       ├── Register.js          ← Signup page
│       ├── Login.js             ← Login page
│       ├── Auth.css             ← Shared auth styles
│       ├── Dashboard.js / .css  ← Business owner dashboard + live QR
│       ├── Subscribe.js / .css  ← Razorpay subscription page
│       └── PublicQR.js / .css   ← Customer-facing auto-refreshing QR page
├── .env                         ← Your secret keys (never commit this)
├── .gitignore
├── vercel.json                  ← Fixes page refresh routing on Vercel
└── package.json
```

---

## 🚀 Deployment — Step by Step

### STEP 1 — Install Dependencies

```bash
npm install
```

---

### STEP 2 — Create Firebase Project

1. Go to [firebase.google.com](https://firebase.google.com) → **Create a project**
2. Name it `qrflow` → disable Google Analytics → **Create Project**

**Enable Authentication:**
- Click **Authentication** → **Get Started**
- Click **Email/Password** → toggle **Enable** → **Save**

**Enable Firestore:**
- Click **Firestore Database** → **Create Database**
- Choose **Start in production mode** → Next
- Region: **asia-south1 (Mumbai)** → **Enable**

**Set Firestore Security Rules:**
- Click the **Rules** tab → replace everything with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId;
    }
  }
}
```

- Click **Publish**

**Get your config keys:**
- Gear icon → **Project Settings** → scroll to **Your apps** → click `</>` (Web)
- Name it `qrflow-web` → **Register App**
- Copy the `firebaseConfig` object values — you need them in the next step

---

### STEP 3 — Create Razorpay Account

1. Go to [razorpay.com](https://razorpay.com) → Sign up
2. Go to **Settings → API Keys → Generate Test Key**
3. Copy your **Key ID** — looks like `rzp_test_xxxxxxxxxx`
4. When going live: switch to **Live Mode** → generate a live key → replace the test key

---

### STEP 4 — Create `.env` File

Create a file called `.env` in the root of your project (same level as `package.json`) and paste this — replacing every value with your actual keys:

```
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456:web:abcdef
REACT_APP_RAZORPAY_KEY=rzp_test_xxxxxxxxxx
```

---

### STEP 5 — Replace `src/firebase.js`

Delete everything in the file and paste this:

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```

---

### STEP 6 — Update `src/pages/Subscribe.js`

Find this line:

```js
const RAZORPAY_KEY = "rzp_test_YourKeyHere";
```

Replace with:

```js
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;
```

---

### STEP 7 — Create `.gitignore`

Create a file called `.gitignore` in the root of your project and paste this:

```
# Secret keys — never commit
.env
.env.local
.env.production

# Dependencies
node_modules/

# Build output
/build

# Misc
.DS_Store
```

---

### STEP 8 — Test Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) and check:

- [ ] Landing page loads correctly
- [ ] Register a new account
- [ ] Login works and redirects to dashboard
- [ ] Add UPI ID in settings → QR generates
- [ ] Copy shareable link → open in new tab → QR appears with countdown
- [ ] Subscribe page loads → Razorpay modal opens

Test Razorpay payment with:
- Card: `4111 1111 1111 1111`
- Expiry: any future date
- CVV: any 3 digits

---

### STEP 9 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial QRFlow deploy"
```

Go to [github.com](https://github.com) → **New Repository** → name it `qrflow` → **Create repository**.

Then run these two commands (replace YOURUSERNAME):

```bash
git remote add origin https://github.com/YOURUSERNAME/qrflow.git
git branch -M main
git push -u origin main
```

---

### STEP 10 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → sign up with GitHub
2. Click **Add New Project** → import your `qrflow` repo
3. Framework: **Create React App** (auto-detected) ✅
4. **Before clicking Deploy** — open **Environment Variables** and add all 7:

| Key | Value |
|---|---|
| `REACT_APP_FIREBASE_API_KEY` | AIza... |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
| `REACT_APP_FIREBASE_PROJECT_ID` | your-project-id |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | 123456789 |
| `REACT_APP_FIREBASE_APP_ID` | 1:123456:web:abcdef |
| `REACT_APP_RAZORPAY_KEY` | rzp_test_xxxxxxxxxx |

5. Click **Deploy** → wait ~2 minutes
6. Your site is live at `qrflow.vercel.app` 🎉

---

### STEP 11 — Add Your Domain to Firebase

Without this, Firebase Auth blocks logins from your live site.

1. Firebase Console → **Authentication** → **Settings** tab
2. **Authorized Domains** → **Add Domain**
3. Type your Vercel URL: `qrflow.vercel.app`
4. Click **Add**

---

### STEP 12 — Final Live Test

Open your Vercel URL and verify:

- [ ] Register works on the live site
- [ ] Dashboard loads with correct user data
- [ ] UPI ID saves and QR generates
- [ ] Shareable link `/qr/uid` opens on a different phone
- [ ] Razorpay test payment completes → plan updates in dashboard

---

## 🔗 How the QR Link Works

Each business owner gets a unique permanent link:

```
yoursite.vercel.app/qr/{firebase-uid}
```

- Customer opens this link once — any phone, no app needed
- QR auto-refreshes every 5 minutes using a time-based token
- Token changes at the same time for everyone — synced to the clock
- Employees **never** send another QR manually

---

## 🔒 Security

- Firebase keys are safe in frontend apps — protection comes from Firestore Rules, not hidden keys
- Firestore Rules ensure users can only read/write their own data
- Never commit `.env` — it is listed in `.gitignore`
- Environment variables injected by Vercel at build time — never exposed in source code
- Each QR is time-bound — expired QRs cannot be reused

---

## 🛠 Going Live with Real Payments

When ready to charge real customers:

1. Complete Razorpay KYC at [razorpay.com](https://razorpay.com) — takes 1–2 business days
2. Razorpay Dashboard → switch to **Live Mode**
3. Generate **Live Key ID** — starts with `rzp_live_`
4. Vercel → Project Settings → Environment Variables
5. Update `REACT_APP_RAZORPAY_KEY` to your live key
6. Click **Redeploy**

Money from subscriptions lands directly in your linked bank account via Razorpay.

---

## 📞 Support

Built for Indian small businesses. For help, contact via your registered business email.
