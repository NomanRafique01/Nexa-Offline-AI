// Main App component
import React, { useState, useRef, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import CodeRunnerModal from "./components/CodeRunnerModal";
import OnboardingScreen from "./components/OnboardingScreen";
import { sendMessage, getMessages, generateTitle, savePartialMessage } from "./services/api";
import { usePyodide, preprocessCode } from "./hooks/usePyodide";

import "./App.css";


const MODELS = [
  { label: "Gemma 2B", value: "Gemma2B" },
  { label: "Phi3",     value: "Phi3"    },
  { label: "Mistral",  value: "Mistral" },
];

function ChipLogo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", transition: "all 0.35s ease" }}>
      <rect x="0" y="0" width="100" height="100" rx="22" fill="var(--logo-chip-bg, var(--accent))" />
      <g stroke="var(--logo-chip-fg, var(--logo-chip))" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <line x1="36" y1="22" x2="36" y2="10" /><line x1="50" y1="22" x2="50" y2="6" /><line x1="64" y1="22" x2="64" y2="10" />
        <line x1="36" y1="78" x2="36" y2="90" /><line x1="50" y1="78" x2="50" y2="94" /><line x1="64" y1="78" x2="64" y2="90" />
        <line x1="22" y1="36" x2="10" y2="36" /><line x1="22" y1="50" x2="6"  y2="50" /><line x1="22" y1="64" x2="10" y2="64" />
        <line x1="78" y1="36" x2="90" y2="36" /><line x1="78" y1="50" x2="94" y2="50" /><line x1="78" y1="64" x2="90" y2="64" />
      </g>
      <g fill="var(--logo-chip-fg, var(--logo-chip))" className="chip-logo-dots">
        <circle cx="36" cy="8"  r="4" /><circle cx="50" cy="4"  r="4" /><circle cx="64" cy="8"  r="4" />
        <circle cx="36" cy="92" r="4" /><circle cx="50" cy="96" r="4" /><circle cx="64" cy="92" r="4" />
        <circle cx="8"  cy="36" r="4" /><circle cx="4"  cy="50" r="4" /><circle cx="8"  cy="64" r="4" />
        <circle cx="92" cy="36" r="4" /><circle cx="96" cy="50" r="4" /><circle cx="92" cy="64" r="4" />
      </g>
      <rect x="22" y="22" width="56" height="56" rx="8" fill="var(--logo-chip-fg, var(--logo-chip))" />
      <rect x="30" y="30" width="40" height="40" rx="5" fill="var(--logo-chip-bg, var(--accent))" opacity="0.3" />
    </svg>
  );
}

const SPECIAL_DAYS = {
  "3-23":  "Pakistan Zindabad💚",
  "8-14":  "Azaadi Mubarak🎆",
  "9-6":   "Salute to our heroes ⚔️",
  "11-9":  "Dream. Think. Rise. — Iqbal Day",
  "9-11":  "In Memory of Quaid-e-Azam 🕊️",
  "3-8":   "Honoring Women Everywhere 💜",
  "3-22":  "Water is Life. Save it 💧",
  "4-7":   "Your Health Matters 🌿",
  "4-22":  "One Planet. Handle with Care 🌍",
  "5-1":   "Dignity in every Labor 🤝",
  "6-5":   "The Earth needs You 🌱",
  "7-11":  "One World, Shared by All 🌐",
  "9-8":   "Knowledge Opens Every Door 📚",
  "9-21":  "Choose Peace, Always ☮️",
  "10-5":  "A Teacher Changes Everything 🍎",
  "10-16": "No one should go Hungry 🌾",
  "10-24": "United for a Better World 🌐",
  "12-1":  "Awareness. Compassion. Action 🎗️",
  "12-10": "Rights are for veryone ✊",
  "2-4":   "Early Awareness Saves Lives 🎗️",
  "2-21":  "Every Language is a World 🗣️",
  "4-23":  "Open a book. Open a Mind 📖",
  "5-3":   "Truth Deserves to be Heard 🗞️",
  "5-31":  "Breathe Free 🚭",
  "6-12":  "Every Child Deserves a Childhood 🧒",
  "8-12":  "The Future belongs to the Youth 🌟",
  "9-16":  "Protect the Ozone. Protect life 🌤️",
  "11-14": "Live Well, Manage Well 💉",
  "12-25": "Peace and Joy to All 🎄",
};

const NEXA_START_TIME = Date.now();
const SPECIAL_DAY_DURATION_MS = 10 * 60 * 1000; // 30 minutes

function getSpecialDayMessage() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
  const key = `${now.getMonth() + 1}-${now.getDate()}`;
  return SPECIAL_DAYS[key] || null;
}

