# Scale generation using 2d6

1. s :== an empty set
2. n :== uniformly randomly chosen note
3. r :== n
4. Append n to s
5. Roll 2d6. Let x :== the lower of the two dice
6. n :== n - x
7. if n <= r - 12, stop
8. Goto 4.
