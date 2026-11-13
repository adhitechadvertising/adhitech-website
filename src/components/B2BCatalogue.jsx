import { useState } from 'react';
import { Download, MessageCircle, Mail, Phone, MapPin, Check, ZoomIn } from 'lucide-react';
import MediaLightbox from './MediaLightbox';
import { companyInfo } from '../data/company';

const whatsappNumber = companyInfo.contact.phone.split(',')[0].replace(/\D/g, '');
const WA_HREF =
  'https://wa.me/' + whatsappNumber + '?text=' +
  encodeURIComponent('Hello Adhitech, I would like a B2B quotation for custom signage letters.');

const img = (name, w, h) => ({ type: 'image', src: `/b2b/${name}.jpg`, w, h });

const SYSTEMS = [
  {
    no: '01',
    short: 'Liquid Acrylic + Channel',
    title: 'Liquid Acrylic Face + Fabricated Channel Letters',
    intro:
      'Our flagship metallic channel letter combines precision-formed aluminum returns with seamless poured liquid acrylic faces, eliminating plastic trim caps and delivering edge-to-edge optical illumination.',
    points: [
      ['Channel Return Depths', '3 standard architectural profile sizes: 40 mm, 60 mm and 80 mm.'],
      ['Channel Return Finishes', 'Formed aluminum alloy in standard architectural colors (Matte Black, Pure White, Signal Red, Brushed Silver and Mirror Gold).'],
      ['Face Technology', 'Optical liquid acrylic resin poured and cured in dust-controlled cleanrooms, offering unlimited custom color blending and vibrant surface diffusion.'],
      ['Illumination Engine', 'High-density rainproof LED strip (IP67), featuring in-house hand-soldered wire jumpers and secondary silicone waterproofing.'],
      ['Rear Backing', 'CNC-milled 3 mm exterior-grade ACP panel secured with industrial blind rivets and heavy-duty nuts and bolts.']
    ]
  },
  {
    no: '02',
    short: 'Liquid Acrylic + 3D Printed',
    title: 'Liquid Acrylic Face + 3D Printed Letters',
    intro:
      'Seamless polymer walls integrate directly with an ultra-gloss liquid acrylic face, featuring our innovative dual-colour rising return profile.',
    points: [
      ['Return Depth / Height', 'Standard profile height from 20 mm to 50 mm.'],
      ['Dual-Colour Rising Profile', 'Multi-filament co-extrusion technology enabling two distinct colors along the return depth (e.g., Jet Black base rising to Signal Red face lip).'],
      ['Standard Return Colors', 'All standard sign shop colors including Deep Black, Traffic White, Industrial Red, Gunmetal Gray and Custom Tones.'],
      ['Poured Liquid Acrylic Face', 'Poured liquid polymer resin face with unlimited color choices.'],
      ['Reinforced Backing', 'CNC-routed 3 mm ACP back panel mechanically fastened with blind rivets and nuts & bolts.']
    ]
  },
  {
    no: '03',
    short: 'Cast Acrylic + 3D Printed',
    title: 'Cast Acrylic Face + 3D Printed Letters',
    intro:
      'Couples the dimensional flexibility of 3D printed additive returns with the crystalline optical perfection of solid cast acrylic sheets.',
    points: [
      ['Return Depth / Height', 'Standard profile height from 20 mm to 50 mm.'],
      ['Solid Cast Acrylic Face', '100% virgin methyl methacrylate cast acrylic sheet (3 mm to 5 mm). High scratch and impact resistance.'],
      ['Crystal-Clear Optical Definition', 'Flame-polished or CNC-beveled edges produce a modern architectural aesthetic with crisp, glare-free light diffusion.'],
      ['Durable Additive Returns', 'Weatherproof polymer return casing engineered in standard colors.'],
      ['Structural Stability', 'Rigid 3 mm ACP back plate fastened with blind rivets, nuts and bolts.']
    ]
  }
];

