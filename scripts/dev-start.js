const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const backendDir = path.join(rootDir, "backend");
const frontendDir = path.join(rootDir, "frontend");
const backendExe = path.join(backendDir, "venv", "Scripts", "python.exe");
const frontendScript = path.join(frontendDir, "node_modules", "react-scripts", "bin", "react-scripts.js");

const backendLog = fs.openSync(path.join(rootDir, ".codex-backend.log"), "a");
const frontendLog = fs.openSync(path.join(rootDir, ".codex-frontend.log"), "a");

const children = [];

function startChild(label, command, args, options, logFd) {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.env,
    stdio: ["ignore", logFd, logFd],
    detached: true,
    windowsHide: true,
  });

  child.unref();
  children.push({ label, child });
  fs.writeSync(logFd, `\n[dev-start] launched ${label} pid=${child.pid}\n`);
  return child;
}

startChild(
  "backend",
  backendExe,
  ["-u", "main.py"],
  { cwd: backendDir, env: process.env },
  backendLog
);

startChild(
  "frontend",
  process.execPath,
  [frontendScript, "start"],
  {
    cwd: frontendDir,
    env: {
      ...process.env,
      BROWSER: "none",
    },
  },
  frontendLog
);

console.log("[dev-start] backend and frontend launched");

setInterval(() => {}, 1 << 30);
