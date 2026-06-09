// Editor Component

import React from "react";
import Editor_ from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python.min.js";

// Highlights Python source code using PrismJS.
const highlight = (code) =>
  Prism.highlight(code, Prism.languages.python, "python");

// Renders a code editor with syntax highlighting and line numbers.
const Editor = ({ code, setCode }) => {
  const lineCount = code.split("\n").length;

  // Handles pasting text from the clipboard.
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        setCode(text);
      } else {
        const el = document.createElement("textarea");
        document.body.appendChild(el);
        el.focus();
        document.execCommand("paste");
        const text = el.value;
        document.body.removeChild(el);
        if (text) setCode(text);
      }
    } catch (err) {
      const el = document.createElement("textarea");
      document.body.appendChild(el);
      el.focus();
      document.execCommand("paste");
      const text = el.value;
      document.body.removeChild(el);
      if (text) setCode(text);
    }
  };

  // Clears the current content of the editor.
  const handleClearEditor = () => {
    setCode("");
  };

  return (
    <div className="cr-editor-wrapper">
      <div className="cr-editor-topbar">
        <span className="cr-editor-label">editor</span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button className="cr-copy-btn" onClick={handlePaste} title="Paste from clipboard">
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
              <rect x="4" y="4" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M6 8h4M6 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Paste
          </button>
          <button className="cr-copy-btn" onClick={handleClearEditor} title="Clear editor">
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
              <path d="M3 4h10M6 4V3h4v1M6 7v5M10 7v5M4 4l1 9h6l1-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Clear
          </button>
        </div>
      </div>

      <div className="cr-editor-inner">
        <div className="cr-line-numbers" aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="cr-line-num">{i + 1}</div>
          ))}
        </div>

        <div className="cr-editor-area">
          <Editor_
            value={code}
            onValueChange={setCode}
            highlight={highlight}
            padding={12}
            style={{
              fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
              fontSize: 13.5,
              lineHeight: "1.6",
              minHeight: "100%",
              outline: "none",
            }}
            textareaClassName="cr-textarea"
            className="cr-prism-editor"
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
