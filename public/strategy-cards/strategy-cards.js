/**
 * Strategy Cards - Random card selection
 */

const API_BASE = '/api/strategy-cards';

// API functions
async function fetchRandomCard() {
  const response = await fetch(`${API_BASE}/random`);
  if (!response.ok) {
    throw new Error('Failed to fetch card');
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
  const container = document.getElementById('card-display');
  container.innerHTML = `
    <div class="strategy-card">
      <div class="card-content">${card.content}</div>
    </div>
  `;
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
