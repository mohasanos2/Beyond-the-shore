// ── DATA ──
// ── ALL TRIPS BY DESTINATION ──
const allTrips={
  marsa:[
    {id:'sataya',name:'Sataya — Dolphin House',loc:'Hamata, Marsa Alam',
     icon:'🐬',bg:'c-teal',bgGrad:'linear-gradient(135deg,#9EE8F0,#2BBFCF)',
     badge:'⭐ Most Popular',disc:null,oldP:null,price:'From $65',priceNum:65,
     desc:'Swim alongside wild spinner dolphins in their natural lagoon. A 45 km reef teeming with dolphins, turtles, and vibrant coral.',
     tags:['snorkeling','dolphins'],tagLabels:['Snorkeling','Dolphins','Full Day','Overnight'],
     options:[
       {label:'Day Trip',duration:'1 Day',price:'From $65',priceNum:65},
       {label:'Overnight',duration:'2 Days / 1 Night',price:'From $110',priceNum:110},
     ],
     details:[{l:'Duration',v:'8 hrs / Overnight'},{l:'Departure',v:'Hamata Marina'},{l:'Level',v:'All Levels'},{l:'Group',v:'Small Groups'}],
     includes:['Snorkeling Equipment','Life Jacket','Lunch','Soft Drinks','Hotel Transfer','Guide'],
     extra:'⚠️ Marine Park fee: €2/person (cash on boat)'},
    {id:'hamata',name:'Hamata Islands',loc:'Hamata National Park',
     icon:'🏝️',bg:'c-sun',bgGrad:'linear-gradient(135deg,#FFE0B2,#F4A535)',
     badge:'🌿 Hidden Gem',disc:null,oldP:null,price:'From $70',priceNum:70,
     desc:'Three untouched virgin islands in a protected national park. Corals and marine life found nowhere else in the Red Sea.',
     tags:['snorkeling','islands'],tagLabels:['Snorkeling','3 Islands','Full Day','Nature'],
     details:[{l:'Duration',v:'Full Day'},{l:'Departure',v:'Hamata Marina'},{l:'Level',v:'All Levels'},{l:'Stops',v:'3 Island Stops'}],
     includes:['Snorkeling Equipment','Lunch','Hotel Transfer','Guide','Park Entry'],
     extra:'⚠️ National Park fee: €10/person (cash)'},
    {id:'coral',name:'Coral Garden',loc:'Marsa Alam Reef',
     icon:'🪸',bg:'c-green',bgGrad:'linear-gradient(135deg,#B8F0C0,#3DB85C)',
     badge:'🤿 Dive & Snorkel',disc:'-8%',oldP:'$65',price:'From $60',priceNum:60,
     desc:"Also known as Meteorite Reef — a vast calm lagoon with three stops: Mekky's Room, Alam Reefs, and a fascinating shipwreck.",
     tags:['snorkeling','diving'],tagLabels:['Snorkeling','Diving','Shipwreck','Dolphins'],
     details:[{l:'Duration',v:'8 hours'},{l:'Departure',v:'Marsa Alam Marina'},{l:'Level',v:'All Levels'},{l:'Stops',v:'3 Sites'}],
     includes:['Snorkeling Gear','Lunch','Soft Drinks','Hotel Transfer','Guide'],
     extra:'⚠️ With 2 scuba dives: $90/person · National Park: $7/person'},
    {id:'abu',name:'Abu Dabbab Bay',loc:'Abu Dabbab, Marsa Alam',
     icon:'🐢',bg:'c-coral',bgGrad:'linear-gradient(135deg,#FFD0C0,#E05C3A)',
     badge:'🐢 Turtle Heaven',disc:null,oldP:null,price:'From $20',priceNum:20,
     desc:'Crystal-clear shallow waters teeming with Green Sea Turtles year-round. One of the rare spots where Dugongs occasionally appear.',
     tags:['wildlife','snorkeling'],tagLabels:['Sea Turtles','Dugong','Snorkeling','Wildlife'],
     options:[
       {label:'Half Day',duration:'4 hours',price:'From $20',priceNum:20},
       {label:'Full Day',duration:'8 hours',price:'From $35',priceNum:35},
     ],
     details:[{l:'Duration',v:'Half Day / Full Day'},{l:'Access',v:'Beach Entry'},{l:'Level',v:'All Levels'},{l:'Best For',v:'Families'}],
     includes:['Beach Entry','Snorkeling Equipment','Guide'],
     extra:'⚠️ Entry: €20 adult / €10 child · Dugong speedboat: +$40 · Dive: +$40'},
    {id:'mubarak',name:'Marsa Mubarak',loc:'Port Ghalib, Marsa Alam',
     icon:'🦭',bg:'c-blue',bgGrad:'linear-gradient(135deg,#C0DEFF,#4A90D9)',
     badge:'🦭 Dugong Bay',disc:'-10%',oldP:'$45',price:'From $39',priceNum:39,
     desc:'The highest Dugong encounter rate in the Red Sea. Gentle giants feed in the seagrass while the largest sea turtles in the region rest nearby.',
     tags:['wildlife'],tagLabels:['Dugong','Sea Turtles','Half Day','Boat Trip'],
     details:[{l:'Duration',v:'4–5 hours'},{l:'Departure',v:'Port Ghalib Marina'},{l:'Level',v:'All Levels'},{l:'Stops',v:'2 Sites'}],
     includes:['Snorkeling Gear','Life Jacket','Buffet Lunch','Drinks','Hotel Transfer','Guide'],
     extra:'⚠️ National Park fee: $5/person · Optional scuba dive: +$30'},
    {id:'luli',name:'Sharm El Luli',loc:'Ras Hankorab, Marsa Alam',
     icon:'🏖️',bg:'c-purple',bgGrad:'linear-gradient(135deg,#E0D4FF,#9B7FE8)',
     badge:'🌊 Pristine Beach',disc:null,oldP:null,price:'From $20',priceNum:20,
     desc:'One of the top three most beautiful beaches in the world — white sand, gin-clear water, and unspoiled reef 64 km south of Marsa Alam. Hawksbill turtles, parrotfish, groupers, and pufferfish at every turn.',
     tags:['snorkeling','islands'],tagLabels:['Snorkeling','Turtles','Beach','Half Day'],
     details:[{l:'Duration',v:'Half/Full Day'},{l:'Distance',v:'64 km from Marsa Alam'},{l:'Level',v:'All Levels'},{l:'Access',v:'Beach + Boat'}],
     includes:['Snorkeling Equipment','Hotel Transfer','Snacks & Water'],
     extra:'⚠️ Full day with Bedouin lunch from €69/person · National Park fee included'},
  ],
  luxor:[
    {id:'temples',name:'Temples & Tombs Full Day',loc:'Luxor, Egypt',
     icon:'🏛️',bg:'c-gold',bgGrad:'linear-gradient(135deg,#FFE9A0,#D4A017)',
     badge:'🏆 Best Seller',disc:null,oldP:null,price:'From $45',priceNum:45,
     desc:'The ultimate Luxor experience in one day — Valley of the Kings, Temple of Hatshepsut, Colossi of Memnon, Karnak & Luxor Temples with a qualified Egyptologist.',
     tags:['culture','temples'],tagLabels:['Valley of Kings','Karnak','Full Day','Egyptologist'],
     details:[{l:'Duration',v:'Full Day (8–9 hrs)'},{l:'Guide',v:'Egyptologist'},{l:'Transport',v:'Private A/C Car'},{l:'Level',v:'All Ages'}],
     includes:['Private Transport','Egyptologist Guide','Hotel Pickup & Drop','Water'],
     extra:'⚠️ Entrance fees: ~$40/person paid separately at sites'},
    {id:'balloon',name:'Sunrise Hot Air Balloon',loc:'West Bank, Luxor',
     icon:'🎈',bg:'c-orange',bgGrad:'linear-gradient(135deg,#FFD0A0,#F4722A)',
     badge:'✨ Once in a Lifetime',disc:null,oldP:null,price:'From $80',priceNum:80,
     desc:'Float 400–500 meters above the Valley of the Kings as the sun rises over ancient Egypt. 45–60 minutes of pure magic with panoramic views of temples and the Nile.',
     tags:['adventure','culture'],tagLabels:['Hot Air Balloon','Sunrise','Valley of Kings','Adventure'],
     details:[{l:'Duration',v:'45–60 minutes flight'},{l:'Departure',v:'West Bank, pre-dawn'},{l:'Height',v:'400–500 meters'},{l:'Operator',v:'Licensed & Certified'}],
     includes:['Hotel Pickup','Balloon Flight','Flight Certificate','Refreshments'],
     extra:'⚠️ Weather dependent — full refund if cancelled · Not suitable for children under 5'},
    {id:'felucca',name:'Sunset Felucca on the Nile',loc:'Luxor Corniche',
     icon:'⛵',bg:'c-rose',bgGrad:'linear-gradient(135deg,#FFD6E0,#E05C8A)',
     badge:'🌅 Most Romantic',disc:null,oldP:null,price:'From $15',priceNum:15,
     desc:'Sail the timeless Nile on a traditional felucca as the sun sets over Luxor. Sip Egyptian tea and hibiscus, watch the golden light on ancient temples, and let the river carry your worries away.',
     tags:['culture','relaxation'],tagLabels:['Felucca','Sunset','Nile','Private'],
     details:[{l:'Duration',v:'1.5–2 hours'},{l:'Departure',v:'Luxor Corniche'},{l:'Type',v:'Private Boat'},{l:'Best For',v:'Couples & Families'}],
     includes:['Private Felucca','Egyptian Tea & Hibiscus','Hotel Transfer'],
     extra:'💡 Perfect add-on after the temples day tour'},
    {id:'luxor-market',name:'Luxor Old Town & Souk Tour',loc:'Luxor City',
     icon:'🕌',bg:'c-amber',bgGrad:'linear-gradient(135deg,#FFF0C0,#F4C430)',
     badge:'🛒 Local Experience',disc:null,oldP:null,price:'From $25',priceNum:25,
     desc:'Walk the Avenue of Sphinxes, explore Luxor Temple by night, and dive into the authentic souk — spices, alabaster, papyrus, and the real heartbeat of Upper Egypt.',
     tags:['culture','temples'],tagLabels:['Souk','Luxor Temple','Night Tour','Cultural'],
     details:[{l:'Duration',v:'3–4 hours (evening)'},{l:'Starts',v:'After sunset'},{l:'Guide',v:'Local Expert'},{l:'Includes',v:'Temple Entry'}],
     includes:['Local Guide','Luxor Temple Entry','Hotel Transfer'],
     extra:'💡 Best experienced at night when the temple is beautifully lit'},
  ],
  aswan:[
    {id:'abusimbel',name:'Abu Simbel & Philae Temple',loc:'Aswan, Egypt',
     icon:'🗿',bg:'c-sand',bgGrad:'linear-gradient(135deg,#F5DEB3,#C8860A)',
     badge:'🏆 Must See',disc:null,oldP:null,price:'From $90',priceNum:90,
     desc:'The twin temples of Ramses II carved into the mountain in 1244 BC, plus the island temple of Philae dedicated to goddess Isis — two of Egypt\'s greatest ancient wonders in one day.',
     tags:['culture','temples'],tagLabels:['Abu Simbel','Philae','Full Day','Egyptologist'],
     details:[{l:'Duration',v:'Full Day'},{l:'Abu Simbel',v:'3 hrs by road each way'},{l:'Guide',v:'Egyptologist'},{l:'Departure',v:'Early morning (4 AM)'}],
     includes:['Private A/C Transport','Egyptologist Guide','Hotel Transfer','Water'],
     extra:'⚠️ Entrance fees ~$30/person · Early 4 AM departure recommended'},
    {id:'nilecruise',name:'4-Day Nile Cruise (Aswan → Luxor)',loc:'Aswan to Luxor',
     icon:'🚢',bg:'c-nile',bgGrad:'linear-gradient(135deg,#A8D8EA,#0E6BA8)',
     badge:'🌟 Premium Experience',disc:null,oldP:null,price:'From $350',priceNum:350,
     desc:'Sail the legendary Nile aboard a 5-star cruise. Three nights from Aswan to Luxor — Philae, Kom Ombo, Edfu, Valley of the Kings, and Karnak. All meals and Egyptologist guide included.',
     tags:['culture','luxury'],tagLabels:['4 Days','5-Star Cruise','All Inclusive','Egyptologist'],
     details:[{l:'Duration',v:'4 Days / 3 Nights'},{l:'Route',v:'Aswan → Luxor'},{l:'Standard',v:'5-Star Cruise'},{l:'Meals',v:'Full Board'}],
     includes:['3 Nights Onboard','All Meals','Egyptologist Guide','Shore Excursions','Hotel Transfer'],
     extra:'⚠️ Entrance fees ~$100/person extra · Abu Simbel optional +$90'},
    {id:'nubian',name:'Nubian Village & Aswan Islands',loc:'Aswan, Egypt',
     icon:'🏘️',bg:'c-terra',bgGrad:'linear-gradient(135deg,#FFCBA4,#E07B39)',
     badge:'🎨 Cultural Gem',disc:null,oldP:null,price:'From $35',priceNum:35,
     desc:'Glide by felucca around Elephantine Island and visit a colorful Nubian village — one of Egypt\'s most vibrant living cultures. Traditional Nubian lunch and warm local hospitality included.',
     tags:['culture','relaxation'],tagLabels:['Nubian Village','Felucca','Half Day','Cultural'],
     details:[{l:'Duration',v:'Half Day (4–5 hrs)'},{l:'Transport',v:'Felucca Boat'},{l:'Highlights',v:'Nubian Village + Islands'},{l:'Meal',v:'Traditional Nubian Lunch'}],
     includes:['Felucca Boat','Local Guide','Traditional Nubian Lunch','Hotel Transfer'],
     extra:'💡 Add a sunset felucca extension for just $10 more'},
  ],
};