const CHOOSER = [
  ['Deep, metallic letters (40 / 60 / 80 mm) with aluminium returns in black, white, red, brushed silver or mirror gold.', 'System 01', 'Liquid Acrylic + Channel'],
  ['Slimmer letters (20–50 mm) with an unlimited-colour poured face, or a two-tone dual-colour rising side wall.', 'System 02', 'Liquid Acrylic + 3D Printed'],
  ['A crystal-clear, scratch-resistant solid sheet face (3–5 mm cast acrylic) with bevelled edges, in standard colours.', 'System 03', 'Cast Acrylic + 3D Printed']
];

const INCLUDES = [
  ['Built to exterior grade', '3 mm ACP back plate, blind rivets and stainless nut & bolt fastening.'],
  ['Hand-soldered LEDs', 'IP67 strip with in-house soldered joints and silicone potting.'],
  ['Ready to mount', 'Wiring, hardware kit and 1:1 CAD hole template supplied.']
];

const MATRIX = {
  head: ['Specification', '01 · Liquid Acrylic + Channel', '02 · Liquid Acrylic + 3D Printed', '03 · Cast Acrylic + 3D Printed'],
  rows: [
    ['Face Material', 'Poured UV Liquid Acrylic Resin', 'Poured UV Liquid Acrylic Resin', 'Solid Precision-Cut Cast Acrylic Sheet'],
    ['Return Casing', 'Fabricated Aluminum Alloy Channel', 'Industrial Additive Polymer (3D Printed)', 'Industrial Additive Polymer (3D Printed)'],
    ['Available Depths', '40 mm, 60 mm, 80 mm', '20 mm to 50 mm', '20 mm to 50 mm'],
    ['Return Finishes', 'All standard architectural colors', 'Standard colors + Dual-Colour Rising', 'All standard architectural colors'],
    ['Face Color Range', 'Unlimited custom resin pigments', 'Unlimited custom resin pigments', 'Standard cast optical / translucent colors'],
    ['Structural Backing', '3 mm CNC-cut ACP Back Panel', '3 mm CNC-cut ACP Back Panel', '3 mm CNC-cut ACP Back Panel'],
    ['Fastening Hardware', 'Heavy-duty rivets & nut-bolt kit', 'Heavy-duty rivets & nut-bolt kit', 'Heavy-duty rivets & nut-bolt kit'],
    ['LED Engine', 'Rainproof LED strip (In-house soldered)', 'Rainproof LED strip (In-house soldered)', 'Rainproof LED strip (In-house soldered)'],
    ['Waterproofing Level', 'IP67 strip + secondary silicone potting', 'IP67 strip + secondary silicone potting', 'IP67 strip + secondary silicone potting']
  ]
};

const WORKFLOW = [
  ['Artwork & CAD layout', 'Letter geometry, LED layout and 1:1 hole template prepared from your artwork.'],
  ['Face production', 'Liquid acrylic is poured and UV-cured, or cast acrylic sheet is precision-cut.'],
  ['Return fabrication', 'Aluminium channel is formed, or the 3D printed polymer return is built to depth.'],
  ['LED & wiring', 'IP67 strip is laid out, hand-soldered and sealed with silicone potting.'],
  ['Back panel assembly', '3 mm ACP back plate is fitted with rivets, nuts, bolts and mounting studs.'],
  ['Pack & dispatch', 'Multi-layer stretch wrap with corner guards for damage-free delivery.']
];

