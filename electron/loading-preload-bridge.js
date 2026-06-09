// Loading window IPC bridge
window.__nexaLoading = {
  _cb: null,
  onReady(fn) { this._cb = fn; },
  trigger() { if (this._cb) this._cb(); }
};