// Expose to window so api.js fallback can find it
window.allTrips = allTrips;

// Active destination
let activeDest='marsa';
let trips=allTrips.marsa;


// ── HERO DESTINATION DATA ──
const heroData={
  marsa:{
    eyebrow:'🌊 Marsa Alam · Red Sea · Egypt',
    h1:'Dive Into the<br/><em>Untouched</em><br/>Red <strong>Sea</strong>',
    sub:'Swim with wild dolphins at Sataya. Encounter rare dugongs at Abu Dabbab. Discover three virgin islands at Hamata. Your journey starts here.',
    search:'Search — dolphins, turtles, diving…',
    theme:'dest-marsa',
    main:{icon:'🐬',bg:'linear-gradient(135deg,#9EE8F0,#2BBFCF)',name:'Sataya Dolphin House',loc:'Hamata, Marsa Alam',price:'From $65'},
    sm1:{icon:'🏝️',bg:'linear-gradient(135deg,#FFE0B2,#F4A535)',name:'Hamata Islands',price:'From $70'},
    sm2:{icon:'🦭',bg:'linear-gradient(135deg,#FFD0C0,#E05C3A)',name:'Abu Dabbab Bay',price:'From $20'},
    pills:['🐢 Sea Turtles Guaranteed','📸 Photos Included'],
    stats:[{n:'93%',l:'Dolphin Rate'},{n:'6 Sites',l:'Marsa Alam'},{n:'★ 5.0',l:'Average Rating'},{n:'100%',l:'Private Guided'}],
  },
  luxor:{
    eyebrow:'🏛️ Luxor · Nile Valley · Egypt',
    h1:'Step Into the<br/><em>Heart of</em><br/>Ancient <strong>Egypt</strong>',
    sub:'Float above the Valley of the Kings at sunrise. Walk among pharaohs at Karnak. Sail the timeless Nile by felucca as the golden light fades over the temples.',
    search:'Search — balloon, temples, Valley of Kings…',
    theme:'dest-luxor',
    main:{icon:'🎈',bg:'linear-gradient(135deg,#FFD0A0,#F4722A)',name:'Sunrise Hot Air Balloon',loc:'West Bank, Luxor',price:'From $80'},
    sm1:{icon:'🏛️',bg:'linear-gradient(135deg,#FFE9A0,#D4A017)',name:'Temples & Tombs Full Day',price:'From $45'},
    sm2:{icon:'⛵',bg:'linear-gradient(135deg,#FFD6E0,#E05C8A)',name:'Sunset Felucca on the Nile',price:'From $15'},
    pills:['🗿 Certified Egyptologist','🌅 Sunrise Balloon'],
    stats:[{n:'4 Tours',l:'Luxor Highlights'},{n:'3000+',l:'Years of History'},{n:'★ 5.0',l:'Average Rating'},{n:'100%',l:'Private Guided'}],
  },
  aswan:{
    eyebrow:'🏺 Aswan · Nubian Egypt · Upper Nile',
    h1:'Sail to the<br/><em>Edge of</em><br/>Ancient <strong>Nubia</strong>',
    sub:'Stand before Ramses II at Abu Simbel. Cruise four days from Aswan to Luxor on a 5-star Nile cruiser. Discover the colorful soul of Nubian village life.',
    search:'Search — Abu Simbel, Nile cruise, Nubia…',
    theme:'dest-aswan',
    main:{icon:'🚢',bg:'linear-gradient(135deg,#A8D8EA,#0E6BA8)',name:'4-Day Nile Cruise',loc:'Aswan → Luxor',price:'From $350'},
    sm1:{icon:'🗿',bg:'linear-gradient(135deg,#F5DEB3,#C8860A)',name:'Abu Simbel & Philae',price:'From $90'},
    sm2:{icon:'🏘️',bg:'linear-gradient(135deg,#FFCBA4,#E07B39)',name:'Nubian Village Tour',price:'From $35'},
    pills:['🗿 Abu Simbel Wonder','🚢 5-Star Nile Cruise'],
    stats:[{n:'3 Icons',l:'Aswan Wonders'},{n:'1244 BC',l:'Abu Simbel Built'},{n:'★ 5.0',l:'Average Rating'},{n:'100%',l:'Private Guided'}],
  },
};

function findTrip(id){
  for(const dest of Object.values(allTrips)){
    const t=dest.find(x=>x.id===id);
    if(t)return t;
  }
  return null;
}

/**
 * initTripsData — يُستدعى مرة واحدة عند تحميل الصفحة.
 * يحاول تحميل الرحلات من Firebase.
 * إذا Firebase فارغ أو غير مُعدّ → يبقى على الـ hardcoded data.
 * يُطلق event 'trips:ready' عند الانتهاء.
 */
window.initTripsData = async function() {
  if (typeof loadTripsFromFirebase === 'function') {
    const remoteTrips = await loadTripsFromFirebase();
    if (remoteTrips) {
      Object.assign(allTrips, remoteTrips);
      trips = allTrips[activeDest] || [];
      console.info('[Data] Loaded from Firebase.');
    } else {
      console.info('[Data] Using local hardcoded data.');
    }
  }
  document.dispatchEvent(new CustomEvent('trips:ready'));
};
