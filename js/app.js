// ── CONSTANTS ──

const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── STATE ──
let activeDest='marsa';
let trips=[];
let state={
  currentStep:1,
  selectedTrip:null,
  selectedDate:null,
  selectedOption:null,
  adults:1,
  children:0,
  contactMethod:'whatsapp',
  calYear:new Date().getFullYear(),
  calMonth:new Date().getMonth()
};

// ── UTILITIES ──
function $(id){return document.getElementById(id);}
function formatDate(d){
  const[y,m,day]=d.split('-');
  return`${parseInt(day)} ${MONTHS_SHORT[parseInt(m)-1]} ${y}`;
}

function esc(s){
  if(s==null)return'';
  return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ── DESTINATION SWITCH ──
const filterConfigs={
  marsa:`<button class="fbtn active" onclick="filterTrips('all',this)">All</button><button class="fbtn" onclick="filterTrips('snorkeling',this)">🤿 Snorkeling</button><button class="fbtn" onclick="filterTrips('diving',this)">🐠 Diving</button><button class="fbtn" onclick="filterTrips('dolphins',this)">🐬 Dolphins</button><button class="fbtn" onclick="filterTrips('wildlife',this)">🦭 Wildlife</button><button class="fbtn" onclick="filterTrips('islands',this)">🏝️ Islands</button>`,
  luxor:`<button class="fbtn active" onclick="filterTrips('all',this)">All</button><button class="fbtn" onclick="filterTrips('culture',this)">🏛️ Culture</button><button class="fbtn" onclick="filterTrips('temples',this)">🗿 Temples</button><button class="fbtn" onclick="filterTrips('adventure',this)">🎈 Adventure</button><button class="fbtn" onclick="filterTrips('relaxation',this)">⛵ Relaxation</button>`,
  aswan:`<button class="fbtn active" onclick="filterTrips('all',this)">All</button><button class="fbtn" onclick="filterTrips('culture',this)">🏛️ Culture</button><button class="fbtn" onclick="filterTrips('temples',this)">🗿 Temples</button><button class="fbtn" onclick="filterTrips('relaxation',this)">⛵ Nile</button><button class="fbtn" onclick="filterTrips('luxury',this)">✨ Luxury</button>`
};

function switchDest(dest){
  activeDest=dest;
  trips=(window.allTrips||{})[dest]||[];
  const filterBar=$('filter-bar');
  if(filterBar&&filterConfigs[dest])filterBar.innerHTML=filterConfigs[dest];
  renderTrips();
  renderTripOptions();
  document.querySelectorAll('#hero-dest-chips .hero-chip').forEach(c=>{
    c.classList.toggle('active',c.getAttribute('onclick')&&c.getAttribute('onclick').includes(`'${dest}'`));
  });
}

// ── CARD HTML BUILDERS ──
function buildTripCardHTML(t){
  const priceBlock=t.options
    ?t.options.map(o=>`<div style="font-size:.85rem;margin:2px 0"><b>${esc(o.label)}</b>: ${esc(o.price)}</div>`).join('')
    :`<span class="price-new">${esc(t.price)} <small>/ person</small></span>`;

  const imgContent = t.imageUrl
    ? `<img src="${esc(t.imageUrl)}" alt="${esc(t.name)}"
            loading="lazy"
            style="width:100%;height:100%;object-fit:cover;border-radius:inherit"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
       <span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:2.5rem">${esc(t.icon)}</span>`
    : `<span>${esc(t.icon)}</span>`;

  return`<div class="tcard" onclick="window.location.href='/trips/${esc(t.id)}'">
    <div class="tcard-img ${esc(t.bg)}" style="${t.imageUrl?'padding:0;overflow:hidden':''}">
      ${t.disc?`<div class="disc-badge">${esc(t.disc)}</div>`:''}
      <div class="pop-badge">${esc(t.badge)}</div>
      ${imgContent}
    </div>
    <div class="tcard-body">
      <div class="tcard-meta">
        <div class="tcard-loc">📍 ${esc(t.loc)}</div>
        <div class="tcard-stars"><span class="verified-badge" style="font-size:0.72rem;background:rgba(7,151,168,0.1);color:var(--teal);padding:2px 8px;border-radius:50px;font-weight:600;letter-spacing:.02em">✓ Verified Tour</span></div>
      </div>
      <div class="tcard-name">${esc(t.name)}</div>
      <div class="tcard-desc">${esc(t.desc)}</div>
      <div class="tcard-tags">${t.tagLabels.map(x=>`<span class="tcard-tag">${esc(x)}</span>`).join('')}</div>
      <div class="tcard-foot">
        <div>${t.oldP?`<span class="price-old">${esc(t.oldP)}</span>`:''} ${priceBlock}</div>
        <button class="tcard-btn" onclick="event.stopPropagation();bookDirect('${esc(t.id)}')">Book Now</button>
      </div>
    </div>
  </div>`;
}

// ── TRIPS RENDER ──
function renderTrips(filter='all'){
  const grid=$('trips-grid');
  if(!grid)return;
  const list=filter==='all'?trips:trips.filter(t=>t.tags.includes(filter));
  grid.innerHTML=list.map(buildTripCardHTML).join('');
}

// ── SEARCH ──
function handleSearch(){
  const q = document.getElementById('search-input');
  if(!q) return;
  const term = q.value.trim().toLowerCase();
  if(!term) { renderTrips(); return; }
  const matched = trips.filter(t =>
    (t.name && t.name.toLowerCase().includes(term)) ||
    (t.desc && t.desc.toLowerCase().includes(term)) ||
    (t.loc  && t.loc.toLowerCase().includes(term))  ||
    (t.tagLabels && t.tagLabels.some(tag => tag.toLowerCase().includes(term)))
  );
  const grid = document.getElementById('trips-grid');
  if(!grid) return;
  if(!matched.length){
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--ink-mid);font-family:Outfit,sans-serif">
      No trips found for "<strong>${esc(term)}</strong>" — try dolphins, snorkeling, or Luxor.
    </div>`;
    return;
  }
  grid.innerHTML = matched.map(buildTripCardHTML).join('');
}
window.handleSearch = handleSearch;

function filterTrips(filter,el){
  document.querySelectorAll('.fbtn,.hero-chip').forEach(b=>{
    b.classList.remove('active');
    const fn=b.getAttribute('onclick')||'';
    if(fn.includes(`'${filter}'`))b.classList.add('active');
  });
  renderTrips(filter);
}

// handleSearch defined above — duplicate removed

// Search with debounce
let __searchTimeout;
const __searchInput=$('search-input');
if(__searchInput){
  __searchInput.addEventListener('keydown',e=>{if(e.key==='Enter')handleSearch();});
  __searchInput.addEventListener('input',()=>{
    clearTimeout(__searchTimeout);
    __searchTimeout=setTimeout(handleSearch,300);
  });
}

function bookDirect(id){BookingRouter.goToBooking(id);}


// ── BOOKING STEPS ──
function goStep(n){
  if(n===2&&!state.selectedTrip)return;
  if(n===3&&!state.selectedDate){
    const dateGrid=document.getElementById('date-grid');
    if(dateGrid){
      dateGrid.scrollIntoView({behavior:'smooth',block:'center'});
      dateGrid.style.outline='2px solid var(--teal)';
      dateGrid.style.borderRadius='12px';
      setTimeout(()=>{dateGrid.style.outline='';dateGrid.style.borderRadius='';},2000);
    }
    return;
  }
  if(n===0){
    state.selectedTrip=null;
    state.selectedDate=null;
    state.currentStep=1;
    document.querySelectorAll('.step-panel').forEach(p=>p.classList.remove('active'));
    $('panel-1').classList.add('active');
    return;
  }
  state.currentStep=n;
  document.querySelectorAll('.step-panel').forEach(p=>p.classList.remove('active'));
  $('panel-'+n).classList.add('active');
  // Re-render option selector in panel-2 when navigating there
  if(n===2 && state.selectedTrip) renderTripOptionSelector(state.selectedTrip);
  // Update steps bar
  for(let i=1;i<=3;i++){
    const num=$('snum-'+i),lbl=$('slabel-'+i);
    if(!num)continue;
    if(i<n){num.className='step-num done';num.textContent='✓';lbl.className='step-label';}
    else if(i===n){num.className='step-num active';num.textContent=i;lbl.className='step-label active';}
    else{num.className='step-num pending';num.textContent=i;lbl.className='step-label';}
    if(i<3){
      const line=$('sline-'+i);
      if(line)line.className='step-line'+(i<n?' done':'');
    }
  }
  updateSummary();
  $('booking')?.scrollIntoView({behavior:'smooth'});
  const pb=$('booking-progress-bar');
  if(pb){const pct={1:33,2:66,3:100}[n]||33;pb.style.width=pct+'%';}
}

// ── TRIP OPTIONS in booking ──
const destLabels={marsa:'🌊 Marsa Alam',luxor:'🏛️ Luxor',aswan:'🏺 Aswan'};

function renderTripOptions(){
  const container=$('trip-options');
  if(!container)return;
  // فلترة حسب dest param إن وجد — fallback لـ localStorage لو المتصفح حذف الـ query string
  const _destParam = new URLSearchParams(window.location.search).get('dest')
                  || localStorage.getItem('bts_dest');
  // امسح من localStorage بعد القراءة لتجنب التأثير على زيارات تانية
  if (!new URLSearchParams(window.location.search).get('dest')) {
    localStorage.removeItem('bts_dest');
  }
  const _src = window.allTrips || {};
  const _marsa = _src.marsa || [];
  const _luxor = _src.luxor || [];
  const _aswan = _src.aswan || [];
  const trips = _destParam === 'marsa' ? _marsa
              : _destParam === 'luxor'  ? _luxor
              : _destParam === 'aswan'  ? _aswan
              : [..._marsa, ..._luxor, ..._aswan];
  let html='';
  const _filteredTrips = _destParam && ['marsa','luxor','aswan'].includes(_destParam)
    ? {[_destParam]: trips}
    : (window.allTrips || {});
  Object.keys(_filteredTrips).forEach(dest=>{
    html+=`<div style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-light);margin:1rem 0 0.5rem;padding-left:0.2rem">${destLabels[dest]||dest}</div>`;
    html+=_filteredTrips[dest].map(t=>`
    <div class="trip-option" data-id="${t.id}" onclick="selectTrip('${t.id}',this)">
      <div class="trip-option-icon" style="background:${t.bgGrad}">${t.icon}</div>
      <div class="trip-option-info">
        <div class="trip-option-name">${t.name}</div>
        <div class="trip-option-meta">📍 ${t.loc} · ${t.details[0].v}</div>
      </div>
      <div class="trip-option-price">${t.price}</div>
      <div class="trip-option-radio"></div>
    </div>`).join('');
  });
  container.innerHTML=html;
}

