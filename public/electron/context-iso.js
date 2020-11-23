/* revzim | this base was an old electron 'skeleton' of mine */
"use strict";
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { ipcRenderer, contextBridge } = require('electron');

const init_module = () =>{
  contextBridge.exposeInMainWorld(
    "api", {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = ["toMain"];
      if (validChannels.includes(channel)) {
        switch (channel) {
          case "toMain":
            ipcRenderer.send(channel, data);
            break;
          default:
            console.log("unhandled channel", channel);
            ipcRenderer.send(channel, data);
            break;
        }
      }
    },
    receive: (channel, func) => {
      let validChannels = ["fromMain"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      } else {
        console.log("ERROR", channel);
      }
    },
  }
  )
}

module.exports = {
  init: init_module,
}