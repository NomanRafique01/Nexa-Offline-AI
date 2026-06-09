// ChatWindow component
import React, { useEffect, useRef, useCallback, useState } from "react";
import { FiArrowDown, FiEdit2, FiRefreshCw, FiCopy, FiCheck, FiVolume2, FiVolumeX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { apiUrl } from "../services/api";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "./ChatWindow.css";

const AnalyzingIndicator = () => (
  <div className="analyzing-indicator">
    <div className="analyzing-icon">
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <span className="analyzing-text">Analyzing image</span>
    <div className="analyzing-dots"><span /><span /><span /></div>
  </div>
);

const TypingDots = () => (
  <div className="typing-dots"><span /><span /><span /></div>
);

const DocThumbnail = ({ doc }) => {
  const ext = doc?.name?.split(".").pop()?.toUpperCase() || "FILE";
  return (
    <div className="bubble-doc-thumb">
      <div className="bubble-doc-icon">{ext}</div>
      <div className="bubble-doc-info">
        <span className="bubble-doc-name">{doc?.name}</span>
        <span className="bubble-doc-type">{ext} Document</span>
      </div>
    </div>
  );
};

const LANGS = [
  { code: "urdu",    label: "Urdu",    native: "اردو" },
  { code: "hindi",   label: "Hindi",   native: "हिन्दी" },
  { code: "chinese", label: "Chinese", native: "中文" },
];

// ── CodeBlock: only wraps actual code fences, copy btn hidden during streaming ──
const CodeBlock = ({ children, isStreaming }) => {
  const [copied, setCopied] = useState(false);

  const getCodeText = (node) => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(getCodeText).join("");
    if (node?.props?.children) return getCodeText(node.props.children);
    return "";
  };

  const codeText = getCodeText(children);

  const handleCopy = () => {
    const text = String(codeText).trim();
    if (!text) return;
    const fallback = () => {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
          .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
          .catch(fallback);
      } else {
        fallback();
      }
    } catch { fallback(); }
  };

  // Only render the code block wrapper if there's actual code content
  const hasCode = React.Children.toArray(children).some(child =>
    child?.props?.className?.startsWith("language-") ||
    (typeof child === "object" && child?.type === "code")
  );

  if (!hasCode) {
    return <pre style={{ background: "#2d2d2d", color: "#ccc", borderRadius: 8, padding: "10px 12px", margin: "8px 0", overflowX: "auto" }}>{children}</pre>;
  }

  const codeChild = React.Children.toArray(children).find(c => c?.type === "code");
  const lang = codeChild?.props?.className?.replace("language-", "") || "python";
  const rawCode = String(codeText).trim();

  let highlighted = rawCode;
  try {
    const grammar = Prism.languages[lang] || Prism.languages.python;
    highlighted = Prism.highlight(rawCode, grammar, lang);
  } catch {}

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang-label">{lang}</span>
        {!isStreaming && (
          <button className="code-copy-btn" onClick={handleCopy}>
            {copied ? <FiCheck size={11} /> : <FiCopy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      <pre className={`language-${lang}`}>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
};

function stripMarkdownForTTS(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[\*\-]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/_{1,2}(.+?)_{1,2}/g, "$1")
    .trim();
}

async function runTTS({ text, onStart, onEnd, onError, cancelRef, audioCtxRef }) {
  let audioCtx = null;
  let cleanedUp = false;
  let nextStartTime = 0;
  let started = false;
  let activeSources = 0;
  let streamDone = false;

  function cleanup() {
    if (cleanedUp) return;
    cleanedUp = true;
    try { if (audioCtx && audioCtx.state !== "closed") audioCtx.close(); } catch (_) {}
    audioCtxRef.current = null;
    onEnd && onEnd();
  }

  function scheduleChunk(samples, sampleRate) {
    if (!samples.length) return;
    const buf = audioCtx.createBuffer(1, samples.length, sampleRate);
    buf.copyToChannel(samples, 0);
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    if (nextStartTime < now) nextStartTime = now + 0.01;
    src.start(nextStartTime);
    nextStartTime += buf.duration;
    activeSources++;

    src.onended = () => {
      activeSources--;
      if (streamDone && activeSources === 0) cleanup();
    };

    if (!started) {
      started = true;
      onStart && onStart();
    }
  }

  try {
    const cleanText = stripMarkdownForTTS(text);
    const url = apiUrl(`/tts/stream?text=${encodeURIComponent(cleanText)}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error("TTS stream failed");

    const reader = response.body.getReader();
    const concat = (a, b) => { const o = new Uint8Array(a.length + b.length); o.set(a); o.set(b, a.length); return o; };

    let headerBuf = new Uint8Array(0);
    let sampleRate = null;
    while (sampleRate === null) {
      if (cancelRef.current) { reader.cancel(); cleanup(); return; }
      const { done, value } = await reader.read();
      if (done) { cleanup(); return; }
      headerBuf = concat(headerBuf, value);
      if (headerBuf.length >= 4) {
        sampleRate = (headerBuf[0] << 24) | (headerBuf[1] << 16) | (headerBuf[2] << 8) | headerBuf[3];
        headerBuf = headerBuf.slice(4);
      }
    }

    audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
    audioCtxRef.current = audioCtx;
    nextStartTime = audioCtx.currentTime + 0.05;

    let leftover = headerBuf;

    while (true) {
      if (cancelRef.current) { reader.cancel(); break; }
      const { done, value } = await reader.read();
      if (done) break;

      const combined = concat(leftover, value);
      const floatCount = Math.floor(combined.length / 4);
      if (floatCount > 0) {
        const samples = new Float32Array(combined.buffer, combined.byteOffset, floatCount);
        scheduleChunk(new Float32Array(samples), sampleRate);
        leftover = combined.slice(floatCount * 4);
      } else {
        leftover = combined;
      }
    }

    streamDone = true;
    if (cancelRef.current || activeSources === 0) cleanup();

  } catch (err) {
    console.error("[TTS]", err);
    cleanup();
    onError && onError(err);
  }
}

// ── makeMarkdownComponents: pass isStreaming so CodeBlock knows to hide copy btn ──
const makeMarkdownComponents = (isStreaming) => ({
  hr: () => null,
  pre: ({ children }) => <CodeBlock isStreaming={isStreaming}>{children}</CodeBlock>,
});

// MessageBubble component
const MessageBubble = React.memo(({ msg, i, isLastMessage, hoveredIdx, isTyping, speakingIdx, loadingTtsIdx,
  copiedIdx, regenIdx, translatingIdx, openTranslateIdx, translations,
  userName, onEditMessage, onReloadResponse,
  handleCopy, handleSpeak, handleTranslate, handleRegenFromUser,
  setOpenTranslateIdx, getAssistantIdxFor, getUserMsgFor, getUserIdxFor, formatTime }) => {

  const timeStr = formatTime(msg.created_at);
  const isTranslated = !!translations[i];

  const renderUserBubble = () => {
    const visibleText = msg.displayContent !== undefined ? msg.displayContent : msg.content;
    return (
      <>
        {msg.image_base64 && (
          <div className="bubble-image-wrapper">
            <img src={`data:image/jpeg;base64,${msg.image_base64}`} alt="uploaded" className="bubble-image" />
          </div>
        )}
        {msg.doc && <DocThumbnail doc={msg.doc} />}
        {visibleText && <p>{visibleText}</p>}
      </>
    );
  };

  const rawContent = translations[i]?.text || msg.content || "";
  const markdownContent = msg.role === "assistant" ? rawContent : null;

  // isStreaming = this is the last message AND model is currently generating
  const isStreaming = isTyping && isLastMessage;
  const mdComponents = makeMarkdownComponents(isStreaming);

  const langClass = translations[i]?.lang === "urdu" ? "lang-urdu" : "";

  return (
    <div className={`message-row ${msg.role}`}>
      <div className="bubble-col">
        <div className={`bubble ${msg.role}${(speakingIdx === i || loadingTtsIdx === i) ? ' tts-active' : ''}`}>
          {msg.role === "user" && renderUserBubble()}
          {msg.role === "assistant" && msg.content && (
            <>
              <div className={`markdown-body ${langClass}`} dir={langClass ? "rtl" : "auto"}>
                <ReactMarkdown components={mdComponents}>{markdownContent}</ReactMarkdown>
              </div>
              {isTranslated && (
                <span className="translated-badge">
                  {LANGS.find(l => l.code === translations[i].lang)?.native || translations[i].lang}
                </span>
              )}
            </>
          )}
          {msg.role === "assistant" && msg.stopped && (
            <p className="stopped-notice">— <em>Response stopped by {userName || "User"}</em></p>
          )}
          {msg.role === "assistant" && (speakingIdx === i || loadingTtsIdx === i) && (
            <div className={`equalizer-bars${loadingTtsIdx === i ? ' loading' : ''}`}>
              <span/><span/><span/><span/><span/>
            </div>
          )}
        </div>
        <div className={`bubble-actions ${msg.role} ${hoveredIdx === i && !isTyping ? "visible" : ""}`}>
          <div className="action-buttons">
          <button className="bub-btn" title="Copy" onClick={() => handleCopy(msg, i)}>
            {copiedIdx === i ? <FiCheck size={12} /> : <FiCopy size={12} />}
          </button>

          {msg.role === "assistant" && msg.content && (
            <button className="bub-btn" title="Regenerate"
              onClick={() => {
                const uIdx = getUserIdxFor(i);
                if (uIdx >= 0 && onReloadResponse) onReloadResponse(i, uIdx);
              }}>
              <FiRefreshCw size={12} />
            </button>
          )}

          {msg.role === "user" && (
            <button className="bub-btn" title="Edit prompt"
              onClick={() => { const t = msg.displayContent !== undefined ? msg.displayContent : msg.content; onEditMessage && onEditMessage(t); }}>
              <FiEdit2 size={12} />
            </button>
          )}

          {msg.role === "user" && getAssistantIdxFor(i) !== null && (
            <button className={`bub-btn regen-btn ${regenIdx === i ? "spinning" : ""}`}
              title="Regenerate response" onClick={() => handleRegenFromUser(i)}>
              <FiRefreshCw size={12} />
            </button>
          )}

          {msg.role === "assistant" && msg.content && (
            <div className="translate-wrapper">
              <button
                className={`bub-btn translate-btn ${isTranslated ? "active" : ""} ${translatingIdx === i ? "spinning" : ""}`}
                title="Translate"
                onClick={() => setOpenTranslateIdx(openTranslateIdx === i ? null : i)}
              >
                <span style={{ fontSize: 11, fontWeight: 700 }}>T</span>
              </button>
              {openTranslateIdx === i && (
                <div className="translate-dropdown">
                  <div className="translate-dropdown-header">Translate to</div>
                  {isTranslated && (
                    <button className="translate-item original" onClick={() => handleTranslate(msg, i, "original")}>
                      <span className="translate-check">↩</span><span>Show original</span>
                    </button>
                  )}
                  {LANGS.map((lang) => (
                    <button key={lang.code}
                      className={`translate-item ${translations[i]?.lang === lang.code ? "active" : ""}`}
                      onClick={() => handleTranslate(msg, i, lang.code)}>
                      <span className="translate-native">{lang.native}</span>
                      <span className="translate-name">{lang.label}</span>
                      {translations[i]?.lang === lang.code && <span className="translate-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {msg.role === "assistant" && msg.content && (
            <button
              className={`bub-btn tts-btn ${speakingIdx === i ? "speaking" : ""} ${loadingTtsIdx === i ? "loading" : ""}`}
              title={speakingIdx === i ? "Stop speaking" : loadingTtsIdx === i ? "Generating audio..." : "Read aloud"}
              onClick={() => handleSpeak(msg, i)}
            >
              {loadingTtsIdx === i ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{display:"block",margin:"auto",animation:"spin 0.8s linear infinite"}}>
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
              ) : speakingIdx === i ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="5" height="16" rx="1.5"/>
                  <rect x="15" y="4" width="5" height="16" rx="1.5"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
              )}
            </button>
          )}
          </div>
          {timeStr && <span className="bubble-timestamp">{timeStr}</span>}
        </div>
      </div>
    </div>
  );
});

// ChatWindow Main component
const ChatWindow = React.memo(({ messages, isTyping, userName, onEditMessage, onReloadResponse,
  speakingIdx, setSpeakingIdx, loadingTtsIdx, setLoadingTtsIdx, cancelTtsRef, audioCtxRef, stopTts }) => {
  const bottomRef      = useRef(null);
  const containerRef   = useRef(null);
  const userScrolledUp = useRef(false);

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [hoveredIdx, setHoveredIdx]       = useState(null);
  const [copiedIdx, setCopiedIdx]         = useState(null);
  const [regenIdx, setRegenIdx]           = useState(null);
  const [translations, setTranslations]         = useState({});
  const [translatingIdx, setTranslatingIdx]     = useState(null);
  const [openTranslateIdx, setOpenTranslateIdx] = useState(null);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    userScrolledUp.current = dist > 80;
    setShowScrollBtn(dist > 80);
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = containerRef.current;
    if (!el) return;
    userScrolledUp.current = false;
    smooth ? el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }) : (el.scrollTop = el.scrollHeight);
  }, []);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "user") { userScrolledUp.current = false; scrollToBottom(false); }
  }, [messages.length, scrollToBottom]);

  useEffect(() => {
    if (!userScrolledUp.current) {
      const el = containerRef.current;
      if (!el) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });
      });
    }
  }, [messages, isTyping]);

  
  

  useEffect(() => {
    const handle = (e) => { if (!e.target.closest(".translate-wrapper")) setOpenTranslateIdx(null); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  

  const formatTime = useCallback((dateStr) => {
    if (!dateStr) return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Karachi",
      }).format(new Date(dateStr));
    } catch {
      const d = new Date(dateStr);
      const pkt = new Date(d.getTime() + 5 * 60 * 60 * 1000);
      let h = pkt.getUTCHours();
      const m = String(pkt.getUTCMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return `${h}:${m} ${ampm}`;
    }
  }, []);

  const getTextToCopy = (msg, idx) => {
    if (msg.role === "user") return msg.displayContent !== undefined ? msg.displayContent : msg.content;
    const raw = translations[idx]?.text || msg.content || "";
    return raw
      .replace(/^#{1,6}\s+(.+)$/gm, '$1')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_{1,2}(.+?)_{1,2}/g, '$1')
      .replace(/^\s*[-*+]\s+/gm, '• ')
      .replace(/```[\s\S]*?```/g, (m) => m.replace(/```[a-z]*\n?/g, '').trim())
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/^\s*>\s+/gm, '')
      .trim();
  };

  const handleCopy = useCallback((msg, idx) => {
    const text = getTextToCopy(msg, idx);
    if (!text) return;
    const fallback = () => {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1800);
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
          .then(() => { setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 1800); })
          .catch(fallback);
      } else {
        fallback();
      }
    } catch { fallback(); }
  }, [translations]);

  const handleSpeak = useCallback(async (msg, idx) => {
    if (speakingIdx === idx || loadingTtsIdx === idx) { stopTts(); return; }
    stopTts();
    await new Promise((r) => setTimeout(r, 100));
    cancelTtsRef.current = false;
    const text = translations[idx]?.text || msg.content || "";
    if (!text) return;
    setLoadingTtsIdx(idx);
    await runTTS({
      text,
      cancelRef: cancelTtsRef,
      audioCtxRef,
      onStart: () => { if (!cancelTtsRef.current) { setLoadingTtsIdx(null); setSpeakingIdx(idx); } },
      onEnd:   () => { audioCtxRef.current = null; setSpeakingIdx(null); setLoadingTtsIdx(null); },
      onError: () => { audioCtxRef.current = null; setSpeakingIdx(null); setLoadingTtsIdx(null); },
    });
  }, [speakingIdx, loadingTtsIdx, stopTts, translations]);

  const handleTranslate = useCallback(async (msg, idx, langCode) => {
    setOpenTranslateIdx(null);
    if (langCode === "original") {
      setTranslations(prev => { const n = { ...prev }; delete n[idx]; return n; });
      return;
    }
    if (translations[idx]?.lang === langCode) return;
    setTranslatingIdx(idx);
    try {
      const res = await fetch(apiUrl("/translate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: msg.content, target_language: langCode }),
      });
      const data = await res.json();
      if (data.translated) setTranslations(prev => ({ ...prev, [idx]: { text: data.translated, lang: langCode } }));
    } catch (err) { console.error("[Translate]", err); }
    finally { setTranslatingIdx(null); }
  }, [translations]);

  const getAssistantIdxFor = useCallback((userIdx) => {
    for (let i = userIdx + 1; i < messages.length; i++)
      if (messages[i].role === "assistant") return i;
    return null;
  }, [messages]);

  const getUserMsgFor = useCallback((assistantIdx) => {
    for (let i = assistantIdx - 1; i >= 0; i--)
      if (messages[i].role === "user") return messages[i];
    return null;
  }, [messages]);

  const getUserIdxFor = useCallback((assistantIdx) => {
    for (let i = assistantIdx - 1; i >= 0; i--)
      if (messages[i].role === "user") return i;
    return -1;
  }, [messages]);

  const handleRegenFromUser = useCallback((userIdx) => {
    const assistantIdx = getAssistantIdxFor(userIdx);
    if (assistantIdx !== null && onReloadResponse) {
      setRegenIdx(userIdx);
      setTimeout(() => setRegenIdx(null), 1000);
      onReloadResponse(assistantIdx, userIdx);
    }
  }, [getAssistantIdxFor, onReloadResponse, messages]);

  const lastUserMsg      = [...messages].reverse().find((m) => m.role === "user");
  const isAnalyzingImage = isTyping && lastUserMsg?.image_base64;

  return (
    <div className="chat-window-wrapper">
      <div className="chat-window" ref={containerRef} onScroll={handleScroll}>
        <div className="messages-list"
          onMouseMove={(e) => {
            const row = e.target.closest(".message-row");
            if (!row) return;
            const rows = Array.from(row.parentElement.children);
            setHoveredIdx(rows.indexOf(row));
          }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {messages.map((msg, i) => (
            <MessageBubble key={msg.created_at + msg.role + i}
              msg={msg} i={i}
              isLastMessage={i === messages.length - 1}
              hoveredIdx={hoveredIdx} isTyping={isTyping}
              speakingIdx={speakingIdx} loadingTtsIdx={loadingTtsIdx}
              copiedIdx={copiedIdx} regenIdx={regenIdx}
              translatingIdx={translatingIdx} openTranslateIdx={openTranslateIdx}
              translations={translations} userName={userName}
              onEditMessage={onEditMessage} onReloadResponse={onReloadResponse}
              handleCopy={handleCopy} handleSpeak={handleSpeak}
              handleTranslate={handleTranslate} handleRegenFromUser={handleRegenFromUser}
              setOpenTranslateIdx={setOpenTranslateIdx}
              getAssistantIdxFor={getAssistantIdxFor} getUserMsgFor={getUserMsgFor}
              getUserIdxFor={getUserIdxFor}
              formatTime={formatTime}
            />
          ))}

          {isTyping && (
            <div className="message-row assistant">
              <div className="bubble-col">
                <div className="bubble assistant typing-bubble">
                  {isAnalyzingImage ? <AnalyzingIndicator /> : <TypingDots />}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {showScrollBtn && (
        <button className="scroll-to-bottom-btn" onClick={() => scrollToBottom(true)} title="Scroll to bottom">
          <FiArrowDown size={16} />
        </button>
      )}
    </div>
  );
});

export default ChatWindow;