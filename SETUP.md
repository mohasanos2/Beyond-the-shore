# ⚙️ Setup Guide — Beyond The Shore

## ⚠️ MANDATORY — Before First Git Push

Run these commands ONCE before `git push` to ensure secret files are not tracked:

```bash
# Step 1 — Remove secret files from git index (keeps files on disk)
git rm --cached js/firebase.js 2>/dev/null || true
git rm --cached js/emailjs-config.js 2>/dev/null || true

# Step 2 — Verify gitignore is working
git check-ignore -v js/firebase.js
git check-ignore -v js/emailjs-config.js
# Both should show: .gitignore:X:js/firebase.js   js/firebase.js

# Step 3 — Confirm nothing sensitive is staged
git diff --cached | grep -i "apiKey\|publicKey\|serviceId"
# Expected: empty output

# Step 4 — Safe to push
git add .
git commit -m "Initial deployment"
git push
```

---

## First-time setup (required before running locally or deploying)

### 1. Firebase
```bash
cp js/firebase.example.js js/firebase.js
```
Then open `js/firebase.js` — the real config values are already filled in.
Project: beyond-the-shore-8c708 | Console: https://console.firebase.google.com

### 2. EmailJS
```bash
cp js/emailjs-config.example.js js/emailjs-config.js
```
Then open `js/emailjs-config.js` — the real values are already filled in.
Dashboard: https://dashboard.emailjs.com

**After creating the client confirmation template in EmailJS:**
Add `clientTemplateId: 'template_XXXXXXX'` to `js/emailjs-config.js`.
See PLAN-BeyondTheShore.md → Phase 2 for full template content.

**Important:** In EmailJS dashboard → Account → API Keys → add your domain
to the allowed domains list to prevent abuse.

### 3. Firestore Security Rules
In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/{tripId} {
      allow read: if true;
      allow write: if false;
    }
    match /bookings/{bookingId} {
      allow read: if false;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

## Running locally
Use a local server (not file://):
- VS Code: Install "Live Server" extension → Right-click index.html → Open with Live Server
- Or: `npx serve .`
