/**
 * usePyodide Hook  (backend-delegated execution)
 *
 * Despite its name, this hook no longer runs Pyodide in-browser. Python code
 * is instead sent to the local FastAPI backend (`/run-python`) which executes
 * it server-side. The hook preserves the same public interface so that the
 * rest of the UI requires zero changes if the execution strategy changes.
 *
 * Returned values:
 *  - isLoading       {boolean}  — always false (backend is assumed ready).
 *  - loadingProgress {number}   — always 100.
 *  - loadingStage    {string}   — always 'Ready'.
 *  - error           {*}        — always null.
 *  - isReady         {boolean}  — always true.
 *  - runPython       {Function} — executes code via the backend REST endpoint.
 *  - resolveInput    {Function} — resolves a pending input() promise (legacy).
 *
 * @module usePyodide
 */
import { useState, useCallback, useRef } from 'react';

/** Base URL of the local Python execution backend. */
const BACKEND_URL = 'http://127.0.0.1:8000';

export const usePyodide = () => {
  const [isReady]         = useState(true);
  const [isLoading]       = useState(false);
  const [loadingProgress] = useState(100);
  const [loadingStage]    = useState('Ready');
  const [error]           = useState(null);
  const inputResolver     = useRef(null);

  /**
   * Resolves a previously registered input() promise.
   * Used by CodeRunnerModal to pass collected user input to the runner.
   */
  const resolveInput = useCallback((value) => {
    if (inputResolver.current) {
      inputResolver.current(value);
      inputResolver.current = null;
    }
  }, []);

  /**
   * Sends Python code to the backend for execution.
   *
   * @param {string}   code              - Python source to execute.
   * @param {number}   [timeoutMs=60000] - Abort the request after this many ms.
   * @param {string[]} [preCollectedInputs=[]] - Values for any input() calls.
   * @returns {Promise<{stdout: string, stderr: string, plots: string[], success: boolean}>}
   */
  const runPython = useCallback(async (code, timeoutMs = 60000, preCollectedInputs = []) => {
    try {
      const inputs = Array.isArray(preCollectedInputs)
        ? preCollectedInputs.filter(v => v !== undefined && v !== null)
        : [];

      console.log('Sending inputs:', inputs);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(`${BACKEND_URL}/run-python`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code, inputs }),
        signal:  controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const text = await res.text();
        return { stdout: '', stderr: `Backend error ${res.status}: ${text}`, plots: [], success: false };
      }

      const data = await res.json();
      return {
        stdout:  data.stdout  || '',
        stderr:  data.stderr  || '',
        plots:   data.plots   || [],
        result:  '',
        success: !data.stderr,
      };

    } catch (err) {
      if (err.name === 'AbortError') {
        return { stdout: '', stderr: `Timeout: exceeded ${timeoutMs / 1000}s`, plots: [], success: false };
      }
      return { stdout: '', stderr: `Cannot reach backend: ${err.message}`, plots: [], success: false };
    }
  }, []);

  return { isLoading, loadingProgress, loadingStage, error, runPython, isReady, resolveInput };
};

/**
 * preprocessCode
 * Reserved for future code transformations (e.g. injecting helpers or
 * stripping magic comments) before sending to the backend. Currently a no-op.
 *
 * @param {string} code - Raw Python source.
 * @returns {string} Unchanged source.
 */
export function preprocessCode(code) {
  return code;
}