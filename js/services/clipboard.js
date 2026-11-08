(() => {
    'use strict';

    function copyWithSelection(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.cssText = 'position:fixed;left:-10000px;top:0;opacity:0;';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, text.length);
        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (error) {
            console.warn('Selection copy failed:', error);
        }
        textarea.remove();
        return copied;
    }

    async function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (error) {
                console.warn('Clipboard API failed:', error);
            }
        }
        return copyWithSelection(text);
    }

    ServiceProgram.clipboard = Object.freeze({ copyText });
})();
// Created by: @xorodev (CipherCoreDev). 2026