/**
 * Tests for octave optimization and ledger line counting
 * Run with: node test/octave-optimization.test.js
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { countLedgerLines, optimizeForTrebleClef } from '../public/2d6-scale/octave-optimization.js';

// Tests for ledger line counting
// Treble clef staff: E4 (30) to F5 (38)

test('Notes on staff have 0 ledger lines', () => {
  assert.strictEqual(countLedgerLines('D/4'), 0, 'D4 is on staff');
  assert.strictEqual(countLedgerLines('E/4'), 0, 'E4 is on staff');
  assert.strictEqual(countLedgerLines('G/4'), 0, 'G4 is on staff');
  assert.strictEqual(countLedgerLines('C/5'), 0, 'C5 is on staff');
  assert.strictEqual(countLedgerLines('F/5'), 0, 'F5 is on staff');
  assert.strictEqual(countLedgerLines('G/5'), 0, 'G5 is on staff');
});

test('Notes below staff count ledger lines correctly', () => {
  assert.strictEqual(countLedgerLines('C/4'), 1, 'C4 needs 1 ledger line');
  assert.strictEqual(countLedgerLines('B/3'), 1, 'B3 needs 1 ledger line');
  assert.strictEqual(countLedgerLines('A/3'), 2, 'A3 needs 2 ledger lines');
  assert.strictEqual(countLedgerLines('G/3'), 2, 'G3 needs 2 ledger lines');
  assert.strictEqual(countLedgerLines('F/3'), 3, 'F3 needs 3 ledger lines');
});

test('Notes above staff count ledger lines correctly', () => {
  assert.strictEqual(countLedgerLines('A/5'), 1, 'A5 needs 1 ledger line');
  assert.strictEqual(countLedgerLines('C/6'), 2, 'C6 needs 2 ledger lines');
  assert.strictEqual(countLedgerLines('D/6'), 2, 'D6 needs 2 ledger lines');
  assert.strictEqual(countLedgerLines('E/6'), 3, 'E6 needs 3 ledger lines');
});

test('Accidentals do not affect ledger line count', () => {
  assert.strictEqual(countLedgerLines('C#/4'), countLedgerLines('C/4'), 'C#4 same as C4');
  assert.strictEqual(countLedgerLines('Bb/5'), countLedgerLines('B/5'), 'Bb5 same as B5');
});

// Tests for octave optimization

test('Scale already optimal stays the same', () => {
  // Scale within staff range
  const scale = ['C/5', 'D/5', 'E/5', 'F/5'];
  const optimized = optimizeForTrebleClef(scale);
  assert.deepStrictEqual(optimized, scale, 'Optimal scale unchanged');
});

test('Scale too low is transposed up', () => {
  // Scale way below staff
  const scale = ['C/2', 'D/2', 'E/2'];
  const optimized = optimizeForTrebleClef(scale);

  // Should be transposed up (each note's octave should be higher)
  const allHigher = optimized.every((note, i) => {
    const origOct = parseInt(scale[i].split('/')[1]);
    const newOct = parseInt(note.split('/')[1]);
    return newOct > origOct;
  });

  assert.ok(allHigher, 'All notes transposed to higher octave');
});

test('Scale too high is transposed down', () => {
  // Scale way above staff
  const scale = ['C/7', 'D/7', 'E/7'];
  const optimized = optimizeForTrebleClef(scale);

  // Should be transposed down
  const allLower = optimized.every((note, i) => {
    const origOct = parseInt(scale[i].split('/')[1]);
    const newOct = parseInt(note.split('/')[1]);
    return newOct < origOct;
  });

  assert.ok(allLower, 'All notes transposed to lower octave');
});

test('Optimization minimizes total ledger lines', () => {
  const scale = ['C/3', 'E/3', 'G/3', 'B/3'];
  const optimized = optimizeForTrebleClef(scale);

  // Calculate total ledger lines before and after
  const beforeTotal = scale.reduce((sum, note) => sum + countLedgerLines(note), 0);
  const afterTotal = optimized.reduce((sum, note) => sum + countLedgerLines(note), 0);

  assert.ok(afterTotal <= beforeTotal, 'Optimized scale has fewer or equal ledger lines');
});
