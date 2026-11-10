import { UNIT_MM } from './dxf';

const nf = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
export const INR = (v) => {
  const r = Math.round(v);
  return (r < 0 ? '−' : '') + '₹' + nf.format(Math.abs(r));
};

export const CATS = [
  { id: 'lc', name: 'Liquid acrylic + channel', sub: 'Pick a channel depth' },
  { id: 'l3', name: 'Liquid acrylic + 3D print', sub: '' },
  { id: 'c3', name: 'Cast acrylic + 3D print', sub: '' }
];
export const CHS = [
  { id: 'c40', mm: 40 },
  { id: 'c60', mm: 60 },
  { id: 'c80', mm: 80 }
];

export const catOf = (id) => CATS.find((c) => c.id === id);
export const chOf = (id) => CHS.find((c) => c.id === id);
export const selLabel = (cat, ch) =>
  catOf(cat).name + (cat === 'lc' ? ', ' + chOf(ch).mm + ' mm channel' : '');

/* Size band by running inch. Under b1: t1. b1 up to b2: t2. b2 up to and including b3: t3. Above b3: custom. */
export function band(run, R) {
  if (run < R.b1) return { i: 1, rate: R.t1 };
  if (run < R.b2) return { i: 2, rate: R.t2 };
  if (run <= R.b3) return { i: 3, rate: R.t3 };
  return { i: 0, rate: null };
}
export function bandName(i, R) {
  if (i === 1) return 'under ' + R.b1 + ' in';
  if (i === 2) return R.b1 + ' to ' + R.b2 + ' in';
  if (i === 3) return R.b2 + ' to ' + R.b3 + ' in';
  return 'over ' + R.b3 + ' in';
}
export function letterRate(run, cat, ch, R) {
  if (cat === 'lc') {
    const b = band(run, R);
    return b.rate == null ? null : b.rate + R[ch];
  }
  return cat === 'l3' ? R.l3 : R.c3;
}

/* Measure a set of letters. `letters` are in file units; `factor` converts file units to mm.
   Each letter's running inch is the larger of its height and width. */
export function measure(letters, { factor, qty }) {
  const rows = [];
  let run = 0, tall = 0;
  letters.forEach((l) => {
    const hIn = (l.h * factor) / 25.4;
    const wIn = (l.w * factor) / 25.4;
    const r = Math.max(hIn, wIn);
    rows.push({ hIn, wIn, run: r, holes: l.holes });
    run += r;
    if (hIn > tall) tall = hIn;
  });
  return { rows, qty, run: run * qty, runOne: run, tall, n: letters.length };
}

export function priceFor(M, cat, ch, R) {
  let tot = 0, custom = 0;
  const groups = {}, customIdx = [];
  M.rows.forEach((r, i) => {
    const rate = letterRate(r.run, cat, ch, R);
    if (rate == null) { custom++; customIdx.push(i + 1); }
    else {
      tot += r.run * rate;
      const key = cat === 'lc' ? band(r.run, R).i : 0;
      if (!groups[key]) groups[key] = { n: 0, run: 0, rate };
      groups[key].n++; groups[key].run += r.run;
    }
  });
  return { total: tot * M.qty, custom: custom * M.qty, customIdx, groups };
}

export function priceText(P) {
  if (P.total === 0 && P.custom > 0) return 'Custom';
  return INR(P.total) + (P.custom > 0 ? ' + custom' : '');
}

export function unitFactor(unitChoice, autoUnit) {
  const u = unitChoice === 'auto' ? autoUnit : unitChoice;
  return UNIT_MM[u] || 1;
}
