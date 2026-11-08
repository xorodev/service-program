const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const browserConfigPath = path.join(__dirname, 'js', 'tailwind-config.js');
const browserContext = { tailwind: {} };
vm.runInNewContext(fs.readFileSync(browserConfigPath, 'utf8'), browserContext);

module.exports = {
    content: ['./index.html', './js/**/*.js'],
    safelist: ['bg-gold-500'],
    theme: browserContext.tailwind.config.theme
};
// Created by: @xorodev (CipherCoreDev). 2026