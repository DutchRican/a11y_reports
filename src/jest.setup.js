/* eslint-disable @typescript-eslint/no-require-imports */
// jest.setup.js
require('whatwg-fetch');
const { TextDecoder, TextEncoder } = require('util');
const ResizeObserver = require('resize-observer-polyfill');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ResizeObserver = ResizeObserver;