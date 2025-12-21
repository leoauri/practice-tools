/**
 * Strategy Cards - Random card selection and creation
 */

const API_BASE = '/api/strategy-cards';
let isEditMode = false;

// API functions
async function fetchRandomCard() {
  const response = await fetch(`${API_BASE}/random`);
  if (!response.ok) {
    throw new Error('Failed to fetch card');
  }
  return response.json();
}

async function createCard(content) {
  const response = await fetch(`${API_BASE}/card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Failed to create card');
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

function renderCard(card) {
  isEditMode = false;

  const container = document.getElementById('card-display');
  container.innerHTML = `
    <div class="strategy-card">
      <div class="card-content">${card.content}</div>
    </div>
  `;
}

function showEditMode() {
  isEditMode = true;

  const container = document.getElementById('card-display');
  container.innerHTML = `
    <div class="strategy-card edit-mode">
      <textarea
        id="card-content-input"
        class="card-content-input"
        autofocus
      ></textarea>
      <div class="card-actions">
        <button id="save-card" class="btn btn-save">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Focus the textarea
  setTimeout(() => {
    document.getElementById('card-content-input').focus();
  }, 0);

  // Attach save button event
  document.getElementById('save-card').addEventListener('click', handleSaveCard);
}

function cancelEditMode() {
  isEditMode = false;

  const container = document.getElementById('card-display');
  container.innerHTML = '';
  hideError();
}

// Event handlers
document.getElementById('draw-card').addEventListener('click', async () => {
  try {
    const card = await fetchRandomCard();
    renderCard(card);
    hideError();
  } catch (error) {
    showError('Failed to draw card. Please try again.');
    console.error('Error drawing card:', error);
  }
});

document.getElementById('new-card').addEventListener('click', () => {
  hideError();
  showEditMode();
});

async function handleSaveCard() {
  const textarea = document.getElementById('card-content-input');
  if (!textarea) return;

  const content = textarea.value.trim();

  if (!content) {
    showError('Please enter card content.');
    return;
  }

  try {
    await createCard(content);
    hideError();

    // Display the saved card
    renderCard({ content });
  } catch (error) {
    showError('Failed to save card. Please try again.');
    console.error('Error creating card:', error);
  }
}
