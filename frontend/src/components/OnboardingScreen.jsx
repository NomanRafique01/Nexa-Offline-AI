// OnboardingScreen Component
import React, { useState, useRef, useCallback, useEffect } from "react";
import "./OnboardingScreen.css";

// Renders the application logo for the onboarding screen.
function ChipLogo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <rect x="0" y="0" width="100" height="100" rx="22" fill="#ffb300" />
      <g stroke="#004953" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <line x1="36" y1="22" x2="36" y2="10" /><line x1="50" y1="22" x2="50" y2="6" /><line x1="64" y1="22" x2="64" y2="10" />
        <line x1="36" y1="78" x2="36" y2="90" /><line x1="50" y1="78" x2="50" y2="94" /><line x1="64" y1="78" x2="64" y2="90" />
        <line x1="22" y1="36" x2="10" y2="36" /><line x1="22" y1="50" x2="6"  y2="50" /><line x1="22" y1="64" x2="10" y2="64" />
        <line x1="78" y1="36" x2="90" y2="36" /><line x1="78" y1="50" x2="94" y2="50" /><line x1="78" y1="64" x2="90" y2="64" />
      </g>
      <g fill="#004953">
        <circle cx="36" cy="8"  r="4" /><circle cx="50" cy="4"  r="4" /><circle cx="64" cy="8"  r="4" />
        <circle cx="36" cy="92" r="4" /><circle cx="50" cy="96" r="4" /><circle cx="64" cy="92" r="4" />
        <circle cx="8"  cy="36" r="4" /><circle cx="4"  cy="50" r="4" /><circle cx="8"  cy="64" r="4" />
        <circle cx="92" cy="36" r="4" /><circle cx="96" cy="50" r="4" /><circle cx="92" cy="64" r="4" />
      </g>
      <rect x="22" y="22" width="56" height="56" rx="8" fill="#004953" />
      <rect x="30" y="30" width="40" height="40" rx="5" fill="#ffb300" opacity="0.18" />
    </svg>
  );
}

/* ── Crop Modal ── */

// CropModal Component
function CropModal({ src, onApply, onCancel }) {
  const VP = 240;

  const [offset, setOffset]       = useState({ x: 0, y: 0 });
  const [scale, setScale]         = useState(1);
  const [dragging, setDragging]   = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgReady, setImgReady]   = useState(false);

  const imgRef    = useRef(null);
  const canvasRef = useRef(null);

  // Handles the mouse down event to initiate dragging of the image.
  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);
  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // Generates the cropped image and passes data URL to onApply.
  const handleApply = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const img    = imgRef.current;
    const canvas = canvasRef.current;
    const out    = 300;

    canvas.width  = out;
    canvas.height = out;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, out, out);
    ctx.save();
    ctx.beginPath();
    ctx.arc(out / 2, out / 2, out / 2, 0, Math.PI * 2);
    ctx.clip();

    const renderedW = VP * scale;
    const renderedH = (img.naturalHeight / img.naturalWidth) * VP * scale;
    const imgCX = VP / 2 + offset.x;
    const imgCY = VP / 2 + offset.y;
    const imgLeft = imgCX - renderedW / 2;
    const imgTop  = imgCY - renderedH / 2;
    const rx = img.naturalWidth  / renderedW;
    const ry = img.naturalHeight / renderedH;
    const srcX = -imgLeft * rx;
    const srcY = -imgTop  * ry;
    const srcW =  VP * rx;
    const srcH =  VP * ry;

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, out, out);
    ctx.restore();
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
          onWheel={(e) => {
            e.preventDefault();
            setScale((s) => Math.min(3, Math.max(0.5, s - e.deltaY * 0.001)));
          }}
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
              top:  "50%",
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
          <input type="range" min="0.5" max="3" step="0.01" value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="ob-crop-zoom-slider" />
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

