const editor = document.getElementById("editor");
const output = document.getElementById("output");
const languageSelect = document.getElementById("language");

let pyodide;

async function loadPyodideAndPackages() {
    output.innerText = "";
    pyodide = await loadPyodide();
    await pyodide.runPythonAsync(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
    `);
    output.innerText = "";
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

// Theme toggle functionality
const themeToggleBtn = document.querySelector("header button");



// Function to toggle theme
function toggleTheme() {
    const body = document.body;
    const isLightTheme = body.classList.toggle("light-theme");

    // Definir los iconos SVG como cadenas
    const sunIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M16.36 7.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
    </svg>`;

    const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" stroke="currentColor" stroke-width="2"/>
    </svg>`;

    // Cambiar el contenido del botón
    themeToggleBtn.innerHTML = isLightTheme ? `${moonIcon}` : `${sunIcon}`;

    // Guardar la preferencia en localStorage
    localStorage.setItem("theme", isLightTheme ? "light" : "dark");
}

// Evento de clic en el botón de cambio de tema
themeToggleBtn.addEventListener("click", toggleTheme);

// Verificar la preferencia guardada al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        toggleTheme(); // Asegura que el icono también se actualice correctamente
    }
});

