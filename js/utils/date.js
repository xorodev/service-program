(() => {
    'use strict';

    const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const MONTH_ABBREVIATIONS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
    const SATURDAY = 6;
    const DAYS_PER_WEEK = 7;

    function parseIsoDate(iso) {
        const match = ISO_DATE_PATTERN.exec(iso);
        if (!match) return null;
        const [year, month, day] = match.slice(1).map(Number);
        const date = new Date(2000, 0, 1);
        date.setFullYear(year, month - 1, day);
        const isRealDate = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
        return isRealDate ? date : null;
    }

    function requireDate(iso) {
        const date = parseIsoDate(iso);
        if (!date) throw new Error(`Invalid ISO date: ${iso}`);
        return date;
    }

    function isValidIsoDate(iso) {
        return parseIsoDate(iso) !== null;
    }

    function toIsoDate(date) {
        const year = String(date.getFullYear()).padStart(4, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getNextSaturdayIso(now = new Date()) {
        const daysUntilSaturday = (SATURDAY - now.getDay() + DAYS_PER_WEEK) % DAYS_PER_WEEK;
        return toIsoDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSaturday));
    }

    function isPastDate(iso, now = new Date()) {
        return iso < toIsoDate(now);
    }

    function formatLongDate(iso) {
        const date = requireDate(iso);
        return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
    }

    function buildFileLabel(iso) {
        const date = requireDate(iso);
        return `Programa_${date.getDate()}_${MONTH_ABBREVIATIONS[date.getMonth()]}`;
    }

    ServiceProgram.dateUtils = Object.freeze({ isValidIsoDate, isPastDate, getNextSaturdayIso, formatLongDate, buildFileLabel });
})();
// Created by: @xorodev (CipherCoreDev). 2026