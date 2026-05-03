const TMDB_API_KEY = '8265bd1679663a7ea12ac168da84d2e8';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

let allCards = [];

async function loadTitles() {
  const res = await fetch('data/titles.json');
  if (!res.ok) throw new Error('Could not load titles.json');
  return res.json();
}

async function fetchTMDB(tmdbId, type) {
  if (!tmdbId) return null;
  const endpoint = type === 'tv' ? 'tv' : 'movie';
  try {
    const res = await fetch(
      `${TMDB_BASE}/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function resolveTitle(entry, tmdb) {
  if (!tmdb) return entry.title || entry.id;
  return entry.type === 'tv'
    ? (tmdb.name || tmdb.original_name || entry.title || entry.id)
    : (tmdb.title || tmdb.original_title || entry.title || entry.id);
}

function resolveYear(entry, tmdb) {
  if (!tmdb) return '';
  const dateStr = entry.type === 'tv' ? tmdb.first_air_date : tmdb.release_date;
  return dateStr ? dateStr.slice(0, 4) : '';
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildCard(entry, tmdb) {
  const type = entry.type;
  const title = resolveTitle(entry, tmdb);
  const year = resolveYear(entry, tmdb);
  const posterPath = tmdb?.poster_path || null;
  const overview = tmdb?.overview || '';

  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = entry.id;
  card.dataset.type = type;
  card.dataset.title = title.toLowerCase();
  card.dataset.connection = entry.saudi_connection.toLowerCase();

  const posterHtml = posterPath
    ? `<img class="card-poster" src="${TMDB_IMG}${posterPath}" alt="${escHtml(title)} poster" loading="lazy">`
    : `<div class="card-poster-placeholder">No Poster</div>`;

  card.innerHTML = `
    ${posterHtml}
    <div class="card-body">
      <div class="card-meta">
        <span class="badge badge-${type}">${type === 'tv' ? 'TV' : 'Film'}</span>
        ${year ? `<span class="card-year">${year}</span>` : ''}
      </div>
      <div class="card-title">${escHtml(title)}</div>
      <div class="card-connection">${escHtml(entry.saudi_connection)}</div>
      <div class="card-more">View details →</div>
    </div>
  `;

  card.addEventListener('click', () => openModal(entry, tmdb, title, year, overview, posterPath));
  return card;
}

function openModal(entry, tmdb, title, year, overview, posterPath) {
  const overlay = document.getElementById('modal-overlay');
  const type = entry.type;

  const posterHtml = posterPath
    ? `<img src="${TMDB_IMG}${posterPath}" alt="${escHtml(title)} poster">`
    : `<div class="modal-poster-placeholder">No Poster</div>`;

  overlay.querySelector('.modal').innerHTML = `
    <div class="modal-header">
      <div class="modal-poster">${posterHtml}</div>
      <div class="modal-info">
        <div class="modal-meta">
          <span class="badge badge-${type}">${type === 'tv' ? 'TV' : 'Film'}</span>
          ${year ? `<span class="modal-year">${year}</span>` : ''}
        </div>
        <div class="modal-title">${escHtml(title)}</div>
        ${overview ? `<div class="modal-overview">${escHtml(overview)}</div>` : ''}
      </div>
    </div>
    <div class="modal-body">
      <div>
        <div class="modal-section-label">Saudi Connection</div>
        <div class="modal-connection-text">${escHtml(entry.saudi_connection)}</div>
      </div>
      <div>
        <div class="modal-section-label">Source</div>
        <a class="modal-source-link" href="${escHtml(entry.source_url)}" target="_blank" rel="noopener noreferrer">
          ↗ ${escHtml(entry.source_url)}
        </a>
      </div>
    </div>
    <div class="modal-close-row">
      <button class="modal-close-btn" id="modal-close-btn">Close</button>
    </div>
  `;

  overlay.classList.add('open');
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function filterCards(query, typeFilter) {
  const q = query.toLowerCase().trim();
  let visible = 0;

  allCards.forEach(({ entry, el }) => {
    const matchesQuery = !q
      || el.dataset.title.includes(q)
      || el.dataset.connection.includes(q);
    const matchesType = typeFilter === 'all' || el.dataset.type === typeFilter;

    const show = matchesQuery && matchesType;
    el.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  document.getElementById('empty').style.display = visible === 0 ? 'block' : 'none';
}

async function init() {
  const grid = document.getElementById('grid');
  const loading = document.getElementById('loading');
  const errorMsg = document.getElementById('error-msg');

  let titles;
  try {
    titles = await loadTitles();
  } catch {
    loading.style.display = 'none';
    errorMsg.style.display = 'block';
    errorMsg.textContent =
      'Failed to load title data. Make sure you\'re serving this over HTTP, not opening the file directly.';
    return;
  }

  const results = await Promise.all(
    titles.map(async (entry) => ({
      entry,
      tmdb: await fetchTMDB(entry.tmdb_id, entry.type),
    }))
  );

  loading.style.display = 'none';

  results.forEach(({ entry, tmdb }) => {
    const el = buildCard(entry, tmdb);
    grid.appendChild(el);
    allCards.push({ entry, tmdb, el });
  });

  document.getElementById('count').textContent =
    `${titles.length} title${titles.length !== 1 ? 's' : ''} documented`;

  const search = document.getElementById('search');
  let filterType = 'all';

  search.addEventListener('input', () => filterCards(search.value, filterType));

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filterType = btn.dataset.filter;
      filterCards(search.value, filterType);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal-overlay');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  init();
});
