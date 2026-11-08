(() => {
    'use strict';

    const THEMES = {
        classic: {
            dateIcon: 'icon w-3.5 h-3.5 mr-1.5 shrink-0 text-gold-400',
            selectionBg: '#d4af37',
            selectionText: '#0f172a',
            card: 'bg-slate-950 rounded-3xl p-6 border-2 border-gold-500/50 relative shadow-2xl',
            corner: 'text-gold-500/70',
            title: 'font-cinzel text-2xl font-black tracking-widest text-gold-400 uppercase text-center',
            date: 'font-medium text-slate-100 text-xs tracking-wide bg-slate-900 flex items-center justify-center px-3.5 rounded-full border border-gold-500/40',
            item: 'theme-item flex items-center justify-between gap-2 px-2.5 rounded-xl bg-slate-900 border border-slate-800',
            icon: 'theme-icon w-7 h-7 rounded-lg bg-gold-500/15 text-gold-400 flex items-center justify-center shrink-0',
            label: 'theme-label text-xs font-semibold text-slate-300',
            val: 'theme-val min-w-0 break-words font-bold text-white text-[13px] text-right',
            footer: 'text-center pt-3 border-t border-gold-500/40',
            quote: 'text-xs italic font-serif text-slate-300 mb-1.5',
            blessing: 'text-xs font-bold text-gold-400 tracking-wide uppercase',
            iconWrap: 'flex items-center justify-center w-11 h-11 rounded-full bg-gold-500/15 border border-gold-500/50 text-gold-400 mb-2',
            divL: 'h-[1px] w-14 bg-gradient-to-r from-transparent to-gold-500/70',
            divR: 'h-[1px] w-14 bg-gradient-to-l from-transparent to-gold-500/70',
            dove: 'text-gold-400 shrink-0 flex items-center justify-center'
        },
        royal: {
            dateIcon: 'icon w-3.5 h-3.5 mr-1.5 shrink-0 text-blue-200',
            selectionBg: '#60a5fa',
            selectionText: '#172554',
            card: 'bg-blue-950 rounded-3xl p-6 border-2 border-blue-400/50 relative shadow-2xl',
            corner: 'text-blue-400/70',
            title: 'font-cinzel text-2xl font-black tracking-widest text-blue-200 uppercase text-center',
            date: 'font-medium text-blue-50 text-xs tracking-wide bg-blue-900 flex items-center justify-center px-3.5 rounded-full border border-blue-400/40',
            item: 'theme-item flex items-center justify-between gap-2 px-2.5 rounded-xl bg-blue-900 border border-blue-800',
            icon: 'theme-icon w-7 h-7 rounded-lg bg-blue-400/15 text-blue-200 flex items-center justify-center shrink-0',
            label: 'theme-label text-xs font-semibold text-blue-200',
            val: 'theme-val min-w-0 break-words font-bold text-white text-[13px] text-right',
            footer: 'text-center pt-3 border-t border-blue-400/40',
            quote: 'text-xs italic font-serif text-blue-100 mb-1.5',
            blessing: 'text-xs font-bold text-blue-200 tracking-wide uppercase',
            iconWrap: 'flex items-center justify-center w-11 h-11 rounded-full bg-blue-400/15 border border-blue-400/50 text-blue-200 mb-2',
            divL: 'h-[1px] w-14 bg-gradient-to-r from-transparent to-blue-400/70',
            divR: 'h-[1px] w-14 bg-gradient-to-l from-transparent to-blue-400/70',
            dove: 'text-blue-200 shrink-0 flex items-center justify-center'
        },
        light: {
            dateIcon: 'icon w-3.5 h-3.5 mr-1.5 shrink-0 text-amber-800',
            selectionBg: '#fcd34d',
            selectionText: '#451a03',
            card: 'bg-amber-50 rounded-3xl p-6 border-2 border-amber-300 relative shadow-2xl',
            corner: 'text-amber-400',
            title: 'font-cinzel text-2xl font-black tracking-widest text-amber-900 uppercase text-center',
            date: 'font-medium text-amber-900 text-xs tracking-wide bg-amber-100 flex items-center justify-center px-3.5 rounded-full border border-amber-300',
            item: 'theme-item flex items-center justify-between gap-2 px-2.5 rounded-xl bg-white border border-amber-200 shadow-sm',
            icon: 'theme-icon w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0',
            label: 'theme-label text-xs font-semibold text-amber-900',
            val: 'theme-val min-w-0 break-words font-bold text-slate-900 text-[13px] text-right',
            footer: 'text-center pt-3 border-t border-amber-300',
            quote: 'text-xs italic font-serif text-amber-900 mb-1.5',
            blessing: 'text-xs font-bold text-amber-800 tracking-wide uppercase',
            iconWrap: 'flex items-center justify-center w-11 h-11 rounded-full bg-amber-100 border border-amber-300 text-amber-800 mb-2',
            divL: 'h-[1px] w-14 bg-gradient-to-r from-transparent to-amber-400',
            divR: 'h-[1px] w-14 bg-gradient-to-l from-transparent to-amber-400',
            dove: 'text-amber-700 shrink-0 flex items-center justify-center'
        }
    };

    ServiceProgram.themeConfig = Object.freeze({
        DEFAULT_THEME: 'classic',
        THEMES: Object.freeze(THEMES)
    });
})();
// Created by: @xorodev (CipherCoreDev). 2026