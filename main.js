const { app, BrowserWindow, shell, globalShortcut } = require("electron");
const path = require("path");

const isMac = process.platform === "darwin";

// Keep a global reference of the window object to prevent garbage collection
let mainWindow = null;

function createWindow() {
  const windowOptions = {
    width: 1000,
    height: 750,
    minWidth: 480,
    minHeight: 400,
    backgroundColor: "#ffffff",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  };

  if (isMac) {
    windowOptions.titleBarStyle = "hiddenInset";
    windowOptions.trafficLightPosition = { x: 16, y: 16 };
    windowOptions.vibrancy = "sidebar";
  }

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.loadURL("https://jisho.org/");

  // Show window once content is ready to avoid visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Open external links in the default browser instead of Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const jishoOrigin = "https://jisho.org";
    if (!url.startsWith(jishoOrigin)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  // Also handle in-page navigation to external sites
  mainWindow.webContents.on("will-navigate", (event, url) => {
    const jishoOrigin = "https://jisho.org";
    if (!url.startsWith(jishoOrigin)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.setName("Jisho");

app.whenReady().then(() => {
  createWindow();

  // macOS: re-create window when clicking the dock icon
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

// macOS convention: keep the app running even when all windows are closed
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
