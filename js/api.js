/**
 * api.js — Beyond The Shore
 * بيكلم Supabase مباشرة من غير backend
 */

const SUPABASE_URL = (window.BTS_CONFIG && window.BTS_CONFIG.SUPABASE_URL) || 'https://bgkwvyjyjorzwtuircmf.supabase.co';
const API_URL      = (window.BTS_CONFIG && window.BTS_CONFIG.API_URL)      || 'https://beyond-the-shore-api.onrender.com';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJna3d2eWp5am9yend0dWlyY21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Mzg0MjQsImV4cCI6MjA5NjUxNDQyNH0.Bj0bzV_ZfZev5ewZE6si33ss89CwaCbLuViEAEPkw8Q';

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.method === 'POST' ? 'return=representation' : '',
      ...options.headers
    },
    ...options
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

const TripsAPI = {
  getAll: () => sbFetch("trips?select=*,icon,badge,bg_gradient&is_active=eq.true&order=created_at.asc"),
  // getById: (id) => sbFetch(`trips?select=*,icon,badge,bg_gradient&id=eq.${id}`).then(r => r[0]) // No longer needed for SSR
};

const BookingsAPI = {
  create: (data) => fetch(API_URL + '/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getById: (id) => sbFetch(`bookings?id=eq.${id}`).then(r => r[0])
};

const ReviewsAPI = {
  getByTripId: (tripId) => fetch(`${API_URL}/api/reviews/${tripId}`).then(r => r.json()),
  create: (data) => fetch(`${API_URL}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => {
    if (!r.ok) return r.json().then(e => { throw new Error(e.error || 'Failed to submit review'); });
    return r.json();
  })
};



const AdminAPI = {
  isAuthenticated: () => !!localStorage.getItem('bts_admin_token'),
  getSession: () => localStorage.getItem('bts_admin_token'),
  logout: () => localStorage.removeItem('bts_admin_token'),
  saveSession: (token) => localStorage.setItem('bts_admin_token', token),

  adminFetch: async function(path, options = {}) {
    const token = this.getSession();
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  login: async (pin) => {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Invalid PIN'); }
    return res.json();
  },

  getBookings: () => AdminAPI.adminFetch('/api/admin/bookings'),
  updateBooking: (id, data) => AdminAPI.adminFetch(`/api/admin/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateTrip: (id, data) => AdminAPI.adminFetch(`/api/admin/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrip: (id) => AdminAPI.adminFetch(`/api/admin/trips/${id}`, { method: 'DELETE' }),
  getSubscribers: () => AdminAPI.adminFetch('/api/admin/subscribers'),
  getAnalytics: () => AdminAPI.adminFetch('/api/admin/analytics')
};

async function initTripsData() {
  try {
    const trips = await TripsAPI.getAll();
    window.allTrips = { marsa: [], luxor: [], aswan: [] };

    trips.forEach(t => {
      const trip = {
        id: t.id,
        name: t.name,
        loc: t.location,
        icon: t.icon || getIcon(t.id),
        bg: getBg(t.id),
        bgGrad: t.bg_gradient || getBgGrad(t.id),
        badge: t.badge || getBadge(t.id),
        price: `From $${t.price}`,
        priceNum: parseFloat(t.price) || 0,
        desc: t.description,
        tags: t.category || [],
        tagLabels: t.highlights || [],
        includes: t.includes || [],
        excludes: t.excludes || [],
        itinerary: t.itinerary || [],
        options: t.options || null,
        details: [
          { l: 'Duration', v: t.duration || 'Full Day' },
          { l: 'Location', v: t.location },
          { l: 'Max Guests', v: t.max_guests || 12 }
        ],
        disc: null,
        oldP: null
      };

      if (t.location && (t.location.includes('Marsa') || t.location.includes('Hamata') || t.location.includes('Abu Dabbab') || t.location.includes('Hankorab') || t.location.includes('Ghalib'))) {
        window.allTrips.marsa.push(trip);
      } else if (t.location && (t.location.includes('Luxor') || t.location.includes('West Bank'))) {
        window.allTrips.luxor.push(trip);
      } else if (t.location && (t.location.includes('Aswan') || t.location.includes('Abu Simbel') || t.location.includes('Nubian'))) {
        window.allTrips.aswan.push(trip);
      } else {
        window.allTrips.marsa.push(trip);
      }
    });

    window.trips = window.allTrips.marsa;
    window.activeDest = 'marsa';
    return window.allTrips;
  } catch (err) {
    console.error('[Supabase] Failed to load trips:', err);
    if (window.allTrips) return window.allTrips;
    return { marsa: [], luxor: [], aswan: [] };
  }
}

function getIcon(id) {
  const icons = { sataya:'🐬',hamata:'🏝️',coral:'🪸',abu:'🐢',mubarak:'🦭',luli:'🏖️',temples:'🏛️',balloon:'🎈',felucca:'⛵','luxor-market':'🛍️',abusimbel:'🗿',nilecruise:'🚢',nubian:'🏺' };
  return icons[id] || '🌊';
}
function getBg(id) {
  const bgs = { sataya:'c-teal',hamata:'c-sun',coral:'c-green',abu:'c-coral',mubarak:'c-blue',luli:'c-purple',temples:'c-gold',balloon:'c-orange',felucca:'c-rose','luxor-market':'c-sun',abusimbel:'c-gold',nilecruise:'c-blue',nubian:'c-coral' };
  return bgs[id] || 'c-teal';
}
function getBgGrad(id) {
  const grads = { sataya:'linear-gradient(135deg,#9EE8F0,#2BBFCF)',hamata:'linear-gradient(135deg,#FFE0B2,#F4A535)',coral:'linear-gradient(135deg,#B8F0C0,#3DB85C)',abu:'linear-gradient(135deg,#FFD0C0,#E05C3A)',mubarak:'linear-gradient(135deg,#C0DEFF,#4A90D9)',luli:'linear-gradient(135deg,#E0D4FF,#9B7FE8)',temples:'linear-gradient(135deg,#FFE9A0,#D4A017)',balloon:'linear-gradient(135deg,#FFD0A0,#F4722A)',felucca:'linear-gradient(135deg,#FFD6E0,#E05C8A)',abusimbel:'linear-gradient(135deg,#FFE9A0,#D4A017)',nilecruise:'linear-gradient(135deg,#C0DEFF,#4A90D9)',nubian:'linear-gradient(135deg,#FFD0C0,#E05C3A)' };
  return grads[id] || 'linear-gradient(135deg,#9EE8F0,#2BBFCF)';
}
function getBadge(id) {
  const badges = { sataya:'⭐ Most Popular',hamata:'🌿 Hidden Gem',coral:'🤿 Dive & Snorkel',abu:'🐢 Turtle Heaven',mubarak:'🦭 Dugong Bay',luli:'🌊 Pristine Beach',temples:'🏆 Best Seller',balloon:'✨ Once in a Lifetime',felucca:'🌅 Sunset Magic',abusimbel:'🗿 Ancient Wonder',nilecruise:'🍽️ Dinner Cruise',nubian:'🏺 Cultural Gem' };
  return badges[id] || '⭐ Featured';
}
function findTrip(id) {
  const all = [...(window.allTrips?.marsa||[]),...(window.allTrips?.luxor||[]),...(window.allTrips?.aswan||[])];
  return all.find(t => t.id === id) || null;
}

// window.findTrip = findTrip; // No longer needed for SSR
window.initTripsData = initTripsData;
window.TripsAPI = TripsAPI;
window.BookingsAPI = BookingsAPI;
window.AdminAPI = AdminAPI;
window.ReviewsAPI = ReviewsAPI;
