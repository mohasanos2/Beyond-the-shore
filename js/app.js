function switchDest(dest,el){
  activeDest=dest;
  trips=allTrips[dest]||[];
  const filterBar=document.getElementById('filter-bar');
  if(dest==='marsa'){
    filterBar.innerHTML=`<button class="fbtn active" onclick="filterTrips('all',this)">All</button><button class="fbtn" onclick="filterTrips('snorkeling',this)">🤿 Snorkeling</button><button class="fbtn" onclick="filterTrips('diving',this)">🐠 Diving</button><button class="fbtn" onclick="filterTrips('dolphins',this)">🐬 Dolphins</button><button class="fbtn" onclick="filterTrips('wildlife',this)">🦭 Wildlife</button><button class="fbtn" onclick="filterTrips('islands',this)">🏝️ Islands</button>`;
  } else if(dest==='luxor'){
    filterBar.innerHTML=`<button class="fbtn active" onclick="filterTrips('all',this)">All</button><button class="fbtn" onclick="filterTrips('culture',this)">🏛️ Culture</button><button class="fbtn" onclick="filterTrips('temples',this)">🗿 Temples</button><button class="fbtn" onclick="filterTrips('adventure',this)">🎈 Adventure</button><button class="fbtn" onclick="filterTrips('relaxation',this)">⛵ Relaxation</button>`;
  } else if(dest==='aswan'){
    filterBar.innerHTML=`<button class="fbtn active" onclick="filterTrips('all',this)">All</button><button class="fbtn" onclick="filterTrips('culture',this)">🏛️ Culture</button><button class="fbtn" onclick="filterTrips('temples',this)">🗿 Temples</button><button class="fbtn" onclick="filterTrips('relaxation',this)">⛵ Nile</button><button class="fbtn" onclick="filterTrips('luxury',this)">✨ Luxury</button>`;
  }
  renderTrips();
  renderTripOptions();
  // Sync hero chips active state (without triggering hero animation)
  document.querySelectorAll('#hero-dest-chips .hero-chip').forEach(c=>{
    c.classList.toggle('active',c.getAttribute('onclick')&&c.getAttribute('onclick').includes(`'${dest}'`));
  });
}

const colors={
  'c-teal':'linear-gradient(135deg,#9EE8F0,#2BBFCF)',
  'c-sun':'linear-gradient(135deg,#FFE0B2,#F4A535)',
  'c-green':'linear-gradient(135deg,#B8F0C0,#3DB85C)',
  'c-coral':'linear-gradient(135deg,#FFD0C0,#E05C3A)',
  'c-blue':'linear-gradient(135deg,#C0DEFF,#4A90D9)'
};

// ── STATE ──
let state={
  currentStep:1,
  selectedTrip:null,
  selectedDate:null,
  adults:1,children:0,
  contactMethod:'whatsapp',
  calYear:new Date().getFullYear(),
  calMonth:new Date().getMonth()
};

// ── PAGE ROUTING ──
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function scrollTo(sel){
  setTimeout(()=>{
    const el=document.querySelector(sel);
    if(el)el.scrollIntoView({behavior:'smooth'});
  },100);
}

// ── TRIPS RENDER ──
function renderTrips(filter='all'){
  const grid=document.getElementById('trips-grid');
  const list=filter==='all'?trips:trips.filter(t=>t.tags.includes(filter));
  grid.innerHTML=list.map(t=>`
  <div class="tcard" onclick="window.location.href='trip.html?id=${t.id}'">
    <div class="tcard-img ${t.bg}">
      ${t.disc?`<div class="disc-badge">${t.disc}</div>`:''}
      <div class="pop-badge">${t.badge}</div>
      <span>${t.icon}</span>
    </div>
    <div class="tcard-body">
      <div class="tcard-meta">
        <div class="tcard-loc">📍 ${t.loc}</div>
        <div class="tcard-stars"><span class="stars">★★★★★</span> 5.0</div>
      </div>
      <div class="tcard-name">${t.name}</div>
      <div class="tcard-desc">${t.desc}</div>
      <div class="tcard-tags">${t.tagLabels.map(x=>`<span class="tcard-tag">${x}</span>`).join('')}</div>
      <div class="tcard-foot">
        <div>${t.oldP?`<span class="price-old">${t.oldP}</span>`:''}<span class="price-new">${t.price} <small>/ person</small></span></div>
        <button class="tcard-btn" onclick="event.stopPropagation();bookDirect('${t.id}')">Book Now</button>
      </div>
    </div>
  </div>`).join('');
}

