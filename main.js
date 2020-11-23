/* revzim | this base was an old electron 'skeleton' of mine */
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
require('./public/electron/ttv');

app.allowRendererProcessReuse = true

// DISABLED
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false

const path = require('path')

const log4js = require('log4js');
let logger;

const START_TIME = Date.now();
const _DEV = process.argv[2];
const PREPEND = _DEV ? "" : `${app.getPath("userData")}/`; // ``;

log4js.configure({
  appenders: {
    out: {type: 'stdout'},
    'ttv-viewer-electron': {type: "file", filename: `${PREPEND}logs/${Math.floor(START_TIME/86400000)}/${START_TIME}.log`} 
  },
  categories: {default: {appenders: ["ttv-viewer-electron", 'out'], level: "debug"}},
})

logger = log4js.getLogger("ttv-viewer-electron");

logger.level = 'debug';

let main_window;

const _DEV_PREPEND = process.argv[2] ? `` : './../';


function AZEncoder() {
  this.encode = (obj) => {
    return Buffer.from(JSON.stringify(obj)).toString('base64');
  }

  this.decode = (str) => {
    return JSON.parse(Buffer.from(str, 'base64').toString());
  }

  this.pprint = (data) =>{
    return JSON.stringify(data, null, "  ");
  }
}

const APP_SETTINGS = {
  home_page: "public/static/index.html",
  encoder: new AZEncoder(),
}

function createWindow() {
  // CREATE BROWSER WINDOW
  main_window = new BrowserWindow({
    minWidth: 600,
    minHeight: 600,
    width: 1200,
    height: 900,
    show: false,
    backgroundColor: "#282828",
    darkTheme: true,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "public/electron/preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      devTools: process.argv[2] ? true : false,
    }
  })
  
  main_window.webContents.on('did-finish-load', function() {
    main_window.webContents.insertCSS('#drag-area{-webkit-app-region: drag!important;}');
  });
  main_window.once("ready-to-show", ()=>{
    main_window.show();
  })
  main_window.webContents.session.webRequest.onBeforeRequest(
    {urls: ["*://*.imrworldwide.com/*", "*://s.amazon-adsystem.com/*", "*://*.scorecardresearch.com/*"]},
    function(details, cb) {
      console.log(details);
      logger.debug(`onBeforeRequest-blocking: ${details.url}`);
      logger.debug({
        id: "onBefore.domain.block",
        data: details,
      })
      cb({
        cancel: true,
      });
    },
  );

  /*
    console.log(details);
    if (details.url.includes("imrworldwide.com")) {
      logger.debug(`onBeforeRequest-blocking: ${details.url}`);
      logger.debug({
        id: "onBefore.domain.block",
        data: details,
      })
      cb({
        cancel: true,
      });
    } else {
      cb({
        cancel: false,
      });
    }
  */
  const blocked_urls = [
    "imrworldwide.com",
    "s.amazon-adsystem.com",
  ];
  main_window.webContents.session.webRequest.onHeadersReceived(
    {urls: ['*://*/*']},
    (details, callback) => {
      // logger.debug(details);
      
      // if (details.url.includes() || )
      delete details.referrer;
      Object.keys(details.responseHeaders).filter(x => {
        x.toLowerCase() === 'referrer' || x.toLowerCase() === 'x-frame-options' || x.toLowerCase() === 'content-security-policy' || x.toLocaleLowerCase() === 'strict-transport-security'
      }).map(x => delete details.responseHeaders[x]);
  
      if (details.url.includes("referrer=")) details.url = details.url.substr(0, details.url.indexOf("referrer="));
      // logger.debug(details.url);
      // logger.debug(details);
      callback({
        cancel: false,
        responseHeaders: details.responseHeaders,
      })
    }
  )
  
  init_window_size_handlers();

  // INIT MENU
  // init_menu()

  // and load the index.html of the app.
  main_window.loadFile(APP_SETTINGS.home_page);

}

let init_window_size_handlers = () => {
  let toggle_max_handler = (ev) =>{
    // main_window.isMaximized() ? main_window.unmaximize() : main_window.maximize();
    let key = `${main_window.isMaximized() ? "btn.max" : "btn.restore"}`;
    main_window.webContents.send("fromMain", APP_SETTINGS.encoder.encode({
      key: key,
      data: `${main_window.isMaximized() ? "max" : "min"}`,
    }))
  };
  main_window.on("maximize", toggle_max_handler);
  main_window.on("unmaximize", toggle_max_handler);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)
app.on('window-all-closed', () => {

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit()

});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('will-quit', (ev) => {

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  
  console.log(ev);
  const choice = dialog.showMessageBoxSync(main_window, {
    type: 'question',
    buttons: ['Exit', 'On second thought...'],
    title: 'Exit?',
    message: 'Did you mean to quit?',
    defaultId: 0,
    cancelId: 1
  })
  const leave = (choice === 0)
  if (leave) {
    console.log("goodbye...");
    if (process.platform !== "darwin") app.quit();
    else app.exit();
  } else {
    ev.preventDefault();
    createWindow();
  }
})

    
let init_extensions = function() {
  // const extensions = ["ublock_origin", "bttv", "ffz"];
  const extensions = {
    ublock_origin: "cjpalhdlnbpafiamejdnhcphjbkeiagm",
    ffz: "fadndhdgpmmaapbmfcknlfgcflmmmieb",
    bttv: "ajopnjidmegmdimjlfnijceegpefgped"
  };

  logger.debug(`loading extensions ${Object.keys(extensions).join(", ")}...`);

  const extensions_paths = Object.values(extensions).map(extension=>{return path.join(__dirname, `${_DEV_PREPEND}extensions/${extension}`);});
  // logger.debug(extensions_paths);
  
  return Promise.all(extensions_paths.map(ext=>{return main_window.webContents.session.loadExtension(ext); }))

}

