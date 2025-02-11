const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "src/executor.js"),
        },
    });

    mainWindow.loadFile("src/index.html");
});

ipcMain.on("run-code", (event, { code, language }) => {
    let command;

    switch (language) {
        case "JavaScript":
            command = `node -e "${code.replace(/"/g, '\\"')}"`;
            break;
        case "Python":
            command = `python -c "${code.replace(/"/g, '\\"')}"`;
            break;
        case "TypeScript":
            command = `npx ts-node -e "${code.replace(/"/g, '\\"')}"`;
            break;
        default:
            event.reply("code-output", "Error: Language not supported");
            return;
    }

    exec(command, (error, stdout, stderr) => {
        event.reply("code-output", error ? stderr : stdout);
    });
});
