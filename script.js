

document.addEventListener('DOMContentLoaded', () => {

    const testWrapper = document.querySelector(".test-wrapper");
    const testArea = document.querySelector("#test-area");
    let originText = document.querySelector("#origin-text p").innerHTML;
    const resetButton = document.querySelector("#reset");
    const theTimer = document.querySelector(".timer");

    const paragraphs = [
        "The text to test.",
        "The quick brown fox jumps over the lazy dog.",
        "Pack my box with five dozen liquor jugs.",
        "How vexingly quick daft zebras jump.",
        "The five boxing wizards jump quickly."
    ];

    // Add leading zero to numbers 9 or below (purely for aesthetics):
    function pad(n) {
        return String(n).padStart(2, "0");
    }

    // Run a standard minute/second/hundredths timer:
    const topScoresDisplay = document.querySelector("#top-scores");
    const wpmDisplay = document.querySelector("#wpm");
    const errorsDisplay = document.querySelector("#errors");
    let errorCount = 0;
    let startTime;
    let elapsed = 0;
    let timerInterval;

    function stop() {
        clearInterval(timerInterval);
        elapsed = Date.now() - startTime;
    }

    function update() {
        elapsed = Date.now() - startTime;
        theTimer.textContent = format(elapsed)
    }

    function format(ms) {
        const min = Math.floor(ms/60000);
        const sec = Math.floor((ms%60000)/1000);
        const hundredths = Math.floor((ms%1000)/10);

        return `${pad(min)}:${pad(sec)}.${pad(hundredths)}`;
    }

    // Match the text entered with the provided text on the page:
    function matchText() {

        const typed = testArea.value;
        const slice = originText.slice(0, typed.length);

        if (typed !== slice) {
            errorCount++;
            errorsDisplay.textContent = errorCount;
            testWrapper.style.borderColor = "red";
        } else if (typed === originText) {
            testWrapper.style.borderColor = "green";
            stop();
            saveScore(elapsed);
        } else {
            testWrapper.style.borderColor = "blue";
        }

        const seconds = elapsed / 1000;
        if (seconds > 0) {
            wpmDisplay.textContent = Math.round((typed.length / 15) / (seconds / 60));
        }
    }

    // Start the timer:
    function startOnFirstType() {
        start()
        testArea.removeEventListener("input", startOnFirstType)
    }

    function start() {
        startTime = Date.now() - elapsed;
        timerInterval = setInterval(update, 10);
    }

    // Reset everything:
    function reset() {
        errorCount = 0;
        errorsDisplay.textContent = 0;
        wpmDisplay.textContent = 0;

        clearInterval(timerInterval);
        elapsed = 0;
        timerInterval = null;
        theTimer.textContent = "00:00.00";
        testArea.value = "";

        testWrapper.style.borderColor = "";

        originText = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        document.querySelector("#origin-text p").textContent = originText;

        testArea.addEventListener("input", startOnFirstType);
    }

    // Save Scores:
    function saveScore(ms) {

        let scores = JSON.parse(localStorage.getItem("topScores") || "[]");
        scores.push(ms);
        scores.sort((a, b) => a - b);
        scores = scores.slice(0, 3);
        localStorage.setItem("topScores", JSON.stringify(scores));

        renderScores(scores);

        if (scores.length === 3) {
            localStorage.removeItem("topScores");
        }
    }

    // Render Scores:
    function renderScores(scores) {
        topScoresDisplay.innerHTML = scores
            .map((ms, i) => `<li>#${i + 1}: ${format(ms)}</li>`)
            .join("");
    }

    // Load scores:
    const saved = JSON.parse(localStorage.getItem("topScores") || "[]");
    renderScores(saved);

    // Event listeners for keyboard input and the reset button:
    testArea.addEventListener("input", startOnFirstType);
    testArea.addEventListener("input", matchText);
    resetButton.addEventListener("click", reset);

})