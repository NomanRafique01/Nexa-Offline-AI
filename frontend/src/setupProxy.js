const { createProxyMiddleware } = require("http-proxy-middleware");

const backendTarget = "http://127.0.0.1:8000";

module.exports = function setupProxy(app) {
  app.use(
    [
      "/chat",
      "/conversations",
      "/translate",
      "/tts",
      "/extract-text",
      "/runtime-status",
      "/ws",
    ],
    createProxyMiddleware({
      target: backendTarget,
      changeOrigin: true,
      ws: true,
    })
  );
};
