// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
var path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

/**
 * Obtiene el ancho del display primario de la PC
 */
function View_GetScreenWidht() {
  const screen = require('electron').screen;
  const display = screen.getPrimaryDisplay();
  const area = display.workArea;
  var dimensions = display.size;

  // console.log(dimensions.width + "x" + dimensions.height);
  return dimensions.width;
}

/**
 * Obtiene el alto del display primario de la PC
 */
function View_GetScreenHeight() {
  const screen = require('electron').screen;
  const display = screen.getPrimaryDisplay();
  const area = display.workArea;
  var dimensions = display.size;

  // console.log(dimensions.width + "x" + dimensions.height);
  return dimensions.height;
}

/**
 * Obtiene el alto actual de la ventana
 */
function View_GetCurrentHeight() {
  const electron = require('electron')
  const remote = electron.remote

  var height = remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds().height;

  return height;
}

/**
 * Obtiene el ancho actual de la ventana
 */
function View_GetCurrentWidth() {
  const electron = require('electron')
  const remote = electron.remote

  var width = remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds().width;

  return width;
}

/**
 * Setea el zoom de la aplicacion.
 */
function View_SetZoomFactor(scaleFactor) {
  const { webFrame } = require('electron');
  webFrame.setZoomFactor(scaleFactor);
}

function View_ResizeAppDinamically () {
  let currentWidth = View_GetCurrentWidth();
  let currentHeight = View_GetCurrentHeight();
  let ratio = currentHeight / currentWidth;

  if (ratio < 0.52 || ratio > 0.6){
    let newWidth = currentHeight / 0.5625;
    const { webFrame } = require('electron');
    webFrame.setSize(newWidth, currentHeight);  
  }
}

function View_CalculateZoomFactor() {
  let currentWidth = View_GetCurrentWidth();
  let currentHeight = View_GetCurrentHeight();
  let ratio = currentHeight / currentWidth;
  let zoomFactor = VIEW_DEFAUL_ZOOM_FACTOR;

  const LIMIT_RATIO = 0.62;
  const STEP = 50;

  let heightMin = 400;
  let heightMax = 1100;

  let tempHeight = heightMin;
  let tempZoomFactor = 0.5;

  for (tempHeight = heightMin, tempZoomFactor = 0.5; tempHeight < heightMax; tempHeight += STEP, tempZoomFactor += 0.067) {

    if (currentHeight < tempHeight) {
      if (ratio > 0.52 && ratio < 0.61) {
        zoomFactor = tempZoomFactor;
        break;
      } 
    }

  }
  Log_Print(Log_t.DEBUG, "View_AdjustAppZoom", "Zoom calculado: " + zoomFactor);
  return zoomFactor;
}

function createWindow () {

  const windowWidth = View_GetScreenWidht();
  const windowHeight = View_GetScreenHeight() - 50;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: windowWidth, 
    height: windowHeight,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  })
  // Oculta la barra de menu
  mainWindow.setMenuBarVisibility(false);
  // maximiza la ventana
  // mainWindow.maximize();
  // no se puede cambiar el tamaño
  mainWindow.setResizable(false);
  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html');
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
