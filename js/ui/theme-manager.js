(() => {
    'use strict';

    const { THEMES } = ServiceProgram.themeConfig;

    const SINGLE_TARGETS = [
        ['program-card', 'card'],
        ['theme-title', 'title'],
        ['theme-date', 'date'],
        ['theme-date-icon', 'dateIcon'],
        ['theme-footer', 'footer'],
        ['theme-quote', 'quote'],
        ['theme-blessing', 'blessing'],
        ['theme-icon-wrap', 'iconWrap'],
        ['theme-divider-l', 'divL'],
        ['theme-divider-r', 'divR'],
        ['theme-dove', 'dove']
    ];

    const GROUP_TARGETS = [
        ['.theme-item', 'item'],
        ['.theme-icon', 'icon'],
        ['.theme-label', 'label'],
        ['.theme-val', 'val']
    ];

    let appliedCornerClass = null;

    function applyCorners(cornerClass) {
        document.querySelectorAll('.corner').forEach(corner => {
            if (appliedCornerClass) corner.classList.remove(appliedCornerClass);
            corner.classList.add(cornerClass);
        });
        appliedCornerClass = cornerClass;
    }

    function apply(name) {
        if (!Object.prototype.hasOwnProperty.call(THEMES, name)) return false;
        const theme = THEMES[name];
        SINGLE_TARGETS.forEach(([id, key]) => {
            document.getElementById(id).setAttribute('class', theme[key]);
        });
        GROUP_TARGETS.forEach(([selector, key]) => {
            document.querySelectorAll(selector).forEach(element => {
                element.className = theme[key];
            });
        });
        applyCorners(theme.corner);
        document.documentElement.style.setProperty('--selection-bg', theme.selectionBg);
        document.documentElement.style.setProperty('--selection-text', theme.selectionText);
        return true;
    }

    ServiceProgram.themeManager = Object.freeze({ apply });
})();
// Created by: @xorodev (CipherCoreDev). 2026