function filterTrips(filter,el){
  document.querySelectorAll('.fbtn,.hero-chip').forEach(b=>{
    b.classList.remove('active');
    const fn=b.getAttribute('onclick')||'';
    if(fn.includes(`'${filter}'`))b.classList.add('active');
  });
  renderTrips(filter);
}

function handleSearch(){
  const q=document.getElementById('search-input').value.toLowerCase().trim();
  if(!q){renderTrips();return;}
  const filtered=trips.filter(t=>
    t.name.toLowerCase().includes(q)||t.desc.toLowerCase().includes(q)||
    t.tagLabels.some(x=>x.toLowerCase().includes(q))
  );
  const grid=document.getElementById('trips-grid');
  grid.innerHTML=filtered.length?filtered.map(t=>`
  <div class="tcard" onclick="window.location.href='trip.html?id=${t.id}'">
    <div class="tcard-img ${t.bg}"><div class="pop-badge">${t.badge}</div><span>${t.icon}</span></div>
    <div class="tcard-body">
      <div class="tcard-meta"><div class="tcard-loc">📍 ${t.loc}</div><div class="tcard-stars"><span class="stars">★★★★★</span> 5.0</div></div>
      <div class="tcard-name">${t.name}</div>
      <div class="tcard-desc">${t.desc}</div>
      <div class="tcard-tags">${t.tagLabels.map(x=>`<span class="tcard-tag">${x}</span>`).join('')}</div>
      <div class="tcard-foot"><div><span class="price-new">${t.price} <small>/ person</small></span></div><button class="tcard-btn" onclick="event.stopPropagation();bookDirect('${t.id}')">Book Now</button></div>
    </div>
  </div>`).join(''):'<p style="color:var(--ink-light);padding:2rem;grid-column:1/-1">No trips matched your search. Try "dolphins", "turtles", or "diving".</p>';
  document.getElementById('trips').scrollIntoView({behavior:'smooth'});
}

document.getElementById('search-input').addEventListener('keydown',e=>{if(e.key==='Enter')handleSearch()});

// ── MODAL ──
let modalTripId=null;
function findTrip(id){
  for(const dest of Object.values(allTrips)){
    const t=dest.find(x=>x.id===id);
    if(t)return t;
  }
  return null;
}
function openModal(id){
  modalTripId=id;
  const t=findTrip(id);
  document.getElementById('m-hero').style.background=colors[t.bg];
  document.getElementById('m-hero').textContent=t.icon;
  document.getElementById('m-name').textContent=t.name;
  document.getElementById('m-old').textContent=t.oldP||'';
  document.getElementById('m-new').textContent=t.price;
  document.getElementById('m-grid').innerHTML=t.details.map(d=>`<div class="m-cell"><div class="m-cell-l">${d.l}</div><div class="m-cell-v">${d.v}</div></div>`).join('');
  document.getElementById('m-inc').innerHTML=t.includes.map(i=>`<li>✓ ${i}</li>`).join('');
  document.getElementById('m-extra').textContent=t.extra;
  const msg=encodeURIComponent(`Hi! I want to book: ${t.name} (${t.price}). Can you help me?`);
  document.getElementById('m-wa').href=`https://wa.me/201037420949?text=${msg}`;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow='';
}
function bookDirect(id){
  const t=findTrip(id);
  if(!t)return;
  state.selectedTrip=t;
  switchDest(Object.keys(allTrips).find(d=>allTrips[d].find(x=>x.id===id)),null);
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('booking').classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(()=>goStep(2),100);
}
function bookTrip(id){
  state.selectedTrip=findTrip(id);
  showPage("booking");
  setTimeout(()=>{
    renderTripOptions();
    document.querySelectorAll(".trip-option").forEach(el=>{
      if(el.dataset.id===id)el.click();
    });
    setTimeout(()=>goStep(2),100);
  },200);
}
function bookFromModal(){
  bookDirect(modalTripId);
  closeModal();
}
document.getElementById('modal').addEventListener('click',e=>{if(e.target===document.getElementById('modal'))closeModal()});

