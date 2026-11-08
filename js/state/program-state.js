(() => {
    'use strict';

    const { FIELDS } = ServiceProgram.programConfig;
    const { sanitizeValue } = ServiceProgram.textUtils;
    const { isValidIsoDate, isPastDate, getNextSaturdayIso } = ServiceProgram.dateUtils;
    const { DEFAULT_THEME, THEMES } = ServiceProgram.themeConfig;
    const { storage } = ServiceProgram;

    const values = {};
    let date = getNextSaturdayIso();
    let theme = DEFAULT_THEME;

    function applyDefaults() {
        date = getNextSaturdayIso();
        FIELDS.forEach(field => {
            values[field.id] = '';
        });
    }

    function isPlainObject(candidate) {
        return candidate !== null && typeof candidate === 'object' && !Array.isArray(candidate);
    }

    function isValidTheme(name) {
        return typeof name === 'string' && Object.prototype.hasOwnProperty.call(THEMES, name);
    }

    function restore() {
        const saved = storage.read();
        if (!isPlainObject(saved)) return;
        if (typeof saved.date === 'string' && isValidIsoDate(saved.date) && !isPastDate(saved.date)) {
            date = saved.date;
        }
        if (isValidTheme(saved.theme)) {
            theme = saved.theme;
        }
        if (!isPlainObject(saved.values)) return;
        FIELDS.forEach(field => {
            const savedValue = saved.values[field.id];
            if (typeof savedValue === 'string') {
                values[field.id] = sanitizeValue(savedValue);
            }
        });
    }

    function persist() {
        storage.write({ date, theme, values });
    }

    function init() {
        applyDefaults();
        restore();
    }

    function snapshot() {
        return { date, theme, values: { ...values } };
    }

    function setValue(id, raw) {
        values[id] = sanitizeValue(raw);
        persist();
        return values[id];
    }

    function setDate(iso) {
        if (!isValidIsoDate(iso)) return false;
        date = iso;
        persist();
        return true;
    }

    function setTheme(name) {
        if (!isValidTheme(name)) return false;
        theme = name;
        persist();
        return true;
    }

    function reset() {
        applyDefaults();
        persist();
    }

    ServiceProgram.programState = Object.freeze({ init, snapshot, setValue, setDate, setTheme, reset });
})();
// Created by: @xorodev (CipherCoreDev). 2026