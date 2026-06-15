# Changelog — Beyond The Shore

## [CP57–62] 2026-06-08 — Security & Quality Pass

### 🔴 Security Fixes
- `firebase.example.js`: replaced real API keys with placeholders
- `js/firebase.js`: updated Firestore Rules documentation (lockdown rules)
- `my-bookings.html`: added XSS escaping on all user-data innerHTML insertions

### 🟡 Booking System
- `js/app.js`: date selection is now required before booking submission
- `js/app.js`: minimum 1 guest enforced at submission
- `js/app.js`: date grid highlights with scroll+outline when date missing
- `js/app.js`: Firestore doc ID now saved in bts_my_bookings for status sync
- `admin/index.html`: updateBookingStatus() now syncs to localStorage bts_my_bookings
- `my-bookings.html`: added Refresh button

### 🟢 UX & SEO
- `sitemap.xml`: removed my-bookings.html (device-specific, no SEO value)
- `trip.html`: added JSON-LD structured data (TouristTrip schema)
- `booking.html`: added ARIA progressbar role
- `admin/index.html`: warning banner when default PIN still in use

## [CP-55] — Admin Dashboard Overhaul

### Added
- Booking Status system: Pending / Confirmed / Cancelled badges + action buttons per booking
- Status persists in Firestore (or localStorage for local-only bookings), updates DOM instantly
- Trip Edit modal: Duration, Group Size, Meeting Point, Highlights, Included, Not Included, Trip Options (label + price, dynamic add/remove)
- Subscribers section: table view + Export CSV (reads from `subscribers` Firestore collection)
- Analytics section (new sidebar item): Total Bookings, Confirmed, Pending, Active Trips, Subscribers, Top Trip cards
- Bookings toolbar: real-time Search by name/trip + Status filter dropdown
- Export Bookings CSV (respects active search + filter)
- Settings section: WhatsApp Number, Default Booking Message, Newsletter Greeting, Email Recipient, Maintenance Mode toggle — all saved to Firestore `config/siteSettings`

### Changed
- Stats section replaced with full Analytics dashboard (sidebar item: 📊 Analytics)
- Settings "coming soon" replaced with functional form backed by Firestore
- Trips section moved to second sidebar item (after Analytics)

### Fixed
- Trip options (label + price) now fully editable and persisted in Firestore
- localStorage bookings now correctly map `name/trip/date/contact` fields for admin display

## [CP-50] — Newsletter Subscribe + Remove Login/Register

### Added
- Newsletter subscribe section on home page (pill-style input, teal background)
- Newsletter subscribe input inside hamburger slide menu
- subscribeNewsletter() — saves to Firestore subscribers collection + EmailJS notification

### Removed
- Sign In / Register / Sign Out links from hamburger menu
- Auth rendering logic from navbar.html slide menu

---

## [CP-49] — Navbar Redesign + FAQ + My Bookings

### Added
- Hamburger slide-in menu replaces old navbar (Logo + Language button + ☰ only)
- Menu items: Home, Our Trips, Book a Trip, FAQ, My Bookings, Sign In/Register or Sign Out
- WhatsApp shortcut in hamburger menu
- FAQ page (faq.html) — accordion layout covering trips, booking, logistics, general
- My Bookings page (my-bookings.html) — shows bookings saved on this device
- Bookings auto-saved to localStorage on successful submission (last 20)

### Changed
- Login/Register now optional — accessible via hamburger menu only
- Booking flow no longer requires authentication
- Book Now button removed from navbar

### Fixed
- Auth guard removed from booking.html — guests can book without account

---

## [CP-48] — Booking Flow Fix

### Fixed
- Option selector moved to Step 2 (above calendar) — was incorrectly showing in Step 1
- Option selector hidden for trips without options (no layout gap)
- Booking summary now correctly reflects selected option and price after re-render
- Selected option preserved on re-render (month change, guest count change)
- templateParams now sends correct option label to EmailJS (not always first option)
- Admin email template updated to include all booking fields in formatted table

