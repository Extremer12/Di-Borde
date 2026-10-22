// DON BORDE — Generador del sistema de identidad en vector puro (SVG).
// Uso: node brand/build-logo.mjs   →  genera /public/brand/*.svg
//
// CONCEPTO CENTRAL:
// 1. SÍMBOLO: Un anillo circular audaz (el "BORDE" artesanal de la pizza)
//    cuya contraforma en espacio negativo dibuja la "D" de Don y de Bordón.
// 2. LOGOTIPO PRINCIPAL (Horizontal / Vertical):
//    [ SÍMBOLO ] + DON BORDE en tipografía rotunda, amigable y perfectamente calibrada.
//    No duplica el símbolo dentro del texto para mantener máxima sobriedad y jerarquía.
// 3. WORDMARK INDEPENDIENTE:
//    DON BORDE pensado para usarse sin el símbolo externo, donde la O de BORDE
//    integra el anillo de la masa en rojo tomate o en versión monocromática.

import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'brand');
fs.mkdirSync(OUT, { recursive: true });

// ── Tipografía base convertida a curvas ──
const FONT_URL = 'https://github.com/google/fonts/raw/main/ofl/paytoneone/PaytoneOne-Regular.ttf';
const FONT_FILE = path.join(ROOT, 'brand', 'PaytoneOne-Regular.ttf');
if (!fs.existsSync(FONT_FILE)) {
  const res = await fetch(FONT_URL);
  if (!res.ok) throw new Error('No se pudo descargar la fuente: ' + res.status);
  fs.writeFileSync(FONT_FILE, Buffer.from(await res.arrayBuffer()));
}
const buf = fs.readFileSync(FONT_FILE);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const CAP = font.tables.os2.sCapHeight || 700;
const toGlyphs = (s) => [...s].map((ch) => font.charToGlyph(ch));
const kern = (a, b) => { const v = font.getKerningValue(a, b); return Number.isFinite(v) ? v : 0; };

// ── Paleta de Color Oficial ──
export const C = {
  red: '#D7381E',    // Rojo Tomate Cálido (artesanal, enérgico, apetitoso)
  cream: '#F7EFE1',  // Crema Masa (harina, sémola, fermentación lenta)
  coal: '#1E1714',   // Negro Carbón Cálido (horno de piedra, leña)
  white: '#FFFFFF',
};

const r2 = (n) => Math.round(n * 100) / 100;

// ── SÍMBOLO ICONO (Grilla de 200u) ─────────────────────────────────────────
// Círculo exterior puro (radio 100) + contraforma interior "D" redondeada.
// El espesor del anillo rojo es homogéneo (~50-54u), emulando el borde inflado
// de la masa artesanal horneada a la piedra.
function symbolPath(cx, cy, diameter) {
  const k = diameter / 200;
  
  // 1. Círculo exterior (puro y perfectamente escalable a cualquier tamaño)
  const steps = 180;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = cx + Math.cos(t - Math.PI / 2) * 100 * k;
    const y = cy + Math.sin(t - Math.PI / 2) * 100 * k;
    d += (i === 0 ? 'M' : 'L') + r2(x) + ' ' + r2(y);
  }
  d += 'Z';

  // 2. Contraforma "D" (espacio negativo que forma la letra D de Don Bordón)
  // Espesor perimetral calibrado:
  // - Lado derecho: semicírculo concéntrico de radio 48
  // - Lado superior e inferior: borde de 50u
  // - Lado izquierdo: espina vertical recta con radio de empalme suave (cr = 14)
  //   con compensación óptica horizontal (-3.5u) para centrar la masa visual.
  const ox = -3.5;
  const L = -48 + ox;
  const T = -48;
  const B = 48;
  const R = 48; // radio del arco semicircular
  const ax = 0 + ox;
  const cr = 14; // redondeo de esquinas internas

  const P = (x, y) => r2(cx + x * k) + ' ' + r2(cy + y * k);

  d += `M${P(L + cr, T)}` +
       `L${P(ax, T)}` +
       `A${r2(R * k)} ${r2(((B - T) / 2) * k)} 0 0 1 ${P(ax, B)}` +
       `L${P(L + cr, B)}` +
       `A${r2(cr * k)} ${r2(cr * k)} 0 0 1 ${P(L, B - cr)}` +
       `L${P(L, T + cr)}` +
       `A${r2(cr * k)} ${r2(cr * k)} 0 0 1 ${P(L + cr, T)}Z`;

  return d;
}

