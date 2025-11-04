#!/usr/bin/env python3
"""Quick test to find alpha where pentatonic beats 8-note scales."""
import sys
sys.path.insert(0, '.')
from scale_ordering import calculate_rotated_magnitude

# 5-note pentatonic (consecutive fifths: C, D, E, G, A)
pentatonic = (0, 2, 4, 7, 9)

# 8-note scale (consecutive fifths)
octatonic = (0, 2, 4, 5, 7, 9, 11, 1)  # C, D, E, F, G, A, B, C#

print("Alpha    Pentatonic   Octatonic    Winner")
print("-" * 50)

for alpha_int in range(0, 101, 1):
    alpha = alpha_int / 100.0
    pent_mag = calculate_rotated_magnitude(pentatonic, alpha)
    oct_mag = calculate_rotated_magnitude(octatonic, alpha)
    winner = "PENTATONIC" if pent_mag > oct_mag else "octatonic"
    print(f"{alpha:.2f}     {pent_mag:.4f}       {oct_mag:.4f}       {winner}")
