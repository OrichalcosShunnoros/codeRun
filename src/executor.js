const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    runCode: (code, language) => ipcRenderer.send("run-code", { code, language }),
    onOutput: (callback) => ipcRenderer.on("code-output", (_, output) => callback(output)),
});