// ── Outliner tipográfico a curvas vectoriales ──
function glyphPath(g, ox, oy, size) {
  const s = size / font.unitsPerEm;
  const X = (v) => r2(ox + v * s), Y = (v) => r2(oy - v * s);
  let d = '', x1 = Infinity, x2 = -Infinity;
  for (const c of g.path.commands) {
    if (c.type === 'M' || c.type === 'L') d += `${c.type}${X(c.x)} ${Y(c.y)}`;
    else if (c.type === 'Q') d += `Q${X(c.x1)} ${Y(c.y1)} ${X(c.x)} ${Y(c.y)}`;
    else if (c.type === 'C') d += `C${X(c.x1)} ${Y(c.y1)} ${X(c.x2)} ${Y(c.y2)} ${X(c.x)} ${Y(c.y)}`;
    else if (c.type === 'Z') d += 'Z';
    if (Number.isFinite(c.x)) { x1 = Math.min(x1, X(c.x)); x2 = Math.max(x2, X(c.x)); }
  }
  return { d, x1, x2 };
}

function word(str, size, { tracking = 0, heroO = false } = {}) {
  const scale = size / font.unitsPerEm;
  const glyphs = toGlyphs(str);
  let x = 0;
  const parts = [];
  let minX = Infinity, maxX = -Infinity;
  const top = -CAP * scale, bottom = 0;

  glyphs.forEach((g, i) => {
    const ch = str[i];
    if (heroO && ch === 'O') {
      const bb = g.getBoundingBox();
      const ocx = x + ((bb.x1 + bb.x2) / 2) * scale;
      const dia = CAP * scale * 1.04;
      parts.push({ d: symbolPath(ocx, -CAP * scale / 2, dia), role: 'accent' });
      minX = Math.min(minX, ocx - dia / 2);
      maxX = Math.max(maxX, ocx + dia / 2);
    } else if (ch !== ' ') {
      const p = glyphPath(g, x, 0, size);
      parts.push({ d: p.d, role: 'text' });
      minX = Math.min(minX, p.x1);
      maxX = Math.max(maxX, p.x2);
    }
    x += g.advanceWidth * scale;
    if (i < glyphs.length - 1) x += kern(g, glyphs[i + 1]) * scale + tracking * size;
  });

  return { parts, minX, width: maxX - minX, top, bottom, cap: CAP * scale };
}

function place(w, x, y) {
  const dx = x - w.minX;
  return {
    parts: w.parts.map((p) => ({ ...p, t: `translate(${r2(dx)} ${r2(y)})` })),
    box: { x1: x, y1: y + w.top * 1.05, x2: x + w.width, y2: y },
  };
}

function svg(parts, box, pal, pad = 0, bg = null) {
  const x = box.x1 - pad, y = box.y1 - pad, w = box.x2 - box.x1 + pad * 2, h = box.y2 - box.y1 + pad * 2;
  const body = parts.map((p) => {
    const fill = p.role === 'accent' ? pal.accent : p.role === 'bg' ? pal.bg : p.role === 'onbg' ? pal.onbg : pal.text;
    return `<path${p.t ? ` transform="${p.t}"` : ''} fill="${fill}" fill-rule="evenodd" d="${p.d}"/>`;
  }).join('\n  ');
  const bgRect = bg ? `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" fill="${bg}"/>\n  ` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r2(x)} ${r2(y)} ${r2(w)} ${r2(h)}" role="img" aria-label="Don Borde">\n  ${bgRect}${body}\n</svg>\n`;
}

// ── COMPOSICIONES OFICIALES ───────────────────────────────────────────────
const S = 200; // Módulo principal de altura para BORDE

