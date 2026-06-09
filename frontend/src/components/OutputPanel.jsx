// OutputPanel Component
import React from "react";

const OutputPanel = ({ output, error, onClear, isLoading }) => {
  return (
    <div className="cr-output-wrapper">
      <div className="cr-output-topbar">
        <span className="cr-output-label">Output</span>
        {(output || error) && !isLoading && (
          <button className="cr-clear-btn" onClick={onClear} title="Clear output">
            Clear
          </button>
        )}
      </div>
      
      <div className={`cr-output-content ${error ? "has-error" : ""}`}>
        {isLoading && (
          <div className="cr-loading-overlay">
            <div className="cr-loading-spinner-large" />
            <span>Initializing Python Environment...</span>
          </div>
        )}
        
        {!isLoading && output && (
          <pre className="cr-stdout">
            <code>{output}</code>
          </pre>
        )}
        
        {!isLoading && error && (
          <pre className="cr-stderr">
            <code>{error}</code>
          </pre>
        )}
        
        {!isLoading && !output && !error && (
          <div className="cr-empty-state">
            <div className="cr-empty-icon">🐍</div>
            <span>Ready to run Python code offline</span>
            <small>NumPy & Pandas available</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;