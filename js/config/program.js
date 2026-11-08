(() => {
    'use strict';

    const icon = paths => `<svg class="icon w-4 h-4" viewBox="0 0 24 24">${paths}</svg>`;

    const FIELDS = [
        {
            id: 'host',
            label: 'Dirige',
            icon: icon('<circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"></path>')
        },
        {
            id: 'welcome',
            label: 'Bienvenida',
            icon: icon('<circle cx="12" cy="12" r="9"></circle><path d="M8.5 13.5c1 1.2 2.1 1.8 3.5 1.8s2.5-.6 3.5-1.8"></path><circle cx="9" cy="10" r="1" class="icon-fill"></circle><circle cx="15" cy="10" r="1" class="icon-fill"></circle>')
        },
        {
            id: 'reading',
            label: 'Lectura',
            icon: icon('<path d="M4 5.5c0-1 .8-1.5 2-1.5h5.5v15H6c-1.2 0-2 .5-2 1.5z"></path><path d="M20 5.5c0-1-.8-1.5-2-1.5h-5.5v15H18c1.2 0 2 .5 2 1.5z"></path>')
        },
        {
            id: 'jubileeSongs',
            label: 'Coros de júbilo',
            icon: icon('<path d="M9 18V5l10-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="16" cy="16" r="3"></circle>')
        },
        {
            id: 'teaching',
            label: 'Enseñanza',
            icon: icon('<rect x="3" y="4" width="18" height="12" rx="1"></rect><path d="M8 20h8M12 16v4"></path>')
        },
        {
            id: 'offeringMotivation',
            label: 'Motivación de ofrenda',
            icon: icon('<path d="M12 21s-7-4.4-9.5-8.5C1 9 2 5 6 5c2 0 3.5 1.2 6 4.5C14.5 6.2 16 5 18 5c4 0 5 4 3.5 7.5C19 16.6 12 21 12 21z" class="icon-fill"></path>')
        },
        {
            id: 'offeringSongs',
            label: 'Coros para la ofrenda',
            icon: icon('<rect x="9" y="2" width="6" height="11" rx="3"></rect><path d="M5 10a7 7 0 0 0 14 0"></path><path d="M12 17v4M8 21h8"></path>')
        },
        {
            id: 'offeringCollection',
            label: 'Recolecta de ofrenda',
            icon: icon('<rect x="3" y="8" width="18" height="13" rx="1"></rect><rect x="3" y="4" width="18" height="4" rx="1"></rect><path d="M12 4v17"></path><path d="M12 4C10.5 1.5 7 1.5 7 4s2.5 0 5 0zM12 4c1.5-2.5 5-2.5 5 0s-2.5 0-5 0z"></path>')
        }
    ];

    ServiceProgram.programConfig = Object.freeze({
        STORAGE_KEY: 'service-program:v2',
        PLACEHOLDER_TEXT: 'Ingrese el nombre aquí...',
        MIN_VALUE_LENGTH: 3,
        MAX_VALUE_LENGTH: 30,
        FOOTER: Object.freeze({
            quote: 'Gracias por su participación en los privilegios del Señor.',
            blessing: '¡Él les use con poder! 🙏'
        }),
        FIELDS: Object.freeze(
            FIELDS.map(field => Object.freeze(field)).sort((a, b) => a.label.localeCompare(b.label, 'es'))
        )
    });
})();
// Created by: @xorodev (CipherCoreDev). 2026