// Stacked: DON arriba, BORDE abajo (heroO opcional)
function stackedWordmark(align = 'left', heroO = false) {
  const borde = word('BORDE', S, { tracking: -0.015, heroO });
  const don = word('DON', S * 0.46, { tracking: 0.04 });
  const gap = borde.cap * 0.14;
  const bordeY = don.cap + gap + borde.cap;
  const donX = align === 'left' ? 0 : (borde.width - don.width) / 2;
  const a = place(don, donX, don.cap);
  const b = place(borde, 0, bordeY);
  const extra = heroO ? borde.cap * 0.04 : 0;
  return {
    parts: [...a.parts, ...b.parts],
    box: { x1: 0, y1: 0, x2: borde.width, y2: bordeY + extra },
    h: bordeY + extra,
  };
}

// 1. LOGO PRINCIPAL / VERSIÓN HORIZONTAL
// [ SÍMBOLO ] + DON / BORDE (sin duplicar el símbolo en la O)
function horizontal() {
  const wm = stackedWordmark('left', false);
  const sym = wm.h * 0.94; // Símbolo armónico con el bloque de texto
  const gap = sym * 0.22;
  const symY = wm.h / 2;
  const parts = [
    { d: symbolPath(sym / 2, symY, sym), role: 'accent' },
    ...wm.parts.map((p) => ({ ...p, t: `translate(${r2(sym + gap)} 0) ${p.t}` }))
  ];
  return {
    parts,
    box: { x1: 0, y1: 0, x2: sym + gap + wm.box.x2, y2: wm.h }
  };
}

// 2. VERSIÓN VERTICAL
// [ SÍMBOLO ]
//    DON
//   BORDE
function vertical() {
  const wm = stackedWordmark('center', false);
  const sym = wm.box.x2 * 0.52;
  const gap = sym * 0.22;
  const parts = [
    { d: symbolPath(wm.box.x2 / 2, sym / 2, sym), role: 'accent' },
    ...wm.parts.map((p) => ({ ...p, t: `translate(0 ${r2(sym + gap)}) ${p.t}` }))
  ];
  return {
    parts,
    box: { x1: 0, y1: 0, x2: wm.box.x2, y2: sym + gap + wm.h }
  };
}

// 3. SÍMBOLO INDEPENDIENTE
function symbolOnly(d = 400) {
  return {
    parts: [{ d: symbolPath(d / 2, d / 2, d), role: 'accent' }],
    box: { x1: 0, y1: 0, x2: d, y2: d }
  };
}

// 4. WORDMARK INDEPENDIENTE (Sin símbolo externo)
// Variante con O integrada (el símbolo actúa como O)
function wordmarkHero() {
  return stackedWordmark('left', true);
}
// Variante 100% tipográfica pura
function wordmarkSolid() {
  return stackedWordmark('left', false);
}

// 5. WORDMARK EN UNA LÍNEA (Horizontal extendido)
function lineWordmark(heroO = false) {
  const don = word('DON', S, { tracking: -0.01 });
  const borde = word('BORDE', S, { tracking: -0.015, heroO });
  const space = S * 0.28;
  const a = place(don, 0, borde.cap);
  const b = place(borde, don.width + space, borde.cap);
  const extra = heroO ? borde.cap * 0.04 : 0;
  return {
    parts: [...a.parts, ...b.parts],
    box: { x1: 0, y1: -extra, x2: don.width + space + borde.width, y2: borde.cap + extra }
  };
}