function selectTrip(id,el){
  document.querySelectorAll('.trip-option').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedTrip=findTrip(id);
  state.selectedOption=null;
  $('btn-next-1').disabled=false;
  renderTripOptionSelector(state.selectedTrip);
  updateSummary();
}

function renderTripOptionSelector(t) {
  const old = document.getElementById('trip-option-selector');
  if (old) old.remove();

  if (!t || !t.options || t.options.length === 0) {
    state.selectedOption = null;
    const area = document.getElementById('trip-options-area');
    if (area) { area.innerHTML = ''; area.style.display = 'none'; }
    updateSummary();
    return;
  }

  // preserve previously selected option, fallback to first
  const currentIdx = state.selectedOption
    ? t.options.findIndex(o => o.label === state.selectedOption.label)
    : -1;
  const activeIdx = currentIdx >= 0 ? currentIdx : 0;
  state.selectedOption = t.options[activeIdx];

  const wrap = document.createElement('div');
  wrap.id = 'trip-option-selector';
  wrap.style.cssText = 'margin-top:1rem;padding:1rem;background:var(--surface,#f8f9fa);border-radius:12px;border:1px solid var(--border,#e0e0e0)';

  wrap.innerHTML = `
    <div style="font-family:Outfit,sans-serif;font-size:0.82rem;font-weight:600;
                color:var(--ink-mid,#666);text-transform:uppercase;
                letter-spacing:.06em;margin-bottom:0.75rem">
      Select Option
    </div>
    <div style="display:flex;flex-direction:column;gap:0.5rem">
      ${t.options.map((o, i) => `
        <label style="display:flex;align-items:center;gap:0.75rem;
                      padding:0.75rem 1rem;border-radius:10px;cursor:pointer;
                      border:2px solid ${i === activeIdx ? 'var(--teal)' : 'var(--border,#e0e0e0)'};
                      background:${i === activeIdx ? 'rgba(7,151,168,0.06)' : '#fff'};
                      transition:border .15s,background .15s"
               id="opt-label-${i}">
          <input type="radio" name="trip-option" value="${i}"
                 ${i === activeIdx ? 'checked' : ''}
                 style="accent-color:var(--teal);width:16px;height:16px"
                 onchange="selectTripOption(${i})"/>
          <span style="flex:1;font-family:Outfit,sans-serif;font-size:0.9rem;
                       color:var(--ink,#1a1a2e);font-weight:500">${o.label}</span>
          <span style="font-family:Outfit,sans-serif;font-size:0.9rem;
                       color:var(--teal);font-weight:700">${o.price}</span>
        </label>`).join('')}
    </div>`;

  const area = document.getElementById('trip-options-area');
  if (area) {
    area.innerHTML = '';
    area.appendChild(wrap);
    area.style.display = 'block';
  }

  updateSummary();
}

function selectTripOption(index) {
  if (!state.selectedTrip || !state.selectedTrip.options) return;
  state.selectedOption = state.selectedTrip.options[index];

  state.selectedTrip.options.forEach((_, i) => {
    const lbl = document.getElementById(`opt-label-${i}`);
    if (!lbl) return;
    lbl.style.borderColor = i === index ? 'var(--teal)' : 'var(--border,#e0e0e0)';
    lbl.style.background = i === index ? 'rgba(7,151,168,0.06)' : '#fff';
  });

  updateSummary();
}

function renderTripSelector(){
  renderTripOptionSelector(state.selectedTrip || {});
}

// ── CALENDAR ──
function renderCal(){
  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  $('cal-month-label').textContent=`${MONTHS[state.calMonth]} ${state.calYear}`;
  const firstDay=new Date(state.calYear,state.calMonth,1).getDay();
  const daysInMonth=new Date(state.calYear,state.calMonth+1,0).getDate();
  let html='';
  for(let i=0;i<firstDay;i++)html+=`<div class="date-cell empty"></div>`;
  for(let d=1;d<=daysInMonth;d++){
    const date=new Date(state.calYear,state.calMonth,d);
    const isPast=date<today;
    const isToday=date.toDateString()===now.toDateString();
    const dateStr=`${state.calYear}-${String(state.calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isSel=state.selectedDate===dateStr;
    let cls='date-cell';
    if(isPast)cls+=' past';
    else if(isSel)cls+=' selected';
    else if(isToday)cls+=' today';
    html+=`<div class="${cls}"${!isPast?` onclick="selectDate('${dateStr}')"`:''}>${d}</div>`;
  }
  $('date-grid').innerHTML=html;
}

function changeMonth(dir){
  state.calMonth+=dir;
  if(state.calMonth>11){state.calMonth=0;state.calYear++;}
  if(state.calMonth<0){state.calMonth=11;state.calYear--;}
  renderCal();
}

function selectDate(d){
  state.selectedDate=d;
  renderCal();
  $('btn-next-2').disabled=false;
  renderTripSelector();
  updateSummary();
}

// ── COUNTERS ──
function changeCount(type,dir){
  if(type==='adults')state.adults=Math.max(1,state.adults+dir);
  if(type==='children')state.children=Math.max(0,state.children+dir);
  $('count-adults').textContent=state.adults;
  $('count-children').textContent=state.children;
  renderTripSelector();
  updateSummary();
}

// ── CONTACT METHOD ──
const contactFieldTemplates={
  whatsapp:`<div class="form-group"><label class="form-label">WhatsApp Number *</label><input class="form-input" type="tel" id="f-wa" placeholder="+1 234 567 8900" oninput="updateSummary()"/></div><div class="form-group"><label class="form-label">Email Address *</label><input class="form-input" type="email" id="f-email" placeholder="your@email.com" oninput="updateSummary()"/></div>`,
  email:`<div class="form-group full"><label class="form-label">Email Address *</label><input class="form-input" type="email" id="f-email" placeholder="your@email.com" oninput="updateSummary()"/></div>`,
  both:`<div class="form-group"><label class="form-label">WhatsApp Number *</label><input class="form-input" type="tel" id="f-wa" placeholder="+1 234 567 8900" oninput="updateSummary()"/></div><div class="form-group"><label class="form-label">Email Address *</label><input class="form-input" type="email" id="f-email" placeholder="your@email.com" oninput="updateSummary()"/></div>`
};
const contactOptIds={whatsapp:'wa',email:'email',both:'both'};

function selectContact(method){
  state.contactMethod=method;
  ['wa','email','both'].forEach(k=>$('copt-'+k).classList.remove('selected'));
  $('copt-'+contactOptIds[method]).classList.add('selected');
  $('contact-fields').innerHTML=contactFieldTemplates[method]||contactFieldTemplates.whatsapp;
}

// ── SUMMARY ──
function updateSummary(){
  const t=state.selectedTrip;
  const fname=$('f-fname')?.value||'';
  const lname=$('f-lname')?.value||'';
  let rows='';
  if(t)rows+=`<div class="summary-row"><span class="summary-key">Trip</span><span class="summary-val">${t.name}</span></div>`;
  if(state.selectedDate)rows+=`<div class="summary-row"><span class="summary-key">Date</span><span class="summary-val">${formatDate(state.selectedDate)}</span></div>`;
  if(t||state.adults)rows+=`<div class="summary-row"><span class="summary-key">Guests</span><span class="summary-val">${state.adults} adult${state.adults!==1?'s':''}${state.children>0?` + ${state.children} child`+(state.children>1?'ren':''):''}</span></div>`;
  if(fname||lname)rows+=`<div class="summary-row"><span class="summary-key">Name</span><span class="summary-val">${esc(fname)} ${esc(lname)}</span></div>`;
  if(t){
    const price=(state.selectedOption?.priceNum||t.priceNum);
    const total=price*state.adults;
    if(state.selectedOption)rows+=`<div class="summary-row"><span class="summary-key">Option</span><span class="summary-val">${esc(state.selectedOption.label)}</span></div>`;
    rows+=`<div class="summary-total"><span class="summary-total-label">Estimated Total</span><span class="summary-total-val">From $${total}</span></div>`;
  }
  const content=rows||'<div class="summary-empty">Complete the steps to see your summary here.</div>';
  const sc=$('summary-content');
  if(sc)sc.innerHTML=content;
  const st=$('booking-summary-top');
  if(st)st.innerHTML=content;
}

// ── SUBMIT ──
async function submitBooking(){
  const submitBtn = document.querySelector('.btn-submit');
  if (submitBtn?.disabled) return;
  const restoreBtn = () => {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.dataset.origText || '✓ Send Reservation';
    submitBtn.style.opacity = '';
    submitBtn.style.cursor = '';
  };
  const setLoading = () => {
    if (!submitBtn) return;
    if (!submitBtn.dataset.origText) submitBtn.dataset.origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Booking...';
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
  };

  setLoading();

  const fname=$('f-fname')?.value?.trim();
  const lname=$('f-lname')?.value?.trim();
  if(!fname||!lname){restoreBtn();alert('Please enter your full name.');return;}
  const waVal=$('f-wa')?.value?.trim();
  const emailVal=$('f-email')?.value?.trim();
  const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if((state.contactMethod==='whatsapp'||state.contactMethod==='both')&&!waVal){
    restoreBtn();alert('Please enter your WhatsApp number.');return;
  }
  // Email required for all methods — needed to send booking confirmation
  if(!emailVal){restoreBtn();alert('Please enter your email address — we need it to send your booking confirmation.');return;}
  if(!emailRegex.test(emailVal)){restoreBtn();alert('Please enter a valid email address (e.g. name@example.com).');return;}
  const t=state.selectedTrip;
  if(!t){restoreBtn();alert('Please select a trip first.');return;}
  if(!state.selectedDate){
    restoreBtn();alert('Please select a travel date before continuing.');
    goStep(2);
    return;
  }
  if((state.adults + state.children) < 1){
    restoreBtn();alert('Please add at least 1 guest.');
    goStep(2);
    return;
  }
  // confirm selectedOption — fallback to first if missing
  if (t.options && t.options.length > 0 && !state.selectedOption) {
    state.selectedOption = t.options[0];
  }

  // ── إرسال الحجز للـ Backend ──────────────────────────────────────
  const bookingData = {
    trip_id:         t.id,
    date:            state.selectedDate,
    guests_adults:   state.adults,
    guests_children: state.children,
    contact_name:    `${fname} ${lname}`,
    contact_phone:   $('f-wa')?.value?.trim() || null,
    contact_email:   emailVal,
    contact_method:  state.contactMethod,
    special_requests: $('f-notes')?.value?.trim() || null
  };

  let bookingId = null;

  try {
    const result = await BookingsAPI.create(bookingData);
    bookingId = result.id;

    // حفظ الحجز في My Bookings محلياً للمستخدم
    try {
      const bookingRecord = {
        id: bookingId,
        trip: t.name,
        date: state.selectedDate ? formatDate(state.selectedDate) : 'Not selected',
        adults: state.adults,
        children: state.children,
        name: `${fname} ${lname}`,
        contact: state.contactMethod,
        status: 'Pending Confirmation',
        submittedAt: new Date().toISOString()
      };
      const _myBookings = JSON.parse(localStorage.getItem('bts_my_bookings') || '[]');
      _myBookings.unshift(bookingRecord);
      localStorage.setItem('bts_my_bookings', JSON.stringify(_myBookings.slice(0, 20)));
    } catch(_e) {}

  } catch(err) {
    restoreBtn();
 alert('Something went wrong. Please try again or contact us on WhatsApp.');
    console.error('[Booking] API error:', err);
    // Fallback: mailto لو البيانات موجودة
    _openMailto(t, fname, lname, {
      from_name: `${fname} ${lname}`,
      trip_name: t.name,
      trip_date: state.selectedDate ? formatDate(state.selectedDate) : 'Not selected',
      adults: state.adults,
      children: state.children,
      contact_method: state.contactMethod,
      whatsapp: $('f-wa')?.value || 'N/A',
      email: emailVal,
      notes: $('f-notes')?.value || 'None'
    });
    return;
  } finally {
    restoreBtn();
  }

  // Show success panel
  const _confirmEl = document.createElement('div');
  _confirmEl.style.cssText = 'text-align:center;margin-bottom:1.2rem';
  _confirmEl.innerHTML = `
    <p style="font-family:Outfit,sans-serif;font-size:1.05rem;color:var(--teal);font-weight:700;margin:0 0 0.35rem">
      🎉 Booking Request Sent!
    </p>
    <p style="font-family:Outfit,sans-serif;font-size:0.8rem;color:var(--ink-mid,#888);font-weight:400;margin:0">
      A confirmation has been sent to ${esc(emailVal)} — we will contact you within 24 hours.
    </p>`;
  $('success-details').innerHTML=`
    <div class="success-detail-row"><span>Trip</span><span>${t.name}</span></div>
    <div class="success-detail-row"><span>Date</span><span>${state.selectedDate?formatDate(state.selectedDate):'TBD'}</span></div>
    <div class="success-detail-row"><span>Guests</span><span>${state.adults} adult${state.adults!==1?'s':''}${state.children>0?` + ${state.children} child`+(state.children>1?'ren':''):''}</span></div>
    <div class="success-detail-row"><span>Name</span><span>${esc(fname)} ${esc(lname)}</span></div>
    ${bookingId ? `<div class="success-detail-row"><span>Reference</span><span style="font-size:0.75rem;color:var(--ink-light)">${bookingId}</span></div>` : ''}`;
  $('success-details').prepend(_confirmEl);
  document.querySelectorAll('.step-panel').forEach(p=>p.classList.remove('active'));
  $('panel-success').classList.add('active');
  $('booking')?.scrollIntoView({behavior:'smooth'});
}

function _openMailto(t, fname, lname, p) {
  const subject = `Trip Booking Request: ${t.name}`;
  const body =
    `New Booking Request from Beyond The Shore Website\n\n` +
    `Name: ${p.from_name}\n` +
    `Trip: ${p.trip_name}\n` +
    `Date: ${p.trip_date}\n` +
    `Adults: ${p.adults}\nChildren: ${p.children}\n` +
    `Nationality: ${p.nationality}\n` +
    `Contact Method: ${p.contact_method}\n` +
    `WhatsApp: ${p.whatsapp}\nEmail: ${p.email}\n` +
    `Notes: ${p.notes}\n`;
  window.location.href = `mailto:beyondtheshore.egypt@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

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

// ── HERO DESTINATION SWITCH ──
function switchDestHero(dest,el){
  document.querySelectorAll('#hero-dest-chips .hero-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  const hero=$('hero-section');
  const d=heroData[dest];
  hero.classList.add('hero-fade');
  setTimeout(()=>{
    hero.classList.remove('dest-marsa','dest-luxor','dest-aswan');
    hero.classList.add(d.theme);
    $('hero-eyebrow').textContent=d.eyebrow;
    $('hero-h1').innerHTML=d.h1;
    $('hero-sub').textContent=d.sub;
    $('search-input').placeholder=d.search;
    const mainImg=$('hcard-main-img');
    mainImg.textContent=d.main.icon;
    mainImg.style.background=d.main.bg;
    $('hcard-main-name').textContent=d.main.name;
    $('hcard-main-loc').textContent='📍 '+d.main.loc;
    $('hcard-main-price').textContent=d.main.price;
    const sm1img=$('hcard-sm1-img');
    sm1img.textContent=d.sm1.icon;
    sm1img.style.background=d.sm1.bg;
    $('hcard-sm1-name').textContent=d.sm1.name;
    $('hcard-sm1-price').textContent=d.sm1.price;
    const sm2img=$('hcard-sm2-img');
    sm2img.textContent=d.sm2.icon;
    sm2img.style.background=d.sm2.bg;
    $('hcard-sm2-name').textContent=d.sm2.name;
    $('hcard-sm2-price').textContent=d.sm2.price;
    $('pill-a').textContent=d.pills[0];
    $('pill-b').textContent=d.pills[1];
    document.querySelector('.stats').innerHTML=d.stats.map(s=>`<div class="stat"><span class="stat-n">${s.n}</span><span class="stat-l">${s.l}</span></div>`).join('');
    hero.classList.remove('hero-fade');
    switchDest(dest);
  },350);
}

// ── INIT ──
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('nav');
  if(nav)nav.classList.toggle('scrolled',window.scrollY>40);
},{passive:true});

if($('hero-section'))$('hero-section').classList.add('dest-marsa');
(async () => {
  const grid = $('trips-grid');
  if (grid) {
    grid.innerHTML = `<div style="grid-column:1/-1;padding:3rem;text-align:center;color:var(--ink-light,#888);font-family:Outfit,sans-serif">Loading trips…</div>`;
  }
  await initTripsData();
  activeDest = window.activeDest || 'marsa';
  trips = window.trips || (window.allTrips || {})[activeDest] || [];
  if (grid) renderTrips();
  if ($('trip-options')) renderTripOptions();
  if ($('date-grid')) renderCal();
})();

// ── Newsletter Subscribe ──
async function subscribeNewsletter(inputEl, feedbackId) {
  const emailInput = inputEl || document.getElementById('newsletter-email');
  const feedbackEl = document.getElementById(feedbackId || 'newsletter-feedback');
  const btn = document.getElementById('newsletter-btn');

  if (!emailInput || !feedbackEl) return;

  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    feedbackEl.innerHTML = '<span class="nl-error">Please enter your email address.</span>';
    return;
  }
  if (!emailRegex.test(email)) {
    feedbackEl.innerHTML = '<span class="nl-error">Please enter a valid email address.</span>';
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = '...'; }
  feedbackEl.innerHTML = '';

  try {
    await fetch(`${(window.BTS_CONFIG && window.BTS_CONFIG.API_URL) || ''}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    emailInput.value = '';
    feedbackEl.innerHTML = '<span class="nl-success">✓ You\'re in! We\'ll be in touch.</span>';
  } catch(e) {
    // Silently succeed — newsletter is non-critical
    emailInput.value = '';
    feedbackEl.innerHTML = '<span class="nl-success">✓ You\'re in! We\'ll be in touch.</span>';
    console.warn('[Newsletter] Backend error (non-critical):', e);
  }

  if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
}