const GALLERY = [
  {
    kicker: 'Production gallery · 01 / 04',
    title: 'Front View — Finished Letters',
    lead: 'Completed letter sets as they leave our workshop: clean face edges, uniform diffusion and consistent return finish.',
    photos: [
      { ...img('finished-letters', 1400, 1054), alt: 'Finished custom-colour signage letters', cap: ['Custom-colour letter set.', 'Gloss custom face with matching return, shown before back-panel sealing and installation.'] },
      { ...img('white-face-g', 963, 1280), alt: 'Letter G with white acrylic face and metal return', cap: ['Illuminated face.', 'Smooth white acrylic face with crisp, even edges.'] },
      { ...img('brushed-steel-return', 963, 1280), alt: 'Letter G showing brushed-steel return and acrylic face', cap: ['Brushed-steel return.', 'Metal side wall with a fine linear grain, set flush to the face.'] }
    ],
    callouts: [
      ['Unlimited face colours', 'Custom pigment blending on poured liquid acrylic faces.'],
      ['Choice of returns', 'Aluminium channel in 5 finishes, or 3D printed in standard colours.'],
      ['Edge-to-edge glow', 'No plastic trim caps on liquid acrylic faces.']
    ]
  },
  {
    kicker: 'Production gallery · 02 / 04',
    title: 'Inside View — LED Structure & Wiring',
    lead: "Dense, evenly spaced IP67 LED strip follows each letter's contour, with hand-soldered joints and silicone-sealed terminations.",
    photos: [
      { ...img('led-large-layout', 963, 1280), alt: 'Large LED panel with contour-following LED strips and red and black feed wires', cap: ['Large-format layout.', 'Parallel LED strip rows with silicone-secured joints and red/black polarity feed leads.'] },
      { ...img('led-concentric-rings', 963, 1280), alt: 'Three concentric LED strip rings inside letter O', cap: ['Concentric LED rings.', 'Three strip loops give uniform lighting across the full stroke width of the letter.'] },
      { ...img('led-soldered-jumpers', 1280, 963), alt: 'Letter O LED layout with output cable', cap: ['Soldered jumpers & feed cable.', 'Insulated jumpers, potted joints and a sheathed lead cable leaving the letter.'] }
    ],
    callouts: [
      ['Hand-soldered joints', 'No push-in clips; joints are vibration-proof.'],
      ['Silicone potting', 'Secondary waterproofing over all terminations.'],
      ['Sized per letter', 'LED wattage is calculated for every custom order.']
    ]
  },
  {
    kicker: 'Production gallery · 03 / 04',
    title: 'Back Panel View — ACP Plate & Fastening',
    lead: 'Each letter is closed with a CNC-cut 3 mm ACP back plate, perimeter-sealed and fitted with threaded studs and wire leads.',
    photos: [
      { ...img('back-plates-batch', 963, 1280), alt: 'Stack of finished back panels with mounting studs and wire leads', cap: ['Batch of finished back plates.', 'Each plate is fitted with mounting studs and a wire lead with a ring terminal.'] },
      { ...img('back-sealed-perimeter', 1400, 1054), alt: 'Back of large letters with black sealant, ACP panel and studs', cap: ['Sealed perimeter.', 'The ACP back plate is bonded and sealed around the full return edge, with the sheathed cable exiting at the back.'] },
      { ...img('back-studs-hardware', 963, 1280), alt: 'Back of a small letter showing studs and sealant bead', cap: ['Mounting studs & hardware.', 'Threaded studs with nuts fixed through the back plate for secure wall mounting.'] }
    ],
    callouts: [
      ['3 mm ACP back plate', 'CNC-cut to the exact letter outline.'],
      ['Rivets, nuts & bolts', 'Blind rivets plus stainless fasteners for wind-load rigidity.'],
      ['1:1 hole template', 'PDF / DXF supplied for fast, accurate on-site fixing.']
    ]
  },
  {
    kicker: 'Production gallery · 04 / 04',
    title: 'Liquid Acrylic Pouring & UV Curing',
    lead: 'Poured faces are loaded into our UV curing machine, where weighted fixtures hold each letter flat while the resin cures to a glass-smooth finish.',
    photos: [
      { ...img('uv-curing-machine', 1280, 963), alt: 'Letters weighted down inside the UV curing machine with UV lamps on', cap: ['Inside the curing machine.', 'UV tubes run beneath and around the letters while weighted fixtures hold each one in place during cure.'] },
      { ...img('loaded-before-curing', 963, 1280), alt: 'Letters and weights loaded in the curing machine before curing', cap: ['Loaded before curing.', 'Letter fixtures and weights positioned on the glass bed.'] }
    ],
    bullets: [
      'Resin colour is blended to your custom specification.',
      'Faces are poured in a dust-controlled area.',
      'Letters are weighted level inside the UV curing machine.',
      'Cured faces then move on to LED fitting and back-panel assembly.'
    ]
  }
];

