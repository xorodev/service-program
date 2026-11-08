const fs = require('node:fs');
const path = require('node:path');

const compiledCssPath = path.join(__dirname, '..', 'css', 'tailwind.css');

fs.appendFileSync(compiledCssPath, '\n:root{--compiled-css-ready:1}\n');
// Created by: @xorodev (CipherCoreDev). 2026