const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function startBackend() {
  const jarPath = path.join(__dirname, '..', 'backend', 'target', 'cortex-ide-0.1.0.jar');
  backendProcess = spawn('java', ['-jar', jarPath], {
    cwd: path.join(__dirname, '..', 'backend'),
  });
  backendProcess.stdout.on('data', (data) => console.log(`[Backend] ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`[Backend] ${data}`));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'Cortex IDE',
    backgroundColor: '#0d1117',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load Angular app
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist', 'frontend', 'browser', 'index.html');
  mainWindow.loadFile(frontendPath);

  mainWindow.on('closed', () => { mainWindow = null; });
}

// IPC handlers
ipcMain.handle('open-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  return result.filePaths[0] || null;
});

app.whenReady().then(() => {
  startBackend();
  // Wait for backend to start
  setTimeout(createWindow, 3000);
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
