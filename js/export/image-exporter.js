(() => {
    'use strict';

    const { canvasRenderer } = ServiceProgram;

    const EXPORT_WIDTH_PX = 448;
    const FONT_LOAD_TIMEOUT_MS = 6000;
    const FONT_READY_TIMEOUT_MS = 3000;
    const BLOB_FALLBACK_TIMEOUT_MS = 5000;
    const URL_REVOKE_DELAY_MS = 10000;
    const PNG_MIME = 'image/png';
    const ShareOutcome = Object.freeze({
        SHARED: 'shared',
        CANCELLED: 'cancelled',
        EXPIRED: 'expired',
        UNAVAILABLE: 'unavailable'
    });
    const ShareResult = Object.freeze({
        SHARED: 'shared',
        CANCELLED: 'cancelled',
        DOWNLOADED: 'downloaded',
        RETRY: 'retry'
    });

    const withTimeout = (promise, ms) => Promise.race([promise, new Promise(resolve => setTimeout(resolve, ms))]);
    const nextFrames = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    let cachedImage = null;

    async function loadFonts(container) {
        if (!document.fonts) return;
        const jobs = [];
        container.querySelectorAll('*').forEach(element => {
            const hasText = [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
            if (!hasText) return;
            const style = getComputedStyle(element);
            jobs.push(
                document.fonts
                    .load(`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`, element.textContent)
                    .catch(() => undefined)
            );
        });
        await withTimeout(Promise.all(jobs), FONT_LOAD_TIMEOUT_MS);
        await withTimeout(document.fonts.ready, FONT_READY_TIMEOUT_MS);
    }

    async function renderWithRetry(clone) {
        try {
            return await canvasRenderer.render(clone);
        } catch (firstError) {
            console.warn('Retrying card export:', firstError);
            await nextFrames();
            return canvasRenderer.render(clone);
        }
    }

    function dataUrlToBlob(canvas) {
        try {
            const binary = atob(canvas.toDataURL(PNG_MIME).split(',')[1]);
            const bytes = new Uint8Array(binary.length);
            for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
            return new Blob([bytes], { type: PNG_MIME });
        } catch (error) {
            console.warn('Data URL conversion failed:', error);
            return null;
        }
    }

    function canvasToBlob(canvas) {
        return new Promise(resolve => {
            let settled = false;
            const settle = blob => {
                if (settled) return;
                settled = true;
                resolve(blob);
            };
            try {
                canvas.toBlob(settle, PNG_MIME);
            } catch (error) {
                console.warn('toBlob failed:', error);
                settle(dataUrlToBlob(canvas));
            }
            setTimeout(() => {
                if (!settled) settle(dataUrlToBlob(canvas));
            }, BLOB_FALLBACK_TIMEOUT_MS);
        });
    }

    function isIOS() {
        return /iP(hone|ad|od)/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    async function shareFile(blob, fileName) {
        if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function' || typeof File !== 'function') {
            return ShareOutcome.UNAVAILABLE;
        }
        try {
            const file = new File([blob], fileName, { type: PNG_MIME });
            if (!navigator.canShare({ files: [file] })) return ShareOutcome.UNAVAILABLE;
            await navigator.share({ files: [file] });
            return ShareOutcome.SHARED;
        } catch (error) {
            const name = error && error.name;
            if (name === 'AbortError') return ShareOutcome.CANCELLED;
            if (name === 'NotAllowedError') return ShareOutcome.EXPIRED;
            return ShareOutcome.UNAVAILABLE;
        }
    }

    function triggerDownload(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), URL_REVOKE_DELAY_MS);
    }

    async function deliver(blob, fileName) {
        const outcome = isIOS() ? await shareFile(blob, fileName) : ShareOutcome.UNAVAILABLE;
        if (outcome === ShareOutcome.SHARED) return true;
        if (outcome === ShareOutcome.CANCELLED) return false;
        triggerDownload(blob, fileName);
        return true;
    }

    async function renderBlob(card) {
        const clone = card.cloneNode(true);
        clone.style.cssText = `position:fixed;left:-10000px;top:0;width:${EXPORT_WIDTH_PX}px;max-width:none;margin:0;box-sizing:border-box;pointer-events:none;`;
        clone.setAttribute('aria-hidden', 'true');
        document.body.appendChild(clone);
        try {
            await loadFonts(clone);
            await nextFrames();
            const canvas = await renderWithRetry(clone);
            const blob = await canvasToBlob(canvas);
            if (!blob) throw new Error('PNG generation failed');
            return blob;
        } finally {
            clone.remove();
        }
    }

    async function prepareImage(card, cacheKey) {
        if (cachedImage && cachedImage.key === cacheKey) return { blob: cachedImage.blob, cached: true };
        const blob = await renderBlob(card);
        cachedImage = { key: cacheKey, blob };
        return { blob, cached: false };
    }

    async function exportCard(card, fileName, cacheKey) {
        const { blob } = await prepareImage(card, cacheKey);
        return deliver(blob, fileName);
    }

    async function shareCard(card, fileName, cacheKey) {
        const { blob, cached } = await prepareImage(card, cacheKey);
        const outcome = await shareFile(blob, fileName);
        if (outcome === ShareOutcome.SHARED) return ShareResult.SHARED;
        if (outcome === ShareOutcome.CANCELLED) return ShareResult.CANCELLED;
        if (outcome === ShareOutcome.EXPIRED && !cached) return ShareResult.RETRY;
        triggerDownload(blob, fileName);
        return ShareResult.DOWNLOADED;
    }

    ServiceProgram.imageExporter = Object.freeze({ ShareResult, exportCard, shareCard });
})();
// Created by: @xorodev (CipherCoreDev). 2026