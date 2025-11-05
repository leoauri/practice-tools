#!/usr/bin/env python3
"""
Order all possible 12-ET scale combinations by circle of fifths displacement magnitude.
"""
import math
import sys
from itertools import combinations

# Circle of fifths order (0-11 semitones from C)
# C, G, D, A, E, B, F#, C#, G#, D#, A#, F
CIRCLE_OF_FIFTHS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]
NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']


def calculate_fifths_magnitude(scale_notes):
    """
    Calculate the displacement magnitude from center on circle of fifths.

    Args:
        scale_notes: tuple of note indices (0-11) in chromatic order

    Returns:
        float: magnitude of vector sum
    """
    if not scale_notes:
        return 0.0

    # For each note in the scale, add a unit vector pointing to its position on the circle
    x_sum = 0.0
    y_sum = 0.0

    for note in scale_notes:
        # Find position on circle of fifths
        circle_pos = CIRCLE_OF_FIFTHS.index(note)
        # Angle for this position (12 positions around circle)
        angle = 2 * math.pi * circle_pos / 12
        # Add unit vector
        x_sum += math.cos(angle)
        y_sum += math.sin(angle)

    # Calculate magnitude
    magnitude = math.sqrt(x_sum**2 + y_sum**2)
    return magnitude


def normalize_angle(angle):
    """Normalize angle to [-pi, pi] range."""
    while angle > math.pi:
        angle -= 2 * math.pi
    while angle < -math.pi:
        angle += 2 * math.pi
    return angle


def calculate_rotated_magnitude(scale_notes, alpha=0.5):
    """
    Calculate magnitude after rotating each note vector towards the centroid.

    Args:
        scale_notes: tuple of note indices (0-11) in chromatic order
        alpha: fraction to rotate towards centroid (0 = no rotation, 1 = full rotation)

    Returns:
        float: magnitude of rotated vector sum
    """
    if not scale_notes:
        return 0.0

    # First pass: calculate angles and centroid
    angles = []
    x_centroid = 0.0
    y_centroid = 0.0

    for note in scale_notes:
        circle_pos = CIRCLE_OF_FIFTHS.index(note)
        angle = 2 * math.pi * circle_pos / 12
        angles.append(angle)
        x_centroid += math.cos(angle)
        y_centroid += math.sin(angle)

    # Calculate centroid direction
    centroid_angle = math.atan2(y_centroid, x_centroid)

    # Second pass: rotate each vector towards centroid and sum
    x_sum = 0.0
    y_sum = 0.0

    for angle in angles:
        # Calculate angular difference (shortest path on circle)
        diff = normalize_angle(centroid_angle - angle)
        # Scale alpha based on angular distance from centroid
        # Notes pointing away from centroid (|diff| = π) get alpha = 0
        # Notes aligned with centroid (diff = 0) get alpha = max_alpha
        scaled_alpha = alpha * (1 - abs(diff) / math.pi)
        # Rotate by scaled alpha fraction of the difference
        rotated_angle = angle + scaled_alpha * diff
        # Add rotated unit vector
        x_sum += math.cos(rotated_angle)
        y_sum += math.sin(rotated_angle)

    # Calculate magnitude
    magnitude = math.sqrt(x_sum**2 + y_sum**2)
    return magnitude


def scale_to_intervals(scale_notes):
    """Convert scale notes to interval pattern (gaps between consecutive notes)."""
    if len(scale_notes) < 2:
        return []

    intervals = []
    sorted_notes = sorted(scale_notes)
    for i in range(len(sorted_notes)):
        next_note = sorted_notes[(i + 1) % len(sorted_notes)]
        gap = (next_note - sorted_notes[i]) % 12
        if gap > 0:  # Skip the wrap-around 0 except at the end
            intervals.append(gap)

    return intervals


def format_scale(scale_notes):
    """Format scale for display."""
    notes = ' '.join(NOTE_NAMES[n] for n in sorted(scale_notes))
    intervals = scale_to_intervals(scale_notes)
    interval_str = ','.join(map(str, intervals)) if intervals else ''
    return f"{notes:30} [{interval_str}]"


def is_major_scale(scale_notes):
    """Check if a scale has the major scale interval pattern (any mode)."""
    intervals = scale_to_intervals(scale_notes)
    if len(intervals) != 7:
        return False
    # Major scale modes (rotations of [2,2,1,2,2,2,1])
    major_rotations = [
        [2, 2, 1, 2, 2, 2, 1],  # Ionian
        [2, 1, 2, 2, 2, 1, 2],  # Dorian
        [1, 2, 2, 2, 1, 2, 2],  # Phrygian
        [2, 2, 2, 1, 2, 2, 1],  # Lydian
        [2, 2, 1, 2, 2, 1, 2],  # Mixolydian
        [2, 1, 2, 2, 1, 2, 2],  # Aeolian
        [1, 2, 2, 1, 2, 2, 2],  # Locrian
    ]
    return intervals in major_rotations


def normalize_scale_pattern(scale_notes):
    """
    Get a normalized interval pattern for the scale (canonical form).
    Returns the lexicographically smallest rotation of the interval pattern.
    """
    intervals = scale_to_intervals(scale_notes)
    if not intervals:
        return tuple()

    # Get all rotations and return the lexicographically smallest
    rotations = [tuple(intervals[i:] + intervals[:i]) for i in range(len(intervals))]
    return min(rotations)


def main():
    # Parse command line arguments
    if len(sys.argv) > 1:
        try:
            alpha = float(sys.argv[1])
        except ValueError:
            print(f"Error: Invalid alpha value '{sys.argv[1]}'. Must be a number.")
            print("Usage: python scale_ordering.py [alpha]")
            print("Example: python scale_ordering.py 0.1")
            sys.exit(1)
    else:
        alpha = 0.1  # Default value

    print(f"\n{'='*80}")
    print(f"ALPHA = {alpha}")
    print(f"{'='*80}\n")

    # Generate all possible scales (1 to 12 notes)
    all_scales = []

    for num_notes in range(1, 13):
        for scale_combo in combinations(range(12), num_notes):
            magnitude = calculate_rotated_magnitude(scale_combo, alpha)
            all_scales.append((magnitude, scale_combo))

    # Sort by magnitude (descending - highest magnitude first)
    all_scales.sort(key=lambda x: x[0], reverse=True)

    # Group by interval pattern (to show only unique scale types)
    seen_patterns = set()
    unique_scales = []

    for magnitude, scale_notes in all_scales:
        pattern = normalize_scale_pattern(scale_notes)
        if pattern not in seen_patterns:
            seen_patterns.add(pattern)
            unique_scales.append((magnitude, scale_notes, pattern))

    # Display top results
    print(f"Top 50 unique scale types (alpha={alpha}):\n")
    print(f"{'Rank':<6} {'Magnitude':<12} {'#Notes':<8} Interval Pattern")
    print("-" * 80)

    for i, (magnitude, scale_notes, pattern) in enumerate(unique_scales[:50], 1):
        major_marker = " ★" if is_major_scale(scale_notes) else ""
        num_notes = len(scale_notes)
        pattern_str = ','.join(map(str, pattern))
        print(f"{i:<6} {magnitude:<12.4f} {num_notes:<8} [{pattern_str}]{major_marker}")

    # Find first major scale
    first_major_rank = next((i for i, (mag, scale, pat) in enumerate(unique_scales, 1)
                            if is_major_scale(scale)), None)

    if first_major_rank:
        print(f"\nFirst major scale: Rank {first_major_rank}")
        print(f"Total unique scale types: {len(unique_scales)}")


if __name__ == '__main__':
    main()
