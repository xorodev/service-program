(() => {
    'use strict';

    const {
        programState,
        programView,
        themeManager,
        editor,
        toast,
        clipboard,
        shareText,
        imageExporter,
        dateUtils
    } = ServiceProgram;

    const card = document.getElementById('program-card');
    const exportButtons = [document.getElementById('btn-download'), document.getElementById('btn-share')];
    const { ShareResult } = imageExporter;
    const SHARE_MESSAGES = Object.freeze({
        [ShareResult.SHARED]: '¡La imagen se compartió correctamente!',
        [ShareResult.CANCELLED]: '¡Se canceló el envío de la imagen!',
        [ShareResult.DOWNLOADED]: 'Su dispositivo no permite compartir directamente. ¡La imagen se guardó! Envíela manualmente en WhatsApp.',
        [ShareResult.RETRY]: '¡La imagen está lista! Presione en: "Compartir", nuevamente para enviarla.'
    });

    let exporting = false;

    function handleValueChange(id, raw) {
        programView.renderValue(id, programState.setValue(id, raw));
    }

    function handleDateChange(iso) {
        if (programState.setDate(iso)) programView.renderDate(iso);
    }

    function handleReset() {
        if (!window.confirm('¿Desea restablecer todos los valores del programa?')) return;
        programState.reset();
        const snapshot = programState.snapshot();
        programView.render(snapshot);
        editor.sync(snapshot);
        toast.show('¡Los valores se restablecieron correctamente!');
    }

    async function handleCopy() {
        const copied = await clipboard.copyText(shareText.build(programState.snapshot()));
        toast.show(copied ? '¡El texto se copió al portapapeles!' : 'No fue posible copiar el texto. Inténtelo nuevamente...');
    }

    function setExporting(active) {
        exporting = active;
        exportButtons.forEach(button => {
            button.disabled = active;
        });
    }

    function buildExportRequest() {
        const snapshot = programState.snapshot();
        return {
            fileName: `${dateUtils.buildFileLabel(snapshot.date)}.png`,
            cacheKey: JSON.stringify(snapshot)
        };
    }

    async function runExport(startMessage, task) {
        if (exporting) return;
        setExporting(true);
        toast.show(startMessage);
        try {
            toast.show(await task());
        } catch (error) {
            console.error('Card export failed:', error);
            toast.show('No fue posible generar la imagen. Inténtelo nuevamente o tome una captura de pantalla...');
        } finally {
            setExporting(false);
        }
    }

    function handleDownload() {
        return runExport('Generando la imagen, por favor espere...', async () => {
            const { fileName, cacheKey } = buildExportRequest();
            const delivered = await imageExporter.exportCard(card, fileName, cacheKey);
            return delivered ? '¡La imagen se guardó correctamente!' : 'Se canceló el guardado de la imagen...';
        });
    }

    function handleShare() {
        return runExport('Preparando la imagen para compartir, por favor espere...', async () => {
            const { fileName, cacheKey } = buildExportRequest();
            return SHARE_MESSAGES[await imageExporter.shareCard(card, fileName, cacheKey)];
        });
    }

    function handleThemeChange(name) {
        if (themeManager.apply(name)) programState.setTheme(name);
    }

    function bindControls() {
        document.getElementById('theme-switcher').addEventListener('click', event => {
            const button = event.target.closest('[data-theme]');
            if (button) handleThemeChange(button.dataset.theme);
        });
        document.getElementById('btn-copy').addEventListener('click', handleCopy);
        document.getElementById('btn-download').addEventListener('click', handleDownload);
        document.getElementById('btn-share').addEventListener('click', handleShare);
    }

    programState.init();
    programView.init(programState.snapshot());
    themeManager.apply(programState.snapshot().theme);
    editor.init({
        getSnapshot: programState.snapshot,
        onValueChange: handleValueChange,
        onDateChange: handleDateChange,
        onReset: handleReset
    });
    bindControls();
})();
// Created by: @xorodev (CipherCoreDev). 2026