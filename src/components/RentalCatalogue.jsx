import { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Check, ZoomIn } from 'lucide-react';
import MediaLightbox from './MediaLightbox';
import { companyInfo } from '../data/company';

const whatsappNumber = companyInfo.contact.phone.split(',')[0].replace(/\D/g, '');
const WA_HREF =
  'https://wa.me/' + whatsappNumber + '?text=' +
  encodeURIComponent('Hello Adhitech, I would like to enquire about channel letters on rent for an event.');

const photo = (name, w, h, alt) => ({ type: 'image', src: `/b2b/rental/${name}.jpg`, w, h, alt });

const PRODUCTS = [
  {
    tag: 'Classic',
    title: 'Warm white channel letters',
    text: 'Bold, glossy liquid acrylic letters with a soft golden glow. Elegant, timeless and made for photographs.',
    image: photo('warm-white-letters', 1400, 788, '#SHAADI in warm white liquid acrylic channel letters, lit'),
    swatches: [['#ffcf8a', 'Warm white illumination']],
    specs: [
      ['Material', 'Liquid acrylic'],
      ['Letter depth', '80 mm channel'],
      ['Letter height', '18 inch'],
      ['Light colour', 'Warm white'],
      ['Best for', 'Stage backdrops, entrances, mandaps']
    ]
  },
  {
    tag: 'Trending',
    title: 'Crystal neon letters',
    text: 'Vibrant neon tube lettering on a crystal-clear acrylic base, so the words appear to float. Pick any colour to match the event theme.',
    image: photo('neon-letters', 1400, 467, '#SHAADI in multi-colour neon tube letters on clear acrylic'),
    wide: true,
    swatches: [['#ff3ea5'], ['#27e6ff'], ['#8b5cff'], ['#ffd23e', 'RGB colour options']],
    specs: [
      ['Style', 'Neon tube letters'],
      ['Base', 'Transparent acrylic, 12 mm'],
      ['Letter height', '18 inch'],
      ['Light colour', 'RGB (multi-colour)'],
      ['Best for', 'Photo booths, reception, sangeet, parties']
    ]
  }
];

const GALLERY = [
  { ...photo('installed-on-site', 1280, 720, '#VKHIGHINLOVE channel letters being installed on a stage at a wedding venue'), cap: 'Installed on site' },
  { ...photo('lit-at-night', 1400, 1050, '#VKHIGHAINLOVE warm white channel letters glowing in the dark'), cap: 'Lit at night' },
  { ...photo('single-letter', 1400, 933, 'Warm white channel letter A, lit'), cap: 'Single letter' },
  { ...photo('clear-acrylic-base', 1400, 788, 'Neon tube letters standing on clear acrylic bases'), cap: 'Clear acrylic base' },
  { ...photo('neon-unlit', 1400, 933, 'Neon tube letters mounted on clear acrylic bases'), cap: 'Neon, unlit' }
];

// Gallery rows: photos in a row share one height, so every photo keeps its own proportions.
const GALLERY_ROWS = [GALLERY.slice(0, 3), GALLERY.slice(3)];

// Product photos first, then the gallery, so the viewer can step through everything.
const ALL_PHOTOS = [...PRODUCTS.map((p) => p.image), ...GALLERY];

const FACTS = [
  ['Rental only', 'No purchase, no storage worries'],
  ['Any word or hashtag', 'Names, quotes, initials'],
  ['2 signature styles', 'Warm white and RGB neon'],
  ['Made for planners', 'Special terms for event organisers']
];

const WORDS = ['#AwedsB', 'MR & MRS', 'LOVE', 'WELCOME', 'A ♥ B', 'HAPPY BIRTHDAY', 'SHE SAID YES', 'BRIDE TO BE', 'SANGEET', 'MEHENDI', 'HALDI', 'CHEERS'];

const OCCASIONS = [
  ['Wedding and reception', 'Couple initials or hashtag behind the stage and at the entrance.'],
  ['Sangeet and mehendi', 'Colourful RGB neon words that set the party mood.'],
  ['Engagement and roka', 'Elegant warm white names for a romantic look.'],
  ['Birthdays and parties', 'Age, names or messages as a photo-ready backdrop.'],
  ['Corporate and launches', 'Brand names and taglines for stage and registration areas.']
];

const STEPS = [
  ['Share the details', 'Event date, venue, the word or hashtag and the style you prefer.'],
  ['Get your quote', 'We discuss the rental rate based on your requirement and event.'],
  ['Confirm and book', 'Lock your date with a booking confirmation.'],
  ['Installed on site', 'Our team installs the letters at your venue, ready before the event.'],
  ['Enjoy, we collect', 'Celebrate. We collect the letters from the venue once the event is over.']
];

const TERMS = [
  'Rental rates are discussed and agreed with each client.',
  'Advance booking is recommended during wedding season.',
  'Installation at the venue and collection after the event are handled by our team.',
  'Custom words and colour combinations are available on request.'
];

