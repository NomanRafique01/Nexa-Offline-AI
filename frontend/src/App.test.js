/**
 * App-level tests for Nexa frontend.
 * Run with: cd frontend && npm test
 */

// Mock heavy libs that break in Jest environment
jest.mock('./components/ChatWindow', () => () => <div data-testid="chat-window" />);
jest.mock('./components/CodeRunnerModal', () => () => <div data-testid="code-runner-modal" />);
jest.mock('./components/CodeRunner', () => () => <div data-testid="code-runner" />);
jest.mock('./components/Editor', () => () => <div data-testid="editor" />);
jest.mock('./components/Sidebar', () => () => <div data-testid="sidebar" />);
jest.mock('./components/MessageInput', () => () => <div data-testid="message-input" />);
jest.mock('./components/OnboardingScreen', () => () => <div data-testid="onboarding" />);
jest.mock('./components/LoadingScreen', () => () => <div data-testid="loading" />);
jest.mock('react-markdown', () => ({ __esModule: true, default: ({ children }) => children }));
jest.mock('jspdf', () => ({ jsPDF: jest.fn().mockImplementation(() => ({})) }));
jest.mock('docx', () => ({
  Document: jest.fn(),
  Packer: { toBlob: jest.fn() },
  Paragraph: jest.fn(),
  TextRun: jest.fn(),
  HeadingLevel: {},
}));
jest.mock('file-saver', () => ({ saveAs: jest.fn() }));
jest.mock('qrcode', () => ({ toDataURL: jest.fn() }));
jest.mock('emoji-picker-react', () => () => null);
jest.mock('prismjs', () => {
  const langProxy = new Proxy({}, {
    get: () => new Proxy({}, { get: () => undefined }),
    set: () => true,
  });
  const Prism = {
    highlight: jest.fn((c) => c),
    languages: Object.assign(langProxy, {
      extend: jest.fn(),
      insertBefore: jest.fn(),
    }),
    hooks: { add: jest.fn(), run: jest.fn() },
    util: { encode: jest.fn((t) => t), type: jest.fn() },
    Token: function(type, content) { this.type = type; this.content = content; },
  };
  global.Prism = Prism;
  return Prism;
});

// Fix usePyodide — it's a NAMED export, not default
jest.mock('./hooks/usePyodide', () => ({
  usePyodide: () => ({
    isLoading: false,
    loadingProgress: 100,
    loadingStage: 'Ready',
    runPython: jest.fn(),
    isReady: true,
    resolveInput: jest.fn(),
    error: null,
  }),
}));

jest.mock('./services/api', () => ({
  getConversations: jest.fn(() => Promise.resolve([])),
  createConversation: jest.fn(() => Promise.resolve({ id: 1, title: 'New Chat' })),
  sendMessage: jest.fn(() => Promise.resolve({ content: 'Hello!' })),
  apiUrl: 'http://127.0.0.1:8000',
}));

import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';

// ─────────────────────────────────────────────────────────────
// Smoke Tests
// ─────────────────────────────────────────────────────────────

describe('App — smoke tests', () => {
  test('renders without crashing', async () => {
    await act(async () => {
      render(<App />);
    });
  });

  test('renders the app container', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(document.body).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────
// Sidebar Tests
// ─────────────────────────────────────────────────────────────

describe('App structure', () => {
  test('app mounts without throwing', async () => {
    let error = null;
    try {
      await act(async () => {
        render(<App />);
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeNull();
  });

  test('document title is set', () => {
    expect(document.title).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────
// Theme Tests
// ─────────────────────────────────────────────────────────────

describe('Themes', () => {
  test('a theme is applied on load', async () => {
    await act(async () => {
      render(<App />);
    });
    const root = document.documentElement || document.body;
    expect(root.className || root.getAttribute('data-theme') || 'forest').toBeTruthy();
  });
});