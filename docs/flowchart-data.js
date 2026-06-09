// ── TREE STRUCTURE ────────────────────────────────────────────────────────────
const TREE={id:"nexa",label:"Nexa Application",cat:"u",children:[
{id:"user",label:"User",cat:"u",children:[
{id:"user-input",label:"Text Input",cat:"u"},
{id:"user-voice",label:"Voice Input",cat:"u"},
{id:"user-file",label:"File Upload (PDF/DOCX)",cat:"u"},
{id:"user-image",label:"Image Attachment",cat:"u"}]},
{id:"electron",label:"Electron Shell",cat:"e",children:[
{id:"main-js",label:"main.js (Main Process)",cat:"e",children:[
{id:"app-lifecycle",label:"App Lifecycle",cat:"e"},
{id:"wipe-install",label:"wipeOnFreshInstall()",cat:"e"},
{id:"harden-session",label:"hardenSession()",cat:"e"},
{id:"start-ollama",label:"startOllama()",cat:"e"},
{id:"start-backend",label:"startBackend()",cat:"e"},
{id:"create-loading",label:"createLoadingWindow()",cat:"e"},
{id:"create-main-win",label:"createMainWindow()",cat:"e"},
{id:"clean-exit",label:"cleanExit()",cat:"e"}]},
{id:"preload-js",label:"preload.js (Context Bridge)",cat:"e",children:[
{id:"ea-complete",label:"completeOnboarding()",cat:"e"},
{id:"ea-profile",label:"getProfile() / setProfile()",cat:"e"},
{id:"ea-onboard",label:"isOnboardingDone()",cat:"e"},
{id:"ea-theme",label:"getTheme() / setTheme()",cat:"e"},
{id:"ea-install",label:"isFirstInstall()",cat:"e"},
{id:"ea-events",label:"onShowOnboarding / onBackendReady",cat:"e"},
{id:"ea-safe",label:"safeInvoke()",cat:"e"}]},
{id:"loading-screen",label:"Loading Screen",cat:"e",children:[
{id:"loading-html",label:"loading.html",cat:"e"},
{id:"loading-js",label:"loading.js (Progress Bar)",cat:"e"},
{id:"loading-css",label:"loading.css (Orbs + Style)",cat:"e"},
{id:"loading-bridge",label:"loading-preload-bridge.js",cat:"e"}]},
{id:"ipc-handlers",label:"IPC Handlers (ipcMain)",cat:"e",children:[
{id:"ipc-complete",label:"complete-onboarding",cat:"e"},
{id:"ipc-profile",label:"get-profile / set-profile",cat:"e"},
{id:"ipc-onboard",label:"is-onboarding-done",cat:"e"},
{id:"ipc-theme",label:"get-theme / set-theme",cat:"e"},
{id:"ipc-install",label:"is-first-install",cat:"e"}]},
{id:"electron-store",label:"electron-store (config.json)",cat:"d",children:[
{id:"es-theme",label:"theme",cat:"d"},
{id:"es-onboard",label:"onboardingDone",cat:"d"},
{id:"es-profile",label:"userProfile {name, avatar}",cat:"d"},
{id:"es-installid",label:"installId (UUID)",cat:"d"},
{id:"es-fingerprint",label:"installFingerprint",cat:"d"}]},
{id:"child-procs",label:"Child Processes",cat:"e",children:[
{id:"ollama-proc",label:"ollamaProc (ollama.exe serve)",cat:"x"},
{id:"backend-proc",label:"backendProc (nexa-backend.exe / python)",cat:"x"}]},
{id:"electron-build",label:"Build & Packaging",cat:"e",children:[
{id:"eb-frontend",label:"Build Frontend (react-scripts)",cat:"f"},
{id:"eb-asar",label:"ASAR Pack",cat:"e"},
{id:"eb-resources",label:"extraResources",cat:"e"},
{id:"eb-nsis",label:"NSIS Installer",cat:"e"},
{id:"eb-portable",label:"Portable Build",cat:"e"}]}]},
{id:"frontend",label:"React Frontend",cat:"f",children:[
{id:"index-js",label:"index.js (Entry Point)",cat:"f"},
{id:"app-js",label:"App.js (Central Orchestrator)",cat:"f",children:[
{id:"app-state",label:"State Management",cat:"f",children:[
{id:"s-activekey",label:"activeKey",cat:"f"},
{id:"s-messages",label:"messages[]",cat:"f"},
{id:"s-istyping",label:"isTyping",cat:"f"},
{id:"s-model",label:"selectedModel",cat:"f"},
{id:"s-sidebar",label:"sidebarCollapsed",cat:"f"},
{id:"s-profile",label:"userProfile {name, avatar}",cat:"f"},
{id:"s-notepad",label:"notepadOpen",cat:"f"},
{id:"s-coderunner",label:"codeRunnerOpen, crCode, crOutput…",cat:"f"},
{id:"s-export",label:"exportDropdown, modelDropdown",cat:"f"}]},
{id:"app-refs",label:"Refs",cat:"f",children:[
{id:"r-msgcache",label:"msgCache { [key]: messages[] }",cat:"f"},
{id:"r-abort",label:"abortControllers { [key]: AbortController }",cat:"f"},
{id:"r-typing",label:"typingState { [key]: boolean }",cat:"f"},
{id:"r-throttle",label:"renderThrottle { [key]: timestamp }",cat:"f"},
{id:"r-focus",label:"inputFocusRef (textarea DOM)",cat:"f"}]},
{id:"app-handlers",label:"Event Handlers",cat:"f",children:[
{id:"h-send",label:"handleSend()",cat:"f"},
{id:"h-stream",label:"streamResponse()",cat:"f"},
{id:"h-stop",label:"handleStop()",cat:"f"},
{id:"h-select",label:"handleSelectConversation()",cat:"f"},
{id:"h-newchat",label:"handleNewChat()",cat:"f"},
{id:"h-edit",label:"handleEditMessage()",cat:"f"},
{id:"h-reload",label:"handleReloadResponse()",cat:"f"},
{id:"h-export-pdf",label:"handleExportPDF()",cat:"f"},
{id:"h-export-docx",label:"handleExportDOCX()",cat:"f"},
{id:"h-run-code",label:"handleRunCode()",cat:"f"},
{id:"h-profile",label:"handleProfileUpdate()",cat:"f"},
{id:"h-onboard",label:"handleOnboardingComplete()",cat:"f"}]}]},
{id:"components",label:"Components",cat:"f",children:[
{id:"comp-onboarding",label:"OnboardingScreen",cat:"f",children:[
{id:"ob-step1",label:"Step 1: Name Input",cat:"f"},
{id:"ob-step2",label:"Step 2: Avatar + CropModal",cat:"f"},
{id:"ob-complete",label:"onComplete(profile)",cat:"f"}]},
{id:"comp-sidebar",label:"Sidebar",cat:"f",children:[
{id:"sb-logo",label:"ChipLogo (Nexa SVG)",cat:"f"},
{id:"sb-newchat",label:"New Chat Button",cat:"f"},
{id:"sb-search",label:"Search Bar",cat:"f"},
{id:"sb-convlist",label:"Conversation List",cat:"f"},
{id:"sb-rename",label:"Rename Button",cat:"f"},
{id:"sb-delete",label:"Delete Button",cat:"f"},
{id:"sb-theme",label:"Theme Picker (10 themes)",cat:"f"},
{id:"sb-profile",label:"Profile Section",cat:"f"},
{id:"sb-about",label:"About Modal",cat:"f"}]},
{id:"comp-chatwin",label:"ChatWindow",cat:"f",children:[
{id:"cw-welcome",label:"Welcome Screen",cat:"f"},
{id:"cw-userbubble",label:"User Message Bubble",cat:"f",children:[
{id:"ub-text",label:"displayContent",cat:"f"},
{id:"ub-image",label:"Image Preview",cat:"f"},
{id:"ub-doc",label:"DocThumbnail",cat:"f"}]},
{id:"cw-aibubble",label:"Assistant Message Bubble",cat:"f",children:[
{id:"ab-markdown",label:"ReactMarkdown",cat:"f"},
{id:"ab-codeblock",label:"CodeBlock + Copy",cat:"f"},
{id:"ab-tts",label:"🔊 TTS Button",cat:"f"},
{id:"ab-translate",label:"🌐 Translate Button",cat:"f"},
{id:"ab-copy",label:"📋 Copy Button",cat:"f"},
{id:"ab-edit",label:"✏️ Edit Button",cat:"f"},
{id:"ab-regen",label:"🔄 Regenerate Button",cat:"f"}]},
{id:"cw-typing",label:"TypingDots Indicator",cat:"f"},
{id:"cw-analyzing",label:"AnalyzingIndicator",cat:"f"},
{id:"cw-scroll",label:"Auto-scroll",cat:"f"}]},
{id:"comp-msginput",label:"MessageInput",cat:"f",children:[
{id:"mi-textarea",label:"Textarea (auto-resize)",cat:"f"},
{id:"mi-emoji",label:"😊 Emoji Picker",cat:"f"},
{id:"mi-plus",label:"➕ Plus Menu",cat:"f",children:[
{id:"pm-upload",label:"📎 Upload Document",cat:"f"},
{id:"pm-image",label:"🖼️ Attach Image",cat:"f"}]},
{id:"mi-voice",label:"🎤 Voice Button (WS)",cat:"f"},
{id:"mi-send",label:"▶ Send / ■ Stop",cat:"f"},
{id:"mi-preview",label:"Image Preview",cat:"f"}]},
{id:"comp-notepad",label:"NotepadTool",cat:"f",children:[
{id:"np-editor",label:"Textarea Editor",cat:"f"},
{id:"np-saved",label:"Saved Notes Sidebar",cat:"f"},
{id:"np-actions",label:"Save/New/Copy/Paste/PDF",cat:"f"}]},
{id:"comp-coderunner",label:"CodeRunnerModal",cat:"f",children:[
{id:"cr-editor",label:"Editor (react-simple-code-editor)",cat:"f"},
{id:"cr-prism",label:"Prism.js Highlighting",cat:"f"},
{id:"cr-snippets",label:"Sample Snippets",cat:"f"},
{id:"cr-run",label:"▶ Run Button",cat:"f"},
{id:"cr-output",label:"OutputPanel (terminal)",cat:"f"},
{id:"cr-loading",label:"Pyodide Loading Indicator",cat:"f"}]},
{id:"comp-loading",label:"LoadingScreen",cat:"f"}]},
{id:"services",label:"Services & Hooks",cat:"f",children:[
{id:"api-js",label:"api.js (HTTP/SSE Client)",cat:"f",children:[
{id:"api-send",label:"sendMessage() — POST /chat SSE",cat:"f"},
{id:"api-convs",label:"getConversations()",cat:"f"},
{id:"api-msgs",label:"getMessages()",cat:"f"},
{id:"api-delete",label:"deleteConversation()",cat:"f"},
{id:"api-title",label:"generateTitle()",cat:"f"},
{id:"api-rename",label:"renameConversation()",cat:"f"},
{id:"api-translate",label:"translateText()",cat:"f"}]},
{id:"pyodide-hook",label:"usePyodide.js (WASM Python)",cat:"f",children:[
{id:"py-load",label:"Load Pyodide Runtime",cat:"f"},
{id:"py-run",label:"runPython(code)",cat:"f"},
{id:"py-input",label:"resolveInput()",cat:"f"},
{id:"py-preprocess",label:"preprocessCode()",cat:"f"}]},
{id:"setup-proxy",label:"setupProxy.js (Dev Proxy)",cat:"f"}]},
{id:"local-storage",label:"localStorage",cat:"d",children:[
{id:"ls-theme",label:"nexa_theme",cat:"d"},
{id:"ls-onboard",label:"nexa_onboarded",cat:"d"},
{id:"ls-profile",label:"nexa_profile",cat:"d"},
{id:"ls-notes",label:"nexa_notes",cat:"d"},
{id:"ls-lastseen",label:"nexa_last_seen",cat:"d"},
{id:"ls-code",label:"nexa_code",cat:"d"}]}]},
{id:"backend",label:"FastAPI Backend (:8000)",cat:"b",children:[
{id:"main-py",label:"main.py (All Routes)",cat:"b",children:[
{id:"route-root",label:"GET / — Health Check",cat:"b"},
{id:"route-status",label:"GET /runtime-status",cat:"b"},
{id:"route-chat",label:"POST /chat — SSE Chat",cat:"b",children:[
{id:"chat-newconv",label:"Create Conversation",cat:"b"},
{id:"chat-saveuser",label:"Save User Message",cat:"b"},
{id:"chat-prompt",label:"Build Model Prompt",cat:"b"},
{id:"chat-image",label:"Image Path (moondream)",cat:"b"},
{id:"chat-text",label:"Text Path (gemma/phi3/mistral)",cat:"b"},
{id:"chat-stream",label:"Stream Tokens via SSE",cat:"b"},
{id:"chat-saveai",label:"Save Assistant Message",cat:"b"}]},
{id:"route-title",label:"POST /conv/{id}/generate-title",cat:"b"},
{id:"route-convs",label:"GET /conversations",cat:"b"},
{id:"route-msgs",label:"GET /conversations/{id}",cat:"b"},
{id:"route-delete",label:"DELETE /conversations/{id}",cat:"b"},
{id:"route-delete-all",label:"DELETE /conversations/all",cat:"b"},
{id:"route-rename",label:"PATCH /conv/{id}/rename",cat:"b"},
{id:"route-translate",label:"POST /translate",cat:"b",children:[
{id:"tr-clean",label:"clean_line()",cat:"b"},
{id:"tr-safe",label:"safe_translate()",cat:"b"},
{id:"tr-argos",label:"argostranslate engine",cat:"b"}]},
{id:"route-langs",label:"GET /translate/languages",cat:"b"},
{id:"route-tts",label:"GET /tts/stream — Piper TTS",cat:"b",children:[
{id:"tts-piper",label:"subprocess.Popen(piper.exe)",cat:"b"},
{id:"tts-pcm",label:"int16 → float32 PCM",cat:"b"},
{id:"tts-streaming",label:"StreamingResponse",cat:"b"}]},
{id:"route-extract",label:"POST /extract-text",cat:"b",children:[
{id:"ext-pdf",label:"pdfplumber (PDF)",cat:"b"},
{id:"ext-docx",label:"python-docx (DOCX)",cat:"b"},
{id:"ext-trim",label:"Trim to 4000 chars",cat:"b"}]},
{id:"route-voice",label:"WS /ws/voice — Vosk STT",cat:"b",children:[
{id:"v-vosk",label:"Vosk KaldiRecognizer(16kHz)",cat:"b"},
{id:"v-sound",label:"sounddevice.RawInputStream",cat:"b"},
{id:"v-partial",label:'{"type":"partial"}',cat:"b"},
{id:"v-final",label:'{"type":"final"}',cat:"b"}]}]},
{id:"models-py",label:"models.py (SQLAlchemy ORM)",cat:"b",children:[
{id:"mod-conv",label:"Conversation {id, title, created_at}",cat:"b"},
{id:"mod-msg",label:"Message {id, conversation_id, role, content, created_at}",cat:"b"}]},
{id:"database-py",label:"database.py (SQLite Setup)",cat:"b",children:[
{id:"db-engine",label:"create_engine()",cat:"b"},
{id:"db-session",label:"SessionLocal",cat:"b"},
{id:"db-init",label:"init_db()",cat:"b"},
{id:"db-dep",label:"get_db()",cat:"b"}]},
{id:"pydantic",label:"Pydantic Models",cat:"b",children:[
{id:"py-chatmsg",label:"ChatMessage",cat:"b"},
{id:"py-rename",label:"RenamePayload",cat:"b"},
{id:"py-title",label:"TitlePayload",cat:"b"},
{id:"py-translate",label:"TranslatePayload",cat:"b"}]},
{id:"helpers",label:"Helper Functions",cat:"b",children:[
{id:"help-strip",label:"strip_markdown()",cat:"b"},
{id:"help-compress",label:"compress_image_b64()",cat:"b"}]},
{id:"nexa-db",label:"nexa.db (SQLite)",cat:"d",children:[
{id:"db-conversations",label:"conversations table",cat:"d"},
{id:"db-messages",label:"messages table",cat:"d"}]}]},
{id:"external",label:"External Services",cat:"x",children:[
{id:"ollama",label:"Ollama Server (:11434)",cat:"x",children:[
{id:"ol-serve",label:"ollama.exe serve",cat:"x"},
{id:"ol-api",label:"/api/generate (SSE)",cat:"x"},
{id:"ol-gemma",label:"gemma:2b",cat:"x"},
{id:"ol-phi3",label:"phi3",cat:"x"},
{id:"ol-mistral",label:"mistral:latest",cat:"x"},
{id:"ol-moondream",label:"moondream (vision)",cat:"x"},
{id:"ol-models-dir",label:"ollama/models/",cat:"d"}]},
{id:"piper",label:"Piper TTS",cat:"x",children:[
{id:"pi-exe",label:"piper/piper.exe",cat:"x"},
{id:"pi-model",label:"en_US-amy-medium.onnx",cat:"x"},
{id:"pi-output",label:"Raw PCM 22050Hz",cat:"x"}]},
{id:"vosk",label:"Vosk Speech Recognition",cat:"x",children:[
{id:"vo-model",label:"vosk-model/",cat:"x"},
{id:"vo-rec",label:"KaldiRecognizer(16kHz)",cat:"x"}]},
{id:"argos",label:"Argos Translate",cat:"x",children:[
{id:"ar-packages",label:"argos_packages/",cat:"x"},
{id:"ar-en-ur",label:"English → Urdu",cat:"x"},
{id:"ar-en-hi",label:"English → Hindi",cat:"x"},
{id:"ar-en-zh",label:"English → Chinese",cat:"x"}]},
{id:"pyodide",label:"Pyodide (WASM Python)",cat:"x",children:[
{id:"py-wasm",label:"Python WASM Runtime",cat:"x"},
{id:"py-stdout",label:"stdout/stderr capture",cat:"x"},
{id:"py-plots",label:"Matplotlib plot capture",cat:"x"}]}]},
{id:"data-flows",label:"Data Flows",cat:"d",children:[
{id:"flow-chat",label:"Chat Flow (Text)",cat:"d"},
{id:"flow-image",label:"Chat Flow (Image/Vision)",cat:"d"},
{id:"flow-voice",label:"Voice Input Flow",cat:"d"},
{id:"flow-tts",label:"Text-to-Speech Flow",cat:"d"},
{id:"flow-translate",label:"Translation Flow",cat:"d"},
{id:"flow-doc",label:"Document Upload Flow",cat:"d"},
{id:"flow-onboard",label:"Onboarding Flow",cat:"d"},
{id:"flow-theme",label:"Theme Flow",cat:"d"},
{id:"flow-code",label:"Code Runner Flow",cat:"d"},
{id:"flow-notepad",label:"Notepad Flow",cat:"d"},
{id:"flow-export",label:"Export Flow (PDF/DOCX)",cat:"d"},
{id:"flow-startup",label:"App Startup Sequence",cat:"d"},
{id:"flow-shutdown",label:"App Shutdown Sequence",cat:"d"}]}
]};

