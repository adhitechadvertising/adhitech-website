import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calculator, BookOpen, Sparkles, ArrowRight, CheckCircle2, MessageCircle, Factory, Ruler, PackageCheck } from 'lucide-react';
import LetterEstimator from '../components/LetterEstimator';
import B2BCatalogue from '../components/B2BCatalogue';
import RentalCatalogue from '../components/RentalCatalogue';
import { companyInfo } from '../data/company';
import './b2b.css';
import PageMeta from '../components/PageMeta';

const TABS = [
  { id: 'estimator', label: 'Cost Estimator', Icon: Calculator },
  { id: 'catalogue', label: 'Product Catalogue', Icon: BookOpen },
  { id: 'rental', label: 'Rental Letters', Icon: Sparkles }
];

const idFromHash = (hash) => {
  const id = hash.replace('#', '');
  return TABS.some((t) => t.id === id) ? id : TABS[0].id;
};

const whatsappNumber = companyInfo.contact.phone.split(',')[0].replace(/\D/g, '');
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Adhitech, I am a signage business and would like to discuss B2B channel-letter manufacturing. Please share the details.')}`;

const systems = [
  {
    title: 'Liquid Acrylic + Fabricated Channel',
    description: 'Liquid Acrylic faces paired with fabricated channel construction for illuminated signage letters.',
    image: '/b2b/finished-letters.jpg'
  },
  {
    title: 'Liquid Acrylic + 3D Printed Letters',
    description: 'A production route combining Liquid Acrylic faces with 3D-printed letter bodies.',
    image: '/assets/industrial_3d_printing.png'
  },
  {
    title: 'Cast Acrylic + 3D Printed Letters',
    description: 'An alternative letter construction for projects specified around cast acrylic faces.',
    image: '/assets/project_liquid_acrylic_detail.jpg'
  }
];

const capabilities = [
  { Icon: Factory, title: 'In-house production', text: 'CNC routing, laser cutting, channel bending, 3D printing and Liquid Acrylic processing.' },
  { Icon: Ruler, title: 'Drawing-based quotations', text: 'Share a DXF, dimensions or reference images so the requirement can be reviewed before pricing.' },
  { Icon: PackageCheck, title: 'Repeat and batch work', text: 'Discuss recurring production, multiple-letter sets and project-wise manufacturing requirements.' }
];

export default function B2B() {
  const location = useLocation();
  const [picked, setPicked] = useState(null);
  const activeId = picked && picked.hash === location.hash ? picked.id : idFromHash(location.hash);

  const selectTab = (id) => {
    setPicked({ id, hash: location.hash });
    window.history.replaceState(null, '', `/b2b#${id}`);
  };

  return (
    <div className="b2b-page">
      <PageMeta title="B2B Channel Letter Manufacturing | Adhitech" description="Outsource Liquid Acrylic LED letters and channel-letter production to Adhitech, Jaipur. Share DXF drawings, explore manufacturing options, see event letters on rent and request a trade quotation." path="/b2b" />
      <div className="bg-grid-overlay" />
      <div className="bg-radial-glow" />

      <section className="container b2b-hero">
        <span className="section-tag">B2B · Manufacturing for trade customers</span>
        <h1>Your Signage Orders. Our Manufacturing.</h1>
        <p className="b2b-lead">
          A production partner for sign makers, advertising fabricators and branding agencies. Outsource Liquid Acrylic LED letters and channel-letter work to our Jaipur manufacturing facility.
        </p>
        <div className="b2b-hero-actions">
          <a className="b2b-primary-action" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} /> Discuss a B2B order
          </a>
          <a className="b2b-secondary-action" href="#b2b-tools" onClick={(event) => { event.preventDefault(); selectTab('estimator'); document.getElementById('b2b-tools')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Estimate your letters <ArrowRight size={17} />
          </a>
        </div>
        <div className="b2b-trust-line">
          <span><CheckCircle2 size={16} /> Production from drawings</span>
          <span><CheckCircle2 size={16} /> Multiple letter construction options</span>
          <span><CheckCircle2 size={16} /> Enquiries for repeat and bulk work</span>
        </div>
      </section>

      <section className="container b2b-content-section">
        <div className="b2b-section-intro">
          <span className="section-tag">Manufacturing options</span>
          <h2>Choose the right construction for your project</h2>
          <p>Different jobs call for different letter constructions. Share your design and specifications and we can help review the suitable production route.</p>
        </div>
        <div className="b2b-systems-grid">
          {systems.map((system) => (
            <article className="b2b-system-card" key={system.title}>
              <img src={system.image} alt={system.title} loading="lazy" />
              <div><h3>{system.title}</h3><p>{system.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="b2b-capabilities-band">
        <div className="container">
          <div className="b2b-section-intro">
            <span className="section-tag">How we support trade customers</span>
            <h2>Built around your production workflow</h2>
          </div>
          <div className="b2b-capabilities-grid">
            {capabilities.map(({ Icon, title, text }) => (
              <article className="b2b-capability" key={title}>
                <Icon size={23} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="b2b-tools" className="container b2b-tools-section">
        <div className="b2b-section-intro">
          <span className="section-tag">Plan your requirement</span>
          <h2>Estimator, catalogue & rental letters</h2>
          <p>Use the estimator for an initial reference, browse the catalogue for construction details, or see the event letters we offer on rent. Final quotations are confirmed against drawings and specifications.</p>
        </div>
        <div className="b2b-tabs" role="tablist" aria-label="B2B tools">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} role="tab" aria-selected={id === activeId} aria-controls={`b2b-panel-${id}`} className={'b2b-tab' + (id === activeId ? ' active' : '')} onClick={() => selectTab(id)}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>
        <div id={`b2b-panel-${activeId}`} key={activeId} className="b2b-body" role="tabpanel">
          {activeId === 'estimator' && <><div className="b2b-sec-head"><h2>Letter Cost Estimator</h2></div><LetterEstimator /></>}
          {activeId === 'catalogue' && <><div className="b2b-sec-head"><h2>B2B Product Catalogue</h2></div><B2BCatalogue /></>}
          {activeId === 'rental' && <><div className="b2b-sec-head"><h2>Rental Letters Catalogue</h2></div><RentalCatalogue /></>}
        </div>
      </section>

      <section className="container b2b-final-cta">
        <div>
          <span className="section-tag">Start a conversation</span>
          <h2>Have drawings ready?</h2>
          <p>Send your DXF, dimensions, reference photos or a short project brief. We’ll review the requirement and discuss the next steps.</p>
        </div>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="b2b-primary-action"><MessageCircle size={18} /> Send an enquiry on WhatsApp</a>
      </section>
    </div>
  );
}
