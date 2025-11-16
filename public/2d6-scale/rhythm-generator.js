/**
 * Rhythm Generator - Generates and displays random rhythm patterns
 */

// State
let rhythmLength = 1; // Number of eighth notes
let startPosition = 0; // Starting position (0-7 within first measure)
let autoRandomizeTimer = null;

/**
 * Generates a random start position for the rhythm within a measure
 * @returns {number} Random position from 0-7 (eighth note positions in 4/4)
 */
function randomizePosition() {
    return Math.floor(Math.random() * 8);
}

/**
 * Renders the rhythm pattern using VexFlow
 */
function renderRhythm() {
    const container = document.getElementById('rhythm-display');
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    const VF = Vex.Flow;

    // Calculate how many measures we need
    const totalEighthNotes = startPosition + rhythmLength;
    const measuresNeeded = Math.ceil(totalEighthNotes / 8);

    // Dimensions
    const measureWidth = 300;
    const staveHeight = 100;
    const padding = 20;
    const totalWidth = measuresNeeded * measureWidth + padding * 2;

    // Create renderer
    const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    renderer.resize(totalWidth, staveHeight + 60);
    const context = renderer.getContext();

    // Create staves for each measure
    const staves = [];
    for (let i = 0; i < measuresNeeded; i++) {
        const x = padding + i * measureWidth;
        const stave = new VF.Stave(x, 40, measureWidth);

        // Add clef and time signature only to first measure
        if (i === 0) {
            stave.addClef('percussion');
            stave.addTimeSignature('4/4');
        }

        stave.setContext(context).draw();
        staves.push(stave);
    }

    // Create notes for all measures
    for (let measure = 0; measure < measuresNeeded; measure++) {
        const measureNotes = [];

        // Build pattern of notes and rests for this measure
        // In 4/4 with eighths: positions 0-1=beat1, 2-3=beat2, 4-5=beat3, 6-7=beat4
        let position = 0;
        while (position < 8) {
            const globalPosition = measure * 8 + position;

            // Check if this position should have a note
            if (globalPosition >= startPosition && globalPosition < startPosition + rhythmLength) {
                // Add eighth note
                const note = new VF.StaveNote({
                    keys: ['b/4'],
                    duration: '8'
                });
                measureNotes.push(note);
                position++;
            } else {
                // Count consecutive rest positions from current position
                let restCount = 0;
                while (position + restCount < 8) {
                    const checkPos = measure * 8 + position + restCount;
                    if (checkPos >= startPosition && checkPos < startPosition + rhythmLength) {
                        break;
                    }
                    restCount++;
                }

                // Add rests respecting beat boundaries
                // Half rest: only at position 0 or 4 (start of 2-beat span)
                if (restCount >= 4 && (position === 0 || position === 4)) {
                    measureNotes.push(new VF.StaveNote({
                        keys: ['b/4'],
                        duration: 'hr'
                    }));
                    position += 4;
                }
                // Quarter rest: only at positions 0, 2, 4, 6 (start of beat)
                else if (restCount >= 2 && position % 2 === 0) {
                    measureNotes.push(new VF.StaveNote({
                        keys: ['b/4'],
                        duration: 'qr'
                    }));
                    position += 2;
                }
                // Eighth rest: any position
                else {
                    measureNotes.push(new VF.StaveNote({
                        keys: ['b/4'],
                        duration: '8r'
                    }));
                    position += 1;
                }
            }
        }

        // Generate beams for this measure
        const beams = VF.Beam.generateBeams(measureNotes);

        // Format and draw notes
        VF.Formatter.FormatAndDraw(context, staves[measure], measureNotes);

        // Draw beams
        beams.forEach((b) => {
            b.setContext(context).draw();
        });
    }

    // Make SVG responsive
    const svg = container.querySelector('svg');
    if (svg) {
        svg.setAttribute('viewBox', `0 0 ${totalWidth} ${staveHeight + 60}`);
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.maxWidth = `${totalWidth}px`;
    }
}

/**
 * Increases rhythm length by 1
 */
function increaseLength() {
    rhythmLength++;
    renderRhythm();
}

/**
 * Decreases rhythm length to ceil(length/2)
 */
function decreaseLength() {
    rhythmLength = Math.ceil(rhythmLength / 2);
    renderRhythm();
}

/**
 * Randomizes the start position and re-renders
 */
function randomize() {
    startPosition = randomizePosition();
    renderRhythm();
}

/**
 * Starts the auto-randomize timer (every 50 seconds)
 */
function startAutoRandomize() {
    // Clear any existing timer
    if (autoRandomizeTimer) {
        clearInterval(autoRandomizeTimer);
    }

    // Set up new timer (50 seconds = 50000ms)
    autoRandomizeTimer = setInterval(() => {
        randomize();
    }, 50000);
}

/**
 * Initialize the rhythm generator
 */
function init() {
    // Set initial random position
    startPosition = randomizePosition();

    // Render initial rhythm
    renderRhythm();

    // Set up event listeners
    const plusBtn = document.getElementById('rhythm-plus-btn');
    const minusBtn = document.getElementById('rhythm-minus-btn');

    if (plusBtn) {
        plusBtn.addEventListener('click', increaseLength);
    }

    if (minusBtn) {
        minusBtn.addEventListener('click', decreaseLength);
    }

    // Start auto-randomize timer
    startAutoRandomize();
}

// Initialize when page loads
window.addEventListener('load', init);
