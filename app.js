const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
ipc.on('open-file-dialog', function (event) {
  console.log("openfiledialog");
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files) {
    if (files) event.sender.send('selected-file', files)
  })
})

  let win;
  function createWindow () {
    
    win =new BrowserWindow({webPreferences: {
      nodeIntegration: true
    },frame: false,
    width: 600,
    height: 425,
    icon:"med/newlogo.png",
    resizable:false,
    center:true});
    win.setTitle("Trizin Crypto")
    win.loadFile('index.html')

    //win.webContents.openDevTools()
    win.on('closed', () => {
      win = null
    })
  }
 
  app.on('ready', createWindow)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  })
  