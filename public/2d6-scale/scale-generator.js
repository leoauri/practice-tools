/**
 * 2d6 Scale Generator
 * Generates musical scales using a 2d6 dice algorithm
 */

import { chooseAccidentals } from './accidentals.js';
import { optimizeForTrebleClef } from './octave-optimization.js';

/**
 * Generate a scale using the 2d6 algorithm
 * @returns {Array} Array of semitone values (0-indexed from C)
 */
function generate2d6Scale() {
  const s = []; // Empty set

  // Step 2: Choose a uniformly random note (0-11 representing C to B)
  const initialNote = Math.floor(Math.random() * 12);
  let n = initialNote;
  const r = n; // Reference note

  // Step 4-8: Loop
  while (true) {
    // Step 4: Append n to s
    s.push(n);

    // Step 5: Roll 2d6, take the lower value
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const x = Math.min(die1, die2);

    // Step 6: n := n - x (moving down in pitch)
    n = n - x;

    // Step 7: Check stopping condition
    if (n <= r - 12) {
      break;
    }
  }

  return s;
}

/**
 * Render scale using VexFlow
 * @param {Array} scale - Array of semitone values
 * @param {string} containerId - DOM element ID to render into
 */
function renderScale(scale, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear previous content

  const VF = Vex.Flow;

  // Create renderer
  const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);

  // Calculate width based on number of notes (give some padding)
  const noteWidth = 80;
  const padding = 100;
  const width = Math.max(500, scale.length * noteWidth + padding);
  const height = 200;

  renderer.resize(width, height);
  const context = renderer.getContext();

  // Create stave
  const stave = new VF.Stave(10, 40, width - 20);
  stave.addClef('treble');
  stave.setContext(context).draw();

  // Choose accidentals intelligently
  let noteNames = chooseAccidentals(scale);

  // Optimize octave placement for treble clef
  noteNames = optimizeForTrebleClef(noteNames);

  // Convert scale to VexFlow notes
  const vexNotes = noteNames.map(noteName => {
    const note = new VF.StaveNote({
      keys: [noteName],
      duration: 'q' // Quarter note
    });

    // Add accidentals for sharp or flat notes
    if (noteName.includes('#')) {
      note.addModifier(new VF.Accidental('#'), 0);
    } else if (noteName.includes('b')) {
      note.addModifier(new VF.Accidental('b'), 0);
    }

    return note;
  });

  // Create voice and add notes
  const voice = new VF.Voice({ num_beats: scale.length, beat_value: 4 });
  voice.addTickables(vexNotes);

  // Format and draw
  const formatter = new VF.Formatter();
  formatter.joinVoices([voice]).format([voice], width - 40);
  voice.draw(context, stave);
}

// UI Event Handlers
function generateNewScale() {
  const scale = generate2d6Scale();
  // Reverse to show ascending instead of descending
  const ascendingScale = scale.reverse();
  // Append the first note an octave higher
  const firstNote = ascendingScale[0];
  const octaveHigher = firstNote + 12;
  ascendingScale.push(octaveHigher);

  renderScale(ascendingScale, 'scale-display');
}

// Initialize
document.getElementById('generate-btn').addEventListener('click', generateNewScale);

// Generate initial scale on load
window.addEventListener('load', () => {
  generateNewScale();
});