// ── BOOKING STEPS ──

function selectDestPanel(dest,el){
  document.querySelectorAll('#panel-0 .trip-option').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected');
  switchDest(dest,null);
  renderTripOptions();
  document.getElementById('btn-next-0').disabled=false;
}function goStep(n){
  if(n===2&&!state.selectedTrip)return;
  if(n===3&&!state.selectedDate)return;
  
  if(n===0){state.selectedTrip=null;state.selectedDate=null;}state.currentStep=n;
  document.querySelectorAll('.step-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-'+n).classList.add('active');
  // update steps bar
  for(let i=1;i<=3;i++){
    const num=document.getElementById('snum-'+i);
    const lbl=document.getElementById('slabel-'+i);
    if(i<n){num.className='step-num done';num.textContent='✓';lbl.className='step-label'}
    else if(i===n){num.className='step-num active';num.textContent=i;lbl.className='step-label active'}
    else{num.className='step-num pending';num.textContent=i;lbl.className='step-label'}
    if(i<3){
      const line=document.getElementById('sline-'+i);
      line.className='step-line'+(i<n?' done':'');
    }
  }
  updateSummary();
  document.getElementById('booking').scrollIntoView({behavior:'smooth'});
}

// ── TRIP OPTIONS in booking ──
function renderTripOptions(){
  const destTripsOnly=allTrips[activeDest]||[];
  const destLabels={marsa:'🌊 Marsa Alam',luxor:'🏛️ Luxor',aswan:'🏺 Aswan'};
  let html='';
  const dest=activeDest;const destTrips=allTrips[activeDest];{
    html+=`<div style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-light);margin:1rem 0 0.5rem;padding-left:0.2rem">${destLabels[dest]}</div>`;
    html+=destTrips.map(t=>`
    <div class="trip-option" data-id="${t.id}" onclick="selectTrip('${t.id}',this)">
      <div class="trip-option-icon" style="background:${t.bgGrad}">${t.icon}</div>
      <div class="trip-option-info">
        <div class="trip-option-name">${t.name}</div>
        <div class="trip-option-meta">📍 ${t.loc} · ${t.details[0].v}</div>
      </div>
      <div class="trip-option-price">${t.price}</div>
      <div class="trip-option-radio"></div>
    </div>`).join('');
  }
  document.getElementById('trip-options').innerHTML=html;
}

function selectTrip(id,el){
  document.querySelectorAll('.trip-option').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedTrip=findTrip(id);
  document.getElementById('btn-next-1').disabled=false;
  updateSummary();
}

// ── CALENDAR ──
function renderCal(){
  const now=new Date();
  const d=new Date(state.calYear,state.calMonth,1);
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('cal-month-label').textContent=`${months[state.calMonth]} ${state.calYear}`;
  const firstDay=d.getDay();
  const daysInMonth=new Date(state.calYear,state.calMonth+1,0).getDate();
  let html='';
  for(let i=0;i<firstDay;i++)html+=`<div class="date-cell empty"></div>`;
  for(let d2=1;d2<=daysInMonth;d2++){
    const date=new Date(state.calYear,state.calMonth,d2);
    const isPast=date<new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const isToday=date.toDateString()===now.toDateString();
    const dateStr=`${state.calYear}-${String(state.calMonth+1).padStart(2,'0')}-${String(d2).padStart(2,'0')}`;
    const isSel=state.selectedDate===dateStr;
    let cls='date-cell';
    if(isPast)cls+=' past';
    else if(isSel)cls+=' selected';
    else if(isToday)cls+=' today';
    html+=`<div class="${cls}" ${!isPast?`onclick="selectDate('${dateStr}')"`:''}>${d2}</div>`;
  }
  document.getElementById('date-grid').innerHTML=html;
}

