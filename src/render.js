const editor = document.getElementById("editor");
const output = document.getElementById("output");
const languageSelect = document.getElementById("language");

function evaluateCode() {
    const code = editor.value.trim();

    if (!code) {
        output.innerText = "";
        return;
    }

    try {
        console.clear();
        output.innerText = "";
        let logOutput = [];

        const originalConsoleLog = console.log;
        console.log = (...args) => {
            logOutput.push(args.join(" "));
            originalConsoleLog.apply(console, args);
        };

        new Function(code)();

        output.innerText = logOutput.length ? logOutput.join("\n") : "Execute code without output.";
        console.log = originalConsoleLog;
    } catch (error) {
        output.innerText = `⚠️ Error: ${error.message}`;
    }
}

editor.addEventListener("input", evaluateCode);