// 6. SELLO ARTESANAL CIRCULAR (Para stickers, fajas de papel y timbres)
function seal(D = 600) {
  const cx = D / 2, cy = D / 2;
  const parts = [];

  // Disco exterior sólido
  const circle = (r) => `M${r2(cx - r)} ${cy}A${r} ${r} 0 1 0 ${r2(cx + r)} ${cy}A${r} ${r} 0 1 0 ${r2(cx - r)} ${cy}Z`;
  parts.push({ d: circle(D / 2), role: 'bg' });

  // Filete interior concéntrico
  parts.push({ d: circle(D / 2 - D * 0.038) + circle(D / 2 - D * 0.048), role: 'onbg' });

  // Texto circular perimetral
  const text = 'DON BORDE  •  MASA MADRE & HORNO A PIEDRA  •  ';
  const size = D * 0.065;
  const scale = size / font.unitsPerEm;
  const rText = D / 2 - D * 0.078 - CAP * scale;
  const glyphs = toGlyphs(text);
  const adv = glyphs.map((g, i) => g.advanceWidth * scale + (i < glyphs.length - 1 ? kern(g, glyphs[i + 1]) * scale : 0));
  const total = adv.reduce((a, b) => a + b, 0);
  const circ = 2 * Math.PI * rText;
  const track = (circ - total) / glyphs.length;
  let s = 0;
  glyphs.forEach((g, i) => {
    const mid = s + adv[i] / 2;
    const ang = (mid / circ) * 360;
    if (text[i] !== ' ') {
      const p = glyphPath(g, -g.advanceWidth * scale / 2, 0, size);
      parts.push({
        d: p.d,
        role: 'onbg',
        t: `translate(${cx} ${cy}) rotate(${r2(ang)}) translate(0 ${r2(-rText)})`
      });
    }
    s += adv[i] + track;
  });

  // Símbolo Don Borde al centro
  parts.push({ d: symbolPath(cx, cy, D * 0.42), role: 'onbg' });

  return { parts, box: { x1: 0, y1: 0, x2: D, y2: D } };
}

// 7. AVATAR / ICONO DE APP / REDES SOCIALES
function avatar(D = 512, round = 0) {
  const sq = round
    ? `M${round} 0H${D - round}A${round} ${round} 0 0 1 ${D} ${round}V${D - round}A${round} ${round} 0 0 1 ${D - round} ${D}H${round}A${round} ${round} 0 0 1 0 ${D - round}V${round}A${round} ${round} 0 0 1 ${round} 0Z`
    : `M0 0H${D}V${D}H0Z`;
  return {
    parts: [
      { d: sq, role: 'bg' },
      { d: symbolPath(D / 2, D / 2, D * 0.62), role: 'onbg' }
    ],
    box: { x1: 0, y1: 0, x2: D, y2: D }
  };
}

// ── GENERACIÓN Y EXPORTACIÓN COMPLETA ─────────────────────────────────────
const PAL = {
  color:    { text: C.coal,  accent: C.red },    // Oficial a 2 colores
  coal:     { text: C.coal,  accent: C.coal },   // Monocromático negro carbón
  white:    { text: C.white, accent: C.white },  // Negativo 100% blanco
  negative: { text: C.cream, accent: C.red },    // Fondo carbón / crema + rojo
};

const write = (name, content) => fs.writeFileSync(path.join(OUT, name), content);

const builds = {
  'horizontal': () => horizontal(),
  'vertical': () => vertical(),
  'symbol': () => symbolOnly(),
  'wordmark': () => wordmarkHero(),
  'wordmark-solid': () => wordmarkSolid(),
  'wordmark-line': () => lineWordmark(true),
  'wordmark-line-solid': () => lineWordmark(false),
};

for (const [name, fn] of Object.entries(builds)) {
  const g = fn();
  write(`${name}-color.svg`, svg(g.parts, g.box, PAL.color));
  write(`${name}-coal.svg`, svg(g.parts, g.box, PAL.coal));
  write(`${name}-white.svg`, svg(g.parts, g.box, PAL.white));
  write(`${name}-negative.svg`, svg(g.parts, g.box, PAL.negative));
}

// Sellos circulares para packaging y stickers
const sl = seal();
write('seal-red.svg', svg(sl.parts, sl.box, { bg: C.red, onbg: C.cream }));
write('seal-coal.svg', svg(sl.parts, sl.box, { bg: C.coal, onbg: C.cream }));
write('seal-cream.svg', svg(sl.parts, sl.box, { bg: C.cream, onbg: C.red }));

// Avatares para Redes Sociales
const av = avatar(512, 0);
write('avatar-red.svg', svg(av.parts, av.box, { bg: C.red, onbg: C.cream }));
write('avatar-coal.svg', svg(av.parts, av.box, { bg: C.coal, onbg: C.cream }));
write('avatar-cream.svg', svg(av.parts, av.box, { bg: C.cream, onbg: C.red }));

// Favicon optimizado con squircle suave
const fav = avatar(64, 14);
write('favicon.svg', svg(fav.parts, fav.box, { bg: C.red, onbg: C.cream }));

console.log('Sistema de identidad generado con éxito en:', OUT);