// ── DETAIL DATA ──────────────────────────────────────────────────────────────
const D={
"nexa":{t:"Nexa Application",d:"Private offline AI assistant — Electron + React + FastAPI + Ollama. All data stays local.",f:[
{n:["u","f","b","x"],a:"→",l:"User → Frontend → Backend → External"},
{n:["x","b","f","u"],a:"←",l:"Response flows back"}],
c:["electron","frontend","backend","external","data-flows"]},

"user":{t:"User",d:"End user interacting with Nexa. Inputs text, voice, files, and images.",f:[
{n:["user","comp-msginput","app-js","api-js","backend"],a:"→",l:"All inputs flow through MessageInput → App → API → Backend"}],
c:["comp-msginput","comp-chatwin","comp-sidebar"]},
"user-input":{t:"Text Input",d:"User types in MessageInput textarea. Auto-resizes up to 140px.",f:[
{n:["mi-textarea","h-send","h-stream","api-send","route-chat"],a:"→",l:"Text → send → stream → POST /chat"}],
c:["mi-textarea","h-send"]},
"user-voice":{t:"Voice Input",d:"Mic button opens WebSocket to /ws/voice. Vosk returns partial/final transcripts that fill the textarea.",f:[
{n:["mi-voice","route-voice","v-vosk"],a:"→",l:"Audio → Vosk STT"},
{n:["v-final","mi-textarea"],a:"→",l:"Recognized text fills input"}],
c:["mi-voice","route-voice","v-vosk"]},
"user-file":{t:"File Upload (PDF/DOCX)",d:"Plus menu → upload file → POST /extract-text → prepend '[Document: name]\\ntext' to message.",f:[
{n:["pm-upload","route-extract","h-send"],a:"→",l:"File → extract text → prepend to message"}],
c:["pm-upload","route-extract"]},
"user-image":{t:"Image Attachment",d:"Plus menu → attach image → FileReader.readAsDataURL() → base64 → sent with chat message to moondream.",f:[
{n:["pm-image","h-send","chat-image","ol-moondream"],a:"→",l:"base64 image → moondream vision"}],
c:["pm-image","chat-image","ol-moondream"]},

"electron":{t:"Electron Shell",d:"Desktop wrapper. Manages lifecycle, spawns processes, IPC bridge, security.",f:[
{n:["main-js","preload-js","frontend"],a:"↔",l:"IPC communication"}],
c:["main-js","preload-js","loading-screen","ipc-handlers","electron-store","child-procs","electron-build"]},
"main-js":{t:"main.js — Main Process",d:"Electron main process. App lifecycle, child processes, windows, IPC handlers, security.",f:[
{n:["app-lifecycle","create-loading","start-ollama","start-backend","create-main-win"],a:"→",l:"Startup sequence"}],
c:["app-lifecycle","wipe-install","harden-session","start-ollama","start-backend","create-loading","create-main-win","clean-exit"]},
"app-lifecycle":{t:"App Lifecycle",d:"app.whenReady() → setup → windows → run. 'window-all-closed' → cleanExit() → app.quit().",f:[
{n:["app-lifecycle","create-loading","start-ollama","start-backend","create-main-win"],a:"→",l:"Sequential startup"}],
c:["create-loading","start-ollama","start-backend","create-main-win","clean-exit"]},
"wipe-install":{t:"wipeOnFreshInstall()",d:"Computes fingerprint (version + exe path + marker). If changed: wipes electron-store, databases, resets onboarding.",f:[
{n:["wipe-install","electron-store","nexa-db"],a:"→",l:"Clear all data on fresh install"}],
c:["electron-store","nexa-db","es-fingerprint"]},
"harden-session":{t:"hardenSession()",d:"Denies all permission requests (camera, mic, etc.). Injects X-Requested-With: Nexa header.",f:[],c:["create-main-win"]},
"start-ollama":{t:"startOllama()",d:"Spawns ollama.exe serve. Sets OLLAMA_MODELS env. Waits 2s.",f:[
{n:["start-ollama","ollama-proc","ollama"],a:"→",l:"spawn ollama.exe serve :11434"}],
c:["ollama-proc","ollama"]},
"start-backend":{t:"startBackend()",d:"Packaged: nexa-backend.exe. Dev: python.exe -u main.py. Env: PYTHONUNBUFFERED, TRANSFORMERS_OFFLINE, NEXA_USER_DATA_DIR. Watches stdout for 'Uvicorn running'. 6s timeout.",f:[
{n:["start-backend","backend-proc","main-py"],a:"→",l:"spawn backend :8000"}],
c:["backend-proc","main-py"]},
"create-loading":{t:"createLoadingWindow()",d:"Frameless full-screen splash with logo, progress bar (5s ease-in-out), 'Powered by Nytheris'. Closes after 5.7s.",f:[
{n:["create-loading","loading-screen"],a:"→",l:"Show splash"}],
c:["loading-html","loading-js","loading-css"]},
"create-main-win":{t:"createMainWindow()",d:"1280×800 BrowserWindow. Loads frontend/build/index.html. Blocks devtools, popups, external nav. After 600ms sends 'show-onboarding' IPC if needed.",f:[
{n:["create-main-win","preload-js","frontend"],a:"→",l:"Load React app"}],
c:["preload-js","frontend","ea-events"]},
"clean-exit":{t:"cleanExit()",d:"Kills backend + ollama via SIGTERM. Called on 'before-quit' and 'window-all-closed'.",f:[
{n:["clean-exit","backend-proc","ollama-proc"],a:"→",l:"SIGTERM both processes"}],
c:["backend-proc","ollama-proc"]},

"preload-js":{t:"preload.js — Context Bridge",d:"Exposes window.electronAPI to renderer. Safe IPC wrappers for onboarding, profile, theme, install status.",f:[
{n:["preload-js","ipc-handlers","electron-store"],a:"↔",l:"invoke ↔ handle ↔ store"}],
c:["ea-complete","ea-profile","ea-onboard","ea-theme","ea-install","ea-events","ea-safe"]},
"ea-complete":{t:"completeOnboarding(profile)",d:"Invokes 'complete-onboarding' IPC → stores onboardingDone=true + userProfile.",f:[
{n:["comp-onboarding","ea-complete","ipc-complete","es-onboard","es-profile"],a:"→",l:"Profile → IPC → store"}],
c:["comp-onboarding","ipc-complete","es-onboard","es-profile"]},
"ea-profile":{t:"getProfile() / setProfile()",d:"Read/write userProfile in electron-store via IPC.",f:[
{n:["app-js","ea-profile","ipc-profile","es-profile"],a:"↔",l:"Profile ↔ store"}],
c:["ipc-profile","es-profile","s-profile"]},
"ea-onboard":{t:"isOnboardingDone()",d:"Returns boolean from electron-store.",f:[
{n:["app-js","ea-onboard","ipc-onboard","es-onboard"],a:"→",l:"Check onboarding status"}],
c:["ipc-onboard","es-onboard"]},
"ea-theme":{t:"getTheme() / setTheme()",d:"Read/write theme in electron-store. Synced with localStorage.",f:[
{n:["sb-theme","ea-theme","ipc-theme","es-theme"],a:"↔",l:"Theme ↔ store"}],
c:["sb-theme","ipc-theme","es-theme","ls-theme"]},
"ea-install":{t:"isFirstInstall()",d:"Returns !onboardingDone && installId exists.",f:[
{n:["app-js","ea-install","ipc-install","es-installid"],a:"→",l:"Check install"}],
c:["ipc-install","es-installid"]},
"ea-events":{t:"onShowOnboarding / onBackendReady",d:"Main→renderer IPC events. 'show-onboarding' triggers OnboardingScreen.",f:[
{n:["main-js","ea-events","app-js"],a:"→",l:"IPC event"}],
c:["create-main-win","comp-onboarding"]},
"ea-safe":{t:"safeInvoke()",d:"try/catch wrapper around ipcRenderer.invoke(). Prevents unhandled rejections.",f:[],c:["ea-complete","ea-profile","ea-theme"]},

"loading-screen":{t:"Loading Screen",d:"Splash shown during startup. Logo, progress bar (5s), 'Powered by Nytheris'. Fades out when main window ready.",f:[
{n:["create-loading","loading-screen","create-main-win"],a:"→",l:"5.5s → show main → close splash"}],
c:["loading-html","loading-js","loading-css","loading-bridge"]},
"loading-html":{t:"loading.html",d:"SVG logo, 'Nexa' title, subtitle, progress bar track, 'Powered by Nytheris' footer.",f:[],c:["loading-js","loading-css"]},
"loading-js":{t:"loading.js",d:"Progress bar 0→100% over 5s (ease-in-out). Fades screen at 5.1s.",f:[],c:["loading-html"]},
"loading-css":{t:"loading.css",d:"Full-screen layout, ambient blur orbs with drift animations, progress bar styling, fade-in for footer.",f:[],c:["loading-html"]},
"loading-bridge":{t:"loading-preload-bridge.js",d:"Minimal bridge: window.__nexaLoading with onReady/trigger for IPC without nodeIntegration.",f:[],c:["loading-html"]},

"ipc-handlers":{t:"IPC Handlers (ipcMain)",d:"All ipcMain.handle() registrations. Read/write electron-store, return data to renderer.",f:[
{n:["preload-js","ipc-handlers","electron-store"],a:"↔",l:"invoke ↔ handle ↔ store"}],
c:["ipc-complete","ipc-profile","ipc-onboard","ipc-theme","ipc-install"]},
"ipc-complete":{t:"complete-onboarding",d:"Sets onboardingDone=true + userProfile in store.",f:[
{n:["ea-complete","ipc-complete","es-onboard","es-profile"],a:"→",l:"Save onboarding data"}],
c:["ea-complete","es-onboard","es-profile"]},
"ipc-profile":{t:"get-profile / set-profile",d:"Read/write userProfile in store.",f:[
{n:["ea-profile","ipc-profile","es-profile"],a:"↔",l:"Profile data"}],
c:["ea-profile","es-profile"]},
"ipc-onboard":{t:"is-onboarding-done",d:"Returns boolean from store.",f:[
{n:["ea-onboard","ipc-onboard","es-onboard"],a:"→",l:"Read status"}],
c:["ea-onboard","es-onboard"]},
"ipc-theme":{t:"get-theme / set-theme",d:"Read/write theme ID in store. Default: 'forest'.",f:[
{n:["ea-theme","ipc-theme","es-theme"],a:"↔",l:"Theme ID"}],
c:["ea-theme","es-theme"]},
"ipc-install":{t:"is-first-install",d:"Returns !onboardingDone && installId.",f:[
{n:["ea-install","ipc-install","es-installid"],a:"→",l:"Check install"}],
c:["ea-install","es-installid"]},

"electron-store":{t:"electron-store (config.json)",d:"Persistent JSON in AppData/Nexa/config.json. Stores theme, onboarding, profile, install tracking.",f:[
{n:["ipc-handlers","electron-store"],a:"↔",l:"Read/Write config"}],
c:["es-theme","es-onboard","es-profile","es-installid","es-fingerprint"]},
"es-theme":{t:"theme",d:"Theme ID. Default: 'forest'. 10 options: forest, midnight, sand, ocean, carbon, blossom, wine, sage, rust, blade.",f:[
{n:["sb-theme","es-theme"],a:"↔",l:"Theme ID"}],
c:["sb-theme","ls-theme"]},
"es-onboard":{t:"onboardingDone",d:"Boolean. Set true after onboarding. Reset on fresh install.",f:[
{n:["ea-complete","es-onboard"],a:"→",l:"Set true"}],
c:["ea-complete","ipc-onboard"]},
"es-profile":{t:"userProfile {name, avatar}",d:"Display name + avatar (base64 data URL or null). Set during onboarding, editable from Sidebar.",f:[
{n:["comp-onboarding","es-profile"],a:"→",l:"Save profile"}],
c:["ea-profile","s-profile"]},
"es-installid":{t:"installId (UUID)",d:"Generated on first install. Tracks fresh vs. existing install.",f:[
{n:["wipe-install","es-installid"],a:"→",l:"Generate UUID"}],
c:["ea-install","es-fingerprint"]},
"es-fingerprint":{t:"installFingerprint",d:"'version::exePath::installMarker'. Compared every launch to detect fresh installs.",f:[
{n:["wipe-install","es-fingerprint"],a:"→",l:"Compute & compare"}],
c:["wipe-install"]},

"child-procs":{t:"Child Processes",d:"Two long-running processes spawned at startup. Killed on quit.",f:[
{n:["start-ollama","ollama-proc"],a:"→",l:"spawn"},
{n:["start-backend","backend-proc"],a:"→",l:"spawn"}],
c:["ollama-proc","backend-proc","clean-exit"]},
"ollama-proc":{t:"ollamaProc",d:"ollama.exe serve on :11434. Models from ollama/models/.",f:[
{n:["start-ollama","ollama-proc","ollama"],a:"→",l:"ollama.exe serve :11434"}],
c:["start-ollama","ollama","clean-exit"]},
"backend-proc":{t:"backendProc",d:"Packaged: nexa-backend.exe. Dev: python.exe -u main.py. FastAPI on :8000.",f:[
{n:["start-backend","backend-proc","main-py"],a:"→",l:"FastAPI :8000"}],
c:["start-backend","main-py","clean-exit"]},

"electron-build":{t:"Build & Packaging",d:"electron-builder for Windows. NSIS installer + portable builds.",f:[
{n:["eb-frontend","eb-asar","eb-resources","eb-nsis"],a:"→",l:"Build pipeline"}],
c:["eb-frontend","eb-asar","eb-resources","eb-nsis","eb-portable"]},
"eb-frontend":{t:"Build Frontend",d:"npm run build → react-scripts build → frontend/build/.",f:[
{n:["eb-frontend","frontend"],a:"→",l:"react-scripts build"}],
c:["frontend"]},
"eb-asar":{t:"ASAR Pack",d:"Packs electron files into app.asar. Backend + Ollama unpacked (need real paths).",f:[],c:["main-js","preload-js"]},
"eb-resources":{t:"extraResources",d:"Copies frontend/build, backend/, ollama/, assets/ → resources/. Accessed via process.resourcesPath.",f:[],c:["main-py","ollama"]},
"eb-nsis":{t:"NSIS Installer",d:"Nexa-Setup-{version}.exe. Custom install dir, desktop/start menu shortcuts, run after finish, delete app data on uninstall.",f:[],c:["eb-resources"]},
"eb-portable":{t:"Portable Build",d:"Nexa-Portable-{version}.exe. Single-file, no installation.",f:[],c:["eb-nsis"]},

"frontend":{t:"React Frontend",d:"SPA with all state in App.js. Components via props/callbacks. API via services/api.js.",f:[
{n:["frontend","api-js","backend"],a:"→",l:"HTTP/SSE/WS"},
{n:["frontend","preload-js"],a:"↔",l:"IPC (Electron)"}],
c:["index-js","app-js","components","services","local-storage"]},
"index-js":{t:"index.js — Entry Point",d:"ReactDOM.createRoot(#root). Suppresses AbortError/BodyStreamBuffer noise. Renders <App /> with StrictMode.",f:[
{n:["index-js","app-js"],a:"→",l:"ReactDOM.createRoot"}],
c:["app-js"]},

"app-js":{t:"App.js — Central Orchestrator",d:"ALL state lives here. Conversations, messages, typing, model, sidebar, notepad, code runner, exports. All handlers defined here, passed as props.",f:[
{n:["comp-msginput","h-send","api-send","route-chat"],a:"→",l:"Chat flow"},
{n:["comp-sidebar","h-select","api-msgs","route-msgs"],a:"→",l:"Select conversation"}],
c:["app-state","app-refs","app-handlers","components","services"]},
"app-state":{t:"State Management",d:"All useState hooks. No external state library — pure React state + refs.",f:[],c:["s-activekey","s-messages","s-istyping","s-model","s-sidebar","s-profile","s-notepad","s-coderunner","s-export"]},
"s-activekey":{t:"activeKey",d:'Current conversation key. "__new__" or string(conversation_id). Switches on select or new-conv SSE response.',f:[
{n:["h-newchat","s-activekey"],a:"→",l:'Set "__new__"'},
{n:["h-stream","s-activekey"],a:"→",l:"Set to convId from SSE"}],
c:["h-newchat","h-select","h-stream"]},
"s-messages":{t:"messages[]",d:"Active conversation messages: {role, content, displayContent, image_base64, doc, stopped, created_at}. Real-time during SSE.",f:[
{n:["h-send","s-messages"],a:"→",l:"Add user msg"},
{n:["h-stream","s-messages"],a:"→",l:"Append tokens"}],
c:["h-send","h-stream","comp-chatwin"]},
"s-istyping":{t:"isTyping",d:"AI generating? Shows TypingDots + switches Send→Stop.",f:[
{n:["h-stream","s-istyping"],a:"→",l:"true on start"},
{n:["h-stop","s-istyping"],a:"→",l:"false on stop/done"}],
c:["comp-chatwin","comp-msginput"]},
"s-model":{t:"selectedModel",d:"Gemma2B / Phi3 / Mistral. Mapped to Ollama IDs in backend.",f:[
{n:["s-model","h-send","route-chat"],a:"→",l:"Model → chat request"}],
c:["route-chat"]},
"s-sidebar":{t:"sidebarCollapsed",d:"Toggle sidebar. Hamburger button.",f:[],c:["comp-sidebar"]},
"s-profile":{t:"userProfile",d:"{name, avatar}. From electron-store or localStorage. Updated via onboarding or Sidebar.",f:[
{n:["comp-onboarding","s-profile"],a:"→",l:"From onboarding"},
{n:["ea-profile","s-profile"],a:"→",l:"From electron-store"}],
c:["comp-onboarding","ea-profile","ls-profile","es-profile"]},
"s-notepad":{t:"notepadOpen",d:"Toggle NotepadTool. Notes button in header.",f:[],c:["comp-notepad"]},
"s-coderunner":{t:"codeRunnerOpen, crCode, crOutput…",d:"Code runner state: open/close, code, output, error, plots, running, language.",f:[
{n:["cr-run","s-coderunner"],a:"→",l:"Run → update output"}],
c:["comp-coderunner","pyodide-hook"]},
"s-export":{t:"exportDropdown, modelDropdown",d:"Header dropdown toggles. Click-outside closes.",f:[],c:["h-export-pdf","h-export-docx"]},

"app-refs":{t:"Refs",d:"useRef hooks for performance-critical data. No re-renders on change.",f:[],c:["r-msgcache","r-abort","r-typing","r-throttle","r-focus"]},
"r-msgcache":{t:"msgCache",d:"Per-conversation message cache. Prevents re-fetching. Updated in real-time during streaming.",f:[
{n:["h-send","r-msgcache"],a:"→",l:"Cache per conversation"}],
c:["h-send","h-stream","h-select"]},
"r-abort":{t:"abortControllers",d:"Per-conversation AbortController. handleStop() aborts the fetch.",f:[
{n:["h-stream","r-abort"],a:"→",l:"Create on stream"},
{n:["h-stop","r-abort"],a:"→",l:"Abort on stop"}],
c:["h-stream","h-stop"]},
"r-typing":{t:"typingState",d:"Per-conversation typing. Tracks streaming even when user switched conversations.",f:[
{n:["h-stream","r-typing"],a:"→",l:"Set per conversation"}],
c:["h-stream","h-stop"]},
"r-throttle":{t:"renderThrottle",d:"80ms throttle. Prevents excessive re-renders during fast token streaming.",f:[
{n:["h-stream","r-throttle"],a:"→",l:"Throttle to ~80ms"}],
c:["h-stream","s-messages"]},
"r-focus":{t:"inputFocusRef",d:"Textarea DOM ref. Used by handleEditMessage() to fill + focus. Global key shortcut also targets this.",f:[
{n:["ab-edit","r-focus"],a:"→",l:"Focus + fill textarea"}],
c:["comp-msginput","h-edit"]},

"app-handlers":{t:"Event Handlers",d:"Core logic connecting user actions to state changes and API calls.",f:[],c:["h-send","h-stream","h-stop","h-select","h-newchat","h-edit","h-reload","h-export-pdf","h-export-docx","h-run-code","h-profile","h-onboard"]},
"h-send":{t:"handleSend()",d:"Creates user msg, adds to msgCache + messages[], calls streamResponse().",f:[
{n:["comp-msginput","h-send","r-msgcache","s-messages","h-stream"],a:"→",l:"User msg → cache → state → stream"}],
c:["comp-msginput","h-stream","s-messages","r-msgcache"]},
"h-stream":{t:"streamResponse()",d:"Creates AbortController, calls sendMessage(). onToken: append to cache, throttle render. onDone: generate title, refresh sidebar. Handles NEW_KEY→convId switch.",f:[
{n:["h-send","h-stream","api-send","route-chat"],a:"→",l:"SSE stream"},
{n:["route-chat","h-stream","r-msgcache","s-messages"],a:"←",l:"Tokens flow back"}],
c:["api-send","r-msgcache","r-abort","r-typing","r-throttle","s-messages","s-istyping"]},
"h-stop":{t:"handleStop()",d:"Aborts SSE via AbortController, marks msg stopped, generates title from partial, sets isTyping=false.",f:[
{n:["comp-msginput","h-stop","r-abort"],a:"→",l:"Abort stream"}],
c:["r-abort","r-typing","s-messages","api-title"]},
"h-select":{t:"handleSelectConversation()",d:"Checks msgCache first (instant). Otherwise fetches via getMessages(). Switches activeKey.",f:[
{n:["comp-sidebar","h-select","api-msgs","route-msgs"],a:"→",l:"Select → fetch → display"}],
c:["comp-sidebar","api-msgs","r-msgcache","s-activekey"]},
"h-newchat":{t:"handleNewChat()",d:'Sets activeKey to "__new__", clears messages, resets typing.',f:[
{n:["sb-newchat","h-newchat","s-activekey"],a:"→",l:'New chat'}],
c:["sb-newchat","s-activekey","s-messages"]},
"h-edit":{t:"handleEditMessage()",d:"Fills textarea with message text using native setter + input event.",f:[
{n:["ab-edit","h-edit","r-focus","mi-textarea"],a:"→",l:"Fill textarea"}],
c:["ab-edit","r-focus","mi-textarea"]},
"h-reload":{t:"handleReloadResponse()",d:"Removes last assistant msg, re-sends user msg through streamResponse().",f:[
{n:["ab-regen","h-reload","h-stream"],a:"→",l:"Remove + re-stream"}],
c:["ab-regen","h-stream","s-messages"]},
"h-export-pdf":{t:"handleExportPDF()",d:"jsPDF export. Header + messages with pagination. Downloads nexa-chat.pdf.",f:[
{n:["s-messages","h-export-pdf"],a:"→",l:"Messages → PDF → download"}],
c:["s-messages"]},
"h-export-docx":{t:"handleExportDOCX()",d:"docx + file-saver export. Headings, bold roles, content. Downloads nexa-chat.docx.",f:[
{n:["s-messages","h-export-docx"],a:"→",l:"Messages → DOCX → download"}],
c:["s-messages"]},
"h-run-code":{t:"handleRunCode()",d:"Pyodide WASM execution. Preprocesses input(), runs code, captures stdout/stderr/plots.",f:[
{n:["cr-run","h-run-code","py-run","cr-output"],a:"→",l:"Code → Pyodide → output"}],
c:["comp-coderunner","pyodide-hook","py-run"]},
"h-profile":{t:"handleProfileUpdate()",d:"Updates profile in state, localStorage, and electron-store.",f:[
{n:["sb-profile","h-profile","s-profile","ls-profile","ea-profile"],a:"→",l:"Profile cascade"}],
c:["sb-profile","s-profile","ls-profile","ea-profile"]},
"h-onboard":{t:"handleOnboardingComplete()",d:"Saves profile, marks onboarding done, switches stage to 'app'.",f:[
{n:["comp-onboarding","h-onboard","s-profile","ea-complete"],a:"→",l:"Complete onboarding"}],
c:["comp-onboarding","ea-complete","s-profile"]},

"components":{t:"React Components",d:"All UI components. Props from App.js, actions via callbacks.",f:[
{n:["app-js","components"],a:"→",l:"Props + callbacks"}],
c:["comp-onboarding","comp-sidebar","comp-chatwin","comp-msginput","comp-notepad","comp-coderunner","comp-loading"]},
"comp-onboarding":{t:"OnboardingScreen",d:"First-run wizard. Name input → avatar picker + CropModal → onComplete(profile).",f:[
{n:["comp-onboarding","h-onboard","ea-complete","es-onboard"],a:"→",l:"Profile → save"}],
c:["h-onboard","ea-complete","ob-step1","ob-step2","ob-complete"]},
"ob-step1":{t:"Step 1: Name Input",d:"Welcome + name text field.",f:[],c:["ob-step2"]},
"ob-step2":{t:"Step 2: Avatar + CropModal",d:"Preset avatars or upload custom. CropModal: drag/zoom in circular viewport → base64 data URL.",f:[],c:["ob-complete"]},
"ob-complete":{t:"onComplete(profile)",d:"Passes {name, avatar} to handleOnboardingComplete().",f:[
{n:["ob-complete","h-onboard"],a:"→",l:"{name, avatar}"}],
c:["h-onboard"]},

"comp-sidebar":{t:"Sidebar",d:"Left panel: conversations, theme picker, profile, controls.",f:[
{n:["comp-sidebar","api-convs","route-convs"],a:"→",l:"Load conversations"}],
c:["sb-logo","sb-newchat","sb-search","sb-convlist","sb-rename","sb-delete","sb-theme","sb-profile","sb-about"]},
"sb-logo":{t:"ChipLogo",d:"Custom SVG chip icon. Nexa brand logo.",f:[],c:[]},
"sb-newchat":{t:"New Chat Button",d:'onNew() → handleNewChat() → activeKey="__new__".',f:[
{n:["sb-newchat","h-newchat"],a:"→",l:"onNew()"}],
c:["h-newchat"]},
"sb-search":{t:"Search Bar",d:"Local filter by title. No backend call.",f:[],c:["sb-convlist"]},
"sb-convlist":{t:"Conversation List",d:"Scrollable list from backend. Click → onSelect(id). Each: title, time, rename, delete.",f:[
{n:["sb-convlist","h-select","api-msgs"],a:"→",l:"Select → fetch messages"}],
c:["h-select","api-convs"]},
"sb-rename":{t:"Rename Button",d:"Inline rename → PATCH /conversations/{id}/rename.",f:[
{n:["sb-rename","api-rename","route-rename"],a:"→",l:"PATCH /rename"}],
c:["api-rename","route-rename"]},
"sb-delete":{t:"Delete Button",d:"DELETE /conversations/{id}. Also 'Clear All' → DELETE /conversations/all.",f:[
{n:["sb-delete","api-delete","route-delete"],a:"→",l:"DELETE"}],
c:["api-delete","route-delete"]},
"sb-theme":{t:"Theme Picker (10 themes)",d:"forest, midnight, sand, ocean, carbon, blossom, wine, sage, rust, blade. Saves to localStorage + electronAPI. Applies CSS vars to :root.",f:[
{n:["sb-theme","ls-theme","ea-theme","es-theme"],a:"→",l:"Save theme everywhere"}],
c:["ls-theme","ea-theme","es-theme"]},
"sb-profile":{t:"Profile Section",d:"Avatar + name. Click to edit → onProfileUpdate().",f:[
{n:["sb-profile","h-profile"],a:"→",l:"Profile update"}],
c:["h-profile","s-profile"]},
"sb-about":{t:"About Modal",d:"App info: version, description, credits.",f:[],c:[]},

"comp-chatwin":{t:"ChatWindow",d:"Chat area: messages with markdown, TTS, translate, copy, edit, regenerate. Welcome screen when empty.",f:[
{n:["s-messages","comp-chatwin"],a:"→",l:"messages[] → render"}],
c:["cw-welcome","cw-userbubble","cw-aibubble","cw-typing","cw-analyzing","cw-scroll"]},
"cw-welcome":{t:"Welcome Screen",d:"Empty state: ChipLogo, getGreeting(name), 'How may I assist you today?', privacy notice.",f:[],c:["s-profile"]},
"cw-userbubble":{t:"User Message Bubble",d:"displayContent, image preview, doc thumbnail.",f:[
{n:["s-messages","cw-userbubble"],a:"→",l:"User message data"}],
c:["ub-text","ub-image","ub-doc"]},
"ub-text":{t:"displayContent",d:"Clean display text (may differ from content which has doc text prepended).",f:[],c:["s-messages"]},
"ub-image":{t:"Image Preview",d:"Thumbnail of attached image (from base64).",f:[
{n:["ub-image","ol-moondream"],a:"→",l:"Image was analyzed by moondream"}],
c:["ol-moondream"]},
"ub-doc":{t:"DocThumbnail",d:"Document name + type icon.",f:[
{n:["ub-doc","route-extract"],a:"→",l:"Text extracted from document"}],
c:["route-extract"]},
"cw-aibubble":{t:"Assistant Message Bubble",d:"ReactMarkdown + action buttons: TTS, translate, copy, edit, regenerate.",f:[
{n:["s-messages","cw-aibubble"],a:"→",l:"Assistant message data"}],
c:["ab-markdown","ab-codeblock","ab-tts","ab-translate","ab-copy","ab-edit","ab-regen"]},
"ab-markdown":{t:"ReactMarkdown",d:"Renders AI response as formatted markdown: headings, bullets, bold, links, etc.",f:[],c:["ab-codeblock"]},
"ab-codeblock":{t:"CodeBlock + Copy",d:"Fenced code with syntax highlighting. Copy via navigator.clipboard. 2s visual tick.",f:[],c:[]},
"ab-tts":{t:"🔊 TTS Button",d:"new Audio('/tts/stream?text=...'). Browser plays Piper PCM stream.",f:[
{n:["ab-tts","route-tts","tts-piper","pi-exe"],a:"→",l:"Text → Piper → PCM audio"}],
c:["route-tts","tts-piper"]},
"ab-translate":{t:"🌐 Translate Button",d:"Language picker (Urdu/Hindi/Chinese). Calls translateText() → POST /translate. Shows translation below message.",f:[
{n:["ab-translate","api-translate","route-translate","tr-argos","argos"],a:"→",l:"Text → Argos → translated"}],
c:["api-translate","route-translate","argos"]},
"ab-copy":{t:"📋 Copy Button",d:"navigator.clipboard.writeText() for full message content.",f:[],c:[]},
"ab-edit":{t:"✏️ Edit Button",d:"Fills MessageInput textarea via onEditMessage() → handleEditMessage().",f:[
{n:["ab-edit","h-edit","r-focus","mi-textarea"],a:"→",l:"Fill textarea"}],
c:["h-edit","mi-textarea"]},
"ab-regen":{t:"🔄 Regenerate Button",d:"Removes assistant response, re-sends user msg via onReloadResponse().",f:[
{n:["ab-regen","h-reload","h-stream","api-send","route-chat"],a:"→",l:"Remove + re-stream"}],
c:["h-reload","h-stream"]},
"cw-typing":{t:"TypingDots",d:"Animated dots when isTyping=true.",f:[
{n:["s-istyping","cw-typing"],a:"→",l:"Show when typing"}],
c:["s-istyping"]},
"cw-analyzing":{t:"AnalyzingIndicator",d:"Special indicator during image analysis (moondream).",f:[
{n:["s-istyping","cw-analyzing"],a:"→",l:"During image analysis"}],
c:["ol-moondream"]},
"cw-scroll":{t:"Auto-scroll",d:"Scrolls to latest message on new tokens.",f:[],c:["s-messages"]},

"comp-msginput":{t:"MessageInput",d:"Input bar: text, emoji, files, image, voice, send/stop.",f:[
{n:["comp-msginput","h-send"],a:"→",l:"onSend(text, image)"}],
c:["mi-textarea","mi-emoji","mi-plus","mi-voice","mi-send","mi-preview"]},
"mi-textarea":{t:"Textarea",d:"Auto-resize up to 140px. Global key shortcut focuses this.",f:[
{n:["mi-textarea","mi-send"],a:"→",l:"Text content"}],
c:["r-focus"]},
"mi-emoji":{t:"😊 Emoji Picker",d:"emoji-picker-react. Appends to textarea.",f:[],c:["mi-textarea"]},
"mi-plus":{t:"➕ Plus Menu",d:"Dropdown: upload document, attach image.",f:[],c:["pm-upload","pm-image"]},
"pm-upload":{t:"📎 Upload Document",d:"File picker (.pdf/.docx) → POST /extract-text → prepend text to message.",f:[
{n:["pm-upload","route-extract","mi-textarea"],a:"→",l:"File → extract → prepend"}],
c:["route-extract"]},
"pm-image":{t:"🖼️ Attach Image",d:"File picker → FileReader.readAsDataURL() → base64. Shows preview.",f:[
{n:["pm-image","mi-preview","h-send"],a:"→",l:"base64 → send with message"}],
c:["mi-preview","h-send"]},
"mi-voice":{t:"🎤 Voice Button (WS)",d:"WebSocket to ws://127.0.0.1:8000/ws/voice. Streams audio, receives transcripts.",f:[
{n:["mi-voice","route-voice","v-vosk","mi-textarea"],a:"→",l:"Audio → Vosk → text"}],
c:["route-voice","v-vosk"]},
"mi-send":{t:"▶ Send / ■ Stop",d:"Send → onSend(). Stop → onStop().",f:[
{n:["mi-send","h-send"],a:"→",l:"Send"},
{n:["mi-send","h-stop"],a:"→",l:"Stop"}],
c:["h-send","h-stop","s-istyping"]},
"mi-preview":{t:"Image Preview",d:"Thumbnail of attached image with ✕ remove button.",f:[
{n:["pm-image","mi-preview"],a:"→",l:"Show base64 preview"}],
c:["pm-image"]},

"comp-notepad":{t:"NotepadTool",d:"In-app notepad. Client-side only. localStorage persistence.",f:[
{n:["comp-notepad","ls-notes"],a:"↔",l:"Read/Write localStorage"}],
c:["np-editor","np-saved","np-actions"]},
"np-editor":{t:"Textarea Editor",d:"Multi-line text editor. Auto-saves.",f:[],c:["ls-notes"]},
"np-saved":{t:"Saved Notes Sidebar",d:"List of saved notes. Click to load, delete option.",f:[],c:["ls-notes"]},
"np-actions":{t:"Save/New/Copy/Paste/PDF",d:"Save (localStorage), New, Copy, Paste, Download PDF (jsPDF).",f:[
{n:["np-actions","ls-notes"],a:"→",l:"Save to localStorage"}],
c:["ls-notes"]},

"comp-coderunner":{t:"CodeRunnerModal",d:"Full-screen Python code editor + runner via Pyodide WASM. No backend.",f:[
{n:["cr-run","h-run-code","py-run","cr-output"],a:"→",l:"Code → WASM → output"}],
c:["cr-editor","cr-prism","cr-snippets","cr-run","cr-output","cr-loading"]},
"cr-editor":{t:"Editor",d:"react-simple-code-editor. Lightweight, supports text input and selection.",f:[],c:["cr-prism","s-coderunner"]},
"cr-prism":{t:"Prism.js Highlighting",d:"Python syntax highlighting applied as background layer.",f:[],c:["cr-editor"]},
"cr-snippets":{t:"Sample Snippets",d:"Hello World, List Comprehension, Classes, NumPy, Pandas, Matplotlib, User Input, Fibonacci.",f:[],c:["cr-editor"]},
"cr-run":{t:"▶ Run Button",d:"onRun() → handleRunCode() → usePyodide().runPython(). Also Ctrl+Enter.",f:[
{n:["cr-run","h-run-code","py-run"],a:"→",l:"Execute code"}],
c:["h-run-code","py-run"]},
"cr-output":{t:"OutputPanel",d:"Terminal-style: stdout (▸), stderr (✖), system (⚡). Auto-scrolls.",f:[
{n:["py-run","cr-output"],a:"→",l:"stdout/stderr"}],
c:["s-coderunner"]},
"cr-loading":{t:"Pyodide Loading",d:"Progress bar for WASM download. Shows percentage + stage.",f:[
{n:["pyodide-hook","cr-loading"],a:"→",l:"Loading progress"}],
c:["pyodide-hook"]},
"comp-loading":{t:"LoadingScreen",d:"React version of loading screen (non-Electron). Logo + animation.",f:[],c:["loading-screen"]},
"services":{t:"Services & Hooks",d:"API client, Pyodide hook, dev proxy — communication layer.",f:[
{n:["services","backend"],a:"→",l:"HTTP/SSE/WS"}],
c:["api-js","pyodide-hook","setup-proxy"]},
"api-js":{t:"api.js — HTTP/SSE Client",d:"Centralized API client. API_BASE = http://127.0.0.1:8000. fetch() for SSE + HTTP CRUD.",f:[
{n:["api-js","backend"],a:"→",l:"All HTTP calls"}],
c:["api-send","api-convs","api-msgs","api-delete","api-title","api-rename","api-translate"]},
"api-send":{t:"sendMessage()",d:"POST /chat, reads SSE via ReadableStream. Parses 'data: {token}' lines. onToken/onDone callbacks. AbortController support.",f:[
{n:["h-stream","api-send","route-chat"],a:"→",l:"POST /chat → SSE"}],
c:["h-stream","route-chat","r-abort"]},
"api-convs":{t:"getConversations()",d:"GET /conversations. Returns [{id, title, created_at}].",f:[
{n:["comp-sidebar","api-convs","route-convs"],a:"→",l:"GET /conversations"}],
c:["comp-sidebar","route-convs"]},
"api-msgs":{t:"getMessages()",d:"GET /conversations/{id}. Returns [{id, role, content, created_at}].",f:[
{n:["h-select","api-msgs","route-msgs"],a:"→",l:"GET /conversations/{id}"}],
c:["h-select","route-msgs"]},
"api-delete":{t:"deleteConversation()",d:"DELETE /conversations/{id}. Removes conversation + all messages.",f:[
{n:["sb-delete","api-delete","route-delete"],a:"→",l:"DELETE"}],
c:["sb-delete","route-delete"]},
"api-title":{t:"generateTitle()",d:"POST /conversations/{id}/generate-title. Uses phi3 (stream=false).",f:[
{n:["h-stream","api-title","route-title"],a:"→",l:"POST /generate-title"}],
c:["h-stream","h-stop","route-title"]},
"api-rename":{t:"renameConversation()",d:"PATCH /conversations/{id}/rename. Sends {title}.",f:[
{n:["sb-rename","api-rename","route-rename"],a:"→",l:"PATCH /rename"}],
c:["sb-rename","route-rename"]},
"api-translate":{t:"translateText()",d:"POST /translate. Sends {text, target_language}.",f:[
{n:["ab-translate","api-translate","route-translate"],a:"→",l:"POST /translate"}],
c:["ab-translate","route-translate"]},
"pyodide-hook":{t:"usePyodide.js",d:"React hook for Pyodide WASM Python. runPython(), resolveInput(), loading state.",f:[
{n:["pyodide-hook","pyodide"],a:"→",l:"Load WASM"}],
c:["py-load","py-run","py-input","py-preprocess"]},
"py-load":{t:"Load Pyodide",d:"Downloads + initializes WASM package. Sets window.__pyodideReady.",f:[
{n:["py-load","pyodide"],a:"→",l:"Download WASM"}],
c:["pyodide","cr-loading"]},
"py-run":{t:"runPython(code)",d:"Executes in WASM sandbox. Returns {success, result, stdout, stderr, plots}.",f:[
{n:["h-run-code","py-run","cr-output"],a:"→",l:"Execute → capture output"}],
c:["h-run-code","cr-output"]},
"py-input":{t:"resolveInput()",d:"Resolves pending input() call. Shows browser prompt or custom UI.",f:[
{n:["py-input","py-run"],a:"→",l:"Provide input value"}],
c:["py-preprocess"]},
"py-preprocess":{t:"preprocessCode()",d:"Patches input() calls for browser compatibility.",f:[
{n:["py-preprocess","py-run"],a:"→",l:"Patched code"}],
c:["py-run"]},
"setup-proxy":{t:"setupProxy.js",d:"Dev proxy: /chat, /conversations, /translate, /tts, /extract-text, /ws → http://127.0.0.1:8000. Not used in production.",f:[
{n:["setup-proxy","backend"],a:"→",l:"Proxy in dev"}],
c:["api-js"]},
"local-storage":{t:"localStorage",d:"Browser storage. Fallback when not in Electron. Synced with electron-store.",f:[
{n:["frontend","local-storage"],a:"↔",l:"Read/Write"}],
c:["ls-theme","ls-onboard","ls-profile","ls-notes","ls-lastseen","ls-code"]},
"ls-theme":{t:"nexa_theme",d:"Theme ID. Default: 'forest'. Written by Sidebar, read on init.",f:[
{n:["sb-theme","ls-theme"],a:"↔",l:"Theme ID"}],
c:["sb-theme","es-theme"]},
"ls-onboard":{t:"nexa_onboarded",d:'"1" or null. Set after onboarding. Read on init.',f:[
{n:["h-onboard","ls-onboard"],a:"→",l:"Set on complete"}],
c:["h-onboard","es-onboard"]},
"ls-profile":{t:"nexa_profile",d:"JSON {name, avatar}. Written by saveProfile(), read by loadSavedProfile().",f:[
{n:["h-profile","ls-profile"],a:"→",l:"Save profile JSON"}],
c:["h-profile","es-profile"]},
"ls-notes":{t:"nexa_notes",d:"JSON [{id, name, content, savedAt}]. Managed by NotepadTool.",f:[
{n:["comp-notepad","ls-notes"],a:"↔",l:"Read/Write notes"}],
c:["comp-notepad"]},
"ls-lastseen":{t:"nexa_last_seen",d:"ISO timestamp of last app open. Shows 'last seen' in Sidebar.",f:[
{n:["app-js","ls-lastseen"],a:"→",l:"Set on mount"}],
c:["comp-sidebar"]},
"ls-code":{t:"nexa_code",d:"Last code in CodeRunner. Persisted between sessions.",f:[
{n:["comp-coderunner","ls-code"],a:"↔",l:"Save/restore code"}],
c:["comp-coderunner"]},
"backend":{t:"FastAPI Backend (:8000)",d:"Python backend: chat SSE, voice WS, TTS streaming, translation, doc extraction, conversation CRUD. SQLite persistence.",f:[
{n:["frontend","backend","external"],a:"→",l:"HTTP/WS requests"}],
c:["main-py","models-py","database-py","pydantic","helpers","nexa-db"]},
"main-py":{t:"main.py — All Routes",d:"Single-file FastAPI app. All routes, Pydantic models, helpers, startup. CORS enabled.",f:[
{n:["api-js","main-py"],a:"→",l:"HTTP/WS requests"}],
c:["route-root","route-status","route-chat","route-title","route-convs","route-msgs","route-delete","route-delete-all","route-rename","route-translate","route-langs","route-tts","route-extract","route-voice"]},
"route-root":{t:"GET /",d:'Returns {"message": "Nexa backend is running!"}. Health check.',f:[],c:[]},
"route-status":{t:"GET /runtime-status",d:'Returns {"status": "ok"}. Backend readiness check.',f:[
{n:["create-main-win","route-status"],a:"→",l:"Check readiness"}],
c:["create-main-win"]},
"route-chat":{t:"POST /chat — SSE Chat",d:"Core endpoint. Creates/retrieves conversation, saves user msg, builds prompt, streams tokens from Ollama, saves assistant msg.",f:[
{n:["api-send","route-chat","ollama"],a:"→",l:"POST /chat → Ollama → SSE"},
{n:["route-chat","nexa-db"],a:"→",l:"Save messages"}],
c:["chat-newconv","chat-saveuser","chat-prompt","chat-image","chat-text","chat-stream","chat-saveai"]},
"chat-newconv":{t:"Create Conversation",d:"If conversation_id is null, INSERT Conversation, return new ID via SSE.",f:[
{n:["chat-newconv","nexa-db"],a:"→",l:"INSERT Conversation"}],
c:["nexa-db","db-conversations"]},
"chat-saveuser":{t:"Save User Message",d:"INSERT Message(role='user') before streaming starts.",f:[
{n:["chat-saveuser","nexa-db"],a:"→",l:"INSERT Message"}],
c:["nexa-db","db-messages"]},
"chat-prompt":{t:"Build Model Prompt",d:"Model-specific templates: Mistral [INST], Gemma <start_of_turn>, Phi3 <s>. Includes markdown formatting instruction.",f:[
{n:["s-model","chat-prompt","ollama"],a:"→",l:"Model → prompt template"}],
c:["s-model","ol-gemma","ol-phi3","ol-mistral"]},
"chat-image":{t:"Image Path (moondream)",d:"If image_base64: compress (512px), switch to moondream, send image + prompt.",f:[
{n:["pm-image","chat-image","help-compress","ol-moondream"],a:"→",l:"base64 → compress → moondream"}],
c:["help-compress","ol-moondream"]},
"chat-text":{t:"Text Path",d:"Standard text chat. Build prompt → POST Ollama /api/generate stream=true.",f:[
{n:["chat-text","ollama"],a:"→",l:"POST /api/generate"}],
c:["chat-prompt","ol-gemma","ol-phi3","ol-mistral"]},
"chat-stream":{t:"Stream Tokens via SSE",d:'Yields: data: {"token":"...","conversation_id":id} and data: {"done":true}.',f:[
{n:["ollama","chat-stream","api-send"],a:"→",l:"Tokens → SSE → frontend"}],
c:["api-send"]},
"chat-saveai":{t:"Save Assistant Message",d:"After stream completes: INSERT Message(role='assistant', content=full_reply).",f:[
{n:["chat-saveai","nexa-db"],a:"→",l:"INSERT Message"}],
c:["nexa-db","db-messages"]},
"route-title":{t:"POST /conv/{id}/generate-title",d:"Sends first user msg to phi3 (stream=false) with 'Generate 4-6 word title'. Strips markdown. Updates conversation.",f:[
{n:["api-title","route-title","ol-phi3","nexa-db"],a:"→",l:"Generate title → save"}],
c:["api-title","ol-phi3","help-strip","nexa-db"]},
"route-convs":{t:"GET /conversations",d:"SELECT * FROM conversations ORDER BY id DESC. Populates Sidebar.",f:[
{n:["api-convs","route-convs","nexa-db"],a:"→",l:"SELECT conversations"}],
c:["api-convs","nexa-db"]},
"route-msgs":{t:"GET /conversations/{id}",d:"SELECT * FROM messages WHERE conversation_id=id ORDER BY id.",f:[
{n:["api-msgs","route-msgs","nexa-db"],a:"→",l:"SELECT messages"}],
c:["api-msgs","nexa-db"]},
"route-delete":{t:"DELETE /conversations/{id}",d:"DELETE messages + conversation for given ID.",f:[
{n:["api-delete","route-delete","nexa-db"],a:"→",l:"DELETE"}],
c:["api-delete","nexa-db"]},
"route-delete-all":{t:"DELETE /conversations/all",d:"DELETE ALL messages + conversations. Full reset.",f:[
{n:["route-delete-all","nexa-db"],a:"→",l:"DELETE ALL"}],
c:["nexa-db"]},
"route-rename":{t:"PATCH /conv/{id}/rename",d:"UPDATE Conversation SET title. Accepts RenamePayload {title}.",f:[
{n:["api-rename","route-rename","nexa-db"],a:"→",l:"UPDATE title"}],
c:["api-rename","nexa-db"]},
"route-translate":{t:"POST /translate",d:"Argos Translate (offline). Maps urdu→ur, hindi→hi, chinese→zh. Chunks ≤100 chars.",f:[
{n:["api-translate","route-translate","tr-argos","argos"],a:"→",l:"Text → Argos → translated"}],
c:["tr-clean","tr-safe","tr-argos","argos"]},
"tr-clean":{t:"clean_line()",d:"Strips markdown before translation: headings, bullets, bold, code, links.",f:[],c:["route-translate"]},
"tr-safe":{t:"safe_translate()",d:"Chunks text ≤100 chars at sentence boundaries. Translates each chunk, rejoins.",f:[],c:["tr-argos"]},
"tr-argos":{t:"argostranslate engine",d:"Offline translation. Loads packages from argos_packages/. from_lang.get_translation(to_lang).",f:[
{n:["tr-argos","argos"],a:"→",l:"Use translation packages"}],
c:["argos","ar-packages"]},
"route-langs":{t:"GET /translate/languages",d:"Lists installed translation languages with codes + names.",f:[
{n:["route-langs","argos"],a:"→",l:"List installed languages"}],
c:["argos"]},
"route-tts":{t:"GET /tts/stream",d:"Spawns piper.exe, writes text to stdin, reads raw PCM, converts int16→float32, streams as octet-stream. First 4 bytes: sample rate 22050.",f:[
{n:["ab-tts","route-tts","tts-piper","pi-exe"],a:"→",l:"Text → Piper → PCM audio"}],
c:["tts-piper","tts-pcm","tts-streaming"]},
"tts-piper":{t:"subprocess.Popen(piper.exe)",d:"Runs piper.exe --model --output-raw. stdin gets text, stdout yields raw PCM.",f:[
{n:["tts-piper","pi-exe"],a:"→",l:"piper.exe subprocess"}],
c:["pi-exe","pi-model"]},
"tts-pcm":{t:"int16 → float32 PCM",d:"Converts Piper's int16 output to float32 for browser Audio. Yields chunks.",f:[],c:["tts-streaming"]},
"tts-streaming":{t:"StreamingResponse",d:'media_type="application/octet-stream". Headers: Cache-Control: no-cache, X-Accel-Buffering: no.',f:[],c:["ab-tts"]},
"route-extract":{t:"POST /extract-text",d:"Extracts text from PDF (pdfplumber) or DOCX (python-docx). Trims to 4000 chars.",f:[
{n:["pm-upload","route-extract","ext-pdf","mi-textarea"],a:"→",l:"File → extract → prepend"}],
c:["ext-pdf","ext-docx","ext-trim"]},
"ext-pdf":{t:"pdfplumber (PDF)",d:"Opens PDF, extracts text per page.",f:[],c:["route-extract"]},
"ext-docx":{t:"python-docx (DOCX)",d:"Opens DOCX, extracts paragraph text.",f:[],c:["route-extract"]},
"ext-trim":{t:"Trim to 4000 chars",d:"Truncates extracted text. Appends '[Document truncated…]' if needed.",f:[],c:["route-extract"]},
"route-voice":{t:"WS /ws/voice — Vosk STT",d:"WebSocket endpoint. Vosk KaldiRecognizer + sounddevice. Streams partial/final transcripts back.",f:[
{n:["mi-voice","route-voice","v-vosk"],a:"→",l:"Audio → Vosk → text"}],
c:["v-vosk","v-sound","v-partial","v-final"]},
"v-vosk":{t:"Vosk KaldiRecognizer(16kHz)",d:"In-process speech recognition model. AcceptWaveform() returns partial or final results.",f:[
{n:["v-vosk","vo-model"],a:"→",l:"Uses vosk-model/"}],
c:["vo-model"]},
"v-sound":{t:"sounddevice.RawInputStream",d:"Mic audio capture. Callback puts bytes into audio_queue for Vosk processing.",f:[],c:["v-vosk"]},
"v-partial":{t:'{"type":"partial"}',d:"Live transcript sent as WebSocket message. Shown in textarea in real-time.",f:[
{n:["v-partial","mi-textarea"],a:"→",l:"Live transcript"}],
c:["mi-voice"]},
"v-final":{t:'{"type":"final"}',d:"Complete recognized text. Appended to textarea.",f:[
{n:["v-final","mi-textarea"],a:"→",l:"Final text"}],
c:["mi-voice"]},
"models-py":{t:"models.py (SQLAlchemy ORM)",d:"Conversation and Message ORM models for SQLite.",f:[
{n:["models-py","nexa-db"],a:"→",l:"ORM → SQLite tables"}],
c:["mod-conv","mod-msg"]},
"mod-conv":{t:"Conversation",d:"{id (PK auto), title (str), created_at (datetime)}. SQLAlchemy model.",f:[
{n:["mod-conv","db-conversations"],a:"→",l:"Maps to conversations table"}],
c:["nexa-db"]},
"mod-msg":{t:"Message",d:"{id (PK auto), conversation_id (FK), role (str), content (text), created_at (datetime)}. SQLAlchemy model.",f:[
{n:["mod-msg","db-messages"],a:"→",l:"Maps to messages table"}],
c:["nexa-db"]},
"database-py":{t:"database.py (SQLite Setup)",d:"Engine, session factory, init_db(), get_db() dependency.",f:[
{n:["database-py","nexa-db"],a:"→",l:"Engine → SQLite"}],
c:["db-engine","db-session","db-init","db-dep"]},
"db-engine":{t:"create_engine()",d:'sqlite:///nexa.db. Path configurable via NEXA_USER_DATA_DIR env var.',f:[
{n:["db-engine","nexa-db"],a:"→",l:"Connect to SQLite"}],
c:["nexa-db"]},
"db-session":{t:"SessionLocal",d:"sessionmaker(bind=engine). Provides DB sessions for route handlers.",f:[],c:["db-dep"]},
"db-init":{t:"init_db()",d:"Base.metadata.create_all(bind=engine). Creates tables if not exist. Called at startup.",f:[
{n:["db-init","nexa-db"],a:"→",l:"Create tables"}],
c:["nexa-db"]},
"db-dep":{t:"get_db()",d:"FastAPI dependency. Yields SessionLocal(), closes on exit.",f:[
{n:["db-dep","db-session"],a:"→",l:"Provide session"}],
c:["db-session"]},
"pydantic":{t:"Pydantic Models",d:"Request validation models for FastAPI routes.",f:[],c:["py-chatmsg","py-rename","py-title","py-translate"]},
"py-chatmsg":{t:"ChatMessage",d:"{text: str, model: str = 'Phi3', conversation_id: int = None, image_base64: str = None}",f:[
{n:["api-send","py-chatmsg","route-chat"],a:"→",l:"Validate chat request"}],
c:["route-chat"]},
"py-rename":{t:"RenamePayload",d:"{title: str}",f:[
{n:["api-rename","py-rename","route-rename"],a:"→",l:"Validate rename"}],
c:["route-rename"]},
"py-title":{t:"TitlePayload",d:"{text: str}",f:[
{n:["api-title","py-title","route-title"],a:"→",l:"Validate title request"}],
c:["route-title"]},
"py-translate":{t:"TranslatePayload",d:"{text: str, target_language: str}",f:[
{n:["api-translate","py-translate","route-translate"],a:"→",l:"Validate translate"}],
c:["route-translate"]},
"helpers":{t:"Helper Functions",d:"Utility functions used by route handlers.",f:[],c:["help-strip","help-compress"]},
"help-strip":{t:"strip_markdown()",d:"Removes markdown formatting: headings, bullets, bold/italic, code blocks, links. Used for title generation.",f:[
{n:["route-title","help-strip"],a:"→",l:"Clean title text"}],
c:["route-title"]},
"help-compress":{t:"compress_image_b64()",d:"Decodes base64 → PIL Image → thumbnail 512×512 → JPEG 85% → base64. For moondream vision.",f:[
{n:["chat-image","help-compress"],a:"→",l:"Compress image for moondream"}],
c:["chat-image"]},
"nexa-db":{t:"nexa.db (SQLite)",d:"Persistent SQLite database. Path: AppData/Nexa/nexa.db (Electron) or backend/nexa.db (dev).",f:[
{n:["main-py","nexa-db"],a:"↔",l:"Read/Write"}],
c:["db-conversations","db-messages"]},
"db-conversations":{t:"conversations table",d:"Columns: id, title, created_at. Stores all chat conversations.",f:[
{n:["route-convs","db-conversations"],a:"→",l:"SELECT/INSERT/UPDATE/DELETE"}],
c:["nexa-db","mod-conv"]},
"db-messages":{t:"messages table",d:"Columns: id, conversation_id (FK), role, content, created_at. Stores all chat messages.",f:[
{n:["route-msgs","db-messages"],a:"→",l:"SELECT/INSERT"}],
c:["nexa-db","mod-msg"]},
"external":{t:"External Services",d:"Ollama (LLM), Piper (TTS), Vosk (STT), Argos (translate), Pyodide (WASM Python).",f:[
{n:["backend","external"],a:"→",l:"Backend calls external services"}],
c:["ollama","piper","vosk","argos","pyodide"]},
"ollama":{t:"Ollama Server (:11434)",d:"Local LLM inference server. /api/generate endpoint. Streams tokens.",f:[
{n:["route-chat","ollama"],a:"→",l:"POST /api/generate"}],
c:["ol-serve","ol-api","ol-gemma","ol-phi3","ol-mistral","ol-moondream","ol-models-dir"]},
"ol-serve":{t:"ollama.exe serve",d:"Main Ollama process. Spawned by Electron at startup. Serves on :11434.",f:[
{n:["start-ollama","ol-serve"],a:"→",l:"spawn ollama.exe serve"}],
c:["ollama-proc"]},
"ol-api":{t:"/api/generate (SSE)",d:"LLM inference endpoint. Accepts {model, prompt, images, stream}. Returns JSON lines with tokens.",f:[
{n:["route-chat","ol-api"],a:"→",l:"Generate request"}],
c:["route-chat"]},
"ol-gemma":{t:"gemma:2b",d:"Small efficient model. Template: <start_of_turn>...<<end_of_turn>.",f:[
{n:["chat-prompt","ol-gemma"],a:"→",l:"Gemma prompt template"}],
c:["chat-prompt"]},
"ol-phi3":{t:"phi3",d:"Default model. Template: <s>...<<|end|>. Also used for title generation.",f:[
{n:["chat-prompt","ol-phi3"],a:"→",l:"Phi3 prompt template"},
{n:["route-title","ol-phi3"],a:"→",l:"Title generation"}],
c:["chat-prompt","route-title"]},
"ol-mistral":{t:"mistral:latest",d:"Larger model. Template: [INST]...[/INST].",f:[
{n:["chat-prompt","ol-mistral"],a:"→",l:"Mistral prompt template"}],
c:["chat-prompt"]},
"ol-moondream":{t:"moondream (vision)",d:"Vision model. Accepts images + prompt. Used for image analysis.",f:[
{n:["chat-image","ol-moondream"],a:"→",l:"Image + prompt → description"}],
c:["chat-image"]},
"ol-models-dir":{t:"ollama/models/",d:"Directory containing LLM model weights. Set via OLLAMA_MODELS env.",f:[
{n:["ol-serve","ol-models-dir"],a:"→",l:"Load model weights"}],
c:["ol-serve"]},
"piper":{t:"Piper TTS",d:"Offline text-to-speech engine. Neural voice model.",f:[
{n:["route-tts","piper"],a:"→",l:"Text → speech"}],
c:["pi-exe","pi-model","pi-output"]},
"pi-exe":{t:"piper/piper.exe",d:"Piper binary. Called as subprocess with --model and --output-raw flags.",f:[
{n:["tts-piper","pi-exe"],a:"→",l:"Execute piper.exe"}],
c:["tts-piper"]},
"pi-model":{t:"en_US-amy-medium.onnx",d:"English female voice model. ONNX format for fast inference.",f:[
{n:["tts-piper","pi-model"],a:"→",l:"Load voice model"}],
c:["tts-piper"]},
"pi-output":{t:"Raw PCM 22050Hz int16",d:"Piper outputs raw PCM audio at 22050Hz sample rate, int16 format.",f:[
{n:["pi-output","tts-pcm"],a:"→",l:"Raw PCM → float32 conversion"}],
c:["tts-pcm"]},
"vosk":{t:"Vosk Speech Recognition",d:"Offline speech-to-text. In-process model, no subprocess.",f:[
{n:["route-voice","vosk"],a:"→",l:"Audio → text"}],
c:["vo-model","vo-rec"]},
"vo-model":{t:"vosk-model/",d:"Pre-trained Vosk model directory. Loaded at startup.",f:[
{n:["v-vosk","vo-model"],a:"→",l:"Load model"}],
c:["v-vosk"]},
"vo-rec":{t:"KaldiRecognizer(16kHz)",d:"Recognizer instance. AcceptWaveform() processes audio chunks. Returns partial or final JSON.",f:[
{n:["v-vosk","vo-rec"],a:"→",l:"Process audio"}],
c:["v-vosk"]},
"argos":{t:"Argos Translate",d:"Offline neural translation. OpenNMT-based models in argos_packages/.",f:[
{n:["route-translate","argos"],a:"→",l:"Translate text"}],
c:["ar-packages","ar-en-ur","ar-en-hi","ar-en-zh"]},
"ar-packages":{t:"argos_packages/",d:"Directory containing translation model packages.",f:[
{n:["tr-argos","ar-packages"],a:"→",l:"Load packages"}],
c:["tr-argos"]},
"ar-en-ur":{t:"English → Urdu",d:"Translation package for Urdu (code: ur).",f:[
{n:["tr-argos","ar-en-ur"],a:"→",l:"Urdu translation"}],
c:["route-translate"]},
"ar-en-hi":{t:"English → Hindi",d:"Translation package for Hindi (code: hi).",f:[
{n:["tr-argos","ar-en-hi"],a:"→",l:"Hindi translation"}],
c:["route-translate"]},
"ar-en-zh":{t:"English → Chinese",d:"Translation package for Chinese (code: zh).",f:[
{n:["tr-argos","ar-en-zh"],a:"→",l:"Chinese translation"}],
c:["route-translate"]},
"pyodide":{t:"Pyodide (WASM Python)",d:"Python runtime compiled to WebAssembly. Runs entirely in the browser. No backend needed.",f:[
{n:["pyodide-hook","pyodide"],a:"→",l:"Load WASM"}],
c:["py-wasm","py-stdout","py-plots"]},
"py-wasm":{t:"Python WASM Runtime",d:"CPython compiled to WASM. Supports most Python standard library + NumPy, Pandas, Matplotlib.",f:[
{n:["py-load","py-wasm"],a:"→",l:"Download + initialize"}],
c:["py-load"]},
"py-stdout":{t:"stdout/stderr capture",d:"Captures print() output and tracebacks from WASM execution.",f:[
{n:["py-run","py-stdout"],a:"→",l:"Capture output"}],
c:["py-run"]},
"py-plots":{t:"Matplotlib plot capture",d:"Captures matplotlib figures as base64 images from WASM execution.",f:[
{n:["py-run","py-plots"],a:"→",l:"Capture plots"}],
c:["py-run"]},
"data-flows":{t:"Data Flows",d:"End-to-end data flow paths through the entire application.",f:[],c:["flow-chat","flow-image","flow-voice","flow-tts","flow-translate","flow-doc","flow-onboard","flow-theme","flow-code","flow-notepad","flow-export","flow-startup","flow-shutdown"]},
"flow-chat":{t:"Chat Flow (Text)",d:"User types → MessageInput → handleSend() → streamResponse() → sendMessage() SSE → POST /chat → Ollama → SSE tokens → onToken() → msgCache → messages[] → ChatWindow renders",f:[
{n:["mi-textarea","h-send","h-stream","api-send","route-chat","ollama","chat-stream","s-messages","cw-aibubble"],a:"→",l:"Full text chat flow"}],
c:["h-send","h-stream","api-send","route-chat","ollama"]},
"flow-image":{t:"Chat Flow (Image/Vision)",d:"User attaches image → base64 → handleSend() → sendMessage() with image_base64 → POST /chat → compress_image_b64() → moondream → SSE tokens → ChatWindow",f:[
{n:["pm-image","h-send","api-send","route-chat","chat-image","ol-moondream","cw-aibubble"],a:"→",l:"Image analysis flow"}],
c:["pm-image","chat-image","ol-moondream"]},
"flow-voice":{t:"Voice Input Flow",d:"Mic click → WebSocket /ws/voice → sounddevice captures audio → Vosk recognizes → {type:partial/final} → MessageInput textarea fills → user edits → sends as text chat",f:[
{n:["mi-voice","route-voice","v-vosk","mi-textarea","h-send"],a:"→",l:"Voice → text → chat"}],
c:["mi-voice","route-voice","v-vosk"]},
"flow-tts":{t:"Text-to-Speech Flow",d:"TTS button click → new Audio('/tts/stream?text=...') → GET /tts/stream → subprocess piper.exe → raw PCM → int16→float32 → StreamingResponse → browser plays audio",f:[
{n:["ab-tts","route-tts","tts-piper","pi-exe","pi-output"],a:"→",l:"Text → Piper → audio playback"}],
c:["ab-tts","route-tts","tts-piper"]},
"flow-translate":{t:"Translation Flow",d:"Translate button → language picker → translateText() → POST /translate → clean_line() → safe_translate() → argostranslate → translated text → ChatWindow shows below message",f:[
{n:["ab-translate","api-translate","route-translate","tr-argos","argos","cw-aibubble"],a:"→",l:"Text → Argos → translated"}],
c:["ab-translate","route-translate","argos"]},
"flow-doc":{t:"Document Upload Flow",d:"Plus menu → upload file → POST /extract-text → pdfplumber/python-docx → trim 4000 chars → return text → prepend '[Document: name]\\ntext' to message → send as chat",f:[
{n:["pm-upload","route-extract","ext-pdf","mi-textarea","h-send","route-chat"],a:"→",l:"File → extract → chat with doc context"}],
c:["pm-upload","route-extract","h-send"]},
"flow-onboard":{t:"Onboarding Flow",d:"App init → check electronAPI.isOnboardingDone() → if false → OnboardingScreen → name + avatar → onComplete(profile) → electronAPI.completeOnboarding() → store onboardingDone=true + userProfile → stage='app'",f:[
{n:["app-js","comp-onboarding","h-onboard","ea-complete","es-onboard","es-profile"],a:"→",l:"Onboarding → save → show app"}],
c:["comp-onboarding","ea-complete","es-onboard"]},
"flow-theme":{t:"Theme Flow",d:"Theme picker click → saveTheme(id) → localStorage + electronAPI.setTheme() → electron-store → CSS variables on :root → all components re-render → BrowserWindow backgroundColor",f:[
{n:["sb-theme","ls-theme","ea-theme","es-theme"],a:"→",l:"Theme → store → CSS vars"}],
c:["sb-theme","ls-theme","ea-theme","es-theme"]},
"flow-code":{t:"Code Runner Flow",d:"Code button → CodeRunnerModal → type/load code → Run → usePyodide().runPython() → Pyodide WASM executes → stdout/stderr/plots → OutputPanel. Entirely in-browser, no backend.",f:[
{n:["cr-editor","h-run-code","py-run","cr-output"],a:"→",l:"Code → WASM → output (no backend)"}],
c:["comp-coderunner","pyodide-hook"]},
"flow-notepad":{t:"Notepad Flow",d:"Notes button → NotepadTool → textarea → Save → localStorage 'nexa_notes' → Download PDF via jsPDF. Entirely client-side, no backend.",f:[
{n:["comp-notepad","ls-notes","np-actions"],a:"→",l:"Notes → localStorage (no backend)"}],
c:["comp-notepad","ls-notes"]},
"flow-export":{t:"Export Flow",d:"Export dropdown → PDF: jsPDF generates from messages[] → downloads nexa-chat.pdf. DOCX: docx package generates → file-saver → downloads nexa-chat.docx.",f:[
{n:["s-messages","h-export-pdf"],a:"→",l:"Messages → PDF/DOCX → download"}],
c:["h-export-pdf","h-export-docx"]},
"flow-startup":{t:"App Startup Sequence",d:"0ms: app.whenReady() → wipeOnFreshInstall() + hardenSession() + createLoadingWindow() + startOllama() + startBackend() + createMainWindow() → 5.5s: mainWindow.maximize() + show() → 5.7s: loadingWin.close() → 6.1s: if !onboardingDone → send 'show-onboarding' IPC",f:[
{n:["app-lifecycle","wipe-install","harden-session","create-loading","start-ollama","start-backend","create-main-win"],a:"→",l:"Startup sequence"}],
c:["app-lifecycle","create-loading","start-ollama","start-backend","create-main-win"]},
"flow-shutdown":{t:"App Shutdown Sequence",d:"User closes window → 'window-all-closed' → cleanExit() → backendProc.kill(SIGTERM) + ollamaProc.kill(SIGTERM) → app.quit(). All data persisted in SQLite + electron-store + localStorage.",f:[
{n:["clean-exit","backend-proc","ollama-proc"],a:"→",l:"SIGTERM both → quit"}],
c:["clean-exit","backend-proc","ollama-proc"]}
};
