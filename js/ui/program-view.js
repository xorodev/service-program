(() => {
    'use strict';

    const { FIELDS, FOOTER } = ServiceProgram.programConfig;
    const { displayValue } = ServiceProgram.textUtils;
    const { formatLongDate } = ServiceProgram.dateUtils;

    const valueElements = new Map();

    function createRow(field) {
        const row = document.createElement('div');
        row.className = 'theme-item';

        const labelGroup = document.createElement('div');
        labelGroup.className = 'flex items-center gap-2.5 shrink-0';

        const iconBox = document.createElement('div');
        iconBox.className = 'theme-icon';
        iconBox.innerHTML = field.icon;

        const label = document.createElement('span');
        label.className = 'theme-label';
        label.textContent = `${field.label}:`;

        const value = document.createElement('span');
        value.className = 'theme-val';

        labelGroup.append(iconBox, label);
        row.append(labelGroup, value);
        valueElements.set(field.id, value);
        return row;
    }

    function renderValue(id, value) {
        valueElements.get(id).textContent = displayValue(value);
    }

    function renderDate(iso) {
        document.getElementById('program-date-text').textContent = `${formatLongDate(iso)}.`;
    }

    function render(snapshot) {
        renderDate(snapshot.date);
        FIELDS.forEach(field => renderValue(field.id, snapshot.values[field.id]));
    }

    function init(snapshot) {
        document.getElementById('participations').replaceChildren(...FIELDS.map(createRow));
        document.getElementById('theme-quote').textContent = `"${FOOTER.quote}"`;
        document.getElementById('theme-blessing').textContent = FOOTER.blessing;
        render(snapshot);
    }

    ServiceProgram.programView = Object.freeze({ init, render, renderValue, renderDate });
})();
// Created by: @xorodev (CipherCoreDev). 2026