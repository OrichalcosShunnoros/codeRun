const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    log: (message) => console.log(message),
});
