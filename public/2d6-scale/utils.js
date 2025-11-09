/**
 * Shared utility functions for music notation
 */

/**
 * Get letter index (0-6) from note name
 * @param {string} noteName - Note name (e.g., 'C#', 'Bb', 'D')
 * @returns {number} Letter index (C=0, D=1, E=2, F=3, G=4, A=5, B=6)
 */
export function getLetterIndex(noteName) {
  const letter = noteName[0];
  return ['C', 'D', 'E', 'F', 'G', 'A', 'B'].indexOf(letter);
}
