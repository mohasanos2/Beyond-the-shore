/**
 * Firebase Configuration — Beyond The Shore
 * SETUP: Copy this file → rename to firebase.js → fill in your values
 * Get values from: https://console.firebase.google.com → Your Project → Project Settings → Web App
 */
const FIREBASE_CONFIG = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID"
};

window.FirebaseDB = (function() {
  const isConfigured = FIREBASE_CONFIG.apiKey !== "REPLACE_WITH_YOUR_API_KEY";
  if (!isConfigured) {
    console.info('[Firebase] Config not set — using local data.');
    return null;
  }
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    const db = firebase.firestore();
    console.info('[Firebase] Connected.');
    return db;
  } catch(e) {
    console.warn('[Firebase] Init failed:', e.message);
    return null;
  }
})();

window.loadTripsFromFirebase = async function() {
  if (!window.FirebaseDB) return null;
  try {
    const snap = await window.FirebaseDB.collection('trips').get();
    if (snap.empty) return null;
    const result = { marsa: [], luxor: [], aswan: [] };
    snap.forEach(doc => {
      const data = doc.data();
      const dest = data.destination;
      if (result[dest]) result[dest].push({ id: doc.id, ...data });
    });
    const hasData = Object.values(result).some(arr => arr.length > 0);
    return hasData ? result : null;
  } catch(e) {
    console.warn('[Firebase] Load trips failed:', e.message);
    return null;
  }
};

window.saveTripToFirebase = async function(tripId, tripData) {
  if (!window.FirebaseDB) return false;
  try {
    await window.FirebaseDB.collection('trips').doc(tripId).set(tripData);
    return true;
  } catch(e) {
    console.warn('[Firebase] Save trip failed:', e.message);
    return false;
  }
};

window.deleteTripFromFirebase = async function(tripId) {
  if (!window.FirebaseDB) return false;
  try {
    await window.FirebaseDB.collection('trips').doc(tripId).delete();
    return true;
  } catch(e) {
    console.warn('[Firebase] Delete trip failed:', e.message);
    return false;
  }
};

window.uploadTripImage = async function(file, tripId) {
  if (!FIREBASE_CONFIG || FIREBASE_CONFIG.apiKey === 'REPLACE_WITH_YOUR_API_KEY') return null;
  try {
    const storage = firebase.storage();
    const ref = storage.ref('trips/' + tripId + '_' + Date.now());
    const snap = await ref.put(file);
    const url = await snap.ref.getDownloadURL();
    return url;
  } catch(e) {
    console.warn('[Firebase] Image upload failed:', e.message);
    return null;
  }
};

window.saveBookingToFirebase = async function(bookingData) {
  if (!window.FirebaseDB) return null;
  try {
    const ref = await window.FirebaseDB.collection('bookings').add({
      ...bookingData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  } catch(e) {
    console.warn('[Firebase] Save booking failed:', e.message);
    return null;
  }
};
