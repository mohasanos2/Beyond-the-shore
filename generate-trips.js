/**
 * generate-trips.js — Beyond The Shore
 * بيجيب الرحلات من API وبيولّد صفحة HTML لكل رحلة
 * بنفس تصميم trip.html بالظبط
 *
 * Usage: node generate-trips.js
 * Output: trips/<id>.html
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const API_URL = 'https://beyond-the-shore-api.onrender.com';
const OUT_DIR = path.join(__dirname, 'trips');

// ── helpers ──────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function fetchJSON(url) {
  return new Promise((res, rej) => {
    https.get(url, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => { try { res(JSON.parse(d)); } catch(e) { rej(e); } });
    }).on('error', rej);
  });
}

// نفس الـ maps من api.js
function getIcon(id) {
  const m = { sataya:'🐬',hamata:'🏝️',coral:'🪸',abu:'🐢',mubarak:'🦭',luli:'🏖️',
               temples:'🏛️',balloon:'🎈',felucca:'⛵','luxor-market':'🛍️',
               abusimbel:'🗿',nilecruise:'🚢',nubian:'🏺' };
  return m[id] || '🌊';
}

function getBgGrad(id) {
  const m = {
    sataya:'linear-gradient(135deg,#0a4a6b,#0797A8)',
    hamata:'linear-gradient(135deg,#0e6655,#1a8a72)',
    coral:'linear-gradient(135deg,#1a6080,#0797A8)',
    abu:'linear-gradient(135deg,#1a5276,#148f77)',
    mubarak:'linear-gradient(135deg,#0b3d6b,#1560bd)',
    luli:'linear-gradient(135deg,#0d5c8a,#0797A8)',
    temples:'linear-gradient(135deg,#4a2800,#8b5e00)',
    balloon:'linear-gradient(135deg,#b34700,#e07800)',
    felucca:'linear-gradient(135deg,#0d3b6e,#1560bd)',
    'luxor-market':'linear-gradient(135deg,#6e2f0c,#c0682b)',
    abusimbel:'linear-gradient(135deg,#4a2800,#a05c00)',
    nilecruise:'linear-gradient(135deg,#1a1a5e,#4a4aaa)',
    nubian:'linear-gradient(135deg,#5d2e0c,#c0782b)',
  };
  return m[id] || 'linear-gradient(135deg,#0797A8,#0a4a6b)';
}

function getBadge(id) {
  const m = {
    sataya:'⭐ Most Popular', hamata:'🌿 Hidden Gem', coral:'🤿 Dive & Snorkel',
    abu:'🐢 Turtle Heaven', mubarak:'🦭 Dugong Bay', luli:'🌊 Pristine Beach',
    temples:'🏆 Best Seller', balloon:'✨ Once in a Lifetime', felucca:'🌅 Sunset Magic',
    abusimbel:'🗿 Ancient Wonder', nilecruise:'🍽️ Dinner Cruise', nubian:'🏺 Cultural Gem',
  };
  return m[id] || '⭐ Featured';
}

function getBgEmojiSet(id) {
  const m = {
    sataya:  ['🐬','🌊','🐟','🐠','🪸','⭐','🐬','🌊','🐡','🪸','🐬','💙'],
    hamata:  ['🏝️','🌊','🐢','🪸','🐠','🌴','🏝️','⭐','🐟','🌊','🦀','🌿'],
    coral:   ['🪸','🐠','🤿','🐟','🌊','🐡','🪸','⭐','🐬','🦈','🐙','💎'],
    abu:     ['🐢','🦭','🌊','🏖️','🐠','🪸','🐢','⭐','🌿','🐡','🌊','💚'],
    mubarak: ['🦭','🐢','🌊','🐠','🪸','⭐','🦭','💙','🐟','🌿','🦭','🌊'],
    luli:    ['🏖️','🌊','🐢','🪸','🐠','🌴','⭐','🏖️','🐟','🦜','🌊','💛'],
    temples: ['🏛️','🗿','🌅','⭐','🏺','🌙','🏛️','✨','🦅','🗿','🌅','🏺'],
    balloon: ['🎈','🌅','🏛️','⭐','✨','🌙','🎈','🌅','🏺','🌤️','🎈','🌟'],
    felucca: ['⛵','🌅','🌊','🌙','⭐','🏛️','⛵','💛','🌿','🌅','⛵','✨'],
    abusimbel:['🗿','🏺','🌅','⭐','🏛️','✨','🗿','🌙','🦅','🌅','🏺','💛'],
    nilecruise:['🚢','🌊','🏛️','🗿','⭐','🌅','🚢','✨','🏺','🌙','🚢','💙'],
    nubian:  ['🏘️','🌴','⛵','🌊','⭐','🎨','🏘️','🌅','🌿','🎭','🏘️','💛'],
  };
  return m[id] || ['🌊','⭐','🌿','🐠','🪸','✨','🌅','💙','🐟','🌊','⭐','🌿'];
}

function formatDest(loc) {
  if (!loc) return 'Egypt';
  if (/Marsa|Hamata|Abu Dabbab|Hankorab|Ghalib/i.test(loc)) return 'Marsa Alam';
  if (/Luxor|West Bank/i.test(loc)) return 'Luxor';
  if (/Aswan|Abu Simbel|Nubian/i.test(loc)) return 'Aswan';
  return 'Egypt';
}

// ── BUILD PAGE ────────────────────────────────────────────────────────────────

function buildPage(t, allTrips) {
  const icon    = getIcon(t.id);
  const bg      = getBgGrad(t.id);
  const badge   = t.badge || getBadge(t.id);
  const dest    = formatDest(t.location);
  const highlights = t.highlights || [];
  const includes   = t.includes   || [];
  const excludes   = t.excludes   || [];
  const itinerary  = t.itinerary  || [];
  const options    = t.options    || [];
  const ogImage    = (t.images && t.images[0]) || '';
  const priceDisplay = t.price ? `From $${t.price}` : '';
  const waMsg = encodeURIComponent(`Hi! I am interested in: ${t.name} (${priceDisplay}). Can you help me?`);

  const bgEmojis = getBgEmojiSet(t.id);

  // ── similar trips (max 3, بعيد عن نفسه) ──
  const similar = allTrips.filter(x => x.id !== t.id).slice(0, 3);
  const simHTML = similar.map(s => {
    const sIcon = getIcon(s.id);
    const sBg   = getBgGrad(s.id);
    const sPrice = s.price ? `From $${s.price}` : '';
    return `<a class="tp-sim-card" href="${esc(s.id)}.html">
      <div class="tp-sim-img" style="background:${esc(sBg)}">${sIcon}</div>
      <div class="tp-sim-body">
        <div class="tp-sim-name">${esc(s.name)}</div>
        <div class="tp-sim-price">${esc(sPrice)}</div>
      </div>
    </a>`;
  }).join('');

  // ── itinerary ──
  const itinInner = itinerary.length
    ? `<div class="tp-itinerary">${itinerary.map(item =>
        `<div class="tp-itin-item">
          <div class="tp-itin-time">${esc(item.time||'')}</div>
          <div class="tp-itin-dot"></div>
          <div class="tp-itin-body">
            <div class="tp-itin-title">${esc(item.title||'')}</div>
            ${item.desc ? `<div class="tp-itin-desc">${esc(item.desc)}</div>` : ''}
          </div>
        </div>`
      ).join('')}</div>`
    : `<div class="tp-itin-fallback">🗓️ Detailed itinerary coming soon.<br/>Contact us on WhatsApp for the full day program.</div>`;

  // ── options ──
  const optSection = options.length ? `
  <div class="tp-section" id="sec-options">
    <div class="tp-section-title">Choose Your Option</div>
    <div class="tp-options">
      ${options.map(o => `
      <div class="tp-option-card" onclick="window.location.href='../booking.html?bookid=${esc(t.id)}'">
        <div><div class="tp-option-label">${esc(o.label)}</div>
        ${o.duration ? `<div style="font-family:Outfit,sans-serif;font-size:.78rem;color:#aaa;margin-top:3px">${esc(o.duration)}</div>` : ''}
        </div><div class="tp-option-price">${esc(o.price)}</div>
      </div>`).join('')}
    </div>
  </div>` : '';

  // ── price display in bar ──
  const priceBarInner = options.length
    ? options.map(o => `<div style="margin:3px 0"><span class="tp-price-main">${esc(o.price)}</span><span class="tp-price-pp"> · ${esc(o.label)}</span></div>`).join('')
    : `<span class="tp-price-main">${esc(priceDisplay)}</span><span class="tp-price-pp"> / person</span>`;

  // ── nav tabs ──
  const navTabs = [
    `<button class="tp-nav-btn active" data-section="sec-overview" onclick="scrollToSection('sec-overview')">Overview</button>`,
    `<button class="tp-nav-btn" data-section="sec-itinerary" onclick="scrollToSection('sec-itinerary')">Itinerary</button>`,
    `<button class="tp-nav-btn" data-section="sec-includes" onclick="scrollToSection('sec-includes')">Includes</button>`,
    options.length ? `<button class="tp-nav-btn" data-section="sec-options" onclick="scrollToSection('sec-options')">Options</button>` : '',
    `<button class="tp-nav-btn" data-section="sec-similar" onclick="scrollToSection('sec-similar')">More Trips</button>`,
  ].filter(Boolean).join('');

  // ── details cards ──
  const detailCards = [
    t.duration   ? `<div class="tp-detail-card"><div class="tp-detail-label">Duration</div><div class="tp-detail-val">${esc(t.duration)}</div></div>` : '',
    t.location   ? `<div class="tp-detail-card"><div class="tp-detail-label">Location</div><div class="tp-detail-val">${esc(t.location)}</div></div>` : '',
    t.max_guests ? `<div class="tp-detail-card"><div class="tp-detail-label">Max Guests</div><div class="tp-detail-val">${esc(String(t.max_guests))}</div></div>` : '',
  ].filter(Boolean).join('');

  const bgEmojiSpans = bgEmojis.map(e => `<span class="bg-emoji">${e}</span>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; img-src 'self' data: https: blob:; font-src https://fonts.gstatic.com; connect-src 'self' https://bgkwvyjyjorzwtuircmf.supabase.co https://beyond-the-shore-api.onrender.com; frame-ancestors 'none';"/>
<meta name="theme-color" content="#0797A8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(t.name)} — Beyond The Shore</title>
<meta name="description" content="${esc(t.description ? t.description.slice(0,155) : `Book ${t.name} with Beyond The Shore. ${dest}, Egypt.`)}"/>
<meta name="keywords" content="${esc(t.name)}, ${esc(dest)}, Egypt tours, snorkeling, diving, Red Sea, Beyond The Shore"/>
<meta property="og:title" content="${esc(t.name)} — Beyond The Shore"/>
<meta property="og:description" content="${esc(t.description ? t.description.slice(0,155) : '')}"/>
<meta property="og:type" content="website"/>
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}"/>` : ''}
<meta property="og:url" content="https://mohasanos2.github.io/Beyond-the-shore/trips/${esc(t.id)}.html"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="canonical" href="https://mohasanos2.github.io/Beyond-the-shore/trips/${esc(t.id)}.html"/>
<link rel="icon" type="image/x-icon" href="../images/favicon.ico"/>
<link rel="apple-touch-icon" href="../images/apple-touch-icon.png"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="../css/style.css"/>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"TouristTrip",
  "name":"${esc(t.name)}",
  "description":"${esc(t.description||'')}",
  "provider":{"@type":"TravelAgency","name":"Beyond The Shore","url":"https://mohasanos2.github.io/Beyond-the-shore/"},
  "offers":{"@type":"Offer","price":"${esc(String(t.price||''))}","priceCurrency":"USD"}
}
</script>
<style>
/* ── TRIP PAGE STYLES ── */
.tp-hero{position:relative;width:100%;height:70vh;min-height:420px;max-height:600px;overflow:hidden;background:${bg}}
.tp-hero img{width:100%;height:100%;object-fit:cover;display:block}
.tp-hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.6) 100%)}
.tp-hero-content{position:absolute;bottom:0;left:0;right:0;padding:2.5rem 2rem 2rem;color:#fff}
.tp-hero-badge{display:inline-block;background:rgba(255,255,255,0.2);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:0.3rem 1rem;font-family:Outfit,sans-serif;font-size:0.78rem;font-weight:600;letter-spacing:0.05em;margin-bottom:0.75rem}
.tp-hero-name{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:600;line-height:1.15;margin-bottom:0.5rem}
.tp-hero-loc{font-family:Outfit,sans-serif;font-size:0.9rem;opacity:0.85}
.tp-hero-emoji{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:6rem}

.tp-nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-bottom:1px solid #e8e8e8;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch}
.tp-nav-inner{display:inline-flex;gap:0;padding:0 1rem;min-width:100%}
.tp-nav-btn{font-family:Outfit,sans-serif;font-size:0.82rem;font-weight:500;color:#888;padding:1rem 1.25rem;border:none;background:none;cursor:pointer;border-bottom:2px solid transparent;transition:color .2s,border-color .2s;white-space:nowrap}
.tp-nav-btn.active,.tp-nav-btn:hover{color:#0797A8;border-bottom-color:#0797A8}

.tp-body{max-width:860px;margin:0 auto;padding:0 1.25rem 8rem}

.tp-price-bar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;padding:1.5rem 0;border-bottom:1px solid #f0f0f0;margin-bottom:2rem}
.tp-price-main{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:600;color:#0797A8}
.tp-price-pp{font-family:Outfit,sans-serif;font-size:0.82rem;color:#888;margin-left:4px}
.tp-verified{display:inline-flex;align-items:center;gap:6px;background:rgba(7,151,168,0.08);color:#0797A8;border-radius:50px;padding:0.35rem 0.9rem;font-family:Outfit,sans-serif;font-size:0.78rem;font-weight:600}

.tp-section{padding:2rem 0;border-bottom:1px solid #f0f0f0}
.tp-section:last-child{border-bottom:none}
.tp-section-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:600;color:#1a1a2e;margin-bottom:1.25rem}

.tp-details{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.75rem;margin-bottom:0}
.tp-detail-card{background:#f8f9fa;border-radius:12px;padding:1rem;text-align:center}
.tp-detail-label{font-family:Outfit,sans-serif;font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#aaa;margin-bottom:0.35rem}
.tp-detail-val{font-family:Outfit,sans-serif;font-size:0.92rem;font-weight:600;color:#1a1a2e}

.tp-highlights{display:flex;flex-wrap:wrap;gap:0.5rem}
.tp-highlight-tag{background:rgba(7,151,168,0.08);color:#0797A8;border-radius:50px;padding:0.4rem 1rem;font-family:Outfit,sans-serif;font-size:0.82rem;font-weight:500}

.tp-itinerary{display:flex;flex-direction:column;gap:0}
.tp-itin-item{display:flex;gap:1.25rem;padding:1.25rem 0}
.tp-itin-item:not(:last-child){border-bottom:1px solid #f5f5f5}
.tp-itin-time{flex-shrink:0;width:72px;font-family:Outfit,sans-serif;font-size:0.8rem;font-weight:700;color:#0797A8;padding-top:2px}
.tp-itin-dot{flex-shrink:0;width:12px;height:12px;border-radius:50%;background:#0797A8;margin-top:5px;box-shadow:0 0 0 3px rgba(7,151,168,0.15)}
.tp-itin-body{flex:1}
.tp-itin-title{font-family:Outfit,sans-serif;font-size:0.95rem;font-weight:600;color:#1a1a2e;margin-bottom:0.25rem}
.tp-itin-desc{font-family:Outfit,sans-serif;font-size:0.84rem;color:#888;line-height:1.5}
.tp-itin-fallback{background:#f8f9fa;border-radius:14px;padding:1.5rem;text-align:center;color:#aaa;font-family:Outfit,sans-serif;font-size:0.88rem}

.tp-inc-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
@media(max-width:540px){.tp-inc-grid{grid-template-columns:1fr}}
.tp-inc-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.6rem}
.tp-inc-list li{font-family:Outfit,sans-serif;font-size:0.88rem;color:#444;display:flex;align-items:flex-start;gap:0.5rem;line-height:1.5}
.tp-inc-list li span.icon{flex-shrink:0;margin-top:1px}

.tp-options{display:flex;flex-direction:column;gap:0.75rem}
.tp-option-card{border:2px solid #e8e8e8;border-radius:12px;padding:1rem 1.25rem;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:border-color .2s,background .2s}
.tp-option-card:hover{border-color:#0797A8;background:rgba(7,151,168,0.04)}
.tp-option-label{font-family:Outfit,sans-serif;font-size:0.92rem;font-weight:600;color:#1a1a2e}
.tp-option-price{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600;color:#0797A8}

.tp-similar{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem}
.tp-sim-card{border:1px solid #e8e8e8;border-radius:14px;overflow:hidden;cursor:pointer;transition:transform .2s,box-shadow .2s;text-decoration:none;display:block}
.tp-sim-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.1)}
.tp-sim-img{height:120px;display:flex;align-items:center;justify-content:center;font-size:2.5rem}
.tp-sim-body{padding:0.85rem 1rem}
.tp-sim-name{font-family:Outfit,sans-serif;font-size:0.88rem;font-weight:600;color:#1a1a2e;margin-bottom:0.25rem}
.tp-sim-price{font-family:Outfit,sans-serif;font-size:0.8rem;color:#0797A8;font-weight:600}

.tp-cta-bar{position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.97);backdrop-filter:blur(12px);border-top:1px solid #e8e8e8;padding:0.85rem 1.25rem;display:flex;gap:0.75rem;align-items:center}
.tp-cta-wa{flex:1;display:flex;align-items:center;justify-content:center;gap:0.5rem;background:#25D366;color:#fff;border:none;border-radius:50px;padding:0.85rem 1rem;font-family:Outfit,sans-serif;font-size:0.88rem;font-weight:600;cursor:pointer;text-decoration:none;transition:opacity .2s}
.tp-cta-wa:hover{opacity:0.9}
.tp-cta-book{flex:2;display:flex;align-items:center;justify-content:center;gap:0.5rem;background:#0797A8;color:#fff;border:none;border-radius:50px;padding:0.85rem 1rem;font-family:Outfit,sans-serif;font-size:0.88rem;font-weight:600;cursor:pointer;text-decoration:none;transition:opacity .2s}
.tp-cta-book:hover{opacity:0.9}
</style>
</head>
<body>

<div class="bg-emojis">${bgEmojiSpans}</div>

<div id="navbar-component"></div>

<div id="trip-page">
  <div id="trip-content">

    <!-- HERO -->
    <div class="tp-hero">
      ${ogImage
        ? `<img src="${esc(ogImage)}" alt="${esc(t.name)}" onerror="this.style.display='none';this.nextSibling.style.display='flex'"/><div class="tp-hero-emoji" style="display:none;position:absolute;inset:0;background:${bg}">${icon}</div>`
        : `<div class="tp-hero-emoji" style="background:${bg}">${icon}</div>`
      }
      <div class="tp-hero-overlay"></div>
      <div class="tp-hero-content">
        <div class="tp-hero-badge">${esc(badge)}</div>
        <div class="tp-hero-name">${esc(t.name)}</div>
        <div class="tp-hero-loc">📍 ${esc(t.location || dest + ', Egypt')}</div>
      </div>
    </div>

    <!-- STICKY NAV -->
    <nav class="tp-nav">
      <div class="tp-nav-inner">
        ${navTabs}
      </div>
    </nav>

    <!-- BODY -->
    <div class="tp-body">
      <a href="../index.html" style="display:inline-block;margin:1.25rem 0 0.5rem;font-family:Outfit,sans-serif;font-size:0.85rem;color:#aaa;text-decoration:none">← All Trips</a>

      <!-- PRICE BAR -->
      <div class="tp-price-bar">
        <div><span class="tp-verified">✓ Verified Tour</span></div>
        <div>${priceBarInner}</div>
      </div>

      <!-- OVERVIEW -->
      <div class="tp-section" id="sec-overview">
        <p style="font-family:Outfit,sans-serif;font-size:1rem;color:#555;line-height:1.75;margin-bottom:1.5rem">${esc(t.description||'')}</p>
        <div class="tp-details">${detailCards}</div>
        ${highlights.length ? `<div style="margin-top:1.25rem"><div class="tp-highlights">${highlights.map(h=>`<span class="tp-highlight-tag">${esc(h)}</span>`).join('')}</div></div>` : ''}
      </div>

      <!-- ITINERARY -->
      <div class="tp-section" id="sec-itinerary">
        <div class="tp-section-title">Day Itinerary</div>
        ${itinInner}
      </div>

      <!-- INCLUDES / EXCLUDES -->
      <div class="tp-section" id="sec-includes">
        <div class="tp-section-title">What's Included</div>
        <div class="tp-inc-grid">
          <div>
            <div style="font-family:Outfit,sans-serif;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#3DB85C;margin-bottom:0.75rem">✓ Included</div>
            <ul class="tp-inc-list">
              ${includes.map(i=>`<li><span class="icon">✅</span>${esc(i)}</li>`).join('')}
            </ul>
          </div>
          ${excludes.length ? `
          <div>
            <div style="font-family:Outfit,sans-serif;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#e05c3a;margin-bottom:0.75rem">✗ Not Included</div>
            <ul class="tp-inc-list">
              ${excludes.map(i=>`<li><span class="icon">❌</span>${esc(i)}</li>`).join('')}
            </ul>
          </div>` : ''}
        </div>
      </div>

      <!-- OPTIONS -->
      ${optSection}

      <!-- SIMILAR TRIPS -->
      <div class="tp-section" id="sec-similar">
        <div class="tp-section-title">You Might Also Like</div>
        <div class="tp-similar">${simHTML}</div>
      </div>
    </div>

    <!-- STICKY CTA -->
    <div class="tp-cta-bar">
      <a class="tp-cta-wa" href="https://wa.me/201037420949?text=${waMsg}">💬 WhatsApp</a>
      <a class="tp-cta-book" href="../booking.html?bookid=${esc(t.id)}">📋 Book Now</a>
    </div>

  </div>
</div>

<div id="footer-component"></div>
<div id="whatsapp-component"></div>

<script>
function scrollToSection(sid){
  const el=document.getElementById(sid);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
  document.querySelectorAll('.tp-nav-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.querySelector('[data-section="'+sid+'"]');
  if(btn) btn.classList.add('active');
}
window.addEventListener('scroll',()=>{
  const secs=['sec-overview','sec-itinerary','sec-includes','sec-options','sec-similar'];
  let cur=secs[0];
  secs.forEach(s=>{const el=document.getElementById(s);if(el&&window.scrollY>=el.offsetTop-120)cur=s;});
  document.querySelectorAll('.tp-nav-btn').forEach(b=>{b.classList.toggle('active',b.getAttribute('data-section')===cur);});
  const nav=document.getElementById('nav');
  if(nav) nav.classList.toggle('scrolled',scrollY>40);
},{passive:true});
</script>
<script src="../js/config.js"></script>
<script src="../js/componentLoader.js"></script>
</body>
</html>`;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Fetching trips from API…');
  let trips;
  try {
    trips = await fetchJSON(`${API_URL}/api/trips`);
    console.log(`✅ Got ${trips.length} trips`);
  } catch(e) {
    console.error('❌ Failed to fetch trips:', e.message);
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let count = 0;
  for (const t of trips) {
    if (!t.is_active) continue;
    const html = buildPage(t, trips.filter(x => x.is_active));
    const outPath = path.join(OUT_DIR, `${t.id}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`  ✓ ${t.id}.html — ${t.name}`);
    count++;
  }

  console.log(`\n🎉 Generated ${count} pages in /trips/`);
  console.log('📁 Next: git add trips/ && git commit -m "fix: rebuild static trip pages with full design" && git pull --rebase && git push');
}

main();