// app.on('ready', async ()=>{
//   await init_extensions()
//     .then(ext=>{
//       if (ext.length === 3) {
//         logger.debug("all extensions loaded successfully.");
//       }
//     })
//     .catch(e=>{
//       logger.debug("extensions load error:", e);
//     })
// })

// let new_win;

ipcMain.on("toMain", (event, args) => {
  let data = APP_SETTINGS.encoder.decode(args);
  let key = data.key;
  logger.debug(APP_SETTINGS.encoder.pprint(data));
  // conditional for client -> backend
  switch (key) {
    case "api.init":
      init_extensions()
        .then(ext=>{
          logger.debug(ext);
          main_window.webContents.send("fromMain", APP_SETTINGS.encoder.encode({
            key: "api.init.resp",
            data: {
              ext: ext,
            },
            error: null,
          }));
        })
        .catch(e=>{
          logger.debug(data.data);
          main_window.webContents.send("fromMain", APP_SETTINGS.encoder.encode({
            key: "api.init.resp.error",
            data: null,
            error: e,
          }));
        })
      break;
    case "query.ttv.stream":
      const jdata = data.data;
      const streamer = jdata.streamer;
      const url = `http://localhost:8085/ttv/${streamer}`;
      // // logger.debug(APP_SETTINGS.encoder.pprint(jdata));
      // new_win = new BrowserWindow({
      //   minWidth: 600,
      //   minHeight: 600,
      //   width: 1200,
      //   height: 900,
      //   parent: main_window,
      //   modal: true,
      //   show: false,
      //   backgroundColor: "#282828",
      //   darkTheme: true,
      //   frame: false,
      //   titleBarStyle: "hidden",
      //   title: `Loading ${streamer}'s stream...`,
      //   webPreferences: {
      //     preload: path.join(__dirname, "public/electron/ttv.preload.js"),
      //     contextIsolation: true,
      //     enableRemoteModule: false,
      //   }
      // });

      // and load the index.html of the app.
      main_window.loadURL(url);
      
      main_window.webContents.on('did-finish-load', function() {
        main_window.webContents.insertCSS('#drag-area{-webkit-app-region: drag!important;}');
        init_window_size_handlers();
      });
      main_window.once("ready-to-show", ()=>{
        logger.debug(APP_SETTINGS.encoder.pprint({
          id: "win.event.ready-to-show",
          data: {
            url: url,
            t: Date.now(),
          }
        }));
        main_window.show();
      })
      break;
    default:
      const tbar_id = "tbar.";
      if (key.includes(tbar_id)) {
        key = key.substr(tbar_id.length);
        console.log(`HANDLE KEY: ${key}`);
        switch(key) {
          case "listeners.remove":
            main_window.removeAllListeners();
            break;
          case "btn.min":
            main_window.minimize();
            break;
          case "btn.max":
          case "btn.restore":
            main_window.isMaximized() ? main_window.unmaximize() : main_window.maximize();
            main_window.webContents.send("fromMain", APP_SETTINGS.encoder.encode({
              key: key,
              data: `${main_window.isMaximized() ? "max" : "min"}`,
            }))
            break;
          case "btn.close":
            main_window.close();
            break;
          case "btn.maxmimized":
            main_window.isMaximized() ? main_window.unmaximize() : main_window.maximize();
            break;
          case "btn.toggle.restore":
            let resp_data = main_window.isMaximized() ? "min" : "max";
            main_window.webContents.send("fromMain", APP_SETTINGS.encoder.encode({
              key: key,
              data: resp_data,
            }))
            break;
          case "btn.back":
            const back_choice = dialog.showMessageBoxSync(main_window, {
              type: 'question',
              buttons: ['Yes', 'No', 'Quit'],
              title: 'Holup',
              message: 'Return home?',
              defaultId: 1,
            })
            const go_back = (back_choice === 0)
            if (go_back) {
              main_window.webContents.goBack();
              init_window_size_handlers();
            } else if (back_choice == 2) {
              console.log("goodbye...");
              if (process.platform !== "darwin") app.quit();
              else app.exit();
            }
            break;
          default:
            logger.debug({
              id: "toMain.tbar.key.unhandled",
              data: {
                key: key,
                data: data.data,
              }
            })
            break;
        }
      } else {
        logger.debug({
          id: "toMain.key.unhandled",
          data: {
            key: key,
            data: data.data,
          }
        })
      }
      
      
      break;
  }
});

const template = [
  {
    label: "ttv-viewer",
    submenu: [
      {
        label: 'Home',
        accelerator: 'CommandOrControl+H',
        click() {
          main_window.loadFile(APP_SETTINGS.home_page);
        },
      },
      { role: 'reload' },
      { role: 'forcereload' },
      { 
        label: 'Go Back',
        accelerator: 'F3',
        click() {
          main_window.webContents.goBack();
        }, 
      },
      { 
        label: 'Go Forward',
        accelerator: 'F4',
        click() {
          main_window.webContents.goForward();
        }, 
      },
      { type: 'separator' },
      { role: 'minimize' },
      { role: 'togglefullscreen' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'quit', accelerator: 'Alt+F4' },
    ],
  }
]

function init_menu() {
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    })

    template.push({
      role: 'window',
    })

    template.push({ role: 'services' })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}