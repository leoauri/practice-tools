# Accidental choice guidelines

Accidentals should be chosen according to the following examples (guidelines):

1. Choose C Db, not C C#. Choose A# B, not Bb B. (prefer different note names for different notes).
2. Choose G Bb, not G A#. Choose G# B, not Ab B. (note name preferably reflects interval size).
3. Choose F# G C C# D. Choose A Bb C Db D (prefer more of the same type of accidental).

## Scoring

For each pair of consecutive notes:

1. Normalise to within an octave
2. Verify the letter name distance matches the semitone distance:
- Unison ↔ 0 semitone
- Second ↔ 1 or 2 semitones
- Third ↔ 3 or 4 semitones
- Fourth ↔ 5 or 6 semitones
- Fifth ↔ 6 or 7 semitones
- Sixth ↔ 8 or 9 semitones
- Seventh ↔ 10 or 11 semitones
3. Score -1 per violation.

## Algorithm

1. If the scale contains no black notes, return the scale.
2. Generate two versions of the scale spelled with only sharps and only flats respectively.
3. Choose the higher scoring version.
4. For each accidental in the scale, switch it if the score can be improved by doing so.
5. Return the resulting scale.
