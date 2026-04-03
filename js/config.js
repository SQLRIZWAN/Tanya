// ============================================================
//  ShopWorld — Configuration
//  Fill in your credentials below before going live
// ============================================================

const CONFIG = {

  // ── Firebase (Realtime DB / Firestore / Auth) ─────────────
  firebase: {
    apiKey:            "",          // e.g. "AIzaSy..."
    authDomain:        "",          // e.g. "shopworld.firebaseapp.com"
    projectId:         "",          // e.g. "shopworld-app"
    storageBucket:     "",          // e.g. "shopworld-app.appspot.com"
    messagingSenderId: "",          // e.g. "123456789"
    appId:             "",          // e.g. "1:123:web:abc"
    databaseURL:       "",          // e.g. "https://shopworld-default-rtdb.firebaseio.com"
  },

  // ── Cloudinary (image upload / rockyou wordlist store) ────
  cloudinary: {
    cloudName:   "",                // e.g. "shopworld"
    apiKey:      "",                // e.g. "123456789"
    apiSecret:   "",                // e.g. "AbCdEf..."
    uploadPreset: "",               // e.g. "shopworld_unsigned"
  },

  // ── UPI Payment ───────────────────────────────────────────
  upi: {
    id:   "9536483433@ptaxis",
    name: "ShopWorld",
  },

  // ── App Settings ──────────────────────────────────────────
  currency: "₹",
  deliveryFee: 0,                   // Free delivery
  minFreeDelivery: 0,
  orderPrefix: "SW",
};
