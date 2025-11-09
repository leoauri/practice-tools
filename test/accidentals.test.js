/**
 * Tests for accidental choice logic
 * Run with: node test/accidentals.test.js
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { chooseAccidentals } from '../public/2d6-scale/accidentals.js';

// Test cases based on guidelines/accidental-choice.md

// Guideline 1: Prefer different note names for different notes
test('Guideline 1a: C Db (prefer different note names)', () => {
  const scale = [0, 1]; // C, C#/Db
  const result = chooseAccidentals(scale);
  assert.deepStrictEqual(result, ['C/4', 'Db/4'], 'Should choose C Db, not C C#');
});

test('Guideline 1b: A# B (prefer different note names)', () => {
  const scale = [10, 11]; // A#/Bb, B
  const result = chooseAccidentals(scale);
  assert.deepStrictEqual(result, ['A#/4', 'B/4'], 'Should choose A# B, not Bb B');
});

// Guideline 2: Note name should reflect interval size
test('Guideline 2a: G Bb (note name reflects interval)', () => {
  const scale = [7, 10]; // G, Bb/A#
  const result = chooseAccidentals(scale);
  assert.deepStrictEqual(result, ['G/4', 'Bb/4'], 'Should choose G Bb, not G A#');
});

test('Guideline 2b: G# B (note name reflects interval)', () => {
  const scale = [8, 11]; // G#/Ab, B
  const result = chooseAccidentals(scale);
  assert.deepStrictEqual(result, ['G#/4', 'B/4'], 'Should choose G# B, not Ab B');
});

test('Guideline 2c: Bb D (note name reflects interval)', () => {
  const scale = [10, 14];
  const result = chooseAccidentals(scale);
  assert.deepStrictEqual(result, ['Bb/4', 'D/5'], 'Should choose Bb D');
});

// Guideline 3: Prefer more of the same type of accidental
test('Guideline 3a: F# G C C# D (prefer consistent accidental type - sharps)', () => {
  const scale = [6, 7, 0, 1, 2]; // F#/Gb, G, C, C#/Db, D
  const result = chooseAccidentals(scale);
  assert.deepStrictEqual(result, ['F#/4', 'G/4', 'C/4', 'C#/4', 'D/4'], 'Should use sharps consistently');
});

test('Guideline 3b: A Bb C Db D (prefer consistent accidental type - flats)', () => {
  const scale = [9, 10, 0, 1, 2]; // A, Bb/A#, C, Db/C#, D
  const result = chooseAccidentals(scale);
  assert.deepStrictEqual(result, ['A/4', 'Bb/4', 'C/4', 'Db/4', 'D/4'], 'Should use flats consistently');
});

test('Prefer same name for same note, even in different octaves', () => {
  const scale = [1, 3, 4, 8, 10, 12, 13];
  const result = chooseAccidentals(scale);
  assert.deepStrictEqual(result, ['Db/4', 'Eb/4', 'E/4', 'Ab/4', 'Bb/4', 'C/5', 'Db/5']);
});
