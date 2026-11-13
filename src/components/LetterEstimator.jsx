import { useEffect, useMemo, useState } from 'react';
import { UploadCloud, MessageCircle, Mail, Copy, Check, Info } from 'lucide-react';
import { parseDXF, UNIT_NAME } from '../lib/dxf';
import { typedLetters, resetGlyphCache } from '../lib/glyph';
import {
  CATS, CHS, INR, bandName, catOf, letterRate, measure, priceFor, priceText, selLabel, unitFactor
} from '../lib/estimate';
import { DEFAULT_RATES as R } from '../data/b2bRates';
import { companyInfo } from '../data/company';

const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const EMPTY_FILE = { name: '', autoUnit: 'mm', unitNote: '', open: 0, dups: 0, unsupported: {}, letters: [] };

// First phone number on the site, digits only (used for the WhatsApp link).
const whatsappNumber = companyInfo.contact.phone.split(',')[0].replace(/\D/g, '');

function Stat({ k, v, u, s }) {
  return (
    <div className="est-stat">
      <div className="est-k">{k}</div>
      <div className="est-v">
        {v}
        <span className="est-u">{u}</span>
      </div>
      <div className="est-s">{s}</div>
    </div>
  );
}

export default function LetterEstimator() {
  const [source, setSource] = useState('vec'); // 'vec' | 'txt'
  const [file, setFile] = useState(null); // { name, ...parsed }
  const [fileError, setFileError] = useState('');
  const [unit, setUnit] = useState('auto');
  const [qty, setQty] = useState('1');
  const [text, setText] = useState('');
  const [cap, setCap] = useState('10');
  const [cat, setCat] = useState('lc');
  const [ch, setCh] = useState('c40');
  const [customer, setCustomer] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fontTick, setFontTick] = useState(0);

  const typed = source === 'txt';

  // The measuring font loads lazily; measure typed words again once it is ready.
  useEffect(() => {
    if (document.fonts && document.fonts.load) {
      document.fonts
        .load('800 300px Inter', 'HDrAEPKGUT0123456789')
        .then(() => {
          resetGlyphCache();
          setFontTick((t) => t + 1);
        })
        .catch(() => {});
    }
  }, []);

  const vec = useMemo(() => {
    if (typed) {
      const capIn = num(cap);
      return {
        ...EMPTY_FILE,
        name: text.trim() || 'Typed words',
        letters: typedLetters(text, capIn),
        unitNote: 'Estimated from a bold sans font at ' + cap + ' in capital height. Upload a DXF for exact measurements.'
      };
    }
    return file || EMPTY_FILE;
    // fontTick re-runs the measurement once the font is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, text, cap, file, fontTick]);

  const factor = typed ? 1 : unitFactor(unit, vec.autoUnit);
  const qtyN = Math.max(1, Math.floor(num(qty)) || 1);
  const M = useMemo(
    () => measure(vec.letters, { factor, qty: qtyN }),
    [vec, factor, qtyN]
  );
  const P = priceFor(M, cat, ch, R);

  const unitShown = unit === 'auto' ? vec.autoUnit : unit;
  const status =
    M.n === 0
      ? typed
        ? 'Type the words above to measure them.'
        : file
          ? vec.name + ': no closed letter outlines were found.'
          : 'Choose a DXF file to measure the letters.'
      : vec.name + ': ' + M.n + ' letter' + (M.n === 1 ? '' : 's') + '. ' +
        (unit === 'auto' || typed ? vec.unitNote : 'Units: ' + UNIT_NAME[unitShown] + ', as chosen.');

  const warns = [];
  const un = vec.unsupported || {};
  const unNames = Object.keys(un);
  if (vec.open > 0) warns.push(vec.open + ' open outline' + (vec.open === 1 ? '' : 's') + ' left out. Close the gaps in the drawing so they count.');
  if (vec.dups > 0) warns.push(vec.dups + ' duplicate outline' + (vec.dups === 1 ? '' : 's') + ' ignored, so nothing is counted twice.');
  if (unNames.length) warns.push('Skipped unsupported items: ' + unNames.map((k) => un[k] + ' ' + k).join(', ') + '.');
  const tallMm = M.tall * 25.4;
  if (!typed && M.n && (tallMm < 20 || tallMm > 3000)) {
    warns.push('The tallest letter measures ' + Math.round(tallMm) + ' mm with these units. Check File units.');
  }

  const handleFile = (f) => {
    if (!f) return;
    setFileError('');
    if (!/\.dxf$/i.test(f.name)) {
      setFileError('Only DXF files work for now. Export the drawing as DXF and choose it again.');
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const r = parseDXF(String(fr.result));
        setFile({ ...r, name: f.name });
        setUnit('auto');
        setSource('vec');
      } catch (err) {
        setFileError('This DXF could not be read (' + (err && err.message ? err.message : 'unknown error') + ').');
      }
    };
    fr.onerror = () => setFileError('The file could not be opened.');
    fr.readAsText(f);
  };

  // ----- estimate summary text -----
  const baseName = vec.name.replace(/\.dxf.*$/i, '').replace(/_/g, ' ');
  const summaryLines = [];
  if (M.n > 0) {
    summaryLines.push('Estimate request: ' + baseName);
    if (customer.trim()) summaryLines.push('From: ' + customer.trim());
    summaryLines.push(selLabel(cat, ch));
    summaryLines.push(M.n + ' letters' + (M.qty > 1 ? ' × ' + M.qty + ' sets' : '') + ', ' + M.run.toFixed(1) + ' running inch');
    if (P.total > 0 || P.custom === 0) summaryLines.push('Estimated price: ' + INR(P.total) + (P.custom > 0 ? ' for the other letters' : ''));
    if (P.custom > 0) summaryLines.push('Letters over ' + R.b3 + ' in need a custom rate');
  }
  const summary = summaryLines.join('\n');
  const waHref = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(summary);
  const mailHref =
    'mailto:' + companyInfo.contact.email +
    '?subject=' + encodeURIComponent('B2B estimate request: ' + baseName) +
    '&body=' + encodeURIComponent(summary + '\n\n(Please attach the drawing file when you send this.)');

  const copySummary = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    try {
      navigator.clipboard.writeText(summary).then(done).catch(() => {});
    } catch {
      /* clipboard not available */
    }
  };

  // ----- price breakdown lines -----
  const breakdown = Object.keys(P.groups).sort().map((k) => {
    const g = P.groups[k];
    return (
      (cat === 'lc' ? g.n + ' letter' + (g.n > 1 ? 's' : '') + ' ' + bandName(+k, R) + ': ' : g.n + ' letter' + (g.n > 1 ? 's' : '') + ': ') +
      g.run.toFixed(1) + ' in × ₹' + g.rate
    );
  });

  const rowsView = M.rows.map((r, i) => {
    const rate = letterRate(r.run, cat, ch, R);
    return { r, i, rate, p: rate == null ? null : r.run * rate };
  });
  const oneSetTotal = rowsView.reduce((t, x) => t + (x.p == null ? 0 : x.p), 0);
  const anyCustom = rowsView.some((x) => x.p == null);

  const selectPrice = (c, k) => {
    setCat(c);
    if (k) setCh(k);
  };

  return (
    <div className="est">
      <div className="est-intro">
        <p>
          Measure your letters from a DXF drawing or from typed words, pick the signage category, and get an indicative
          cost. Each letter is priced by its own running inch, nothing else added.
        </p>
      </div>

      <div className="est-main">
        {/* ---------- Drawing ---------- */}
        <section className="est-panel est-draw" aria-labelledby="est-draw-h">
          <h3 id="est-draw-h" className="est-h">
            Your drawing
            <span className="est-chip">{typed ? 'Typed words' : file ? 'Your file' : 'No file yet'}</span>
          </h3>

          <div className="est-stack">
            <fieldset className="est-fieldset">
              <legend>Estimate from</legend>
              <div className="est-tiles two">
                <div className="est-tile-wrap">
                  <input className="est-tile-in" type="radio" name="est-src" id="est-src-vec" checked={!typed} onChange={() => setSource('vec')} />
                  <label className="est-tile" htmlFor="est-src-vec"><b>Vector file</b><span>DXF, exact measurements</span></label>
                </div>
                <div className="est-tile-wrap">
                  <input className="est-tile-in" type="radio" name="est-src" id="est-src-txt" checked={typed} onChange={() => setSource('txt')} />
                  <label className="est-tile" htmlFor="est-src-txt"><b>Typed words</b><span>Estimated from the text</span></label>
                </div>
              </div>
            </fieldset>

            {!typed && (
              <div className="est-field">
                <label htmlFor="est-file">Vector file (DXF)</label>
                <label
                  htmlFor="est-file"
                  className={'est-drop' + (dragging ? ' drag' : '')}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFile(e.dataTransfer.files && e.dataTransfer.files[0]);
                  }}
                >
                  <UploadCloud size={26} />
                  <strong>{file ? file.name : 'Choose a DXF file'}</strong>
                  <span>{file ? 'Choose another file to replace it' : 'or drag and drop it here'}</span>
                </label>
                <input
                  id="est-file"
                  className="est-file-input"
                  type="file"
                  accept=".dxf"
                  onChange={(e) => {
                    handleFile(e.target.files && e.target.files[0]);
                    e.target.value = '';
                  }}
                />
              </div>
            )}

            {typed && (
              <div className="est-grid2 est-words">
                <div className="est-field">
                  <label htmlFor="est-txt">Words</label>
                  <input id="est-txt" type="text" value={text} placeholder="Type the words, for example SUNRISE" autoComplete="off" onChange={(e) => setText(e.target.value)} />
                </div>
                <div className="est-field">
                  <label htmlFor="est-cap">Capital height <span className="est-unit">(in)</span></label>
                  <input id="est-cap" type="number" inputMode="decimal" min="0.5" step="0.5" value={cap} onChange={(e) => setCap(e.target.value)} />
                </div>
              </div>
            )}

            <p className="est-note" aria-live="polite">{fileError || status}</p>
            {warns.length > 0 && (
              <div className="est-warns">
                {warns.map((w, i) => <div className="est-warn" key={i}>{w}</div>)}
              </div>
            )}

            <div className="est-grid2">
              {!typed && (
                <div className="est-field">
                  <label htmlFor="est-unit">File units</label>
                  <select id="est-unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="auto">Auto from file</option>
                    <option value="mm">Millimetres</option>
                    <option value="cm">Centimetres</option>
                    <option value="in">Inches</option>
                    <option value="m">Metres</option>
                  </select>
                </div>
              )}
              <div className="est-field">
                <label htmlFor="est-qty">Sets</label>
                <input id="est-qty" type="number" inputMode="numeric" min="1" step="1" value={qty} onChange={(e) => setQty(e.target.value)} />
              </div>
            </div>

            <div className="est-scroll">
              <table className="est-table" style={{ minWidth: 480 }}>
                {M.n === 0 ? (
                  <tbody><tr><td className="est-empty">No letters measured yet.</td></tr></tbody>
                ) : (
                  <>
                    <thead>
                      <tr><th>#</th><th>Height</th><th>Width</th><th>Running inch</th><th>Rate</th><th>Price</th></tr>
                    </thead>
                    <tbody>
                      {rowsView.map(({ r, i, rate, p }) => (
                        <tr key={i}>
                          <td>{i + 1}{r.holes ? <span className="est-tag">{r.holes} hole{r.holes > 1 ? 's' : ''}</span> : null}</td>
                          <td className="n">{r.hIn.toFixed(2)} in</td>
                          <td className="n">{r.wIn.toFixed(2)} in</td>
                          <td className="n big">{r.run.toFixed(2)} in</td>
                          {rate == null
                            ? <td className="n cu" colSpan={2}>Custom rate</td>
                            : <><td className="n">₹{rate}</td><td className="n">{INR(p)}</td></>}
                        </tr>
                      ))}
                      <tr className="est-total-row">
                        <td>One set</td><td /><td />
                        <td className="n">{M.runOne.toFixed(2)} in</td><td />
                        <td className="n">{INR(oneSetTotal)}{anyCustom ? ' + custom' : ''}</td>
                      </tr>
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>
        </section>

        {/* ---------- Measurements and price ---------- */}
        <section className="est-panel est-choose" aria-labelledby="est-ch-h" aria-live="polite">
          <h3 id="est-ch-h" className="est-h">Measurements and price</h3>
          <div className="est-stack">
            <div className="est-stats">
              <Stat k="Running inch" v={M.run.toFixed(1)} u="in" s="Larger of height and width, added up" />
              <Stat k="Letters" v={M.n} u={M.qty > 1 ? ' × ' + M.qty + ' sets' : ''} s="Counted from your drawing" />
            </div>

            <fieldset className="est-fieldset">
              <legend>Signage category</legend>
              <div className="est-tiles">
                {CATS.map((v) => (
                  <div className="est-tile-wrap" key={v.id}>
                    <input className="est-tile-in" type="radio" name="est-cat" id={'est-cat-' + v.id} checked={cat === v.id} onChange={() => setCat(v.id)} />
                    <label className="est-tile" htmlFor={'est-cat-' + v.id}><b>{v.name}</b><span>{v.sub || '\u00a0'}</span></label>
                  </div>
                ))}
              </div>
            </fieldset>

            {cat === 'lc' && (
              <fieldset className="est-fieldset">
                <legend>Channel depth</legend>
                <div className="est-tiles">
                  {CHS.map((c) => (
                    <div className="est-tile-wrap" key={c.id}>
                      <input className="est-tile-in" type="radio" name="est-chd" id={'est-chd-' + c.id} checked={ch === c.id} onChange={() => setCh(c.id)} />
                      <label className="est-tile" htmlFor={'est-chd-' + c.id}>
                        <b>{c.mm} mm</b>
                        <span>{R[c.id] > 0 ? '+₹' + R[c.id] + ' per inch' : 'No extra cost'}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            )}

            {P.custom > 0 && (
              <div className="est-warn">
                {P.customIdx.length} letter{P.customIdx.length > 1 ? 's are' : ' is'} over {R.b3} in (letter {P.customIdx.join(', ')}). Custom rate, please contact us.
                {P.total > 0 ? ' The price below covers the other letters only.' : ''}
              </div>
            )}

            <div className="est-price-box">
              <div className="est-lbl">{selLabel(cat, ch)}</div>
              <div className="est-total">{M.n === 0 ? '–' : P.total === 0 && P.custom > 0 ? 'Custom rate' : INR(P.total)}</div>
              <div className="est-work">
                {M.n === 0 ? (
                  'Choose a DXF file or type words to see the price.'
                ) : (
                  <>
                    {breakdown.map((b, i) => <span key={i}>{b}<br /></span>)}
                    {M.qty > 1 && <span>{M.qty} sets<br /></span>}
                    Nothing else added.
                  </>
                )}
              </div>
            </div>

            {M.n > 0 && (
              <div className="est-summary">
                <div className="est-summary-head">
                  <img src="/assets/adhitech_logo_light.png" alt="Adhitech Advertising Technology" />
                  <span>Estimate summary</span>
                </div>
                <div className="est-field">
                  <label htmlFor="est-customer">Your name / company <span className="est-unit">(optional)</span></label>
                  <input id="est-customer" type="text" value={customer} autoComplete="organization" onChange={(e) => setCustomer(e.target.value)} placeholder="Added to the message you send us" />
                </div>
                <pre className="est-pre">{summary}</pre>
                <div className="est-actions">
                  <a className="est-btn primary" href={waHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> Send on WhatsApp</a>
                  <a className="est-btn" href={mailHref}><Mail size={16} /> Email us</a>
                  <button type="button" className="est-btn" onClick={copySummary}>
                    {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="est-disclaimer">
                  <Info size={14} /> This is an indicative estimate from your drawing. Send it to us and we will confirm the quotation.
                  If your email app does not open, use WhatsApp or copy the summary.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ---------- All choices ---------- */}
        <section className="est-panel est-matrix" aria-labelledby="est-mx-h">
          <h3 id="est-mx-h" className="est-h">All choices for this drawing</h3>
          <p className="est-sec-note">Select a price to pick that category and channel depth.</p>
          <div className="est-scroll">
            <table className="est-table est-mx" style={{ minWidth: 420 }}>
              <thead><tr><th>Category</th><th>Price</th></tr></thead>
              <tbody>
                {CHS.map((C) => {
                  const Pc = priceFor(M, 'lc', C.id, R);
                  const on = cat === 'lc' && ch === C.id;
                  return (
                    <tr key={C.id}>
                      <td>Liquid acrylic + channel, {C.mm} mm<span className="est-dim">{R[C.id] > 0 ? '+₹' + R[C.id] + ' per inch for channel' : 'No channel extra'}</span></td>
                      <td><button type="button" aria-pressed={on} onClick={() => selectPrice('lc', C.id)}>{M.n === 0 ? '–' : priceText(Pc)}</button></td>
                    </tr>
                  );
                })}
                {[['l3', '₹' + R.l3 + ' per inch'], ['c3', '₹' + R.c3 + ' per inch']].map(([id, sub]) => {
                  const Pc = priceFor(M, id, 'c40', R);
                  return (
                    <tr key={id}>
                      <td>{catOf(id).name}<span className="est-dim">{sub}</span></td>
                      <td><button type="button" aria-pressed={cat === id} onClick={() => selectPrice(id)}>{M.n === 0 ? '–' : priceText(Pc)}</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
