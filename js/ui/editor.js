(() => {
    'use strict';

    const { FIELDS, MIN_VALUE_LENGTH, MAX_VALUE_LENGTH, PLACEHOLDER_TEXT } = ServiceProgram.programConfig;
    const { sanitizeValue, valueLength } = ServiceProgram.textUtils;

    const LABEL_CLASS = 'block mb-1 text-xs font-semibold text-slate-300';
    const INPUT_CLASS = 'w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all';
    const HINT_CLASS = 'mt-1 text-[11px] text-slate-400';
    const HINT_ERROR_CLASS = 'mt-1 text-[11px] text-red-400';

    const dateInput = document.getElementById('date-input');
    const fieldsContainer = document.getElementById('editor-fields');
    const resetButton = document.getElementById('btn-reset');
    const controls = new Map();

    function renderHint({ input, hint }) {
        const length = valueLength(sanitizeValue(input.value));
        const tooShort = length < MIN_VALUE_LENGTH;
        const invalid = tooShort && length > 0;
        hint.textContent = tooShort
            ? `Mínimo: ${MIN_VALUE_LENGTH} caracteres (${length}/${MAX_VALUE_LENGTH}).`
            : `${length}/${MAX_VALUE_LENGTH}`;
        hint.className = invalid ? HINT_ERROR_CLASS : HINT_CLASS;
        input.setAttribute('aria-invalid', String(invalid));
        input.classList.toggle('border-red-500', invalid);
        input.classList.toggle('border-slate-700', !invalid);
    }

    function createField(field, onValueChange) {
        const inputId = `field-${field.id}`;
        const hintId = `hint-${field.id}`;

        const wrapper = document.createElement('div');

        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.className = LABEL_CLASS;
        label.textContent = field.label;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = inputId;
        input.className = INPUT_CLASS;
        input.maxLength = MAX_VALUE_LENGTH;
        input.placeholder = PLACEHOLDER_TEXT;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.setAttribute('aria-describedby', hintId);

        const hint = document.createElement('p');
        hint.id = hintId;

        const control = { input, hint };
        input.addEventListener('input', () => {
            renderHint(control);
            onValueChange(field.id, input.value);
        });

        wrapper.append(label, input, hint);
        controls.set(field.id, control);
        renderHint(control);
        return wrapper;
    }

    function sync(snapshot) {
        dateInput.value = snapshot.date;
        FIELDS.forEach(field => {
            const control = controls.get(field.id);
            control.input.value = snapshot.values[field.id];
            renderHint(control);
        });
    }

    function init({ getSnapshot, onValueChange, onDateChange, onReset }) {
        fieldsContainer.replaceChildren(...FIELDS.map(field => createField(field, onValueChange)));
        dateInput.addEventListener('input', () => {
            if (dateInput.value) onDateChange(dateInput.value);
        });
        dateInput.addEventListener('blur', () => {
            dateInput.value = getSnapshot().date;
        });
        resetButton.addEventListener('click', onReset);
        sync(getSnapshot());
    }

    ServiceProgram.editor = Object.freeze({ init, sync });
})();
// Created by: @xorodev (CipherCoreDev). 2026