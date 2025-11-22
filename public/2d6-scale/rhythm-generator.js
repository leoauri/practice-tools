/**
 * Rhythm Generator - Generates and displays random rhythm patterns
 */

// State
let rhythmLength = 1; // Number of eighth notes per phrase
let startPosition1 = 0; // Starting position for phrase 1 (0-7)
let startPosition2 = 0; // Desired beat position for phrase 2 (0-7)
let autoRandomizeTimer = null;

/**
 * Generates a random beat position (0-7)
 * @returns {number} Random position from 0-7 (eighth note positions in 4/4)
 */
function randomBeatPosition() {
    return Math.floor(Math.random() * 8);
}

/**
 * Calculates the actual start position for phrase 2
 * Must be at least 1 eighth rest after phrase 1 ends, on the desired beat
 * @returns {number} Global position where phrase 2 starts
 */
function getPhrase2Start() {
    const phrase1End = startPosition1 + rhythmLength - 1;
    const minStart = phrase1End + 2; // At least 1 rest gap

    // Find first occurrence of startPosition2 beat that is >= minStart
    let measure = Math.floor(minStart / 8);
    let candidate = measure * 8 + startPosition2;

    if (candidate < minStart) {
        measure++;
        candidate = measure * 8 + startPosition2;
    }

    return candidate;
}

/**
 * Checks if a global position should have a note (in either phrase)
 * @param {number} globalPosition - The global eighth note position
 * @param {number} phrase2Start - The calculated start of phrase 2
 * @returns {boolean} True if this position should have a note
 */
function isNotePosition(globalPosition, phrase2Start) {
    // Check phrase 1
    if (globalPosition >= startPosition1 && globalPosition < startPosition1 + rhythmLength) {
        return true;
    }
    // Check phrase 2
    if (globalPosition >= phrase2Start && globalPosition < phrase2Start + rhythmLength) {
        return true;
    }
    return false;
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

    // Calculate phrase 2 actual start and total measures needed
    const phrase2Start = getPhrase2Start();
    const phrase2End = phrase2Start + rhythmLength;
    const measuresNeeded = Math.ceil(phrase2End / 8);

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
            if (isNotePosition(globalPosition, phrase2Start)) {
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
                    if (isNotePosition(checkPos, phrase2Start)) {
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
 * Randomizes both phrase start positions and re-renders
 */
function randomize() {
    startPosition1 = randomBeatPosition();
    startPosition2 = randomBeatPosition();
    renderRhythm();
    startAutoRandomize();
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
    // Set initial random positions for both phrases
    startPosition1 = randomBeatPosition();
    startPosition2 = randomBeatPosition();

    // Render initial rhythm
    renderRhythm();

    // Set up event listeners
    const plusBtn = document.getElementById('rhythm-plus-btn');
    const minusBtn = document.getElementById('rhythm-minus-btn');
    const generateBtn = document.getElementById('generate-btn');

    if (plusBtn) {
        plusBtn.addEventListener('click', increaseLength);
    }

    if (minusBtn) {
        minusBtn.addEventListener('click', decreaseLength);
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', randomize);
    }

    // Start auto-randomize timer
    startAutoRandomize();
}

// Initialize when page loads
window.addEventListener('load', init);
