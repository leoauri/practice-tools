/**
 * Octave optimization for treble clef display
 */

import { getLetterIndex } from './utils.js';

// Treble clef staff range (absolute letter indices)
const STAFF_LOW = 4 * 7 + 2;  // E4 = 30
const STAFF_HIGH = 5 * 7 + 3; // F5 = 38

/**
 * Get absolute letter index from VexFlow note name
 * @param {string} noteName - VexFlow note name (e.g., 'C#/4')
 * @returns {number} Absolute letter index (octave * 7 + letterIndex)
 */
function getAbsoluteLetterIndex(noteName) {
  const [note, octaveStr] = noteName.split('/');
  const octave = parseInt(octaveStr);
  const letterIndex = getLetterIndex(note);
  return octave * 7 + letterIndex;
}

/**
 * Count ledger lines needed for a note on treble clef
 * @param {string} noteName - VexFlow note name (e.g., 'C#/4')
 * @returns {number} Number of ledger lines needed
 */
export function countLedgerLines(noteName) {
  const absoluteIndex = getAbsoluteLetterIndex(noteName);

  if (absoluteIndex >= STAFF_LOW && absoluteIndex <= STAFF_HIGH) {
    return 0; // On staff
  } else if (absoluteIndex < STAFF_LOW) {
    // Below staff
    return Math.floor((STAFF_LOW - absoluteIndex) / 2);
  } else {
    // Above staff
    return Math.floor((absoluteIndex - STAFF_HIGH) / 2);
  }
}

/**
 * Transpose all notes by a number of octaves
 * @param {Array<string>} noteNames - VexFlow note names
 * @param {number} octaveShift - Number of octaves to shift
 * @returns {Array<string>} Transposed note names
 */
function transposeOctaves(noteNames, octaveShift) {
  return noteNames.map(name => {
    const [note, octaveStr] = name.split('/');
    const newOctave = parseInt(octaveStr) + octaveShift;
    return `${note}/${newOctave}`;
  });
}

/**
 * Calculate total ledger lines for a scale
 * @param {Array<string>} noteNames - VexFlow note names
 * @returns {number} Total ledger lines
 */
function totalLedgerLines(noteNames) {
  return noteNames.reduce((sum, name) => sum + countLedgerLines(name), 0);
}

/**
 * Optimize scale octave placement for treble clef
 * Uses the convex property: transpose down until no improvement, then up
 * @param {Array<string>} noteNames - VexFlow note names
 * @returns {Array<string>} Optimally transposed note names
 */
export function optimizeForTrebleClef(noteNames) {
  let current = noteNames;
  let currentScore = totalLedgerLines(current);

  // Try transposing down until no improvement
  while (true) {
    const down = transposeOctaves(current, -1);
    const downScore = totalLedgerLines(down);

    if (downScore < currentScore) {
      current = down;
      currentScore = downScore;
    } else {
      break;
    }
  }

  // Try transposing up until no improvement
  while (true) {
    const up = transposeOctaves(current, 1);
    const upScore = totalLedgerLines(up);

    if (upScore < currentScore) {
      current = up;
      currentScore = upScore;
    } else {
      break;
    }
  }

  return current;
}
