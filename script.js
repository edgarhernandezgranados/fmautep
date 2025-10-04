const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
    if (menu) menu.classList.remove('show');
  });
});
document.getElementById('year').textContent = new Date().getFullYear();

async function renderEvents(){
  try{
    const res = await fetch('data/events.json', {cache:'no-store'});
    const events = await res.json();
    const container = document.getElementById('events-grid');
    container.innerHTML = '';
    if (!events.length){
      container.innerHTML = '<p>No upcoming events yet — check back soon.</p>';
      return;
    }
    const formatter = new Intl.DateTimeFormat(undefined, {dateStyle:'medium', timeStyle:'short'});
    events.sort((a,b)=> new Date(a.datetime) - new Date(b.datetime)).forEach(ev=>{
      const li = document.createElement('article');
      li.className = 'card';
      li.setAttribute('role','listitem');
      li.innerHTML = `
        <div class="card__body">
          <div class="card__eyebrow">${ev.type || 'Event'}</div>
          <h3>${ev.title}</h3>
          <p>${ev.summary}</p>
          <div class="card__meta">
            <span>📅 ${formatter.format(new Date(ev.datetime))}</span>
            ${ev.location ? `<span>📍 ${ev.location}</span>` : ''}
          </div>
        </div>
        <div class="card__footer">
          <a class="btn btn--small" href="${ev.rsvp || '#'}" target="_blank" rel="noopener">RSVP</a>
          ${ev.speaker ? `<span class="small">Speaker: ${ev.speaker}</span>` : ''}
        </div>`;
      container.appendChild(li);
    });
  }catch(e){ console.error(e); }
}

async function renderOfficers(){
  try{
    const res = await fetch('data/officers.json', {cache:'no-store'});
    const officers = await res.json();
    const container = document.getElementById('officers-grid');
    container.innerHTML = '';
    officers.forEach(p=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('role','listitem');
      card.innerHTML = `
        ${p.photo ? `<img class="card__avatar" src="${p.photo}" alt="${p.name}" loading="lazy">` : `<div class="card__avatar" aria-hidden="true"></div>`}
        <div class="card__body">
          <h3>${p.name}</h3>
          <p class="small" style="color:var(--brand)">${p.role}</p>
          ${p.bio ? `<p>${p.bio}</p>` : ''}
        </div>
        <div class="card__footer">
          <div class="person small">
            ${p.email ? `<a href="mailto:${p.email}">Email</a>` : ''}
            ${p.linkedin ? `<span>•</span><a href="${p.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
          </div>
        </div>`;
      container.appendChild(card);
    });
  }catch(e){ console.error(e); }
}

renderEvents();
renderOfficers();
