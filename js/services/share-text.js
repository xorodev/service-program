(() => {
    'use strict';

    const { FIELDS, FOOTER } = ServiceProgram.programConfig;
    const { displayValue } = ServiceProgram.textUtils;
    const { formatLongDate } = ServiceProgram.dateUtils;

    function build(snapshot) {
        const lines = FIELDS.map(field => `• ${field.label}: ${displayValue(snapshot.values[field.id])}`);
        return [
            `Programa: ${formatLongDate(snapshot.date)}`,
            ...lines,
            '',
            FOOTER.quote,
            FOOTER.blessing
        ].join('\n');
    }

    ServiceProgram.shareText = Object.freeze({ build });
})();
// Created by: @xorodev (CipherCoreDev). 2026