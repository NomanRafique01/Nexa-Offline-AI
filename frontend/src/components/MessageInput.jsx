// MessageInput component
import React, { useState, useRef, useEffect } from "react";
import { IoSend, IoMic, IoMicOff, IoStop } from "react-icons/io5";
import { FiPlus, FiImage, FiX } from "react-icons/fi";
import "./MessageInput.css";

// MessageInput component
const MessageInput = ({ onSend, onStop, isGenerating, focusRef }) => {
  const [text, setText]               = useState("");
  const [showPlus, setShowPlus]       = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError]       = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);

  const textareaRef        = useRef(null);
  const plusRef            = useRef(null);
  const micBtnRef          = useRef(null);
  const wsRef              = useRef(null);
  const finalTranscriptRef = useRef("");
  const imageInputRef      = useRef(null);
  const isListeningRef     = useRef(false);

  useEffect(() => {
    if (focusRef) focusRef.current = textareaRef.current;
  }, [focusRef]);

  useEffect(() => {
    const handle = (e) => {
      if (plusRef.current && !plusRef.current.contains(e.target)) setShowPlus(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    return () => stopMic();
  }, []);

  const stopMic = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    isListeningRef.current = false;
    setIsListening(false);
  };

  const startMic = () => {
    setMicError(false);
    try {
      const ws = new WebSocket("ws://127.0.0.1:8000/ws/voice");
      wsRef.current = ws;

      ws.onopen = () => {
        isListeningRef.current = true;
        setIsListening(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "final" && data.text) {
          finalTranscriptRef.current += data.text + " ";
          setText(finalTranscriptRef.current);
        } else if (data.type === "partial" && data.text) {
          setText(finalTranscriptRef.current + data.text);
        }
        const ta = textareaRef.current;
        if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 140) + "px"; }
      };

      ws.onerror = () => {
        setMicError(true);
        stopMic();
      };

      ws.onclose = () => {
        isListeningRef.current = false;
        setIsListening(false);
      };

    } catch {
      setMicError(true);
    }
  };

  const toggleVoice = () => isListening ? stopMic() : startMic();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && !attachedImage) return;
    if (isGenerating) return;
    if (isListening) stopMic();

    onSend(trimmed, attachedImage ? attachedImage.base64 : null);
    setText("");
    finalTranscriptRef.current = "";
    setShowPlus(false);
    setAttachedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); return; }
    if (isListeningRef.current) stopMic();
  };

  const handleChange = (e) => {
    if (isListeningRef.current) stopMic();
    setText(e.target.value);
    finalTranscriptRef.current = e.target.value;
    const ta = textareaRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 140) + "px"; }
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(",")[1];
      setAttachedImage({ file, preview: ev.target.result, base64 });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setShowPlus(false);
  };

  const canSend = (text.trim() || attachedImage) && !isGenerating;

  return (
    <div className="input-area">
      {attachedImage && (
        <div className="attachment-preview-bar">
          <div className="attachment-chip">
            <img src={attachedImage.preview} alt="preview" className="attachment-thumb" />
            <span className="attachment-name">{attachedImage.file.name}</span>
            <button className="attachment-remove" onClick={() => setAttachedImage(null)}>
              <FiX size={11} />
            </button>
          </div>
        </div>
      )}

      <div className="plus-popup-anchor" ref={plusRef}>
        {showPlus && (
          <div className="plus-popup">
            <button className="plus-popup-item" onClick={() => { imageInputRef.current?.click(); setShowPlus(false); }}>
              <span className="plus-popup-icon"><FiImage size={16} /></span>
              <span className="plus-popup-label">Upload Image</span>
            </button>
          </div>
        )}
      </div>

      <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageFile} />

      <div className={`input-box ${isGenerating ? "generating" : ""}`}>

        <button className={`plus-btn ${showPlus ? "active" : ""}`} onClick={() => setShowPlus((v) => !v)} type="button">
          <FiPlus size={20} style={{ transition: "transform 0.2s ease", transform: showPlus ? "rotate(45deg)" : "rotate(0deg)" }} />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          placeholder="Message Nexa..."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="input-field"
        />

        <button
          ref={micBtnRef}
          className={`mic-btn ${isListening ? "active" : ""} ${micError ? "error" : ""}`}
          onClick={toggleVoice}
          type="button"
          title={isListening ? "Stop mic" : micError ? "Mic unavailable" : "Voice input"}
        >
          {isListening ? <IoMicOff size={18} /> : <IoMic size={18} />}
        </button>

        {isGenerating ? (
          <button className="stop-btn" onClick={onStop} type="button" title="Stop generation">
            <IoStop size={17} />
          </button>
        ) : (
          <button className={`send-btn ${canSend ? "active" : ""}`} onClick={handleSend} disabled={!canSend} type="button">
            <IoSend size={17} />
          </button>
        )}
      </div>

      {micError && <p className="mic-error-hint">Microphone access unavailable</p>}
    </div>
  );
};

export default MessageInput;