function changeMonth(dir){
  state.calMonth+=dir;
  if(state.calMonth>11){state.calMonth=0;state.calYear++}
  if(state.calMonth<0){state.calMonth=11;state.calYear--}
  renderCal();

}

function selectDate(d){
  state.selectedDate=d;
  renderCal();

  document.getElementById('btn-next-2').disabled=false;
  updateSummary();
}

// ── COUNTERS ──
function changeCount(type,dir){
  if(type==='adults'){state.adults=Math.max(1,state.adults+dir)}
  if(type==='children'){state.children=Math.max(0,state.children+dir)}
  document.getElementById('count-adults').textContent=state.adults;
  document.getElementById('count-children').textContent=state.children;
  updateSummary();
}

// ── CONTACT METHOD ──
function selectContact(method){
  state.contactMethod=method;
  ['wa','email','both'].forEach(k=>document.getElementById('copt-'+k).classList.remove('selected'));
  document.getElementById('copt-'+{whatsapp:'wa',email:'email',both:'both'}[method]).classList.add('selected');
  const fields=document.getElementById('contact-fields');
  if(method==='whatsapp')fields.innerHTML=`<div class="form-group full"><label class="form-label">WhatsApp Number *</label><input class="form-input" type="tel" id="f-wa" placeholder="+1 234 567 8900" oninput="updateSummary()"/></div>`;
  else if(method==='email')fields.innerHTML=`<div class="form-group full"><label class="form-label">Email Address *</label><input class="form-input" type="email" id="f-email" placeholder="your@email.com" oninput="updateSummary()"/></div>`;
  else fields.innerHTML=`<div class="form-group"><label class="form-label">WhatsApp Number *</label><input class="form-input" type="tel" id="f-wa" placeholder="+1 234 567 8900" oninput="updateSummary()"/></div><div class="form-group"><label class="form-label">Email Address *</label><input class="form-input" type="email" id="f-email" placeholder="your@email.com" oninput="updateSummary()"/></div>`;
}

// ── SUMMARY ──
function updateSummary(){
  const t=state.selectedTrip;
  const fname=document.getElementById('f-fname')?.value||'';
  const lname=document.getElementById('f-lname')?.value||'';
  let rows='';
  if(t)rows+=`<div class="summary-row"><span class="summary-key">Trip</span><span class="summary-val">${t.name}</span></div>`;
  if(state.selectedDate)rows+=`<div class="summary-row"><span class="summary-key">Date</span><span class="summary-val">${formatDate(state.selectedDate)}</span></div>`;
  if(t||state.adults)rows+=`<div class="summary-row"><span class="summary-key">Guests</span><span class="summary-val">${state.adults} adult${state.adults!==1?'s':''}${state.children>0?` + ${state.children} child`+(state.children>1?'ren':''):''}</span></div>`;
  if(fname||lname)rows+=`<div class="summary-row"><span class="summary-key">Name</span><span class="summary-val">${fname} ${lname}</span></div>`;
  if(t){
    const total=t.priceNum*state.adults;
    rows+=`<div class="summary-total"><span class="summary-total-label">Estimated Total</span><span class="summary-total-val">From $${total}</span></div>`;
  }
  document.getElementById('summary-content').innerHTML=rows||'<div class="summary-empty">Complete the steps to see your summary here.</div>';
}