const COMMERCIAL = [
  ['Internal Loop Wiring', '0.5 sq mm copper wire factory-routed for all internal letter loops with insulated pass-through grommets.'],
  ['Main Letter Lead Wiring', '1.5 sq mm copper wire heavy-duty main feed wire with color-coded polarity leads (+/-).'],
  ['Mechanical Hardware Kit', 'High-shear blind rivets, stainless steel machine nuts, bolts, washers, and threaded rear mounting studs tailored to project depth.'],
  ['Pre-Engineered Hole Design', 'Full 1:1 CAD hole layout template (PDF/DXF) showing exact electrical pass-throughs and structural mounting anchor points.'],
  ['Protective Packaging', 'Multi-layer plastic stretch-wrap packaging with edge corner guards for damage-free delivery.'],
  ['LED Wattage Sizing', 'Adhitech calculates and confirms the LED wattage for every custom order, based on your exact scale and diode layout.']
];

const ORDER = [
  ['Artwork', 'vector file or clear logo / font name'],
  ['Letter height', 'and required return depth'],
  ['System', '01, 02 or 03'],
  ['Return finish', 'and face colour'],
  ['Quantity', 'and number of letter sets'],
  ['Mounting surface', 'wall, panel or frame']
];

const allPhotos = GALLERY.flatMap((g) => g.photos);

