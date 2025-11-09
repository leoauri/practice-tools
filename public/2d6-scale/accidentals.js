/**
 * Accidental choice logic for musical scales
 * Follows guidelines in guidelines/accidental-choice.md
 */

const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const BLACK_KEYS = [1, 3, 6, 8, 10]; // C#/Db, D#/Eb, F#/Gb, G#/Ab, A#/Bb

/**
 * Get letter index (0-6) from note name
 * @param {string} noteName - Note name (e.g., 'C#', 'Bb', 'D')
 * @returns {number} Letter index (C=0, D=1, E=2, F=3, G=4, A=5, B=6)
 */
function getLetterIndex(noteName) {
  const letter = noteName[0];
  return ['C', 'D', 'E', 'F', 'G', 'A', 'B'].indexOf(letter);
}

/**
 * Check if interval is valid based on semitone and letter distance
 * @param {number} semitoneDistance - Distance in semitones (0-11)
 * @param {number} letterDistance - Distance in letter names (0-6)
 * @returns {boolean} True if valid interval
 */
function isValidInterval(semitoneDistance, letterDistance) {
  // Interval validation from guidelines
  const validIntervals = {
    0: [0],           // Unison ↔ 0 semitone
    1: [1, 2],        // Second ↔ 1 or 2 semitones
    2: [3, 4],        // Third ↔ 3 or 4 semitones
    3: [5, 6],        // Fourth ↔ 5 or 6 semitones
    4: [6, 7],        // Fifth ↔ 6 or 7 semitones
    5: [8, 9],        // Sixth ↔ 8 or 9 semitones
    6: [10, 11]       // Seventh ↔ 10 or 11 semitones
  };

  return validIntervals[letterDistance]?.includes(semitoneDistance) ?? false;
}

/**
 * Score a scale spelling based on interval validity
 * @param {Array<number>} semitones - Array of semitone values
 * @param {Array<string>} noteNames - Array of note names (without octave)
 * @returns {number} Score (-1 per violation, higher is better)
 */
function scoreScale(semitones, noteNames) {
  let score = 0;

  for (let i = 0; i < semitones.length - 1; i++) {
    for (let j = i + 1; j < semitones.length; j++) {
      // Get the two notes
      const sem1 = semitones[i];
      const sem2 = semitones[j];
      const name1 = noteNames[i];
      const name2 = noteNames[j];
      
      // Order agnostic: find lower and upper
      const isAscending = sem2 >= sem1;
      const lowerSem = isAscending ? sem1 : sem2;
      const upperSem = isAscending ? sem2 : sem1;
      const lowerName = isAscending ? name1 : name2;
      const upperName = isAscending ? name2 : name1;
      
      // Calculate interval, normalize to within octave
      const semitoneDistance = (upperSem - lowerSem) % 12;
      
      // Calculate letter distance (upward from lower to upper)
      const lowerLetter = getLetterIndex(lowerName);
      const upperLetter = getLetterIndex(upperName);
      const letterDistance = (upperLetter - lowerLetter + 7) % 7;
      
      // Check validity
      if (!isValidInterval(semitoneDistance, letterDistance)) {
        score -= 1;
      }
    }
  }

  return score;
}

/**
 * Flip accidental (sharp ↔ flat)
 * @param {string} noteName - Note name (e.g., 'C#', 'Db')
 * @returns {string} Flipped note name
 */
function flipAccidental(noteName) {
  const flips = {
    'C#': 'Db', 'Db': 'C#',
    'D#': 'Eb', 'Eb': 'D#',
    'F#': 'Gb', 'Gb': 'F#',
    'G#': 'Ab', 'Ab': 'G#',
    'A#': 'Bb', 'Bb': 'A#'
  };
  return flips[noteName] || noteName;
}

/**
 * Convert semitones to note names with chosen accidentals
 * @param {Array<number>} semitones - Array of semitone values
 * @param {boolean} useSharps - Use sharps (true) or flats (false) for black keys
 * @returns {Array<string>} Array of note names (without octave)
 */
function spellScale(semitones, useSharps) {
  const noteTable = useSharps ? NOTE_NAMES_SHARP : NOTE_NAMES_FLAT;
  return semitones.map(s => {
    const noteIndex = ((s % 12) + 12) % 12;
    return noteTable[noteIndex];
  });
}

/**
 * Check if scale contains any black keys
 * @param {Array<number>} semitones - Array of semitone values
 * @returns {boolean} True if contains black keys
 */
function hasBlackKeys(semitones) {
  return semitones.some(s => {
    const noteIndex = ((s % 12) + 12) % 12;
    return BLACK_KEYS.includes(noteIndex);
  });
}

/**
 * Choose appropriate accidentals for a scale
 * @param {Array<number>} semitones - Array of semitone values (can be negative or > 11)
 * @returns {Array<string>} Array of note names in VexFlow format (e.g., 'C#/4', 'Bb/3')
 */
export function chooseAccidentals(semitones) {
  // Algorithm from guidelines/accidental-choice.md

  // Step 1: If no black notes, return as-is
  if (!hasBlackKeys(semitones)) {
    return semitones.map(s => {
      const octave = Math.floor(s / 12) + 4;
      const noteIndex = ((s % 12) + 12) % 12;
      return `${NOTE_NAMES_SHARP[noteIndex]}/${octave}`;
    });
  }

  // Step 2: Generate sharps and flats versions
  const sharpsSpelling = spellScale(semitones, true);
  const flatsSpelling = spellScale(semitones, false);

  // Step 3: Choose higher scoring version
  const sharpsScore = scoreScale(semitones, sharpsSpelling);
  const flatsScore = scoreScale(semitones, flatsSpelling);

  let bestSpelling = sharpsScore >= flatsScore ? [...sharpsSpelling] : [...flatsSpelling];
  let bestScore = Math.max(sharpsScore, flatsScore);

  // Step 4: For each accidental, try flipping it
  for (let i = 0; i < bestSpelling.length; i++) {
    const noteIndex = ((semitones[i] % 12) + 12) % 12;

    // Only try flipping black keys
    if (BLACK_KEYS.includes(noteIndex)) {
      const original = bestSpelling[i];
      bestSpelling[i] = flipAccidental(original);

      const newScore = scoreScale(semitones, bestSpelling);

      if (newScore > bestScore) {
        // Keep the flip
        bestScore = newScore;
      } else {
        // Revert
        bestSpelling[i] = original;
      }
    }
  }

  // Step 5: Return with octaves
  return semitones.map((s, i) => {
    const octave = Math.floor(s / 12) + 4;
    return `${bestSpelling[i]}/${octave}`;
  });
}
