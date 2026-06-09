// Sidebar component
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FiPlus, FiTrash2, FiMessageSquare, FiChevronsLeft, FiChevronsRight,
  FiEdit2, FiCheck, FiX, FiSearch, FiSettings, FiCamera, FiUser, FiSun, FiInfo
} from "react-icons/fi";
import { getConversations, deleteConversation, apiUrl } from "../services/api";
import "./Sidebar.css";

const THEMES = [
  { id: "forest",   label: "🌿 Forest",   sidebar: "#004953", main: "#f4f7f6", header: "#ffffff",  bubbleUser: "#004953", bubbleAi: "#e8eeee" },
  { id: "midnight", label: "🌙 Midnight", sidebar: "#080810", main: "#0f0f1a", header: "#1a1a2e",  bubbleUser: "#7c6ef7", bubbleAi: "#1e1e2e" },
  { id: "sand",     label: "☀️ Sand",     sidebar: "#3d1f00", main: "#fdf6ed", header: "#fff8f0",  bubbleUser: "#c2671a", bubbleAi: "#f0e6d3" },
  { id: "ocean",    label: "🐬 Ocean",    sidebar: "#023e58", main: "#e8f4f8", header: "#ffffff",  bubbleUser: "#0077b6", bubbleAi: "#d0eaf5" },
  { id: "carbon",   label: "🖤 Carbon",   sidebar: "#0d0d0d", main: "#1a1a1a", header: "#222222",  bubbleUser: "#2e2e2e", bubbleAi: "#252525" },
  { id: "blossom",  label: "🌸 Blossom",  sidebar: "#6d2b4e", main: "#fff0f5", header: "#ffffff",  bubbleUser: "#c2185b", bubbleAi: "#fce4ec" },
  { id: "wine",     label: "🍷 Wine",     sidebar: "#4a0010", main: "#fdf5f7", header: "#ffffff",  bubbleUser: "#7b1a2e", bubbleAi: "#f5e8ec" },
  { id: "sage",     label: "🌿 Sage",     sidebar: "#2d4a3e", main: "#f5f7f4", header: "#ffffff",  bubbleUser: "#2d6a4f", bubbleAi: "#e4ede8" },
  { id: "rust",  label: "🟤 Rust",  sidebar: "#8B3A2A", main: "#FDF6F0", header: "#ffffff", bubbleUser: "#C0492B", bubbleAi: "#F5E6E0" },
  { id: "blade", label: "⚔️ Blade", sidebar: "#3D4550", main: "#F4F5F7", header: "#ffffff", bubbleUser: "#5A6472", bubbleAi: "#E4E8ED" },
];

