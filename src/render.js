const editor = document.getElementById("editor");
const output = document.getElementById("output");
const languageSelect = document.getElementById("language");

let pyodide;

async function loadPyodideAndPackages() {
    output.innerText = "Pyodide is loading...";
    pyodide = await loadPyodide();
    await pyodide.runPythonAsync(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
    `);
    output.innerText = "Python is charged. Now you can write python code.";
}

loadPyodideAndPackages();

async function evaluateCode() {
    const code = editor.value.trim();
    const language = languageSelect.value;

    if (!code) {
        output.innerText = "";
        return;
    }

    if (language === "javascript") {
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

            output.innerText = logOutput.length ? logOutput.join("\n") : "Code executed without output.";
            console.log = originalConsoleLog;
        } catch (error) {
            output.innerText = `⚠️ Error: ${error.message}`;
        }
    } else if (language === "python") {
        if (!pyodide) {
            output.innerText = "❌ Pyodide not yet loaded.";
            return;
        }

        try {
            await pyodide.runPythonAsync(`
import sys
from io import StringIO

sys.stdout = StringIO()
sys.stderr = sys.stdout
            `);

            await pyodide.runPythonAsync(code);

            const result = await pyodide.runPythonAsync("sys.stdout.getvalue()");
            output.innerText = result.trim() || "Code executed without output.";
        } catch (error) {
            output.innerText = `⚠️ Error: ${error}`;
        }
    }
}


editor.addEventListener("input", evaluateCode);
languageSelect.addEventListener("change", evaluateCode);
