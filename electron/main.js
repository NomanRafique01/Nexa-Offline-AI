// Main Process
const { app, BrowserWindow, ipcMain, session, screen, Menu } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const Store = require("electron-store");
const crypto = require("crypto");

const store = new Store();

// Get theme background color
function getThemeBg() {
  const theme = store.get("theme", "forest");
  const map = {
    forest:   "#f4f7f6",
    midnight: "#0f0f1a",
    sand:     "#fdf6ed",
    ocean:    "#e8f4f8",
    carbon:   "#1a1a1a",
    blossom:  "#fff5f8",
    wine:     "#fdf5f7",
    sage:     "#f5f7f4",
    rust:     "#FDF6F0",
    blade:    "#F4F5F7",
  };
  return map[theme] || "#f4f7f6";
}

// Read install marker
function readInstallMarker() {
  try {
    const programData = process.env.PROGRAMDATA;
    if (!programData) return "";
    const markerPath = path.join(programData, "Nexa", "install-marker.txt");
    if (!fs.existsSync(markerPath)) return "";
    return fs.readFileSync(markerPath, "utf8").trim();
  } catch {
    return "";
  }
}

// ── Paths ─────────────────────────────────────────────────
const isPackaged = app.isPackaged;
const resourcesPath = isPackaged
  ? process.resourcesPath
  : path.join(__dirname, "..");

const backendPath = path.join(resourcesPath, "backend");
const ollamaPath  = path.join(resourcesPath, "ollama");

const pythonExe  = path.join(backendPath, "venv", "Scripts", "python.exe");
const mainPy     = path.join(backendPath, "main.py");
const backendExe = path.join(backendPath, "nexa-backend.exe");
const ollamaExe  = path.join(ollamaPath, "ollama.exe");
const iconPath   = path.join(resourcesPath, "assets", "icon.ico");

let mainWindow  = null;
let loadingWin  = null;
let backendProc = null;
let ollamaProc  = null;

// ── Security hardening ─────────────────────────────────────

// Harden session security
function hardenSession() {
  try {
    const s = session.defaultSession;
    if (!s) return;

    s.setPermissionRequestHandler((_webContents, permission, callback) => {
      if (permission === 'media' || permission === 'microphone' || permission === 'audioCapture') {
      callback(true);
    } else {
      callback(false);
    }
  });

    s.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: " +
            "https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org; " +
            "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:* https://cdn.jsdelivr.net " +
            "https://pypi.org https://files.pythonhosted.org;"
          ],
        },
      });
    });

    s.webRequest.onBeforeSendHeaders((details, callback) => {
      const headers = details.requestHeaders || {};
      headers["X-Requested-With"] = "Nexa";
      callback({ requestHeaders: headers });
    });
  } catch (e) {
    console.error("Session hardening error:", e);
  }
}

// ── Fresh Install ─────────────────────────────────────────

// Wipe data on fresh install
async function wipeOnFreshInstall() {
  const userDataDir = app.getPath("userData");
  const installMarker = readInstallMarker();
  const currentInstallFingerprint = `${app.getVersion()}::${app.getPath("exe")}::${installMarker || "no-marker"}`;
  const savedInstallFingerprint   = store.get("installFingerprint", "");
  console.log("currentFingerprint:", currentInstallFingerprint);
  console.log("savedFingerprint:  ", savedInstallFingerprint);
  const isFirstInstall = !savedInstallFingerprint || savedInstallFingerprint !== currentInstallFingerprint;
  console.log("isFirstInstall:", isFirstInstall);

  if (!store.get("theme")) store.set("theme", "forest");

  if (!isFirstInstall) return false;

  // Wipe electron-store
  store.clear();
  store.set("installId",           crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  store.set("installFingerprint",  currentInstallFingerprint);
  store.set("onboardingDone",      false);
  store.set("theme",               "forest");
  store.set("notes",               []);

  // Wipe userData nexa.db (chat history / notes)
  try {
    const dbPath = path.join(userDataDir, "nexa.db");
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  } catch (e) {
    console.error("userData DB wipe error:", e);
  }

  // Wipe backend's own nexa.db
  try {
    const backendDb = path.join(backendPath, "nexa.db");
    if (fs.existsSync(backendDb)) fs.unlinkSync(backendDb);
  } catch (e) {
    console.error("Backend DB wipe error:", e);
  }

  // Wipe localStorage, Session Storage, and all cached data
  try {
    const foldersToWipe = ["Local Storage", "Session Storage", "blob_storage", "IndexedDB"];
    for (const folder of foldersToWipe) {
      const p = path.join(userDataDir, folder);
      if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
    }
  } catch (e) {
    console.error("localStorage wipe error:", e);
  }

  console.log("Fresh install → full wipe done");
  return true;
}

// ── Start Ollama ──────────────────────────────────────────

// Start Ollama process
function startOllama() {
  return new Promise((resolve) => {
    if (!fs.existsSync(ollamaExe)) return resolve();

    ollamaProc = spawn(ollamaExe, ["serve"], {
      cwd: ollamaPath,
      env: {
        ...process.env,
        OLLAMA_MODELS: path.join(ollamaPath, "models"),
      },
      stdio: "ignore",
    });

    setTimeout(resolve, 2000);
  });
}

// ── Start Backend ─────────────────────────────────────────

// Start Python backend
function startBackend() {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      PYTHONUNBUFFERED:    "1",
      TRANSFORMERS_OFFLINE: "1",
      NEXA_USER_DATA_DIR:  app.getPath("userData"),
    };

    if (app.isPackaged && fs.existsSync(backendExe)) {
      backendProc = spawn(backendExe, [], {
        cwd:   backendPath,
        stdio: ["ignore", "pipe", "pipe"],
        env,
      });
    } else {
      if (!fs.existsSync(pythonExe)) return reject("Python not found");
      backendProc = spawn(pythonExe, ["-u", mainPy], {
        cwd:   backendPath,
        stdio: ["ignore", "pipe", "pipe"],
        env,
      });
    }

    let started = false;

    backendProc.stdout.on("data", (d) => {
      const msg = d.toString();
      if (!started && msg.includes("Uvicorn running")) {
        started = true;
        resolve();
      }
    });

    backendProc.stderr.on("data", (d) => {
      const msg = d.toString();
      if (!started && msg.includes("Uvicorn running")) {
        started = true;
        resolve();
      }
    });

    backendProc.on("error", reject);

    setTimeout(() => {
      if (!started) resolve();
    }, 6000);
  });
}