### Improved
- renderTripOptionSelector() respects previously selected option on re-render
- submitBooking() validates and confirms selectedOption before sending

---

## [CP-47] — Production Readiness Update

### Added
- EmailJS client confirmation template (clientTemplateId) — customers now receive booking confirmation email
- Email field now required for all contact methods (WhatsApp/Email/Both)
- Admin bookings panel now reads from Firestore (with localStorage fallback for legacy bookings)
- Quick-action buttons in admin: Email Client + WhatsApp direct links per booking
- Canonical tags added to index, trip, booking-dest pages
- Login brute-force rate limiting: max 5 attempts per 15 minutes (sessionStorage-based)

### Fixed
- XSS: fname/lname now escaped via esc() in updateSummary() and success panel
- XSS: selectedOption.label now escaped via esc() in updateSummary()
- Firestore bookings collection rules updated: allow create, deny read/update/delete
- reply_to field added to EmailJS templateParams for proper email threading
- Duplicate handleSearch() definition removed from app.js (second weaker definition was overwriting the first)
- booking.html initial contact-fields HTML now matches whatsapp template (email field present before JS hydration)

### Improved
- sitemap.xml lastmod updated to 2026-06-07
- README.md project structure updated to reflect new image filenames
- Images optimized: image_1.png + image_2.png (812 KB) → logo.webp + logo.png + apple-touch-icon.png (76 KB)

---

## [CP-46] — Full Security Audit Remediation FINAL

### Security — Critical Fixes
- Open Redirect fix: booking.html inline auth guard now stores only relative path (window.location.pathname)
- XSS fix: admin/index.html renderAdminTrips() now sanitizes all Firestore trip fields with escA()
- Added escA() helper function in admin panel for template-safe HTML escaping

### Security — High / Medium Fixes
- Register rate limit: max 5 registrations per hour per browser session (sessionStorage-based)
- Session expiry: auth sessions now expire after 7 days (expiresAt field in session object)
- currentUser() now validates session expiry and auto-clears expired sessions
- Booking localStorage capped at 200 entries to prevent storage overflow

### Improved
- handleSearch() function defined and wired — search bar now functional on index.html
- Search supports trip name, description, location, and tag matching with esc() sanitization
- Enter key on search input now triggers search
- CSP updated: frame-ancestors 'none' added to all pages (Clickjacking protection)
- sitemap.xml: <lastmod> added to all URLs for better SEO crawler support
- componentLoader.js: DOMParser-based parsing strips external script tags from components
- SETUP.md: mandatory git rm --cached steps added before first push
- CHANGELOG.md updated

---

## [CP-41] — Security Hardening FINAL

### Security
- XSS fix: all trip data fields now sanitized with esc() in trip.html
- Open Redirect fix: auth redirect now validates relative paths only in login.html and register.html
- Open Redirect fix: requireAuth() in auth.js now stores only relative paths
- Admin brute force protection: PIN locked for 15 minutes after 5 failed attempts
- Added SECURITY.md with pre-deployment checklist and Firebase rules
- Added auth.js warning comment documenting localStorage auth limitations

### Improved
- Firebase SDK upgraded from 9.23.0 to 10.14.1 (compat mode — no API changes)
- loading="lazy" added to trip hero image in trip.html
- .gitignore enhanced with additional secret file patterns
- CHANGELOG.md updated

---

## [CP-36] — Security & Polish Release

### Security
- Firebase and EmailJS config files excluded from version control
- Added XSS sanitization (esc() function) to all innerHTML insertions
- Added Content Security Policy meta tag to all HTML pages
- Bookings now saved to Firestore in addition to localStorage

### Fixed
- Email format validation added to booking form
- Admin PIN hash now has developer documentation comment

### Improved
- Dynamic OG meta tags on trip detail pages
- Removed static 5.0 ratings → replaced with "Verified Tour" badge
- Added loading="lazy" to trip card images
- componentLoader warns on file:// protocol
- Added apple-touch-icon to all pages
- README.md and SETUP.md added to repo
