(() => {
    'use strict';

    const MIN_VISIBLE_MS = 4000;
    const MAX_VISIBLE_MS = 10000;
    const READING_MS_PER_CHARACTER = 60;
    const VISIBLE_CLASS = 'toast-visible';
    const toastElement = document.getElementById('toast');
    const messageElement = document.getElementById('toast-msg');
    const closeButton = document.getElementById('toast-close');
    let hideTimer = null;

    function visibleDuration(message) {
        return Math.min(MAX_VISIBLE_MS, MIN_VISIBLE_MS + message.length * READING_MS_PER_CHARACTER);
    }

    function hide() {
        clearTimeout(hideTimer);
        toastElement.classList.remove(VISIBLE_CLASS);
    }

    function show(message) {
        messageElement.textContent = message;
        toastElement.classList.add(VISIBLE_CLASS);
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hide, visibleDuration(message));
    }

    closeButton.addEventListener('click', hide);

    ServiceProgram.toast = Object.freeze({ show });
})();
// Created by: @xorodev (CipherCoreDev). 2026