// ── Loading Window ────────────────────────────────────────

// Create loading window
function createLoadingWindow() {
  const { width, height } = screen.getPrimaryDisplay().bounds;
  loadingWin = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    show:        false,
    frame:       false,
    resizable:   false,
    // ── FIX REQ 6: removed alwaysOnTop so it can't flash over main ──
    skipTaskbar: true,
    icon:        iconPath,
    backgroundColor: getThemeBg(),
    webPreferences: {
      nodeIntegration:  false,
      contextIsolation: true,
      sandbox:          true,
    },
  });

  loadingWin.loadFile(path.join(__dirname, "loading.html"));
  loadingWin.once("ready-to-show", () => loadingWin.show());
}

// ── Main Window ───────────────────────────────────────────

// Create main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width:  1280,
    height: 800,
    show:   false,
    fullscreen:       false,
    frame:            true,
    autoHideMenuBar:  true,
    icon:             iconPath,
    title:            "Nexa Offline AI",
    backgroundColor:  getThemeBg(),
    webPreferences: {
      preload:          path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration:  false,
      devTools:         true,
      sandbox:          true,
    },
  });

  const file = path.join(resourcesPath, "frontend", "build", "index.html");
  mainWindow.loadFile(file);
  mainWindow.setMenuBarVisibility(false);

  // ── FIX REQ 6: smooth transition — show main THEN close loading ──
  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();

    // Close loading window AFTER main is visible — no flash gap
    setTimeout(() => {
      if (loadingWin && !loadingWin.isDestroyed()) {
        loadingWin.close();
        loadingWin = null;
      }
    }, 80);

    // ── FIX REQ 2: delay onboarding until React has fully mounted ──
    if (!store.get("onboardingDone")) {
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("show-onboarding");
        }
      }, 600);
    }
  });

  // Block devtools shortcuts
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (
      input.key === "F12" ||
      (input.control && input.shift && input.key === "I")
    ) {
      event.preventDefault();
    }
  });
  

  // Block popups and cross-navigation
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file:")) event.preventDefault();
  });
}

// ── IPC ───────────────────────────────────────────────────
ipcMain.handle("complete-onboarding", (_, data) => {
  store.set("onboardingDone", true);
  store.set("userProfile", data);
});

ipcMain.handle("set-profile", (_, data) => {
  const profile = {
    name:   data?.name   || "",
    avatar: data?.avatar || null,
  };
  store.set("userProfile", profile);
  return profile;
});

ipcMain.handle("get-profile", () => {
  return store.get("userProfile", null);
});

ipcMain.handle("is-onboarding-done", () => {
  return store.get("onboardingDone", false);
});

ipcMain.handle("is-first-install", () => {
  return !store.get("onboardingDone", false) && !!store.get("installId");
});

ipcMain.handle("get-theme", () => {
  return store.get("theme", "forest");
});

const { clipboard } = require("electron");

ipcMain.handle("get-notes", () => {
  return store.get("notes", []);
});

ipcMain.handle("set-notes", (_, notes) => {
  store.set("notes", notes);
});

ipcMain.handle("clipboard-write", (_, text) => {
  clipboard.writeText(text || "");
});

ipcMain.handle("clipboard-read", () => {
  return clipboard.readText();
});

// ── App Start ─────────────────────────────────────────────
app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  hardenSession();
  await wipeOnFreshInstall();
  createLoadingWindow();

  try {
    const minimumLoadingTime = new Promise((resolve) => setTimeout(resolve, 3500));
    await Promise.all([startOllama(), startBackend(), minimumLoadingTime]);
  } catch (e) {
    console.error(e);
  }

  createMainWindow();
  if (mainWindow) mainWindow.webContents.send("backend-ready");
});

// ── Exit — stop backend & ollama completely ───────────────

// Clean exit
function cleanExit() {
  try { if (backendProc) { backendProc.kill("SIGTERM"); backendProc = null; } } catch {}
  try { if (ollamaProc)  { ollamaProc.kill("SIGTERM");  ollamaProc  = null; } } catch {}
}

app.on("before-quit", cleanExit);
app.on("window-all-closed", () => {
  cleanExit();
  app.quit();
});