export default function RentalCatalogue() {
  const [openSrc, setOpenSrc] = useState(null);
  const openIndex = openSrc ? ALL_PHOTOS.findIndex((p) => p.src === openSrc) : -1;

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="cat rent">
      {/* Cover */}
      <header className="cat-cover rent-cover">
        <div className="cat-cover-top">
          <img className="cat-logo" src="/assets/adhitech_logo_light.png" alt="Adhitech Advertising Technology" />
          <div className="cat-edition">
            <span>Event letter rentals</span>
            <span>For planners and decorators</span>
          </div>
        </div>
        <div className="rent-cover-body">
          <div className="rent-glow" aria-hidden="true">#AwedsB</div>
          <h3 className="cat-title">Channel letters on rent</h3>
          <p className="cat-lead">
            Illuminated lettering for weddings, receptions, sangeets and parties. Names, hashtags and messages that
            look stunning on stage, entrances and photo corners.
          </p>
          <div className="cat-cta">
            <button type="button" className="est-btn primary" onClick={() => scrollTo('rent-collection')}>
              View the collection
            </button>
            <a className="est-btn" href={WA_HREF} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} /> Get a quote
            </a>
          </div>
        </div>
        <div className="rent-facts">
          {FACTS.map(([t, d]) => (
            <div className="rent-fact" key={t}><b>{t}</b><span>{d}</span></div>
          ))}
        </div>
      </header>

      {/* Collection */}
      <section className="cat-section" id="rent-collection">
        <span className="section-tag">The collection</span>
        <h3 className="cat-h">Two styles, endless words</h3>
        <p className="cat-p">
          Choose the glow that suits your client&apos;s theme. Both styles can be combined in one setup, for example
          warm white names with an RGB neon hashtag.
        </p>
        <div className="rent-products">
          {PRODUCTS.map((p) => (
            <article className="rent-product" key={p.title}>
              <button
                type="button"
                className={'rent-photo' + (p.wide ? ' fit' : '')}
                style={p.wide ? { '--rent-bg': `url(${p.image.src})` } : undefined}
                onClick={() => setOpenSrc(p.image.src)}
                aria-label={`View larger: ${p.image.alt}`}
              >
                <span className="rent-tag">{p.tag}</span>
                <img src={p.image.src} width={p.image.w} height={p.image.h} loading="lazy" alt={p.image.alt} />
                <span className="cat-zoom"><ZoomIn size={16} /></span>
              </button>
              <div className="rent-product-body">
                <h4>{p.title}</h4>
                <p>{p.text}</p>
                <div className="rent-swatches">
                  {p.swatches.map(([c]) => (
                    <span key={c} className="rent-dot" style={{ background: c, color: c }} />
                  ))}
                  <span>{p.swatches[p.swatches.length - 1][1]}</span>
                </div>
                <ul className="rent-specs">
                  {p.specs.map(([k, v]) => (
                    <li key={k}><span>{k}</span><span>{v}</span></li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="cat-section">
        <span className="section-tag">Gallery</span>
        <h3 className="cat-h">Our letters at real events</h3>
        <p className="cat-p">From our workshop to the wedding venue.</p>
        <div className="rent-gallery">
          {GALLERY_ROWS.map((row, r) => (
            <div className="rent-row" key={r}>
              {row.map((g) => (
                <button
                  type="button"
                  className="rent-shot"
                  key={g.src}
                  style={{ flexGrow: g.w / g.h }}
                  onClick={() => setOpenSrc(g.src)}
                  aria-label={`View larger: ${g.alt}`}
                >
                  <img src={g.src} width={g.w} height={g.h} loading="lazy" alt={g.alt} />
                  <span className="rent-cap">{g.cap}</span>
                  <span className="cat-zoom"><ZoomIn size={16} /></span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Words */}
      <section className="cat-section">
        <span className="section-tag">Popular setups</span>
        <h3 className="cat-h">Spell out the celebration</h3>
        <p className="cat-p">We can arrange letters for any word, name or hashtag your client wants. Some of the most popular ones:</p>
        <div className="rent-chips">
          {WORDS.map((w) => <span className="rent-chip" key={w}>{w}</span>)}
        </div>
      </section>

      {/* Occasions */}
      <section className="cat-section">
        <h3 className="cat-h">Perfect for every function</h3>
        <div className="cat-callouts">
          {OCCASIONS.map(([t, d]) => (
            <div className="cat-callout" key={t}><b>{t}</b>{d}</div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="cat-section">
        <span className="section-tag">How it works</span>
        <h3 className="cat-h">Simple for planners</h3>
        <p className="cat-p">A smooth process so you can promise your clients a perfect look.</p>
        <div className="cat-flow">
          {STEPS.map(([t, d], i) => (
            <div className="cat-step" key={t}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <b>{t}</b>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Terms + contact */}
      <section className="cat-section cat-order">
        <div>
          <span className="section-tag">Plan an event</span>
          <h3 className="cat-h">Let&apos;s make it glow</h3>
          <p className="cat-p">Tell us the date, the word and the vibe. We&apos;ll get back to you with availability and a quote.</p>
          <ul className="cat-checklist rent-terms">
            {TERMS.map((t) => (
              <li key={t}><Check size={16} /> <span>{t}</span></li>
            ))}
          </ul>
          <div className="cat-cta rent-cta">
            <a className="est-btn primary" href={WA_HREF} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} /> Enquire on WhatsApp
            </a>
          </div>
        </div>
        <aside className="cat-desk card-premium">
          <img src="/assets/adhitech_logo_light.png" alt="Adhitech Advertising Technology" />
          <h4>Rental enquiries</h4>
          <p className="muted">Event lettering on rent, installed and collected by our team</p>
          <a href={WA_HREF} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp: {companyInfo.contact.phone}</a>
          <a href={`mailto:${companyInfo.contact.email}`}><Mail size={16} /> {companyInfo.contact.email}</a>
          <a href={`tel:${companyInfo.contact.phone.split(',')[0].replace(/[^+\d]/g, '')}`}><Phone size={16} /> Call us</a>
          <span className="addr"><MapPin size={16} /> {companyInfo.contact.address}</span>
        </aside>
      </section>

      {openIndex >= 0 && (
        <MediaLightbox
          items={ALL_PHOTOS}
          index={openIndex}
          label="Rental letters photo"
          onChange={(i) => setOpenSrc(ALL_PHOTOS[i].src)}
          onClose={() => setOpenSrc(null)}
        />
      )}
    </div>
  );
}
