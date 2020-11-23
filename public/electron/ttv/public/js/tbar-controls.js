if (!window.api) console.log("BROWSER VIEWING...");

// When document has loaded, initialise
document.onreadystatechange = (event) => {
  if (document.readyState == "complete") {
    init_controls();
    // document.getElementById('electron-ver').innerHTML = `${process.versions.electron}`
  }
};

const ttv_api_keys = [
  {
    key: "tbar.listeners.remove",
  },
  {
    key: "tbar.btn.min",
  },
  {
    key: "tbar.btn.max",
  },
  {
    key: "tbar.btn.restore",
  },
  {
    key: "tbar.btn.close",
  },
  {
    key: "tbar.btn.toggle.restore",
  },
];

// KEY = STRING
// DATA = ANY
const send_api_msg = (key, data={}) =>{
  if (!window.api) return;
  window.api.send("toMain", btoa(JSON.stringify({
    key: key,
    data: data,
  })))
}

window.onbeforeunload = (event) => {
  /* If window is reloaded, remove win event listeners
  (DOM element listeners get auto garbage collected but not
  Electron win listeners as the win is not dereferenced unless closed) */
  send_api_msg("tbar.listeners.remove");
}

function init_controls() {
  const btns = [
    {
      name: "min-button",
      handler: (ev) =>{
        send_api_msg("tbar.btn.min");
      }
    },
    {
      name: "max-button",
      handler: (ev) =>{
        send_api_msg("tbar.btn.max");
      }
    },
    {
      name: "restore-button",
      handler: (ev) =>{
        send_api_msg("tbar.btn.restore");
      }
    },
    {
      name: "close-button",
      handler: (ev) =>{
        send_api_msg("tbar.btn.back");
      }
    },
  ]
  
  btns.forEach(btn=>{
    document.getElementById(btn.name).addEventListener('click', btn.handler);
  })
  
  // // Make minimise/maximise/restore/close buttons work when they are clicked
  // document.getElementById('min-button').addEventListener("click", event => {
  //   win.minimize();
  // });

  // document.getElementById('max-button').addEventListener("click", event => {
  //   win.maximize();
  // });

  // document.getElementById('restore-button').addEventListener("click", event => {
  //   win.unmaximize();
  // });

  // document.getElementById('close-button').addEventListener("click", event => {
  //   win.close();
  // });
  // toggle_restore_btns();
  // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
  // win.on('maximize', toggle_restore_btns);
  // win.on('unmaximize', toggle_restore_btns);

  // let toggle_restore_btns = () => {
  //   send_api_msg("tbar.btn.maximized");
  //   // if (win.isMaximized()) {
  //   //   document.body.classList.add('maximized');
  //   // } else {
  //   //   document.body.classList.remove('maximized');
  //   // }
  // }
}


window.addEventListener('popstate', (ev)=>{
  console.log("POPSTATE", ev);
  send_api_msg("tbar.btn.back");
})