(() => {
    'use strict';

    const SCALE = 3;
    const ICON_LOAD_TIMEOUT_MS = 8000;
    const SHADOW_PATTERN = /(rgba?\([^)]*\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/g;
    const GRADIENT_STOP_PATTERN = /rgba?\([^)]*\)|color\([^)]*\)|transparent/g;

    const colorProbe = document.createElement('canvas').getContext('2d');
    const ascentCache = new Map();

    let ctx = null;
    let originX = 0;
    let originY = 0;
    let root = null;

    const toPx = value => parseFloat(value) || 0;
    const toRgba = color => `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;

    function parseColor(color) {
        colorProbe.fillStyle = '#000000';
        colorProbe.fillStyle = color;
        const normalized = colorProbe.fillStyle;
        if (normalized[0] === '#') {
            return [
                parseInt(normalized.slice(1, 3), 16),
                parseInt(normalized.slice(3, 5), 16),
                parseInt(normalized.slice(5, 7), 16),
                1
            ];
        }
        const parts = normalized.match(/[\d.]+/g).map(Number);
        return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
    }

    function getRadii(style, width, height) {
        const radii = [
            style.borderTopLeftRadius,
            style.borderTopRightRadius,
            style.borderBottomRightRadius,
            style.borderBottomLeftRadius
        ].map(toPx);
        const factor = Math.min(
            1,
            radii[0] + radii[1] > 0 ? width / (radii[0] + radii[1]) : 1,
            radii[3] + radii[2] > 0 ? width / (radii[3] + radii[2]) : 1,
            radii[0] + radii[3] > 0 ? height / (radii[0] + radii[3]) : 1,
            radii[1] + radii[2] > 0 ? height / (radii[1] + radii[2]) : 1
        );
        return radii.map(radius => radius * factor);
    }

    function roundedRectPath(x, y, width, height, radii) {
        const [topLeft, topRight, bottomRight, bottomLeft] = radii;
        ctx.moveTo(x + topLeft, y);
        ctx.lineTo(x + width - topRight, y);
        if (topRight) ctx.arcTo(x + width, y, x + width, y + topRight, topRight);
        ctx.lineTo(x + width, y + height - bottomRight);
        if (bottomRight) ctx.arcTo(x + width, y + height, x + width - bottomRight, y + height, bottomRight);
        ctx.lineTo(x + bottomLeft, y + height);
        if (bottomLeft) ctx.arcTo(x, y + height, x, y + height - bottomLeft, bottomLeft);
        ctx.lineTo(x, y + topLeft);
        if (topLeft) ctx.arcTo(x, y, x + topLeft, y, topLeft);
        ctx.closePath();
    }

    function fillRoundedRect(x, y, width, height, radii, fillStyle) {
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        roundedRectPath(x, y, width, height, radii);
        ctx.fill();
        ctx.restore();
    }

    function paintGradient(x, y, width, height, radii, backgroundImage) {
        const stops = backgroundImage.match(GRADIENT_STOP_PATTERN) || [];
        if (stops.length < 2) return;
        let from = parseColor(stops[0]);
        let to = parseColor(stops[stops.length - 1]);
        if (from[3] === 0) from = [to[0], to[1], to[2], 0];
        if (to[3] === 0) to = [from[0], from[1], from[2], 0];
        const reversed = backgroundImage.includes('to left');
        const gradient = reversed
            ? ctx.createLinearGradient(x + width, 0, x, 0)
            : ctx.createLinearGradient(x, 0, x + width, 0);
        gradient.addColorStop(0, toRgba(from));
        gradient.addColorStop(1, toRgba(to));
        fillRoundedRect(x, y, width, height, radii, gradient);
    }

    function paintShadows(x, y, width, height, radii, background, boxShadow) {
        for (const match of boxShadow.matchAll(SHADOW_PATTERN)) {
            const shadowColor = parseColor(match[1]);
            if (shadowColor[3] <= 0) continue;
            ctx.save();
            ctx.shadowColor = toRgba(shadowColor);
            ctx.shadowOffsetX = parseFloat(match[2]) * SCALE;
            ctx.shadowOffsetY = parseFloat(match[3]) * SCALE;
            ctx.shadowBlur = parseFloat(match[4]) * SCALE;
            ctx.fillStyle = toRgba(background);
            ctx.beginPath();
            roundedRectPath(x, y, width, height, radii);
            ctx.fill();
            ctx.restore();
        }
    }

    function paintBorder(x, y, width, height, radii, style) {
        const widths = [
            style.borderTopWidth,
            style.borderRightWidth,
            style.borderBottomWidth,
            style.borderLeftWidth
        ].map(toPx);
        if (!widths.some(value => value > 0)) return;
        const colors = [
            style.borderTopColor,
            style.borderRightColor,
            style.borderBottomColor,
            style.borderLeftColor
        ];
        const side = widths.findIndex(value => value > 0);
        const [top, right, bottom, left] = widths;
        const innerWidth = width - left - right;
        const innerHeight = height - top - bottom;
        const innerRadii = [
            Math.max(0, radii[0] - Math.max(top, left)),
            Math.max(0, radii[1] - Math.max(top, right)),
            Math.max(0, radii[2] - Math.max(bottom, right)),
            Math.max(0, radii[3] - Math.max(bottom, left))
        ];
        ctx.save();
        ctx.fillStyle = toRgba(parseColor(colors[side]));
        ctx.beginPath();
        roundedRectPath(x, y, width, height, radii);
        if (innerWidth > 0 && innerHeight > 0) {
            roundedRectPath(x + left, y + top, innerWidth, innerHeight, innerRadii);
        }
        ctx.fill('evenodd');
        ctx.restore();
    }

    function paintBox(element, style) {
        const rect = element.getBoundingClientRect();
        const x = rect.left - originX;
        const y = rect.top - originY;
        const { width, height } = rect;
        if (width <= 0 || height <= 0) return;
        const radii = getRadii(style, width, height);

        if (style.backgroundImage.includes('linear-gradient')) {
            paintGradient(x, y, width, height, radii, style.backgroundImage);
        } else {
            const background = parseColor(style.backgroundColor);
            if (background[3] > 0) {
                if (element !== root && style.boxShadow !== 'none') {
                    paintShadows(x, y, width, height, radii, background, style.boxShadow);
                }
                fillRoundedRect(x, y, width, height, radii, toRgba(background));
            }
        }

        paintBorder(x, y, width, height, radii, style);
    }

    function measureAscent(font) {
        const probe = document.createElement('div');
        probe.style.cssText = `position:fixed;left:-10000px;top:0;white-space:nowrap;line-height:normal;font:${font};`;
        probe.innerHTML = '<span>Hg</span><span style="display:inline-block;width:0;height:0"></span>';
        document.body.appendChild(probe);
        try {
            const text = probe.children[0].getBoundingClientRect();
            const baseline = probe.children[1].getBoundingClientRect();
            return baseline.bottom - text.top;
        } finally {
            probe.remove();
        }
    }

    function ascentFor(font, metrics) {
        if (metrics.fontBoundingBoxAscent !== undefined) return metrics.fontBoundingBoxAscent;
        if (!ascentCache.has(font)) ascentCache.set(font, measureAscent(font));
        return ascentCache.get(font);
    }

    function collectTextLines(node) {
        const raw = node.nodeValue;
        const range = document.createRange();
        const lines = [];
        let offset = 0;
        for (const symbol of raw) {
            range.setStart(node, offset);
            range.setEnd(node, offset + symbol.length);
            offset += symbol.length;
            const rects = range.getClientRects();
            if (!rects.length) continue;
            const rect = rects[0];
            let character = symbol;
            if (/\s/.test(character)) {
                if (rect.width < 0.1) continue;
                character = ' ';
            }
            const last = lines[lines.length - 1];
            if (last && Math.abs(rect.top - last.top) < 2) {
                last.text += character;
                last.right = rect.right;
            } else {
                lines.push({ top: rect.top, left: rect.left, right: rect.right, height: rect.height, text: character });
            }
        }
        return lines;
    }

    function paintText(node, style) {
        const raw = node.nodeValue;
        if (!raw || !raw.trim()) return;
        const lines = collectTextLines(node);

        ctx.save();
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        ctx.fillStyle = style.color;
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'left';
        const letterSpacing = style.letterSpacing === 'normal' ? 0 : toPx(style.letterSpacing);
        const supportsLetterSpacing = 'letterSpacing' in ctx;
        if (supportsLetterSpacing) ctx.letterSpacing = `${letterSpacing}px`;

        for (const line of lines) {
            let text = line.text.trimEnd();
            if (!text) continue;
            if (style.textTransform === 'uppercase') text = text.toUpperCase();
            const metrics = ctx.measureText(text);
            const baseX = line.left - originX;
            const baseY = line.top - originY + ascentFor(ctx.font, metrics);
            if (letterSpacing && !supportsLetterSpacing) {
                let cursorX = baseX;
                for (const character of text) {
                    ctx.fillText(character, cursorX, baseY);
                    cursorX += ctx.measureText(character).width + letterSpacing;
                }
            } else {
                const maxWidth = line.right - line.left;
                if (metrics.width > maxWidth + 1) ctx.fillText(text, baseX, baseY, maxWidth);
                else ctx.fillText(text, baseX, baseY);
            }
        }
        ctx.restore();
    }

    async function svgToImage(svg, width, height) {
        const clone = svg.cloneNode(true);
        const originals = [svg, ...svg.querySelectorAll('*')];
        const clones = [clone, ...clone.querySelectorAll('*')];
        originals.forEach((element, index) => {
            const style = getComputedStyle(element);
            clones[index].setAttribute(
                'style',
                `stroke:${style.stroke};fill:${style.fill};stroke-width:${style.strokeWidth};stroke-linecap:${style.strokeLinecap};stroke-linejoin:${style.strokeLinejoin};`
            );
            clones[index].removeAttribute('class');
        });
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clone.setAttribute('width', width * SCALE);
        clone.setAttribute('height', height * SCALE);
        const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
        const image = new Image();
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Icon load timed out')), ICON_LOAD_TIMEOUT_MS);
            image.onload = () => {
                clearTimeout(timer);
                resolve();
            };
            image.onerror = () => {
                clearTimeout(timer);
                reject(new Error('Icon could not be loaded'));
            };
            image.src = url;
        });
        return image;
    }

    async function paint(element) {
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return;
        if (element instanceof SVGSVGElement) {
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const image = await svgToImage(element, rect.width, rect.height);
                ctx.drawImage(image, rect.left - originX, rect.top - originY, rect.width, rect.height);
            }
            return;
        }
        paintBox(element, style);
        for (const child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) paintText(child, style);
            else if (child.nodeType === Node.ELEMENT_NODE) await paint(child);
        }
    }

    async function render(clone) {
        root = clone;
        const rect = clone.getBoundingClientRect();
        originX = rect.left;
        originY = rect.top;

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(rect.width * SCALE);
        canvas.height = Math.round(rect.height * SCALE);
        ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context is unavailable');
        ctx.scale(SCALE, SCALE);

        await paint(clone);
        return canvas;
    }

    ServiceProgram.canvasRenderer = Object.freeze({ render });
})();
// Created by: @xorodev (CipherCoreDev). 2026