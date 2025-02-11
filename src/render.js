const codeInput = document.getElementById("code");
const languageSelect = document.getElementById("language");
const resultOutput = document.getElementById("result");

let typingTimer;
const delay = 500;

codeInput.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        window.api.runCode(codeInput.value, languageSelect.value);
    }, delay);
});

window.api.onOutput((output) => {
    resultOutput.textContent = output;
});
