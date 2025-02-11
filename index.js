const { app, BrowserWindow } = require("electron");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("src/index.html");
});