function formatDate(d){
  const [y,m,day]=d.split('-');
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(day)} ${months[parseInt(m)-1]} ${y}`;
}

// ── SUBMIT ──
function submitBooking(){
  const fname=document.getElementById('f-fname')?.value?.trim();
  const lname=document.getElementById('f-lname')?.value?.trim();
  if(!fname||!lname){alert('Please enter your full name.');return;}
  const t=state.selectedTrip;
  // Build mailto
  const subject=`Trip Booking Request: ${t?.name}`;
  const body=`New Booking Request from Beyond The Shore Website\n\n`+
    `Name: ${fname} ${lname}\n`+
    `Trip: ${t?.name}\n`+
    `Date: ${state.selectedDate?formatDate(state.selectedDate):'Not selected'}\n`+
    `Adults: ${state.adults}\n`+
    `Children: ${state.children}\n`+
    `Nationality: ${document.getElementById('f-nationality')?.value||'Not provided'}\n`+
    `Contact Method: ${state.contactMethod}\n`+
    `WhatsApp: ${document.getElementById('f-wa')?.value||'N/A'}\n`+
    `Email: ${document.getElementById('f-email')?.value||'N/A'}\n`+
    `Notes: ${document.getElementById('f-notes')?.value||'None'}\n`;
  window.location.href=`mailto:hello@beyondtheshore.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // Show success
  document.getElementById('success-details').innerHTML=`
    <div class="success-detail-row"><span>Trip</span><span>${t?.name}</span></div>
    <div class="success-detail-row"><span>Date</span><span>${state.selectedDate?formatDate(state.selectedDate):'TBD'}</span></div>
    <div class="success-detail-row"><span>Guests</span><span>${state.adults} adult${state.adults!==1?'s':''}${state.children>0?` + ${state.children} child`+(state.children>1?'ren':''):''}</span></div>
    <div class="success-detail-row"><span>Name</span><span>${fname} ${lname}</span></div>`;
  document.querySelectorAll('.step-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-success').classList.add('active');
  document.getElementById('booking').scrollIntoView({behavior:'smooth'});
}



function switchDestHero(dest,el){
  // Update hero chips active state
  document.querySelectorAll('#hero-dest-chips .hero-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');

  const hero=document.getElementById('hero-section');
  const d=heroData[dest];

  // Fade out
  hero.classList.add('hero-fade');
  setTimeout(()=>{
    // Swap theme class
    hero.classList.remove('dest-marsa','dest-luxor','dest-aswan');
    hero.classList.add(d.theme);

    // Update text
    document.getElementById('hero-eyebrow').textContent=d.eyebrow;
    document.getElementById('hero-h1').innerHTML=d.h1;
    document.getElementById('hero-sub').textContent=d.sub;
    document.getElementById('search-input').placeholder=d.search;

    // Update cards
    const mainImg=document.getElementById('hcard-main-img');
    mainImg.textContent=d.main.icon;
    mainImg.style.background=d.main.bg;
    document.getElementById('hcard-main-name').textContent=d.main.name;
    document.getElementById('hcard-main-loc').textContent='📍 '+d.main.loc;
    document.getElementById('hcard-main-price').textContent=d.main.price;

    const sm1img=document.getElementById('hcard-sm1-img');
    sm1img.textContent=d.sm1.icon;
    sm1img.style.background=d.sm1.bg;
    document.getElementById('hcard-sm1-name').textContent=d.sm1.name;
    document.getElementById('hcard-sm1-price').textContent=d.sm1.price;

    const sm2img=document.getElementById('hcard-sm2-img');
    sm2img.textContent=d.sm2.icon;
    sm2img.style.background=d.sm2.bg;
    document.getElementById('hcard-sm2-name').textContent=d.sm2.name;
    document.getElementById('hcard-sm2-price').textContent=d.sm2.price;

    // Update pills
    document.getElementById('pill-a').textContent=d.pills[0];
    document.getElementById('pill-b').textContent=d.pills[1];

    // Update stats
    document.querySelector('.stats').innerHTML=d.stats.map(s=>`<div class="stat"><span class="stat-n">${s.n}</span><span class="stat-l">${s.l}</span></div>`).join('');

    // Fade in
    hero.classList.remove('hero-fade');

    // Sync the trips section (switch destination without needing tabs)
    switchDest(dest, null);
  },350);
}

// ── INIT ──
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',scrollY>40);
});

// Set initial hero theme class
document.getElementById('hero-section').classList.add('dest-marsa');

renderTrips();
renderTripOptions();
renderCal();

