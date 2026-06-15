# 🌊 Beyond The Shore

> Premium travel experiences in Marsa Alam, Luxor & Aswan — dolphins, snorkeling, island tours and Nile cruises.

**Live site:** https://mohasanos2.github.io/Beyond-the-shore/

---

## 🗂️ Project Structure

    ├── index.html              # Main landing page
    ├── booking.html            # 3-step booking flow
    ├── booking-dest.html       # Destination selector
    ├── trip.html               # Individual trip detail page
    ├── login.html              # User login
    ├── register.html           # User registration
    ├── 404.html                # Custom 404 page
    ├── admin/
    │   └── index.html          # Admin dashboard (PIN-protected)
    ├── components/
    │   ├── navbar.html         # Shared navigation
    │   ├── footer.html         # Shared footer
    │   └── whatsapp.html       # WhatsApp floating button
    ├── css/
    │   └── style.css           # Global stylesheet
    ├── js/
    │   ├── app.js              # Core application logic
    │   ├── data.js             # Trip data (local fallback)
    │   ├── firebase.js         # Firebase config & helpers (⚠️ not committed)
    │   ├── firebase.example.js # Template for firebase.js
    │   ├── emailjs-config.js   # EmailJS config (⚠️ not committed)
    │   ├── emailjs-config.example.js # Template for emailjs-config.js
    │   ├── auth.js             # User auth (localStorage-based)
    │   ├── booking-router.js   # Booking navigation module
    │   └── componentLoader.js  # Loads shared HTML components
    ├── images/
    │   ├── logo.webp           # Logo — header/footer (28 KB)
    │   ├── logo.png            # Logo — OG meta / fallback (22 KB)
    │   ├── apple-touch-icon.png # iOS home screen icon (24 KB)
    │   └── favicon.ico
    ├── sitemap.xml
    ├── robots.txt
    └── SETUP.md                # First-time setup guide

---

## ⚙️ Setup

See **SETUP.md** for step-by-step instructions to configure Firebase and EmailJS.

**Quick start (local dev):**
1. `cp js/firebase.example.js js/firebase.js` — config values pre-filled
2. `cp js/emailjs-config.example.js js/emailjs-config.js` — config values pre-filled
3. Open with Live Server (VS Code) or `npx serve .`

> ⚠️ Never commit `js/firebase.js` or `js/emailjs-config.js` — they are in `.gitignore`

---

## 🚀 Deploy to GitHub Pages

1. Push to `main` branch (ensure `firebase.js` and `emailjs-config.js` are NOT committed)
2. GitHub → Settings → Pages → Source: `main` / `root`
3. Site will be live at `https://mohasanos2.github.io/Beyond-the-shore/`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Database | Firebase Firestore (beyond-the-shore-8c708) |
| Storage | Firebase Storage |
| Email | EmailJS (service_0zc6kfh) |
| Auth | localStorage + SHA-256 hashing |
| Hosting | GitHub Pages |

---

## 🔐 Security Notes

- Firebase keys are excluded from version control via `.gitignore`
- Firestore rules restrict all writes by default
- EmailJS domain restriction should be set in the EmailJS dashboard
- Admin panel uses client-side PIN protection (suitable for static hosting)

---

## 📞 Contact

**Beyond The Shore** — beyondtheshore.egypt@gmail.com
