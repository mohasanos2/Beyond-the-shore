# Security Guide — Beyond The Shore

## ⚠️ CRITICAL: Firestore Rules

Before going live, you MUST update Firestore Security Rules.
The rules required are documented at the top of `js/firebase.js`.

Current rules (allow read/write: if true) are DEVELOPMENT ONLY.
They expose all booking data (names, emails, phone numbers) to anyone.

Status: [ ] Rules updated in Firebase Console

## Before Pushing to GitHub (Mandatory Checklist)

### ⚠️ Step 1 — Remove Secret Files from Git Tracking

If you have ever run `git add .` before setting up `.gitignore`, run:

```bash
git rm --cached js/firebase.js
git rm --cached js/emailjs-config.js
git status
# Confirm both files appear as "deleted" (they stay on disk, just not tracked)
```

### ⚠️ Step 2 — Verify .gitignore is Working

```bash
git check-ignore -v js/firebase.js
# Expected output: .gitignore:XX:js/firebase.js   js/firebase.js
git check-ignore -v js/emailjs-config.js
# Expected output: .gitignore:XX:js/emailjs-config.js   js/emailjs-config.js
```

### ⚠️ Step 3 — Verify No Secrets in Staged Files

```bash
git diff --cached | grep -i "apiKey\|publicKey\|serviceId"
# Expected: no output (empty)
```

---

## Firebase Security Rules

Set these rules in Firebase Console before going live:

### Firestore Rules (Console → Firestore → Rules)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/{tripId} {
      allow read: if true;
      allow write: if false;
    }
    match /bookings/{bookingId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

### Storage Rules (Console → Storage → Rules)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /trips/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## Authentication System Notice

The login/register system in `js/auth.js` stores user data in **localStorage**.
This is a **demo/prototype system** — not suitable for production with real users.

For production: migrate to Firebase Authentication or a proper backend.

---

## Admin Panel Security

- Admin PIN is stored as SHA-256 hash (not plaintext)
- Session expires after 30 minutes of inactivity
- Brute force protection: locked for 15 minutes after 5 failed attempts
- Admin panel is excluded from search engines via `robots.txt`
- **Change the default PIN before deploying** — generate new hash at:
  https://emn178.github.io/online-tools/sha256.html

---

## Content Security Policy

All pages include a CSP meta tag that:
- Restricts scripts to known CDN domains only
- Blocks inline event handlers from external sources
- Restricts image sources to HTTPS and data URIs only
- Blocks connections to unknown domains

---

## Reporting Security Issues

If you discover a security vulnerability, please contact:
beyondtheshore.egypt@gmail.com

Do not open a public GitHub issue for security vulnerabilities.