export default function B2BCatalogue() {
  const [openSrc, setOpenSrc] = useState(null);
  const openIndex = openSrc ? allPhotos.findIndex((p) => p.src === openSrc) : -1;

  return (
    <div className="cat">
      {/* Cover */}
      <header className="cat-cover">
        <div className="cat-cover-top">
          <img className="cat-logo" src="/assets/adhitech_logo_light.png" alt="Adhitech Advertising Technology" />
          <div className="cat-edition">
            <span>B2B Trade Catalogue</span>
            <span>2026 / 2027 Specification Edition</span>
          </div>
        </div>
        <div className="cat-cover-body">
          <div className="cat-cover-text">
            <span className="section-tag">Commercial illuminated letter systems</span>
            <h3 className="cat-title">Precision Custom Signage Letters</h3>
            <p className="cat-lead">
              Engineered dimensional signage letters manufactured for commercial sign shops, architectural branding firms,
              and retail fit-out contractors. Combining liquid acrylic casting, CNC metal channels, and industrial 3D
              additive manufacturing with IP67 rainproof LED systems.
            </p>
            <div className="cat-cta">
              <a className="est-btn primary" href="/downloads/Adhitech-B2B-Catalogue.pdf" download>
                <Download size={16} /> Download PDF catalogue
              </a>
              <a className="est-btn" href={WA_HREF} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} /> Request a quotation
              </a>
            </div>
          </div>
          <button className="cat-cover-photo" onClick={() => setOpenSrc('/b2b/finished-letters.jpg')} aria-label="View photo larger">
            <img src="/b2b/finished-letters.jpg" width="1400" height="1054" alt="Finished custom-colour signage letters" />
          </button>
        </div>

        <div className="cat-pillars">
          {SYSTEMS.map((s) => (
            <div key={s.no} className="cat-pillar">
              <h4>{s.no}. {s.short}</h4>
            </div>
          ))}
        </div>
        <p className="cat-standards">
          <strong>Standards:</strong> 3 mm ACP Backing • Blind Rivets • Nut &amp; Bolt Fasteners • IP67 Rainproof LEDs
          &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Scope:</strong> Wiring &amp; Hole Design Included • LED Wattage Provided
        </p>
      </header>

      {/* At a glance */}
      <div className="cat-stats">
        {[['3', 'Letter systems'], ['20–80 mm', 'Return depth range'], ['IP67', 'Rainproof LED strip'], ['3 mm', 'ACP back plate']].map(([n, l]) => (
          <div className="cat-stat" key={l}><div className="n">{n}</div><div className="l">{l}</div></div>
        ))}
      </div>

      {/* Systems */}
      <section className="cat-section">
        <span className="section-tag">System overview</span>
        <h3 className="cat-h">B2B Architectural Manufacturing &amp; System Overview</h3>
        <p className="cat-p">
          <strong>Adhitech Advertising Technology Pvt Ltd</strong> is a specialized manufacturer supplying custom illuminated
          dimensional letters to signage fabricators and commercial contractors. Every letter is built to exterior-grade
          standards with 3 mm ACP back panels, mechanical fasteners, and in-house soldered rainproof LEDs.
        </p>
        <div className="cat-systems">
          {SYSTEMS.map((s) => (
            <article className="cat-system card-premium" key={s.no}>
              <div className="cat-system-no">System {s.no}</div>
              <h4>{s.title}</h4>
              <p>{s.intro}</p>
              <ul>
                {s.points.map(([k, v]) => (
                  <li key={k}><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Chooser */}
      <section className="cat-section">
        <h3 className="cat-h">Which system should I choose?</h3>
        <div className="cat-scroll">
          <table className="cat-table">
            <thead><tr><th style={{ width: '58%' }}>If your project needs…</th><th>Choose</th></tr></thead>
            <tbody>
              {CHOOSER.map(([need, sys, name]) => (
                <tr key={sys}><td>{need}</td><td><strong>{sys}</strong><br />{name}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="cat-h sub">What every system includes</h3>
        <div className="cat-callouts">
          {INCLUDES.map(([t, d]) => (
            <div className="cat-callout" key={t}><b>{t}</b>{d}</div>
          ))}
        </div>
      </section>

      {/* Matrix */}
      <section className="cat-section">
        <span className="section-tag">Compare</span>
        <h3 className="cat-h">Master Technical Comparison Matrix</h3>
        <p className="cat-p">Comprehensive engineering comparison across all three signage letter systems:</p>
        <div className="cat-scroll">
          <table className="cat-table cat-matrix">
            <thead><tr>{MATRIX.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {MATRIX.rows.map((r) => (
                <tr key={r[0]}>{r.map((c, i) => (i === 0 ? <td key={i}><strong>{c}</strong></td> : <td key={i}>{c}</td>))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Structural */}
      <section className="cat-section">
        <span className="section-tag">Engineering</span>
        <h3 className="cat-h">Structural Engineering &amp; Electrical Specifications</h3>
        <div className="cat-two">
          <div className="cat-block">
            <h4>1. Heavy-Duty ACP Back Panel &amp; Mechanical Assembly</h4>
            <p>
              Every letter incorporates a <strong>3 mm Aluminum Composite Panel (ACP) back plate</strong> precision CNC-cut to
              exact letter geometry. The back plate is fastened using <strong>industrial blind rivets</strong> and reinforced
              with <strong>stainless steel nuts and bolts</strong>, providing extreme torsional rigidity and wind-load resistance.
            </p>
          </div>
          <div className="cat-block">
            <h4>2. In-House Soldered Rainproof LEDs &amp; Dual Waterproofing</h4>
            <ul>
              <li><strong>Rainproof LED Strip:</strong> High-efficiency IP67 SMD architectural LEDs rated for 50,000+ hours.</li>
              <li><strong>In-House Hand Soldering:</strong> Zero push-in clips. All inter-module jumpers and supply feeds are manually soldered with high-purity solder for vibration-proof connectivity.</li>
              <li><strong>Secondary Waterproofing:</strong> Solder joints and terminations receive a protective layer of optical-grade RTV silicone potting and heat-shrink tubing to guarantee complete weatherproofing.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="cat-section">
        <span className="section-tag">From drawing to dispatch</span>
        <h3 className="cat-h">Our Production Workflow</h3>
        <p className="cat-p">Every order moves through the same controlled sequence, so each letter set arrives matched, wired and ready to mount.</p>
        <div className="cat-flow">
          {WORKFLOW.map(([t, d], i) => (
            <div className="cat-step" key={t}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <b>{t}</b>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      {GALLERY.map((g) => (
        <section className="cat-section" key={g.title}>
          <span className="section-tag">{g.kicker}</span>
          <h3 className="cat-h">{g.title}</h3>
          <p className="cat-p">{g.lead}</p>
          <div className="cat-photos">
            {g.photos.map((p) => (
              <figure className="cat-fig" key={p.src}>
                <button className="cat-fig-btn" onClick={() => setOpenSrc(p.src)} aria-label={`View larger: ${p.alt}`}>
                  <img src={p.src} width={p.w} height={p.h} loading="lazy" alt={p.alt} />
                  <span className="cat-zoom"><ZoomIn size={16} /></span>
                </button>
                <figcaption><strong>{p.cap[0]}</strong> {p.cap[1]}</figcaption>
              </figure>
            ))}
          </div>
          {g.callouts && (
            <div className="cat-callouts">
              {g.callouts.map(([t, d]) => <div className="cat-callout" key={t}><b>{t}</b>{d}</div>)}
            </div>
          )}
          {g.bullets && (
            <div className="cat-block cat-glance">
              <h4>Pour &amp; cure at a glance</h4>
              <ul>{g.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </div>
          )}
        </section>
      ))}

      {/* Commercial */}
      <section className="cat-section">
        <span className="section-tag">Commercial</span>
        <h3 className="cat-h">Commercial Inclusions &amp; Technical Scope</h3>
        <p className="cat-p">
          Adhitech provides transparent pricing for custom letter fabrication. Trade partners receive fully pre-engineered,
          ready-to-mount letter sets with full hardware and electrical documentation.
        </p>
        <div className="cat-scroll">
          <table className="cat-table">
            <thead><tr><th>Deliverable / Component</th><th>Status in Base Price</th><th>Technical Specification</th></tr></thead>
            <tbody>
              {COMMERCIAL.map(([k, v]) => (
                <tr key={k}>
                  <td><strong>{k}</strong></td>
                  <td><span className="cat-included"><Check size={12} /> Included</span></td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Order + contact */}
      <section className="cat-section cat-order">
        <div>
          <span className="section-tag">Place an order</span>
          <h3 className="cat-h">How to place an order</h3>
          <p className="cat-p">Send the following to us on WhatsApp or by email, and we will return a specification and quotation:</p>
          <ul className="cat-checklist">
            {ORDER.map(([k, v]) => (
              <li key={k}><Check size={16} /> <span><strong>{k}</strong> — {v}</span></li>
            ))}
          </ul>
        </div>
        <aside className="cat-desk card-premium">
          <img src="/assets/adhitech_logo_light.png" alt="Adhitech Advertising Technology" />
          <h4>Trade Enquiries &amp; Technical Desk</h4>
          <p className="muted">Commercial Signage Systems &amp; Architectural Letter Fabrication</p>
          <a href={WA_HREF} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp: {companyInfo.contact.phone}</a>
          <a href={`mailto:${companyInfo.contact.email}`}><Mail size={16} /> {companyInfo.contact.email}</a>
          <a href={`tel:${companyInfo.contact.phone.split(',')[0].replace(/[^+\d]/g, '')}`}><Phone size={16} /> Call us</a>
          <span className="addr"><MapPin size={16} /> {companyInfo.contact.address}</span>
        </aside>
      </section>

      {openIndex >= 0 && (
        <MediaLightbox
          items={allPhotos}
          index={openIndex}
          label="B2B catalogue photo"
          onChange={(i) => setOpenSrc(allPhotos[i].src)}
          onClose={() => setOpenSrc(null)}
        />
      )}
    </div>
  );
}
