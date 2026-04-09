# ⬡ QRFlow

Auto-refreshing payment QR SaaS for Indian small businesses.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase
1. Go to https://firebase.google.com → Create a new project
2. Enable **Authentication** → Sign-in method → **Email/Password**
3. Enable **Firestore Database** → Start in production mode
4. Go to Project Settings → Your Apps → Add Web App
5. Copy your config into `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

6. Add this Firestore security rule:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Set up Razorpay
1. Sign up at https://razorpay.com
2. Go to Settings → API Keys → Generate Test Key
3. Copy your **Key ID** into `src/pages/Subscribe.js`:
```js
const RAZORPAY_KEY = "rzp_test_YourActualKeyHere";
```
4. When going live, switch to your Live Key ID

### 4. Run locally
```bash
npm start
```
App runs at http://localhost:3000

### 5. Deploy to Vercel (free)
```bash
npm run build
```
Then go to https://vercel.com → New Project → Upload the `/build` folder
OR connect your GitHub repo and Vercel auto-deploys on every push.

---

## 📁 Project Structure

```
src/
├── firebase.js              # Firebase config (fill in your keys)
├── index.js                 # React entry point
├── App.js                   # Routes
├── index.css                # Global styles
├── context/
│   └── AuthContext.js       # Auth state, login, register, logout
├── components/
│   ├── Navbar.js            # Top navigation
│   ├── Navbar.css
│   └── PrivateRoute.js      # Blocks unauthenticated access
└── pages/
    ├── Landing.js / .css    # Homepage
    ├── Register.js / .css   # Sign up
    ├── Login.js             # Login
    ├── Auth.css             # Shared auth styles
    ├── Dashboard.js / .css  # Business owner dashboard
    ├── Subscribe.js / .css  # Razorpay subscription
    └── PublicQR.js / .css   # Customer-facing QR page
```

---

## 💰 Business Model

| Plan     | Price       | Features                          |
|----------|-------------|-----------------------------------|
| Starter  | ₹500/month  | 1 QR link, auto-refresh, sharing  |
| Pro      | ₹1500/month | 3 links, custom interval, branding|

---

## 🔗 How the QR Link Works

- Each business gets a unique link: `yoursite.com/qr/{uid}`
- Customers open this once — QR auto-updates every 5 minutes
- No app download needed
- Employees never manually send a QR again

---

## 📞 Support
Built for Indian small businesses. Contact via your business email.
