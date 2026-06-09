// CodeRunner Component (inline/embedded variant)
import React, { useEffect, useCallback, useState, useRef } from "react";
import Editor from "./Editor";
import "./CodeRunner.css";

// Built-in Python snippets shown in the Snippets dropdown.
const SAMPLE_SNIPPETS = [
  {
    label: "Hello World",
    code: `print("Hello from Nexa!")\n\nfor i in range(5):\n    print(f"  Line {i + 1}")\n`,
  },
  {
    label: "List Comprehension",
    code: `numbers = list(range(1, 11))\nsquares = [n**2 for n in numbers]\nevens   = [n for n in numbers if n % 2 == 0]\n\nprint("Numbers:", numbers)\nprint("Squares:", squares)\nprint("Evens:  ", evens)\nprint("Sum of squares:", sum(squares))\n`,
  },
  {
    label: "Classes & OOP",
    code: `class Animal:\n    def __init__(self, name, sound):\n        self.name  = name\n        self.sound = sound\n\n    def speak(self):\n        return f"{self.name} says {self.sound}!"\n\nanimals = [\n    Animal("Dog",  "Woof"),\n    Animal("Cat",  "Meow"),\n    Animal("Duck", "Quack"),\n]\n\nfor a in animals:\n    print(a.speak())\n`,
  },
  {
    label: "NumPy",
    code: `import numpy as np\n\narr = np.array([1, 2, 3, 4, 5])\nprint("Array:", arr)\nprint("Mean:", np.mean(arr))\nprint("Std: ", np.std(arr))\n\nmatrix = np.arange(1, 10).reshape(3, 3)\nprint("\\nMatrix:\\n", matrix)\nprint("Transpose:\\n", matrix.T)\n`,
  },
  {
    label: "Pandas",
    code: `import pandas as pd\n\ndata = {\n    'Name':  ['Alice', 'Bob', 'Charlie', 'Diana'],\n    'Age':   [25, 30, 35, 28],\n    'Score': [88.5, 92.0, 79.3, 95.1],\n}\n\ndf = pd.DataFrame(data)\nprint(df)\nprint("\\nAverage score:", df['Score'].mean())\nprint("Oldest:", df.loc[df['Age'].idxmax(), 'Name'])\n`,
  },
  {
    label: "Matplotlib Plot",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 2 * np.pi, 200)\ny1 = np.sin(x)\ny2 = np.cos(x)\n\nplt.figure(figsize=(8, 4))\nplt.plot(x, y1, label='sin(x)', linewidth=2)\nplt.plot(x, y2, label='cos(x)', linewidth=2)\nplt.title('Trigonometric Functions')\nplt.xlabel('x')\nplt.ylabel('y')\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.tight_layout()\nplt.show()\n`,
  },
  {
    label: "User Input",
    code: `name = input("Enter your name: ")\nage  = int(input("Enter your age: "))\n\nprint(f"Hello, {name}!")\nprint(f"In 10 years you will be {age + 10} years old.")\n`,
  },
  {
    label: "Fibonacci",
    code: `def fibonacci(n):\n    a, b = 0, 1\n    seq = []\n    for _ in range(n):\n        seq.append(a)\n        a, b = b, a + b\n    return seq\n\nfib = fibonacci(20)\nprint("Fibonacci(20):", fib)\nprint("Sum:", sum(fib))\nprint("Max:", max(fib))\n`,
  },
];

const IconCode = () => (
  <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
    <path d="M5 4L1 8l4 4M11 4l4 4-4 4M9.5 2.5l-3 11"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconTerminal = () => (
  <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
    <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M4 6l3 3-3 3M9 12h3" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPlay = () => (
  <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
    <path d="M4 2.5l9 5.5-9 5.5V2.5z" fill="currentColor"/>
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
    <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconSnippet = () => (
  <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
    <rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor"/>
    <rect x="2" y="7" width="8"  height="2" rx="1" fill="currentColor"/>
    <rect x="2" y="11" width="10" height="2" rx="1" fill="currentColor"/>
  </svg>
);

// Renders a scrollable list of output lines (stdout, stderr, plots, user input).
function TerminalOutput({ lines }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);
  if (!lines.length) return null;

  return (
    <div className="cr-terminal-lines">
      {lines.map((line, i) => {
        if (line.type === "plot") {
          return (
            <div key={i} className="cr-terminal-line cr-line-plot">
              <img src={`data:image/png;base64,${line.text}`} alt="matplotlib output" className="cr-plot-img" />
            </div>
          );
        }
        if (line.type === "input-value") {
          return (
            <div key={i} className="cr-terminal-line cr-line-input-value">
              <span className="cr-line-prefix">›</span>
              <span className="cr-line-text">{line.text}</span>
            </div>
          );
        }
        return (
          <div key={i} className={`cr-terminal-line cr-line-${line.type}`}>
            <span className="cr-line-prefix">
              {line.type === "error"  ? "✖" :
               line.type === "system" ? ""  :
               line.type === "info"   ? "i" : ">"}
            </span>
            <span className="cr-line-text">{line.text}</span>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

// Renders an inline input field inside the terminal for Python's input().
function InlineInputRow({ prompt, onSubmit }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); onSubmit(value); setValue(""); }
  };

  return (
    <div className="cr-inline-input-row">
      <span className="cr-inline-prompt-text">{prompt}</span>
      <input
        ref={inputRef}
        className="cr-inline-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Type and press Enter…"
        autoComplete="off"
        spellCheck={false}
      />
      <button className="cr-inline-submit" onClick={() => { onSubmit(value); setValue(""); }}>↵</button>
    </div>
  );
}

// Swaps between a spinner and Play icon.
function RunButtonContent({ isRunning }) {
  if (isRunning) return <><span className="cr-spinner" /> Running</>;
  return <><IconPlay /> Run</>;
}

// Default editor pane height as a percentage of the total body height.
const DEFAULT_EDITOR_PCT = 58;

// CodeRunnerModal Component
const CodeRunnerModal = ({
  isOpen, onClose,
  code, setCode,
  output, error, plots,
  isRunning, onRun, onClear,
  pyodideLoading,
  loadingProgress,
  loadingStage,
  isPyodideReady,
  resolveInput,
}) => {
  const [snippetOpen,   setSnippetOpen]   = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const [runCount,      setRunCount]      = useState(0);
  const [inputRequest,  setInputRequest]  = useState(null);

  // ── Resize state ──────────────────────────────────────────────────────────
  const [editorPct, setEditorPct] = useState(DEFAULT_EDITOR_PCT);
  const isDragging  = useRef(false);
  const bodyRef     = useRef(null);
  const dragStartY  = useRef(0);
  const dragStartPct= useRef(DEFAULT_EDITOR_PCT);

  const prevOutput = useRef("");
  const prevError  = useRef("");
  const prevPlots  = useRef([]);
  const snippetRef = useRef(null);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  // Initiates resizing of the editor and terminal panes.
  const onDividerMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current  = true;
    dragStartY.current  = e.clientY;
    dragStartPct.current = editorPct;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, [editorPct]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging.current || !bodyRef.current) return;
      const bodyH = bodyRef.current.getBoundingClientRect().height;
      const delta = e.clientY - dragStartY.current;
      const deltaPct = (delta / bodyH) * 100;
      const newPct = Math.min(85, Math.max(15, dragStartPct.current + deltaPct));
      setEditorPct(newPct);
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };
  }, []);

  // ── Input request ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => setInputRequest({ prompt: e.detail.prompt });
    window.addEventListener("pyodide-input-request", handler);
    return () => window.removeEventListener("pyodide-input-request", handler);
  }, []);

  // Handles submission of user input.
  const handleInputSubmit = (value) => {
    setInputRequest(null);
    setTerminalLines((prev) => [...prev, { type: "input-value", text: value }]);
    resolveInput(value);
  };

  useEffect(() => {
    const newLines = [];
    if (output && output !== prevOutput.current) {
      prevOutput.current = output;
      output.split("\n").forEach((l) => { if (l !== "") newLines.push({ type: "stdout", text: l }); });
    }
    if (error && error !== prevError.current) {
      prevError.current = error;
      error.split("\n").forEach((l) => { if (l !== "") newLines.push({ type: "error", text: l }); });
    }
    if (plots && plots.length > prevPlots.current.length) {
      const newPlots = plots.slice(prevPlots.current.length);
      prevPlots.current = plots;
      newPlots.forEach((b64) => newLines.push({ type: "plot", text: b64 }));
    }
    if (newLines.length) setTerminalLines((prev) => [...prev, ...newLines]);
  }, [output, error, plots]);

  useEffect(() => {
    const h = (e) => {
      if (snippetRef.current && !snippetRef.current.contains(e.target)) setSnippetOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Prepares state for a new code execution run.
  const handleRun = useCallback(() => {
    setTerminalLines([
      { type: "system", text: `Run #${runCount + 1}  —  ${new Date().toLocaleTimeString()}` },
    ]);
    setRunCount((c) => c + 1);
    setInputRequest(null);
    prevOutput.current = "";
    prevError.current  = "";
    prevPlots.current  = [];
    onRun();
  }, [onRun, runCount]);

  // Clears the terminal output and error states.
  const handleClear = useCallback(() => {
    setTerminalLines([]);
    setInputRequest(null);
    prevOutput.current = "";
    prevError.current  = "";
    prevPlots.current  = [];
    onClear();
  }, [onClear]);

  // Resets state and dismisses the modal.
  const handleClose = useCallback(() => {
    setTerminalLines([]);
    setInputRequest(null);
    prevOutput.current = "";
    prevError.current  = "";
    prevPlots.current  = [];
    setEditorPct(DEFAULT_EDITOR_PCT); // ← reset split on close
    onClose();
  }, [onClose]);

  const handleBackdrop = (e) => { if (e.target.classList.contains("cr-backdrop")) handleClose(); };

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") { handleClose(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && isPyodideReady && !isRunning) {
      e.preventDefault();
      handleRun();
    }
  }, [handleClose, handleRun, isPyodideReady, isRunning]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const isEmpty = terminalLines.length === 0 && !inputRequest;

  return (
    <div className="cr-backdrop" onClick={handleBackdrop}>
      <div className="cr-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="cr-header">
          <div className="cr-header-left">
            <div className="cr-title-group">
              <span className="cr-title-icon"><IconCode /></span>
              <span className="cr-title">Code Runner</span>
              <span className="cr-lang-badge">Python 3</span>
            </div>
            {pyodideLoading && (
              <span className="cr-loading-text">
                <span className="cr-loading-dot" />
                {loadingStage || `Loading… ${loadingProgress}%`}
              </span>
            )}
            {isPyodideReady && !pyodideLoading && (
              <span className="cr-ready-badge">
                <span className="cr-ready-dot" />
                Ready
              </span>
            )}
          </div>

          <div className="cr-header-right">
            <div className="cr-snippet-wrapper" ref={snippetRef}>
              <button className="cr-snippet-btn" onClick={() => setSnippetOpen((v) => !v)}>
                <IconSnippet /> Snippets
              </button>
              {snippetOpen && (
                <div className="cr-snippet-dropdown">
                  {SAMPLE_SNIPPETS.map((s) => (
                    <button key={s.label} className="cr-snippet-item"
                      onClick={() => { setCode(s.code); setSnippetOpen(false); }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="cr-run-btn"
              onClick={handleRun}
              disabled={isRunning || !code.trim() || !isPyodideReady || pyodideLoading}
              title={!isPyodideReady ? "Python is loading…" : "Run (Ctrl+Enter)"}
            >
              <RunButtonContent isRunning={isRunning} />
            </button>

            <button className="cr-close-btn" onClick={handleClose} title="Close (Esc)">
              <IconClose />
            </button>
          </div>
        </div>

        {pyodideLoading && (
          <div className="cr-progress-bar">
            <div className="cr-progress-fill" style={{ width: `${loadingProgress}%` }} />
          </div>
        )}

        {/* ── Body ── */}
        <div className="cr-body" ref={bodyRef}>

          {/* Editor pane — height driven by editorPct */}
          <div className="cr-editor-pane" style={{ flex: `0 0 ${editorPct}%` }}>
            <Editor code={code} setCode={setCode} disabled={!isPyodideReady} />
          </div>

          {/* ── Drag divider ── */}
          <div
            className="cr-resize-divider"
            onMouseDown={onDividerMouseDown}
            title="Drag to resize"
          >
            <span className="cr-resize-handle-dots" />
          </div>

          {/* Terminal pane — takes remaining space */}
          <div className="cr-terminal-pane" style={{ flex: `1 1 0` }}>
            <div className="cr-terminal-header">
              <span className="cr-terminal-title">
                <span className="cr-terminal-icon"><IconTerminal /></span>
                Terminal
              </span>
              <div className="cr-terminal-header-right">
                {isPyodideReady && (
                  <span className="cr-terminal-caps">
                    numpy · pandas · matplotlib · scipy · sympy · input()
                  </span>
                )}
                {!isEmpty && (
                  <button className="cr-clear-btn" onClick={handleClear}>Clear</button>
                )}
              </div>
            </div>

            <div className="cr-terminal-body">
              {pyodideLoading && (
                <div className="cr-terminal-init">
                  <div className="cr-loading-spinner-large" />
                  <span>{loadingStage || 'Initializing Python runtime'}</span>
                  <div className="cr-init-progress">
                    <div className="cr-init-progress-fill" style={{ width: `${loadingProgress}%` }} />
                  </div>
                  <small>This only happens once — subsequent runs are instant.</small>
                </div>
              )}

              {!pyodideLoading && isEmpty && (
                <div className="cr-terminal-empty">
                  <div className="cr-terminal-prompt-row">
                    <span className="cr-terminal-prompt">$</span>
                    <span className="cr-terminal-cursor" />
                  </div>
                  <div className="cr-terminal-hint">
                    Press <kbd>Ctrl+Enter</kbd> or click Run to execute
                  </div>
                  <div className="cr-terminal-hint cr-terminal-hint-sub">
                    Supports numpy, pandas, matplotlib, scipy, sympy, input() and more
                  </div>
                </div>
              )}

              {!pyodideLoading && !isEmpty && (
                <TerminalOutput lines={terminalLines} />
              )}
            </div>

            {inputRequest && (
              <InlineInputRow
                prompt={inputRequest.prompt}
                onSubmit={handleInputSubmit}
              />
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="cr-footer">
          <span className="cr-footer-left">Offline · 60s timeout · micropip auto-install</span>
          <span className="cr-footer-right">Ctrl+Enter to run · Esc to close</span>
        </div>

      </div>
    </div>
  );
};

export default CodeRunnerModal;