function getGreeting(name) {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
  const hour = now.getHours();
  const day = now.toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Karachi" });
  const firstName = name ? name.trim().split(/\s+/)[0] : "";

  // Show special day message only within first 30 minutes of Nexa being open
  const specialMsg = getSpecialDayMessage();
  if (specialMsg && (Date.now() - NEXA_START_TIME) < SPECIAL_DAY_DURATION_MS) {
    return specialMsg;
  }

  let period;
  if (hour >= 0 && hour < 4)        period = firstName ? `Night Owl, ${firstName} 🦉` : "Night Owl 🦉";
  else if (hour >= 4 && hour < 6)   period = "It's Dawn";
  else if (hour >= 6 && hour < 7)   period = "It's Dusk";
  else if (hour >= 7 && hour < 9)   period = "Early Bird";
  else if (hour >= 9 && hour < 12)  period = `Happy ${day}`;
  else if (hour >= 12 && hour < 13) period = "High Noon";
  else if (hour >= 13 && hour < 17) period = "Good Afternoon";
  else if (hour >= 17 && hour < 18) period = "Golden Hour";
  else if (hour >= 18 && hour < 20) period = "Good Evening";
  else if (hour >= 20 && hour < 22) period = "Winding Down";
  else                               period = "Burning Midnight Oil";

  if (hour >= 0 && hour < 4) return period;
  return firstName ? `${period}, ${firstName}` : period;
  }