// Map theme ID
function toDataTheme(id) { return id === "forest" ? "" : id; }
// Load theme
function loadTheme() { return localStorage.getItem("nexa_theme") || "forest"; }
// Save theme
function saveTheme(id) { localStorage.setItem("nexa_theme", id); }
// Format last seen
function formatLastSeen(isoStr) {
  const diff = Math.floor((Date.now() - new Date(isoStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const ChipLogo = () => (
  <svg
    className="nexa-chip-logo"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Nexa Logo"
    style={{ display: "block", transition: "all 0.35s ease" }}
  >
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

// About Modal
function AboutModal({ onClose }) {
  useEffect(() => {
    const handle = (e) => {
      if (e.target.classList.contains("about-modal-overlay")) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  return (
    <div className="about-modal-overlay">
      <div className="about-modal">
        <div className="about-modal-header">
          <div className="about-modal-title-row">
            <div className="about-modal-icon-wrap">
              <FiInfo size={16} />
            </div>
            <span className="about-modal-title">About Nexa</span>
          </div>
          <button className="about-modal-close" onClick={onClose}><FiX size={14} /></button>
        </div>
        <div className="about-modal-body">
          <p className="about-modal-text">
            Nexa is a fully offline AI assistant developed by <strong>Maryam Fatima</strong> and <strong>Noman Rafique</strong>, students of BS Artificial Intelligence at NFC Institute of Engineering and Technology, Multan. It was built as part of their 2<sup>nd</sup> semester Digital Logic Design (DLD) project, reflecting their own creativity and independent development.
          </p>
          <p className="about-modal-text">
            This application does not exist on the internet and is designed to operate completely offline. Nexa is part of their AI startup, <strong>Nytheris</strong>, through which they aim to develop a range of innovative tools in the field of Artificial Intelligence, focusing on privacy, efficiency, and self-reliant systems.
          </p>
          <div className="about-modal-footer">
            <span className="about-modal-badge">🔒 Fully Offline</span>
            <span className="about-modal-badge">🤖 BS AI Project</span>
            <span className="about-modal-badge">🚀 Nytheris</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Crop Modal
function CropModal({ src, onApply, onCancel }) {
  const VP = 240;
  const [offset, setOffset]       = useState({ x: 0, y: 0 });
  const [scale, setScale]         = useState(1);
  const [dragging, setDragging]   = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgReady, setImgReady]   = useState(false);
  const imgRef    = useRef(null);
  const canvasRef = useRef(null);

  const onMouseDown = (e) => { e.preventDefault(); setDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); };
  const onMouseMove = useCallback((e) => { if (!dragging) return; setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }, [dragging, dragStart]);
  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  const handleApply = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const img = imgRef.current; const canvas = canvasRef.current; const out = 300;
    canvas.width = out; canvas.height = out;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, out, out); ctx.save(); ctx.beginPath(); ctx.arc(out/2, out/2, out/2, 0, Math.PI*2); ctx.clip();
    const renderedW = VP * scale; const renderedH = (img.naturalHeight / img.naturalWidth) * VP * scale;
    const imgCX = VP/2 + offset.x; const imgCY = VP/2 + offset.y;
    const imgLeft = imgCX - renderedW/2; const imgTop = imgCY - renderedH/2;
    const rx = img.naturalWidth / renderedW; const ry = img.naturalHeight / renderedH;
    const srcX = -imgLeft * rx; const srcY = -imgTop * ry; const srcW = VP * rx; const srcH = VP * ry;
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, out, out); ctx.restore();
    onApply(canvas.toDataURL("image/png"));
  };

  return (
    <div className="ob-crop-modal-overlay">
      <div className="ob-crop-modal">
        <div className="ob-crop-modal-header">
          <span className="ob-crop-modal-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            Crop Photo
          </span>
          <button className="ob-crop-modal-close" onClick={onCancel}>✕</button>
        </div>
        <p className="ob-crop-hint">Drag to reposition · Use slider or scroll to zoom</p>
        <div
          className="ob-crop-viewport"
          onMouseDown={onMouseDown}
          onWheel={(e) => { e.preventDefault(); setScale((s) => Math.min(3, Math.max(0.5, s - e.deltaY * 0.001))); }}
          style={{ width: VP, height: VP }}
        >
          <div className="ob-crop-mask" />
          <img
            ref={imgRef}
            src={src}
            alt="crop"
            className="ob-crop-img"
            onLoad={() => setImgReady(true)}
            style={{
              opacity: imgReady ? 1 : 0,
              width: VP,
              height: "auto",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
              transformOrigin: "center center",
              cursor: dragging ? "grabbing" : "grab",
              maxWidth: "none",
              userSelect: "none",
              transition: "opacity 0.2s ease",
            }}
            draggable={false}
          />
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div className="ob-crop-zoom-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <input
            type="range" min="0.5" max="3" step="0.01" value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="ob-crop-zoom-slider"
          />
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
        <div className="ob-crop-actions">
          <button className="ob-crop-cancel" onClick={onCancel}>Cancel</button>
          <button className="ob-crop-apply" onClick={handleApply}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// Sidebar Main
const Sidebar = ({ activeId, onSelect, onNew, refreshTrigger, collapsed, onToggle, userProfile, onProfileUpdate, lastSeen, backendReady, onGlowChange, onShowShortcuts }) => {
  const [conversations, setConversations]   = useState([]);
  const [search, setSearch]                 = useState("");
  const [renamingId, setRenamingId]         = useState(null);
  const [renameValue, setRenameValue]       = useState("");
  const [showPanel, setShowPanel]           = useState(false);
  const [activeTab, setActiveTab]           = useState("theme");
  const [selectedTheme, setSelectedTheme]   = useState(loadTheme);
  const [editName, setEditName]             = useState("");
  const [croppedAvatar, setCroppedAvatar]   = useState(null);
  const [cropSrc, setCropSrc]               = useState(null);
  const [showAbout, setShowAbout]           = useState(false);
  const [showDotsMenu, setShowDotsMenu]     = useState(false);

  const [hoveredId, setHoveredId]           = useState(null);
  const hoverTimer                          = useRef(null);

  const handleConvoMouseEnter = useCallback((id) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoveredId(id), 80);
  }, []);

  const handleConvoMouseLeave = useCallback(() => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoveredId(null), 100);
  }, []);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const renameInputRef = useRef(null);
  const fileInputRef   = useRef(null);
  const panelRef       = useRef(null);
  const dotsMenuRef    = useRef(null);

  useEffect(() => {
    const saved = loadTheme();
    setSelectedTheme(saved);
    document.documentElement.setAttribute("data-theme", toDataTheme(saved));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = selectedTheme === "midnight" || selectedTheme === "carbon";

    root.classList.add("theme-switching");
    root.setAttribute("data-theme", toDataTheme(selectedTheme));
    saveTheme(selectedTheme);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-switching");
      });
    });

    if (window.electronAPI?.setTheme) {
      window.electronAPI.setTheme(selectedTheme).catch(() => {});
    }
  }, [selectedTheme]);

  useEffect(() => { if (collapsed) setShowPanel(false); }, [collapsed]);

  // Close dots menu on outside click
  useEffect(() => {
    if (!showDotsMenu) return;
    const handle = (e) => {
      if (dotsMenuRef.current && !dotsMenuRef.current.contains(e.target)) {
        setShowDotsMenu(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showDotsMenu]);

  useEffect(() => {
    if (!showPanel) return;
    const handle = (e) => {
      if (cropSrc) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowPanel(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showPanel, cropSrc]);

  const load = async () => {
    try { const data = await getConversations(); setConversations(data); } catch {}
  };

  useEffect(() => { load(); }, [refreshTrigger]);

  useEffect(() => {
    if (renamingId && renameInputRef.current) { renameInputRef.current.focus(); renameInputRef.current.select(); }
  }, [renamingId]);

  useEffect(() => {
    if (!renamingId) return;
    const handle = (e) => {
      if (renameInputRef.current && !renameInputRef.current.closest(".convo-item").contains(e.target)) { setRenamingId(null); setRenameValue(""); }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [renamingId]);

  useEffect(() => {
    if (showPanel && activeTab === "profile") {
      setEditName(userProfile.name || "");
      setCroppedAvatar(userProfile.avatar || null);
      setCropSrc(null);
    }
  }, [showPanel, activeTab, userProfile.name, userProfile.avatar]);

  // Delete conversation
  const handleDelete = async (e, id) => { e.stopPropagation(); await deleteConversation(id); if (activeId === id) onNew(); load(); };
  // Start rename
  const startRename = (e, c) => { e.stopPropagation(); setRenamingId(c.id); setRenameValue(c.title || ""); };

  const confirmRename = async (e, id) => {
    e?.stopPropagation();
    if (!renameValue.trim()) { setRenamingId(null); setRenameValue(""); return; }
    try {
      await fetch(apiUrl(`/conversations/${id}/rename`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: renameValue.trim() }),
      });
      setConversations((prev) => prev.map((c) => c.id === id ? { ...c, title: renameValue.trim() } : c));
    } catch {}
    setRenamingId(null);
  };

  const cancelRename = (e) => { e?.stopPropagation(); setRenamingId(null); setRenameValue(""); };
  const handleRenameKey = (e, id) => { if (e.key === "Enter") confirmRename(null, id); if (e.key === "Escape") cancelRename(); };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCropSrc(ev.target.result);
    reader.readAsDataURL(file); e.target.value = "";
  };

  // Handle profile update
  const handleUpdate = () => { onProfileUpdate({ name: editName.trim(), avatar: croppedAvatar }); setShowPanel(false); };
  // Filter conversations
  const filtered = conversations.filter((c) => (c.title || "").toLowerCase().includes(search.toLowerCase()));

  // Open About
  const handleOpenAbout = () => {
    setShowAbout(true);
    onGlowChange?.(true);
  };

  // Close About
  const handleCloseAbout = () => {
    setShowAbout(false);
    onGlowChange?.(false);
  };

  return (
    <>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onApply={(dataUrl) => { setCroppedAvatar(dataUrl); setCropSrc(null); }}
          onCancel={() => setCropSrc(null)}
        />
      )}

      {showAbout && <AboutModal onClose={handleCloseAbout} />}

      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

        <div className="sidebar-collapsed-bar">
          <button className="toggle-btn" onClick={onToggle} title="Open sidebar">
            <FiChevronsRight size={16} />
          </button>
        </div>

        <div className="sidebar-content">

            <div className="sidebar-header">
              <div className="sidebar-logo">
                <ChipLogo />
                <span className="logo-text">NEXA</span>
              </div>
              <button className="toggle-btn" onClick={onToggle} title="Close sidebar">
                <FiChevronsLeft size={16} />
              </button>
            </div>

            <div className="sidebar-new-chat-wrap">
              <button className="new-chat-btn" onClick={onNew}>
                <FiPlus size={16} />
                <span>New Chat</span>
              </button>
            </div>

            <div className="search-wrapper">
              <FiSearch size={13} className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch("")}>
                  <FiX size={12} />
                </button>
              )}
            </div>

            <div className="sidebar-section-label">
              {search ? `Results (${filtered.length})` : "Recent"}
            </div>

            <div className="conversations-list">
              {filtered.length === 0 && (
                <div className="no-chats">{search ? "No matching chats" : "No conversations yet"}</div>
              )}
              {filtered.map((c) => {
                const actionsVisible = hoveredId === c.id || activeId === c.id || renamingId === c.id;
                return (
                  <div
                    key={c.id}
                    className={`convo-item ${activeId === c.id ? "active" : ""}`}
                    onClick={() => renamingId !== c.id && onSelect(c.id)}
                    onMouseEnter={() => handleConvoMouseEnter(c.id)}
                    onMouseLeave={handleConvoMouseLeave}
                  >
                    <FiMessageSquare size={14} className="convo-icon" />
                    {renamingId === c.id ? (
                      <input
                        ref={renameInputRef}
                        className="rename-input"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => handleRenameKey(e, c.id)}
                        onClick={(e) => e.stopPropagation()}
                        maxLength={60}
                      />
                    ) : (
                      <span className="convo-title">{c.title || "..."}</span>
                    )}
                    <div className={`convo-actions ${actionsVisible ? "visible" : ""}`}>
                      {renamingId === c.id ? (
                        <>
                          <button className="action-btn confirm" onClick={(e) => confirmRename(e, c.id)} title="Save"><FiCheck size={12} /></button>
                          <button className="action-btn cancel" onClick={cancelRename} title="Cancel"><FiX size={12} /></button>
                        </>
                      ) : (
                        <>
                          <button className="action-btn rename" onClick={(e) => startRename(e, c)} title="Rename"><FiEdit2 size={12} /></button>
                          <button className="action-btn delete" onClick={(e) => handleDelete(e, c.id)} title="Delete"><FiTrash2 size={13} /></button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sidebar-profile-footer" ref={panelRef}>
              <div className="profile-footer-inner">
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt="profile" className="profile-footer-avatar" />
                ) : (
                  <div className="profile-footer-avatar-placeholder">
                    {userProfile.name ? userProfile.name[0].toUpperCase() : <FiUser size={14} />}
                  </div>
                )}
                <div className="profile-footer-info">
                  <span className="profile-footer-name">{userProfile.name || "Set up profile"}</span>
                  <span className="profile-footer-sub">
                    {lastSeen ? `Last seen ${formatLastSeen(lastSeen)}` : "Personal account"}
                  </span>
                </div>

                {/* Status light + three dots */}
                <div className="footer-right-wrap" ref={dotsMenuRef}>
                 
                  <button
                    className="profile-three-dots"
                    onClick={() => setShowDotsMenu(v => !v)}
                    title="More options"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5"  r="2.5" />
                      <circle cx="12" cy="12" r="2.5" />
                      <circle cx="12" cy="19" r="2.5" />
                    </svg>
                  </button>

                  {showDotsMenu && (
                    <div className="dots-popup-menu">
                      <button
                        className="dots-popup-item"
                        onClick={() => { setShowDotsMenu(false); setActiveTab("theme"); setShowPanel(v => !v); }}
                      >
                        <FiSettings size={13} />
                        <span>Settings</span>
                      </button>
                      <button
                        className="dots-popup-item"
                        onClick={() => { setShowDotsMenu(false); handleOpenAbout(); }}
                      >
                        <FiInfo size={13} />
                        <span>About</span>
                      </button>
                      <button
                        className="dots-popup-item"
                        onClick={() => { setShowDotsMenu(false); onShowShortcuts?.(); }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/></svg>
                        <span>Shortcuts</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {showPanel && (
                <div className="profile-panel">
                  <div className="profile-panel-header">
                    <span className="profile-panel-title">Settings</span>
                    <button className="profile-panel-close" onClick={() => setShowPanel(false)}><FiX size={14} /></button>
                  </div>

                  <div className="settings-tabs">
                    <button
                      className={`settings-tab ${activeTab === "theme" ? "active" : ""}`}
                      onClick={() => setActiveTab("theme")}
                    >
                      <FiSun size={12} /> Theme
                    </button>
                    <button
                      className={`settings-tab ${activeTab === "profile" ? "active" : ""}`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <FiUser size={12} /> Profile
                    </button>
                  </div>

                  {activeTab === "theme" && (
                    <>
                      <div className="theme-grid-scroll-wrap">
                        <div className="theme-grid">
                          {THEMES.map((t) => (
                            <div
                              key={t.id}
                              className={`theme-card ${selectedTheme === t.id ? "selected" : ""}`}
                              onClick={() => setSelectedTheme(t.id)}
                            >
                              <div className="theme-card-preview">
                                <div className="theme-preview-sidebar" style={{ background: t.sidebar }} />
                                <div className="theme-preview-main" style={{ background: t.main }}>
                                  <div className="theme-preview-header" style={{ background: t.header }} />
                                  <div className="theme-preview-bubble" style={{ background: t.bubbleUser }} />
                                  <div className="theme-preview-bubble ai" style={{ background: t.bubbleAi }} />
                                </div>
                              </div>
                              <div className="theme-card-label">
                                <span>{t.label}</span>
                                {selectedTheme === t.id && <span className="theme-check">✓</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="theme-scroll-hint">Scroll to see all themes</div>
                    </>
                  )}

                  {activeTab === "profile" && (
                    <>
                      <div className="profile-avatar-section">
                        <div className="profile-avatar-preview">
                          {croppedAvatar ? (
                            <img src={croppedAvatar} alt="avatar" className="profile-avatar-img" />
                          ) : (
                            <div className="profile-avatar-empty">
                              {editName ? editName[0].toUpperCase() : <FiUser size={22} />}
                            </div>
                          )}
                          <button className="profile-avatar-edit-btn" onClick={() => fileInputRef.current?.click()}>
                            <FiCamera size={12} />
                          </button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="profile-field">
                        <label className="profile-field-label">Display Name</label>
                        <input
                          className="profile-field-input"
                          type="text"
                          placeholder="Enter your name..."
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          maxLength={40}
                        />
                      </div>
                      <button
                        className="profile-update-btn"
                        onClick={handleUpdate}
                        disabled={!editName.trim()}
                      >
                        <FiCheck size={13} />
                        Update Profile
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
      </aside>
    </>
  );
};

export default Sidebar;