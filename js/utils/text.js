(() => {
    'use strict';

    const { MIN_VALUE_LENGTH, MAX_VALUE_LENGTH, PLACEHOLDER_TEXT } = ServiceProgram.programConfig;
    const INVISIBLE_CHARACTERS = /[\p{Cc}\p{Cf}]/gu;

    function valueLength(value) {
        return Array.from(value).length;
    }

    function sanitizeValue(raw) {
        const cleaned = String(raw)
            .replace(/\s+/g, ' ')
            .replace(INVISIBLE_CHARACTERS, '')
            .trim();
        return Array.from(cleaned).slice(0, MAX_VALUE_LENGTH).join('').trim();
    }

    function isValidValue(value) {
        return valueLength(value) >= MIN_VALUE_LENGTH;
    }

    function displayValue(value) {
        return isValidValue(value) ? value : PLACEHOLDER_TEXT;
    }

    ServiceProgram.textUtils = Object.freeze({ valueLength, sanitizeValue, isValidValue, displayValue });
})();
// Created by: @xorodev (CipherCoreDev). 2026