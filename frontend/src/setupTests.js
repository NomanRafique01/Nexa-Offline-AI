import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for Jest (required by jsPDF, docx)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;