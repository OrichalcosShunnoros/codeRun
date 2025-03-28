const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  log: (message) => console.log(message),
  fetch: (url) => fetch(url).then((res) => res.text())
})
