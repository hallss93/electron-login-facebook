import { app, BrowserWindow, ipcMain } from 'electron'
var FB = require('fb');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('fb-authenticate', function (ipcEvent, arg) {
  var options = {
    client_id: 'CLIENT_ID',
    scopes: 'public_profile',
    redirect_uri: 'https://www.facebook.com/connect/login_success.html'
  };

  var authWindow = new BrowserWindow({ width: 1000, height: 700, show: false, parent: mainWindow, modal: true, webPreferences: { nodeIntegration: false } });
  var facebookAuthURL = `https://www.facebook.com/login/device-based/regular/login/?login_attempt=1&lwv=111`

  authWindow.loadURL(facebookAuthURL);
  authWindow.show();
  authWindow.webContents.on('did-navigate', function (event, newUrl, code, text) {
    if (newUrl == "https://www.facebook.com/") {
      authWindow.loadURL(`https://www.facebook.com/v3.1/dialog/oauth?
      client_id=${options.client_id}
      &display=popup
      &response_type=token
      &redirect_uri=${options.redirect_uri}`)
      authWindow.loadURL(`https://www.facebook.com/v2.8/dialog/oauth?client_id=${options.client_id}&redirect_uri=${options.redirect_uri}&response_type=token,granted_scopes&scope=${options.scopes}&display=popup`)
    } else {
      var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
      var access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
      var error = /\?error=(.+)$/.exec(newUrl);

      if (access_token) {
        FB.setAccessToken(access_token);
        FB.api('/me', { fields: ['id', 'name', 'picture.width(800).height(800)'] }, function (resMe) {
          ipcEvent.sender.send('fb-authenticated', resMe)
          authWindow.close();
        });
      }
    }
  });
})