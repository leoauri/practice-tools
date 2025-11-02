/**
 * Speed Standards - Song selection and UI management
 * Based on weighted selection algorithm from speed_up_standards.ipynb
 */

const API_BASE = '/api/speed-standards';

// Song selection algorithm
class Song {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.achieved = parseFloat(data.achieved) || 0;
    this.target = parseFloat(data.target) || 0;
  }
}

function weight(song) {
  if (song.target === 0) return 1;
  return 1 - (song.achieved / song.target);
}

function tried(repertoire) {
  return repertoire.filter(s => s.target !== 0);
}

function untried(repertoire) {
  return repertoire.filter(s => s.target === 0);
}

function untriedSong(repertoire) {
  const untriedSongs = untried(repertoire);
  if (untriedSongs.length === 0) {
    throw new Error("No untried songs available");
  }
  return untriedSongs[Math.floor(Math.random() * untriedSongs.length)];
}

function unachieved(repertoire) {
  return repertoire.filter(s => s.target > 0 && s.achieved === 0);
}

function averageWeight(repertoire) {
  const triedSongs = tried(repertoire);
  const triedWeights = triedSongs
    .map(s => weight(s))
    .filter(w => w > 0);

  if (triedWeights.length > 0) {
    return triedWeights.reduce((a, b) => a + b, 0) / triedWeights.length;
  }
  return 1;
}

function weightedChoice(items, weights) {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  return items[items.length - 1];
}

function songToPractice(repertoire) {
  const unachievedSongs = unachieved(repertoire);

  if (unachievedSongs.length > 0) {
    return unachievedSongs[Math.floor(Math.random() * unachievedSongs.length)];
  }

  const triedSongs = tried(repertoire);
  const untriedSongs = untried(repertoire);

  if (triedSongs.length === 0 && untriedSongs.length === 0) {
    throw new Error("No songs available in repertoire");
  }

  const selectionPool = [...triedSongs];
  const weightsPool = triedSongs.map(s => weight(s));

  if (untriedSongs.length > 0) {
    selectionPool.push(untriedSong(repertoire));
    weightsPool.push(averageWeight(repertoire));
  }

  return weightedChoice(selectionPool, weightsPool);
}

// API functions
async function fetchRepertoire() {
  const response = await fetch(`${API_BASE}/repertoire`);
  if (!response.ok) {
    throw new Error('Failed to fetch repertoire');
  }
  const data = await response.json();
  return data.map(song => new Song(song));
}

async function updateSong(id, achieved, target) {
  const response = await fetch(`${API_BASE}/song/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ achieved, target }),
  });
  if (!response.ok) {
    throw new Error('Failed to update song');
  }
  return response.json();
}

// UI functions
function showError(message) {
  const errorEl = document.getElementById('error');
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

function hideError() {
  const errorEl = document.getElementById('error');
  errorEl.style.display = 'none';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

function renderSelectedSong(song) {
  const container = document.getElementById('selected-song');
  container.innerHTML = `
    <div class="song-card selected">
      <h3>${song.title}</h3>
      <div class="song-stats">
        <span>Current: ${song.achieved} BPM</span>
        ${song.target > 0 ? `<span>Target: ${song.target} BPM</span>` : '<span>No target set</span>'}
        ${song.target > 0 ? `<span>Progress: ${Math.round((song.achieved / song.target) * 100)}%</span>` : ''}
      </div>
    </div>
  `;
}

function renderRepertoire(repertoire) {
  const container = document.getElementById('repertoire-list');

  const triedSongs = tried(repertoire).sort((a, b) => a.title.localeCompare(b.title));
  const untriedSongs = untried(repertoire).sort((a, b) => a.title.localeCompare(b.title));

  let html = '';

  if (triedSongs.length > 0) {
    html += '<h3>In Progress</h3><div class="songs-grid">';
    triedSongs.forEach(song => {
      const progress = song.target > 0 ? (song.achieved / song.target) * 100 : 0;
      const progressClass = progress >= 100 ? 'complete' : progress > 0 ? 'in-progress' : 'unachieved';

      html += `
        <div class="song-card ${progressClass}" data-id="${song.id}">
          <h4>${song.title}</h4>
          <div class="song-stats">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
            </div>
            <span>${song.achieved} / ${song.target} BPM</span>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }

  if (untriedSongs.length > 0) {
    html += '<h3>Not Yet Tried</h3><div class="songs-grid">';
    untriedSongs.forEach(song => {
      html += `
        <div class="song-card untried" data-id="${song.id}">
          <h4>${song.title}</h4>
          <div class="song-stats">
            <span>No target set</span>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }

  container.innerHTML = html;
}

// Initialize app
let repertoire = [];

async function init() {
  try {
    repertoire = await fetchRepertoire();
    hideLoading();
    hideError();
    renderRepertoire(repertoire);
  } catch (error) {
    hideLoading();
    showError('Failed to load repertoire. Please check your connection and try again.');
    console.error('Error loading repertoire:', error);
  }
}

document.getElementById('select-song').addEventListener('click', () => {
  if (repertoire.length === 0) {
    showError('No songs available. Please reload the page.');
    return;
  }

  try {
    const selected = songToPractice(repertoire);
    renderSelectedSong(selected);
    hideError();
  } catch (error) {
    showError('Could not select a song. Please try again.');
    console.error('Error selecting song:', error);
  }
});

// Start the app
init();