// OnboardingScreen Component
const OnboardingScreen = ({ onComplete }) => {
  const [firstName, setFirstName]         = useState("");
  const [lastName, setLastName]           = useState("");
  const [cropSrc, setCropSrc]             = useState(null);
  const [croppedAvatar, setCroppedAvatar] = useState(null);
  const [saving, setSaving]               = useState(false);
  const [visible, setVisible]             = useState(false); // starts hidden for fade-in

  const fileInputRef = useRef(null);

  // Fade in after a short delay so the transition from loading feels smooth
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const checkOnboardingState = async () => {
      if (!window.electronAPI?.isOnboardingDone) return;
      try {
        const done = await window.electronAPI.isOnboardingDone();
        if (!done || cancelled) return;
        const profile = (await window.electronAPI.getProfile?.()) || { name: "", avatar: null };
        onComplete(profile);
      } catch {}
    };
    checkOnboardingState();
    return () => { cancelled = true; };
  }, [onComplete]);

  // Handles the selection of a new avatar image file.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCropSrc(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Validates input, saves the profile data, and triggers completion callback.
  const handleSave = async () => {
  if (!firstName.trim()) return;
  setSaving(true);
  const profile = {
    name: `${firstName.trim()} ${lastName.trim()}`.trim(),
    avatar: croppedAvatar || null,
  };
  // Save to electron-store (persistent)
  await window.electronAPI.completeOnboarding(profile);
  setTimeout(() => onComplete(profile), 700);
  };

  const isValid = firstName.trim().length > 0;

  return (
    <>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onApply={(dataUrl) => { setCroppedAvatar(dataUrl); setCropSrc(null); }}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div className={`ob-overlay ${visible ? "ob-visible" : ""}`}>
        <div className="ob-orb ob-orb-1" />
        <div className="ob-orb ob-orb-2" />
        <div className="ob-orb ob-orb-3" />

        <div className={`ob-card ${visible ? "ob-card-in" : ""}`}>

          <div className="ob-header">
            <div className="ob-logo-wrap"><ChipLogo size={52} /></div>
            <div className="ob-header-text">
              <h1 className="ob-title">Welcome to Nexa</h1>
              <p className="ob-subtitle">Your private offline AI assistant</p>
            </div>
          </div>

          <div className="ob-divider" />

          <div className="ob-avatar-section">
            <div className="ob-avatar-ring"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload photo">
              {croppedAvatar ? (
                <img src={croppedAvatar} alt="avatar" className="ob-avatar-img" />
              ) : (
                <div className="ob-avatar-placeholder">
                  <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="35" r="22" fill="#b0bec5" />
                    <ellipse cx="50" cy="88" rx="34" ry="24" fill="#b0bec5" />
                  </svg>
                </div>
              )}
              <div className="ob-avatar-overlay">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
            <p className="ob-avatar-hint">
              {croppedAvatar ? "✓ Photo added" : "Add a photo (optional)"}
            </p>
            {croppedAvatar && (
              <button className="ob-avatar-remove" onClick={() => setCroppedAvatar(null)}>
                Remove photo
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*"
              style={{ display: "none" }} onChange={handleFileChange} />
          </div>

          <div className="ob-fields">
            <div className="ob-field-group">
              <label className="ob-label">First Name <span className="ob-required">*</span></label>
              <input className="ob-input" type="text" placeholder=" "
                value={firstName} onChange={(e) => setFirstName(e.target.value)}
                maxLength={30} autoFocus
                onKeyDown={(e) => e.key === "Enter" && isValid && handleSave()} />
            </div>
            <div className="ob-field-group">
              <label className="ob-label">Last Name <span className="ob-optional"></span></label>
              <input className="ob-input" type="text" placeholder=" "
                value={lastName} onChange={(e) => setLastName(e.target.value)}
                maxLength={30}
                onKeyDown={(e) => e.key === "Enter" && isValid && handleSave()} />
            </div>
          </div>

          <button
            className={`ob-save-btn ${isValid ? "ob-save-active" : ""} ${saving ? "ob-saving" : ""}`}
            onClick={handleSave} disabled={!isValid || saving}
          >
            {saving ? (
              <span className="ob-save-inner">
                <svg className="ob-spinner" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Setting up…
              </span>
            ) : (
              <span className="ob-save-inner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Get Started
              </span>
            )}
          </button>

          <p className="ob-footer-note">
            Your data stays on this device — nothing is sent to the cloud.
          </p>
        </div>
      </div>
    </>
  );
};

export default OnboardingScreen;