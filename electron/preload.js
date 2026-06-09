// Preload script
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // ── Onboarding ─────────────────────────────
  
  completeOnboarding: (profile) =>
    ipcRenderer.invoke("complete-onboarding", profile),

  getProfile: () =>
    ipcRenderer.invoke("get-profile"),

  setProfile: (profile) =>
    ipcRenderer.invoke("set-profile", profile),

  isOnboardingDone: () =>
    ipcRenderer.invoke("is-onboarding-done"),

  // ── Theme ──────────────────────────────────

  getTheme: () =>
    ipcRenderer.invoke("get-theme"),

  setTheme: (theme) =>
    ipcRenderer.invoke("set-theme", theme),

  // ── First Install ──────────────────────────

  isFirstInstall: () =>
    ipcRenderer.invoke("is-first-install"),

  // ── Notes ──────────────────────────────────

  getNotes: () =>
    ipcRenderer.invoke("get-notes"),

  setNotes: (notes) =>
    ipcRenderer.invoke("set-notes", notes),
  
  clipboardWrite: (text) => ipcRenderer.invoke("clipboard-write", text),

  clipboardRead: () => ipcRenderer.invoke("clipboard-read"),

  // ── Events ─────────────────────────────────

  onShowOnboarding: (callback) => {
    ipcRenderer.removeAllListeners("show-onboarding");
    ipcRenderer.on("show-onboarding", (_, data) => callback(data));
  },

  removeShowOnboarding: () => {
    ipcRenderer.removeAllListeners("show-onboarding");
  },

  onBackendReady: (callback) => {
    ipcRenderer.on("backend-ready", callback);
  },

  removeBackendReady: (callback) => {
    ipcRenderer.removeListener("backend-ready", callback);
  },

  // ── Safe invoke wrapper (prevents crash) ──

  safeInvoke: async (channel, data) => {
    try {
      return await ipcRenderer.invoke(channel, data);
    } catch (e) {
      console.error("IPC Error:", e);
      return null;
    }
  }
});