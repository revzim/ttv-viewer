/* revzim | this base was an old electron 'skeleton' of mine */
const { app, BrowserWindow, Menu } = require('electron')

require('ttv-ad-less-standalone');

app.allowRendererProcessReuse = true

// DISABLED
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false

const path = require('path')

let mainWindow


function createWindow() {
  // CREATE BROWSER WINDOW
  mainWindow = new BrowserWindow({
    minWidth: 600,
    minHeight: 600,
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "public/electron/preload.js"),
      contextIsolation: true,
      enableRemoteModule: false
    }
  })

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    {urls: ['*://*/*']},
    (details, callback) => {
      Object.keys(details.responseHeaders).filter(x => {
        x.toLowerCase() === 'x-frame-options' || x.toLowerCase() === 'content-security-policy' || x.toLocaleLowerCase() === 'strict-transport-security'
      }).map(x => delete details.responseHeaders[x])
  
      callback({
        cancel: false,
        responseHeaders: details.responseHeaders,
      })
    },
  )

  // INIT MENU
  initMenu()

  // and load the index.html of the app.
  mainWindow.loadFile("public/static/index.html")

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

const template = [
  {
    label: "TTV Viewer",
    submenu: [
      {
        label: 'Home',
        accelerator: 'CommandOrControl+H',
        click() {
          sendMenuEvent({ route: '/' })
        },
      },
      { role: 'reload' },
      { role: 'forcereload' },
      { 
        label: 'Go Back',
        accelerator: 'F3',
        click() {
          mainWindow.webContents.goBack();
        }, 
      },
      { 
        label: 'Go Forward',
        accelerator: 'F4',
        click() {
          mainWindow.webContents.goForward();
        }, 
      },
      { type: 'separator' },
      { role: 'minimize' },
      { role: 'togglefullscreen' },
      // { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'quit', accelerator: 'Alt+F4' },
    ],
  }
]

function initMenu() {
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