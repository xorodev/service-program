(() => {
    'use strict';

    const SENTINEL_PROPERTY = '--compiled-css-ready';
    const SENTINEL_VALUE = '1';
    const PROBE_CLASS = 'bg-gold-500';
    const PROBE_BACKGROUND = 'rgb(212, 175, 55)';
    const FALLBACK_SCRIPTS = ['https://cdn.tailwindcss.com', 'js/tailwind-config.js'];

    function hasSentinel() {
        const value = getComputedStyle(document.documentElement).getPropertyValue(SENTINEL_PROPERTY);
        return value.trim() === SENTINEL_VALUE;
    }

    function hasCustomUtilities() {
        const probe = document.createElement('div');
        probe.className = PROBE_CLASS;
        document.documentElement.appendChild(probe);
        const background = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return background === PROBE_BACKGROUND;
    }

    function isCompiledCssHealthy() {
        try {
            return hasSentinel() && hasCustomUtilities();
        } catch (error) {
            return false;
        }
    }

    function loadFallback() {
        console.warn('Compiled CSS is unavailable or invalid. Loading Tailwind from its CDN instead.');
        FALLBACK_SCRIPTS.forEach(src => {
            document.write(`<script src="${src}"><\/script>`);
        });
    }

    if (!isCompiledCssHealthy()) loadFallback();
})();
// Created by: @xorodev (CipherCoreDev). 2026