// Notepad component
function NotepadTool({ onClose }) {
  const [text, setText]               = useState("");
  const [fileName, setFileName]       = useState("Untitled Note");
  const [editingName, setEditingName] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        if (window.electronAPI?.getNotes) {
          const n = await window.electronAPI.getNotes();
          if (n) { setNotes(n); return; }
        }
        setNotes(JSON.parse(localStorage.getItem("nexa_notes") || "[]"));
      } catch {
        setNotes(JSON.parse(localStorage.getItem("nexa_notes") || "[]"));
      }
    };
    load();
  }, []);
  const [confirmClose, setConfirmClose] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [copyTick, setCopyTick]         = useState(false);
  const [pasteTick, setPasteTick]       = useState(false);

  const nameRef      = useRef(null);
  const panelRef     = useRef(null);
  const savedTextRef = useRef("");

  useEffect(() => { if (editingName) nameRef.current?.focus(); }, [editingName]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (confirmClose) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        if (text !== savedTextRef.current) { e.preventDefault(); e.stopPropagation(); setConfirmClose(true); }
        else onClose();
      }
    };
    document.addEventListener("mousedown", handleOutside, true);
    return () => document.removeEventListener("mousedown", handleOutside, true);
  }, [text, confirmClose, onClose]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    let y = 20;
    doc.setFont("helvetica", "bold"); doc.setFontSize(15);
    doc.text(fileName, pw / 2, y, { align: "center" }); y += 10;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(150);
    doc.text(new Date().toLocaleString(), pw / 2, y, { align: "center" }); y += 10;
    doc.setTextColor(50, 50, 50); doc.setFontSize(11);
    const lines = doc.splitTextToSize(text || " ", pw - 30);
    lines.forEach((line) => {
      if (y > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; }
      doc.text(line, 15, y); y += 6;
    });
    doc.save(`${fileName}.pdf`);
  };

  const saveNote = () => {
    const id = activeNoteId || Date.now().toString();
    const updated = { id, name: fileName, content: text, savedAt: new Date().toLocaleString() };
    const newNotes = [updated, ...notes.filter((n) => n.id !== id)];
    setNotes(newNotes);
    localStorage.setItem("nexa_notes", JSON.stringify(newNotes));
    if (window.electronAPI?.setNotes) window.electronAPI.setNotes(newNotes);
    setActiveNoteId(id); savedTextRef.current = text;
  };
  const loadNote   = (note) => { setText(note.content); setFileName(note.name); setActiveNoteId(note.id); savedTextRef.current = note.content; };
  const deleteNote = (id, e) => {
    e.stopPropagation();
    const nn = notes.filter((n) => n.id !== id);
    setNotes(nn);
    localStorage.setItem("nexa_notes", JSON.stringify(nn));
    if (window.electronAPI?.setNotes) window.electronAPI.setNotes(nn);
    if (activeNoteId === id) { setText(""); setFileName("Untitled Note"); setActiveNoteId(null); savedTextRef.current = ""; }
  };
  const newNote              = () => { setText(""); setFileName("Untitled Note"); setActiveNoteId(null); savedTextRef.current = ""; };
  const handleClose          = () => { if (text !== savedTextRef.current) setConfirmClose(true); else onClose(); };
  const handleConfirmSave    = () => { saveNote(); setConfirmClose(false); onClose(); };
  const handleConfirmDiscard = () => { setConfirmClose(false); onClose(); };
  const handleCopy = async () => {
  try {
    if (window.electronAPI?.clipboardWrite) await window.electronAPI.clipboardWrite(text);
    else await navigator.clipboard.writeText(text);
    setCopyTick(true); setTimeout(() => setCopyTick(false), 1800);
  } catch {}
};
const handlePaste = async () => {
  try {
    let c = "";
    if (window.electronAPI?.clipboardRead) c = await window.electronAPI.clipboardRead();
    else c = await navigator.clipboard.readText();
    setText((p) => p + c); setPasteTick(true); setTimeout(() => setPasteTick(false), 1800);
  } catch {}
};

  return (
    <>
      <div className="tool-panel notepad-panel" ref={panelRef}>
        <div className="tool-panel-header">
          <span className="tool-panel-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            {editingName ? (
              <input ref={nameRef} className="notepad-name-input" value={fileName}
                onChange={(e) => setFileName(e.target.value)} onBlur={() => setEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditingName(false)} />
            ) : (
              <span className="notepad-name-label" onClick={() => setEditingName(true)} title="Click to rename">
                {fileName}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft:4,opacity:0.5}}>
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </span>
            )}
          </span>
          <button className="tool-close-btn" onClick={handleClose}>✕</button>
        </div>
        <div className="notepad-body">
          <div className="notepad-editor-col">
            <textarea className="notepad-textarea" value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Start writing your notes here..." spellCheck />
            <div className="notepad-editor-footer">
              <div style={{display:"flex",gap:6}}>
                <button type="button" className="tool-action-btn" onMouseDown={(e) => e.stopPropagation()} onClick={handlePaste}>
                  {pasteTick
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>}
                  {pasteTick ? "Pasted!" : "Paste"}
                </button>
                <button type="button" className="tool-action-btn" onMouseDown={(e) => e.stopPropagation()} onClick={handleCopy}>
                  {copyTick
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>}
                  {copyTick ? "Copied!" : "Copy"}
                </button>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button className="tool-action-btn notepad-pdf-btn" onClick={handleDownloadPDF} title="Download note as PDF">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  PDF
                </button>
                <button className="tool-action-btn" onClick={newNote}>+ New</button>
                <button className="tool-action-btn primary" onClick={saveNote}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/>
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="notepad-history-col">
            <div className="notepad-history-header">Saved Notes</div>
            {notes.length === 0 && <div className="notepad-history-empty">No saved notes yet</div>}
            {notes.map((n) => (
              <div key={n.id} className={`notepad-history-item ${activeNoteId === n.id ? "active" : ""}`} onClick={() => loadNote(n)}>
                <div className="notepad-history-name">{n.name}</div>
                <div className="notepad-history-date">{n.savedAt}</div>
                <button className="notepad-history-del" onClick={(e) => deleteNote(n.id, e)} title="Delete">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {confirmClose && (
        <div className="np-confirm-overlay" onMouseDown={(e) => e.stopPropagation()}>
          <div className="np-confirm-box">
            <div className="np-confirm-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/>
              </svg>
            </div>
            <h3 className="np-confirm-title">Save before closing?</h3>
            <p className="np-confirm-sub">Your note "<strong>{fileName}</strong>" has unsaved changes.</p>
            <div className="np-confirm-actions">
              <button className="np-confirm-btn discard" onClick={handleConfirmDiscard}>Don't Save</button>
              <button className="np-confirm-btn cancel" onClick={() => setConfirmClose(false)}>Cancel</button>
              <button className="np-confirm-btn save" onClick={handleConfirmSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const NEW_KEY      = "__new__";
const DEFAULT_CODE = `# Welcome to Code Runner ⚡\n# Press Ctrl+Enter or click Run\n\nprint("Hello from Nexa!")\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))\n\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nsquares = [n ** 2 for n in numbers]\nprint("Squares:", squares)\n\ntotal = sum(squares)\nprint("Sum of squares:", total)\n`;

function saveProfile(p) {
  localStorage.setItem("nexa_profile", JSON.stringify({ name: p.name || "", avatar: p.avatar || null }));
}

function checkOnboardingNeeded() {
  const done = localStorage.getItem("nexa_onboarded");
  return !done;
}

function loadSavedProfile() {
  try {
    const p = JSON.parse(localStorage.getItem("nexa_profile") || "{}");
    return { name: p.name || "", avatar: p.avatar || null };
  } catch { return { name: "", avatar: null }; }
}

// Render throttle map
const renderThrottle = {};

// App component
function App({ initialProfile }) {
  const [stage, setStage]           = useState("init");
  const [appVisible, setAppVisible] = useState(false);

  const [activeKey, setActiveKey]               = useState(NEW_KEY);
  const [messages, setMessages]                 = useState([]);
  const [isTyping, setIsTyping]                 = useState(false);
  const [refreshTrigger, setRefreshTrigger]     = useState(0);
  const [selectedModel, setSelectedModel]       = useState("Gemma2B");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modelDropdown, setModelDropdown]       = useState(false);
  const [exportDropdown, setExportDropdown]     = useState(false);
  const [notepadOpen, setNotepadOpen]           = useState(false);
  const [shortcutsOpen, setShortcutsOpen]       = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [userProfile, setUserProfile] = useState(
    initialProfile || loadSavedProfile()
  );

  const [greetingText, setGreetingText] = useState(() => getGreeting(loadSavedProfile().name));

useEffect(() => {
  const specialMsg = getSpecialDayMessage();
  if (!specialMsg) return;
  const elapsed = Date.now() - NEXA_START_TIME;
  const remaining = SPECIAL_DAY_DURATION_MS - elapsed;
  if (remaining <= 0) return;
  const timer = setTimeout(() => {
    setGreetingText(getGreeting(userProfile.name));
  }, remaining);
  return () => clearTimeout(timer);
}, [userProfile.name]);

useEffect(() => {
  const check = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/runtime-status");
      const data = await res.json();
      setBackendReady(data.status === "ok" && data.ollama === true);
    } catch {
      setBackendReady(false);
    }
  };
  check();
  const interval = setInterval(check, 5000);
  return () => clearInterval(interval);
}, []);

  const notepadRef = useRef(null);
  const [speakingIdx, setSpeakingIdx]     = useState(null);
  const [loadingTtsIdx, setLoadingTtsIdx] = useState(null);
  const cancelTtsRef  = useRef(false);
  const audioCtxRef   = useRef(null);

  const stopTts = useCallback(() => {
  cancelTtsRef.current = true;
  try { if (audioCtxRef.current && audioCtxRef.current.state !== "closed") audioCtxRef.current.close(); } catch (_) {}
  audioCtxRef.current = null;
  setSpeakingIdx(null);
  setLoadingTtsIdx(null);
}, []);
  const [lastSeen, setLastSeen] = useState(() => localStorage.getItem("nexa_last_seen") || null);


  useEffect(() => {
    const prev = localStorage.getItem("nexa_last_seen");
    setLastSeen(prev);
    localStorage.setItem("nexa_last_seen", new Date().toISOString());
  }, []);

  useEffect(() => {
    async function init() {
      if (window.electronAPI) {
        try {
          const first = await window.electronAPI.isFirstInstall();
          if (first) {
            localStorage.clear();
          }
        } catch (e) {
          console.error("Failed to check first install:", e);
        }
      }

      if (!localStorage.getItem("nexa_theme")) {
        localStorage.setItem("nexa_theme", "forest");
      }

      let onboardingDone = false;

      if (window.electronAPI) {
        try {
          const profile = await window.electronAPI.getProfile();
          if (profile && profile.name) {
            onboardingDone = true;
            setUserProfile(profile);
            setGreetingText(getGreeting(profile.name));
            localStorage.setItem("nexa_profile", JSON.stringify(profile));
            localStorage.setItem("nexa_onboarded", "1");
          }
        } catch {}
      } else {
        onboardingDone = !checkOnboardingNeeded();
        if (onboardingDone) {
          const p = loadSavedProfile();
          setUserProfile(p);
          setGreetingText(getGreeting(p.name));
        }
      }

      setStage(onboardingDone ? "app" : "onboarding");
    }

    init();
  }, []);

  useEffect(() => {
    if (stage === "app") {
      const t = setTimeout(() => setAppVisible(true), 60);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const handleOnboardingComplete = useCallback((profile) => {
    setUserProfile(profile);
    saveProfile(profile);
    setGreetingText(getGreeting(profile.name));
    if (window.electronAPI) {
      window.electronAPI.completeOnboarding(profile).catch(() => {});
    }
    setStage("app");
  }, []);

  const [codeRunnerOpen, setCodeRunnerOpen] = useState(false);
  const [crCode, setCrCode]                 = useState(DEFAULT_CODE);
  const [crLanguage, setCrLanguage]         = useState("python");
  const [crOutput, setCrOutput]             = useState("");
  const [crError, setCrError]               = useState("");
  const [crPlots, setCrPlots]               = useState([]);
  const [crRunning, setCrRunning]           = useState(false);

  const { isLoading: pyodideLoading, loadingProgress, loadingStage, runPython, isReady, resolveInput } = usePyodide();

  const dropdownRef       = useRef(null);
  const exportRef         = useRef(null);
  const msgCache          = useRef({});
  const abortControllers  = useRef({});
  const typingState       = useRef({});
  const activeKeyRef      = useRef(NEW_KEY);
  const inputFocusRef     = useRef(null);
  const codeRunnerOpenRef = useRef(codeRunnerOpen);

  useEffect(() => { codeRunnerOpenRef.current = codeRunnerOpen; }, [codeRunnerOpen]);
  const hasMessages = messages.length > 0 || isTyping;

  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setModelDropdown(false);
      if (exportRef.current  && !exportRef.current.contains(e.target))   setExportDropdown(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      // Auto-focus input on typing
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (codeRunnerOpenRef.current) return;
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable) return;
        if (/^[a-zA-Z0-9]$/.test(e.key)) inputFocusRef.current?.focus();
        return;
      }
      if (!e.ctrlKey && !e.metaKey) return;
      const key = e.key?.toLowerCase();
      if (e.shiftKey) {
        if (key === "n") { e.preventDefault(); handleNewChat(); }
        if (key === "h") { e.preventDefault(); setSidebarCollapsed(v => !v); }
        if (key === "c") { e.preventDefault(); setCodeRunnerOpen(v => !v); }
        if (key === "e") { e.preventDefault(); setExportDropdown(v => !v); }
        if (key === "m") { e.preventDefault(); setModelDropdown(v => !v); }
        if (key === "p") { e.preventDefault(); setNotepadOpen(v => !v); }
        if (key === "k") { e.preventDefault(); setShortcutsOpen(v => !v); }
      }
      if (!e.shiftKey && key === "escape") {
        setModelDropdown(false); setExportDropdown(false);
        setNotepadOpen(false); setShortcutsOpen(false);
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  const handleProfileUpdate = async (p) => {
    const clean = { name: p.name || "", avatar: p.avatar || null };
    setUserProfile(clean);
    saveProfile(clean);
    setGreetingText(getGreeting(clean.name));
    if (window.electronAPI?.setProfile) {
      await window.electronAPI.setProfile(clean);
    }
  };

  // Switch conversation key
  const switchTo = (key, msgs) => {
    activeKeyRef.current = key;
    setActiveKey(key);
    setMessages(msgs);
    setIsTyping(typingState.current[key] || false);
  };

  const handleNewChat = () => {
    stopTts();
    if (!msgCache.current[NEW_KEY]) msgCache.current[NEW_KEY] = [];
    activeKeyRef.current = NEW_KEY;
    setActiveKey(NEW_KEY);
    setMessages(msgCache.current[NEW_KEY]);
    setIsTyping(typingState.current[NEW_KEY] || false);
  };

  // Abort stream
  const abortStream = (key) => {
    const controller = abortControllers.current[key];
    if (controller) {
      try { controller.abort(); } catch {}
      delete abortControllers.current[key];
    }
    typingState.current[key] = false;
    delete renderThrottle[key];
  };

  const handleSelectConversation = async (id) => {
    stopTts();
    const key = String(id);
    const currentKey = activeKeyRef.current;
    if (currentKey === key) return;

    // Load from cache or fetch
    if (msgCache.current[key]) {
      switchTo(key, msgCache.current[key]);
      return;
    }
    try {
      const msgs = await getMessages(id);
      // Restore image_base64 from local cache if backend doesn't persist it
      storeImagesFromMsgs(key, msgs);
      const enriched = restoreImagesFromCache(key, msgs);
      msgCache.current[key] = enriched;
      switchTo(key, enriched);
    } catch {
      msgCache.current[key] = [];
      switchTo(key, []);
    }
  };

  // Local image cache
  const imageCache = useRef({});

  const storeImagesFromMsgs = (key, msgs) => {
    msgs.forEach((msg, idx) => {
      if (msg.role === "user" && msg.image_base64) {
        if (!imageCache.current[key]) imageCache.current[key] = {};
        imageCache.current[key][idx] = msg.image_base64;
      }
    });
  };

  const restoreImagesFromCache = (key, msgs) => {
  const cache = imageCache.current[key];
  if (!cache) return msgs;
  return msgs.map((msg, idx) => {
    if (msg.role === "user" && !msg.image_base64 && cache[idx]) {
      return { ...msg, image_base64: cache[idx] };
    }
    return msg;
  });
};
  const handleStop = () => {
    const key = activeKeyRef.current;
    abortStream(key);

    const msgs = msgCache.current[key];
    if (msgs) {
      const li = msgs.length - 1;
      if (li >= 0 && msgs[li].role === "assistant") msgs[li] = { ...msgs[li], stopped: true };
      if (activeKeyRef.current === key) setMessages([...msgs]);
    }
    if (activeKeyRef.current === key) setIsTyping(false);

    const numericId = key === NEW_KEY ? null : Number(key);

    // Save partial assistant reply to DB
    if (numericId && msgs) {
      const la = [...msgs].reverse().find((m) => m.role === "assistant");
      if (la?.content?.trim()) {
        savePartialMessage(numericId, la.content).catch(() => {});
      }
    }

    if (numericId && msgs) {
      const la = [...msgs].reverse().find((m) => m.role === "assistant");
      const lu = [...msgs].reverse().find((m) => m.role === "user");
      const t  = (lu?.displayContent || lu?.content || "") + " " + (la?.content || "");
      if (t.trim().length > 10) {
        generateTitle(numericId, t).then(() => setRefreshTrigger((v) => v + 1)).catch(() => {});
      }
    }
  };
  

  // Stream response function
  const streamResponse = async (streamKey, numericId, modelText, image_base64) => {
    // Each stream gets its own abort controller keyed to THIS stream's key
    const controller = new AbortController();
    abortControllers.current[streamKey] = controller;
    typingState.current[streamKey] = true;

    // Only update typing UI if this stream's key is still the active chat
    if (activeKeyRef.current === streamKey) setIsTyping(true);

    try {
      await sendMessage(
        modelText, numericId, selectedModel,
        // onToken — only write to the cache for THIS streamKey, never activeKeyRef
        (token, convId) => {
          // If NEW_KEY stream just got a real conversation ID, migrate the key
          if (streamKey === NEW_KEY && convId) {
            const nk = String(convId);
            // Migrate cache
            if (msgCache.current[NEW_KEY]) {
              msgCache.current[nk] = msgCache.current[NEW_KEY];
              delete msgCache.current[NEW_KEY];
            }
            // Migrate image cache
            if (imageCache.current[NEW_KEY]) {
              imageCache.current[nk] = imageCache.current[NEW_KEY];
              delete imageCache.current[NEW_KEY];
            }
            // Migrate abort controller
            abortControllers.current[nk] = controller;
            delete abortControllers.current[NEW_KEY];
            // Migrate typing state
            typingState.current[nk] = true;
            delete typingState.current[NEW_KEY];
            delete renderThrottle[NEW_KEY];
            // Update active key if we're still on NEW_KEY
            if (activeKeyRef.current === NEW_KEY) {
              activeKeyRef.current = nk;
              setActiveKey(nk);
            }
            setRefreshTrigger((v) => v + 1);
            // Update streamKey reference for future tokens in this closure
            // We can't reassign const, so we use a flag below
          }

          // Determine the real key for this stream now (may have migrated)
          

          // Always get the actual current key for this stream from abortControllers
          // Find which key owns this controller
          const ownerKey = Object.keys(abortControllers.current).find(
            k => abortControllers.current[k] === controller
          ) || streamKey;

          const msgs = msgCache.current[ownerKey];
          if (!msgs) return;

          const li = msgs.length - 1;
          if (li >= 0 && msgs[li].role === "assistant") {
            msgs[li] = { ...msgs[li], content: msgs[li].content + token };
          } else {
            msgs.push({ role: "assistant", content: token, stopped: false, created_at: new Date().toISOString() });
          }

          // CRITICAL: Only render if this stream's owner key is the active chat
          if (activeKeyRef.current === ownerKey) {
            const now = Date.now();
            if (!renderThrottle[ownerKey] || now - renderThrottle[ownerKey] >= 80) {
              renderThrottle[ownerKey] = now;
              setMessages([...msgs]);
            }
          }
        },
        // onDone
        async (convId) => {
          // Find owner key
          const ownerKey = Object.keys(abortControllers.current).find(
            k => abortControllers.current[k] === controller
          ) || (convId ? String(convId) : streamKey);

          typingState.current[ownerKey] = false;
          delete abortControllers.current[ownerKey];
          delete renderThrottle[ownerKey];

          // Final render only if this chat is still active
          if (activeKeyRef.current === ownerKey) {
            setMessages([...(msgCache.current[ownerKey] || [])]);
            setIsTyping(false);
          }

          if (convId) {
            const msgs = msgCache.current[ownerKey];
            const la = msgs ? [...msgs].reverse().find((m) => m.role === "assistant") : null;
            const lu = msgs ? [...msgs].reverse().find((m) => m.role === "user")      : null;
            const t  = (lu?.displayContent || lu?.content || "") + " " + (la?.content || "");
            try { await generateTitle(convId, t); } catch {}
            setRefreshTrigger((v) => v + 1);
          }
        },
        controller.signal,
        image_base64,
        userProfile.name
      );
    } catch (err) {
      const isAbort =
        err.name === "AbortError" || err.name === "TypeError" ||
        err.message?.includes("BodyStreamBuffer") || err.message?.includes("aborted") ||
        err.message?.includes("Failed to fetch");

      if (!isAbort) {
        // Find owner key for error display
        const ownerKey = Object.keys(abortControllers.current).find(
          k => abortControllers.current[k] === controller
        ) || streamKey;
        const msgs = msgCache.current[ownerKey];
        if (msgs) {
          const li = msgs.length - 1;
          if (li >= 0 && msgs[li].role === "assistant") {
            msgs[li] = { ...msgs[li], content: "⚠️ Could not reach Nexa backend." };
          } else {
            msgs.push({ role: "assistant", content: "⚠️ Could not reach Nexa backend.", stopped: false, created_at: new Date().toISOString() });
          }
          if (activeKeyRef.current === ownerKey) setMessages([...msgs]);
        }
      }

      // Clean up for this stream key
      const ownerKey = Object.keys(abortControllers.current).find(
        k => abortControllers.current[k] === controller
      ) || streamKey;
      typingState.current[ownerKey] = false;
      delete abortControllers.current[ownerKey];
      delete renderThrottle[ownerKey];
      if (activeKeyRef.current === ownerKey) setIsTyping(false);
    }
  };

  const handleSend = async (modelText, image_base64 = null, docMeta = null, displayText = "") => {
    const key       = activeKeyRef.current;
    const numericId = key === NEW_KEY ? null : Number(key);

    // Abort any existing stream on this chat before starting a new one
    abortStream(key);

    const userMsg = {
      role: "user",
      content: modelText,
      displayContent: displayText || modelText,
      image_base64: image_base64 || null,
      doc: docMeta || null,
      created_at: new Date().toISOString()
    };

    if (!msgCache.current[key]) msgCache.current[key] = [];
    msgCache.current[key] = [...msgCache.current[key], userMsg];

    // Store image in local cache for history restoration
    if (image_base64) {
      storeImagesFromMsgs(key, msgCache.current[key]);
    }

    if (activeKeyRef.current === key) setMessages([...msgCache.current[key]]);
    await streamResponse(key, numericId, modelText, image_base64);
  };

  const handleEditMessage = (text) => {
    const ta = inputFocusRef.current; if (!ta) return;
    const ns = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    ns.call(ta, text); ta.dispatchEvent(new Event("input", { bubbles: true })); ta.focus();
    ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  };

  const handleReloadResponse = (assistantIdx, userIdx) => {
  const key = activeKeyRef.current;
  if (!msgCache.current[key]) return;
  abortStream(key);

  const msgs = [...msgCache.current[key]];
  const userMsg = msgs[userIdx];
  if (!userMsg) return;

  // Remove both assistant and user messages, keep everything else
  const updated = msgs.filter((_, i) => i !== assistantIdx && i !== userIdx);

  // Push user message to bottom
  const reUserMsg = { ...userMsg, created_at: new Date().toISOString() };
  updated.push(reUserMsg);

  msgCache.current[key] = updated;
  setMessages([...updated]);

  const numericId = key === NEW_KEY ? null : Number(key);
  streamResponse(key, numericId, userMsg.content, userMsg.image_base64 || null);
  };

  const handleExportPDF = () => {
    setExportDropdown(false);
    const doc = new jsPDF(); const pw = doc.internal.pageSize.getWidth(); let y = 20;
    doc.setFont("helvetica", "bold"); doc.setFontSize(16);
    doc.text("Nexa Chat Export", pw / 2, y, { align: "center" }); y += 10;
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(150);
    doc.text(new Date().toLocaleString(), pw / 2, y, { align: "center" }); y += 10;
    messages.forEach((msg) => {
      if (!msg.content) return;
      const role  = msg.role === "user" ? "You" : "Nexa";
      const lines = doc.splitTextToSize(msg.content, pw - 30);
      if (y + lines.length * 7 > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 73, 83);
      doc.text(role, 15, y); y += 6;
      doc.setFont("helvetica", "normal"); doc.setTextColor(50, 50, 50); doc.setFontSize(10);
      lines.forEach((line) => { if (y > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; } doc.text(line, 15, y); y += 6; }); y += 4;
    });
    doc.save("nexa-chat.pdf");
  };

  const handleExportDOCX = async () => {
    setExportDropdown(false);
    const children = [
      new Paragraph({ text: "Nexa Chat Export", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ children: [new TextRun({ text: new Date().toLocaleString(), color: "888888", size: 20 })] }),
      new Paragraph({ text: "" }),
    ];
    messages.forEach((msg) => {
      if (!msg.content) return;
      const role = msg.role === "user" ? "You" : "Nexa";
      children.push(new Paragraph({ children: [new TextRun({ text: `${role}: `, bold: true, color: msg.role === "user" ? "004953" : "006680" }), new TextRun({ text: msg.displayContent || msg.content })], spacing: { after: 120 } }));
    });
    const blob = await Packer.toBlob(new Document({ sections: [{ children }] }));
    saveAs(blob, "nexa-chat.docx");
  };

  const crRunningRef = useRef(false);
  const crCodeRef = useRef(crCode);
  const lastRunIdRef = useRef(0);

  useEffect(() => { crCodeRef.current = crCode; }, [crCode]);

  const handleRunCode = useCallback(async (inputs = [], runId, expectedInputCount) => {
    if (crRunningRef.current) return;
    const codeToRun = crCodeRef.current || "";
    if (!codeToRun.trim() || !isReady) return;
    const inputCount = typeof expectedInputCount === "number"
      ? expectedInputCount
      : (codeToRun.match(/input\s*\(/g) || []).length;
    if (inputs.length < inputCount) return;
    if (typeof runId === "number" && runId <= lastRunIdRef.current) return;
    if (typeof runId === "number") lastRunIdRef.current = runId;
    crRunningRef.current = true;
    setCrRunning(true); setCrOutput(""); setCrError(""); setCrPlots([]);
    try {
      const result = await runPython(codeToRun, 60000, inputs);
      if (result.success) {
        const rv = result.result && result.result !== "undefined" && result.result !== "None" ? `\n[Return: ${result.result}]` : "";
        setCrOutput((result.stdout || "") + rv); setCrError(result.stderr || ""); setCrPlots(result.plots || []);
      } else {
        setCrError(result.stderr || "Execution failed"); setCrPlots(result.plots || []);
      }
    } catch (err) { setCrError(err.message || "Unexpected error"); }
    finally { setCrRunning(false); crRunningRef.current = false; }
  }, [isReady, runPython]);

  const handleClearOutput = useCallback(() => { setCrOutput(""); setCrError(""); setCrPlots([]); }, []);

  if (stage === "init") return null;
  if (stage === "onboarding") return <OnboardingScreen onComplete={handleOnboardingComplete} />;

  return (
    <div className={`app-layout ${appVisible ? "app-fadein" : ""}`}>
      <Sidebar
        activeId={activeKey === NEW_KEY ? null : Number(activeKey)}
        onSelect={handleSelectConversation} onNew={handleNewChat}
        refreshTrigger={refreshTrigger} collapsed={sidebarCollapsed} backendReady={backendReady}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        userProfile={userProfile} onProfileUpdate={handleProfileUpdate}
        lastSeen={lastSeen} onShowShortcuts={() => setShortcutsOpen(true)}
      />

      <main className="main-area">
        {shortcutsOpen && (
          <>
            <div className="shortcuts-dismiss-overlay" onClick={() => setShortcutsOpen(false)} />
            <div className="shortcuts-panel-inline">
              <div className="shortcuts-header">
                <span className="shortcuts-title">
                  <span className="shortcuts-title-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/></svg>
                  </span>
                  Keyboard Shortcuts
                </span>
                <button className="shortcuts-close" onClick={() => setShortcutsOpen(false)}>✕</button>
              </div>
              <div className="shortcuts-list">
                {[
                  ["New Chat",        "Ctrl + Shift + N"],
                  ["Toggle Sidebar",  "Ctrl + Shift + H"],
                  ["Code Runner",     "Ctrl + Shift + C"],
                  ["Export",          "Ctrl + Shift + E"],
                  ["Model Switcher",  "Ctrl + Shift + M"],
                  ["Notepad",         "Ctrl + Shift + P"],
                  ["Show Shortcuts",  "Ctrl + Shift + K"],
                  ["Close / Dismiss", "Escape"],
                ].map(([label, keys]) => (
                  <div className="shortcuts-row" key={label}>
                    <span className="shortcuts-label">{label}</span>
                    <span className="shortcuts-keys">
                      {keys.split(" + ").map((k, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="shortcuts-plus">+</span>}
                          <kbd className="shortcuts-kbd">{k}</kbd>
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <div className="chat-header">
          <div className="chat-header-identity">
            {userProfile.avatar
              ? <img src={userProfile.avatar} alt="profile" className="header-avatar" />
              : <div className="header-avatar-placeholder">{userProfile.name ? userProfile.name[0].toUpperCase() : "N"}</div>}
            <span className="header-username">{userProfile.name || "Nexa"}</span>
          </div>

          <div className="header-right">
            <div className="export-toggle-wrapper" ref={exportRef}>
              <button className="export-toggle-btn" onClick={() => setExportDropdown((v) => !v)}>
                <svg className="export-icon" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 14v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <span className="export-toggle-label">Export</span>
                <span className={`export-toggle-arrow ${exportDropdown ? "open" : ""}`}>▾</span>
              </button>
              {exportDropdown && (
                <div className="export-dropdown">
                  <div className="export-dropdown-header">Export as</div>
                  <button className="export-dropdown-item" onClick={handleExportPDF}>
                    <div className="export-fmt-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.8"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.8"/></svg></div>
                    <div className="export-fmt-info"><span className="export-fmt-name">PDF</span><span className="export-fmt-desc">Portable document</span></div>
                  </button>
                  <button className="export-dropdown-item" onClick={handleExportDOCX}>
                    <div className="export-fmt-icon"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></div>
                    <div className="export-fmt-info"><span className="export-fmt-name">DOCX</span><span className="export-fmt-desc">Word document</span></div>
                  </button>
                </div>
              )}
            </div>

            <button className="export-toggle-btn" onClick={() => setCodeRunnerOpen(true)} title="Code Runner (Python)">
              <svg viewBox="0 0 20 20" fill="none" width="15" height="15" className="export-icon">
                <path d="M6 7l-4 3 4 3M14 7l4 3-4 3M11 4l-2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="export-toggle-label">Code</span>
            </button>

            <div className="export-toggle-wrapper" ref={notepadRef}>
              <button
                className={`export-toggle-btn ${notepadOpen ? "tools-active" : ""}`}
                onClick={() => setNotepadOpen((v) => !v)}
                title="Notepad"
              >
                <svg className="export-icon" viewBox="0 0 20 20" fill="none">
                  <path d="M13.5 2.5a2.121 2.121 0 013 3L7 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="export-toggle-label">Notes</span>
              </button>
              {notepadOpen && <NotepadTool onClose={() => setNotepadOpen(false)} />}
            </div>

            <div className="model-toggle-wrapper" ref={dropdownRef}>
              <button className="model-toggle-btn" onClick={() => setModelDropdown((v) => !v)}>
                <span className="model-toggle-label">{selectedModel}</span>
                <span className={`model-toggle-arrow ${modelDropdown ? "open" : ""}`}>▾</span>
              </button>
              {modelDropdown && (
                <div className="model-dropdown">
                  {MODELS.map((m) => (
                    <button key={m.value} className={`model-dropdown-item ${selectedModel === m.value ? "active" : ""}`}
                      onClick={() => { setSelectedModel(m.value); setModelDropdown(false); setTimeout(() => inputFocusRef.current?.focus(), 0); }}>
                      {selectedModel === m.value && <span className="model-check">✓</span>}
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`chat-body ${hasMessages ? "has-messages" : "empty"}`}>
        
          {!hasMessages && (
            <div className="welcome-text">
              <div className="welcome-icon"><ChipLogo size={80} /></div>
              <h2 className="welcome-greeting">
                {[...String(greetingText)].map((char, index) => (
                  <span key={index} style={{ animationDelay: `${index * 0.03}s` }} className="typewriter-char">
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h2>
              <p className="welcome-assist">How may I assist you today?</p>
              <p className="welcome-sub">Nexa is running locally · Your data stays private</p>
            </div>
          )}
          {hasMessages && (
            <ChatWindow messages={messages} isTyping={isTyping} userName={userProfile.name || "User"}
              onEditMessage={handleEditMessage} onReloadResponse={handleReloadResponse}
              speakingIdx={speakingIdx} setSpeakingIdx={setSpeakingIdx}
              loadingTtsIdx={loadingTtsIdx} setLoadingTtsIdx={setLoadingTtsIdx}
              cancelTtsRef={cancelTtsRef} audioCtxRef={audioCtxRef} stopTts={stopTts} />
          )}
          <div className="input-wrapper">
            <MessageInput onSend={handleSend} onStop={handleStop} isGenerating={isTyping} focusRef={inputFocusRef} />
            <p className="disclaimer">Nexa can make mistakes. Please double-check important responses.</p>
          </div>
        </div>
      </main>

      <CodeRunnerModal
        isOpen={codeRunnerOpen} onClose={() => setCodeRunnerOpen(false)}
        code={crCode} setCode={setCrCode} language={crLanguage} setLanguage={setCrLanguage}
        output={crOutput} error={crError} plots={crPlots} isRunning={crRunning}
        onRun={handleRunCode} onClear={handleClearOutput}
        pyodideLoading={pyodideLoading} loadingProgress={loadingProgress}
        loadingStage={loadingStage} isPyodideReady={isReady} resolveInput={resolveInput}
      />
    </div>
  );
}

export default App;