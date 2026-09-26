<?php
/**
 * WDH inline SVG icon library.
 * Usage: <?= icon('globe') ?>  or  <?= icon('shield', 'w-5') ?>
 * All icons are 24x24 viewBox, stroke=currentColor, so they inherit the
 * color of their wrapping element (see .ficon/.sicon/.trust-icon CSS).
 */
function icon($name, $class = '') {
    $common = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    $body = '';
    switch ($name) {
        case 'flag-bd':
            $body = '<rect x="4" y="3" width="16" height="12" rx="1.5" fill="#046a38" stroke="none"/>
                <circle cx="11" cy="9" r="3.6" fill="#f42a41" stroke="none"/>';
            return "<svg viewBox=\"0 0 24 18\" class=\"icon $class\" aria-hidden=\"true\">$body</svg>";
        case 'flag-us':
            $body = '<rect x="4" y="3" width="16" height="12" rx="1.5" fill="#eef3fb" stroke="none"/>
                <rect x="4" y="3" width="16" height="1.6" fill="#c53030" stroke="none"/>
                <rect x="4" y="6.2" width="16" height="1.6" fill="#c53030" stroke="none"/>
                <rect x="4" y="9.4" width="16" height="1.6" fill="#c53030" stroke="none"/>
                <rect x="4" y="12.6" width="16" height="1.6" fill="#c53030" stroke="none"/>
                <rect x="4" y="3" width="7" height="6.6" fill="#1e3a8a" stroke="none"/>';
            return "<svg viewBox=\"0 0 24 18\" class=\"icon $class\" aria-hidden=\"true\">$body</svg>";
        case 'building':
            $body = '<rect x="4" y="3" width="16" height="18" rx="1"/>
                <line x1="8" y1="7" x2="8" y2="7.01"/><line x1="12" y1="7" x2="12" y2="7.01"/><line x1="16" y1="7" x2="16" y2="7.01"/>
                <line x1="8" y1="11" x2="8" y2="11.01"/><line x1="12" y1="11" x2="12" y2="11.01"/><line x1="16" y1="11" x2="16" y2="11.01"/>
                <line x1="8" y1="15" x2="8" y2="15.01"/><line x1="12" y1="15" x2="12" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/>
                <path d="M9 21v-3a3 3 0 016 0v3"/>';
            break;
        case 'mail':
            $body = '<rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3,7 12,13 21,7"/>';
            break;
        case 'mail-shield':
            $body = '<rect x="3" y="5" width="14" height="12" rx="2"/><polyline points="3,7 10,11.5 17,7"/>
                <path d="M16.2 13.2l2.8-1 2.8 1v2.4c0 2-1.2 3.2-2.8 3.7-1.6-.5-2.8-1.7-2.8-3.7v-2.4z" fill="currentColor" fill-opacity=".14"/>';
            break;
        case 'shield':
            $body = '<path d="M12 3l7 3v5.5c0 5-3.2 8-7 9.5-3.8-1.5-7-4.5-7-9.5V6l7-3z"/>';
            break;
        case 'shield-check':
            $body = '<path d="M12 3l7 3v5.5c0 5-3.2 8-7 9.5-3.8-1.5-7-4.5-7-9.5V6l7-3z"/><polyline points="9,12 11,14 15,10"/>';
            break;
        case 'headset':
            $body = '<path d="M4 14v-2a8 8 0 0116 0v2"/>
                <rect x="2.5" y="13.5" width="4.5" height="6.5" rx="1.6"/>
                <rect x="17" y="13.5" width="4.5" height="6.5" rx="1.6"/>
                <path d="M19.2 20c0 1.4-1.4 2.2-3.7 2.2h-1"/>';
            break;
        case 'globe':
            $body = '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/>
                <path d="M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z"/>';
            break;
        case 'server':
            $body = '<rect x="3" y="4" width="18" height="6.5" rx="1.6"/><rect x="3" y="13.5" width="18" height="6.5" rx="1.6"/>
                <circle cx="7" cy="7.25" r=".9" fill="currentColor" stroke="none"/><circle cx="7" cy="16.75" r=".9" fill="currentColor" stroke="none"/>
                <line x1="11" y1="7.25" x2="17" y2="7.25"/><line x1="11" y1="16.75" x2="17" y2="16.75"/>';
            break;
        case 'monitor':
            $body = '<rect x="3" y="4" width="18" height="12.5" rx="1.6"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="16.5" x2="12" y2="20"/>';
            break;
        case 'lock':
            $body = '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>';
            break;
        case 'bell':
            $body = '<path d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z"/><path d="M10 21h4"/>';
            break;
        case 'menu':
            $body = '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
            break;
        case 'grid':
            $body = '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/>
                <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/>';
            break;
        case 'briefcase':
            $body = '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5.5a2 2 0 012-2h4a2 2 0 012 2V7"/><line x1="3" y1="13" x2="21" y2="13"/>';
            break;
        case 'check-circle':
            $body = '<circle cx="12" cy="12" r="9"/><polyline points="8,12.5 11,15.5 16,9"/>';
            break;
        case 'x-circle':
            $body = '<circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>';
            break;
        case 'tag':
            $body = '<path d="M12.5 3h5.5a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-.44 1.06l-8 8a1.5 1.5 0 0 1-2.12 0l-6-6a1.5 1.5 0 0 1 0-2.12l8-8A1.5 1.5 0 0 1 12.5 3Z"/><circle cx="16.5" cy="7.5" r="1.25"/>';
            break;
        case 'gift':
            $body = '<rect x="3.5" y="9" width="17" height="4" rx="1"/><rect x="5" y="13" width="14" height="8" rx="1"/><line x1="12" y1="9" x2="12" y2="21"/><path d="M12 9c-1.2-3.2-3-4.5-4.4-4.5A2.1 2.1 0 0 0 5.5 6.6C5.5 8 7.5 9 12 9Z"/><path d="M12 9c1.2-3.2 3-4.5 4.4-4.5a2.1 2.1 0 0 1 2.1 2.1c0 1.4-2 2.4-6.5 2.4Z"/>';
            break;
        case 'user':
            $body = '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/>';
            break;
        case 'alert-circle':
            $body = '<circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12.5"/><line x1="12" y1="15.7" x2="12" y2="15.71"/>';
            break;
        case 'check':
            $body = '<polyline points="4,12.5 9,17.5 20,6"/>';
            break;
        case 'chevron-down':
            $body = '<polyline points="6,9 12,15 18,9"/>';
            break;
        case 'cart':
            $body = '<circle cx="9" cy="20" r="1.3" fill="currentColor" stroke="none"/><circle cx="18" cy="20" r="1.3" fill="currentColor" stroke="none"/>
                <path d="M3 4h2l2.2 12a2 2 0 002 1.7h7.3a2 2 0 002-1.7L20 8H6.2"/>';
            break;
        case 'search':
            $body = '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.6" y2="16.6"/>';
            break;
        case 'sun':
            $body = '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4.2"/><line x1="12" y1="19.8" x2="12" y2="22"/>
                <line x1="2" y1="12" x2="4.2" y2="12"/><line x1="19.8" y1="12" x2="22" y2="12"/>
                <line x1="4.6" y1="4.6" x2="6.1" y2="6.1"/><line x1="17.9" y1="17.9" x2="19.4" y2="19.4"/>
                <line x1="4.6" y1="19.4" x2="6.1" y2="17.9"/><line x1="17.9" y1="6.1" x2="19.4" y2="4.6"/>';
            break;
        case 'moon':
            $body = '<path d="M21 12.8A9 9 0 1111.2 3 7.2 7.2 0 0021 12.8z"/>';
            break;
        case 'mail-line':
            $body = '<rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3,7 12,13 21,7"/>';
            break;
        case 'phone':
            $body = '<path d="M6.6 10.8a15.6 15.6 0 006.6 6.6l2.2-2.2a1.2 1.2 0 011.3-.3c1 .35 2.1.55 3.3.55.7 0 1.2.5 1.2 1.2V20a1.2 1.2 0 01-1.2 1.2C11.9 21.2 2.8 12.1 2.8 4.2A1.2 1.2 0 014 3h3.5c.7 0 1.2.5 1.2 1.2 0 1.2.2 2.3.55 3.3.1.45 0 .95-.3 1.3l-2.35 2z"/>';
            break;
        case 'arrow-right':
            $body = '<line x1="4" y1="12" x2="20" y2="12"/><polyline points="13,5 20,12 13,19"/>';
            break;
        case 'quote':
            $body = '<path d="M9.5 8.5C6.5 9.5 5 11.7 5 14.3c0 2 1.4 3.4 3.2 3.4 1.7 0 3-1.3 3-3 0-1.6-1.1-2.8-2.6-3 .3-1.3 1.3-2.4 2.6-2.9zM18 8.5c-3 1-4.5 3.2-4.5 5.8 0 2 1.4 3.4 3.2 3.4 1.7 0 3-1.3 3-3 0-1.6-1.1-2.8-2.6-3 .3-1.3 1.3-2.4 2.6-2.9z" fill="currentColor" stroke="none"/>';
            return "<svg viewBox=\"0 0 24 24\" class=\"icon $class\" aria-hidden=\"true\">$body</svg>";
        default:
            $body = '<circle cx="12" cy="12" r="9"/>';
    }
    return "<svg viewBox=\"0 0 24 24\" $common class=\"icon $class\" aria-hidden=\"true\">$body</svg>";
}
