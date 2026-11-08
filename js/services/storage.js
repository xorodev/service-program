(() => {
    'use strict';

    const { STORAGE_KEY } = ServiceProgram.programConfig;

    function read() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            return raw === null ? null : JSON.parse(raw);
        } catch (error) {
            console.warn('Stored program could not be read:', error);
            return null;
        }
    }

    function write(data) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn('Program could not be stored:', error);
        }
    }

    ServiceProgram.storage = Object.freeze({ read, write });
})();
// Created by: @xorodev (CipherCoreDev). 2026