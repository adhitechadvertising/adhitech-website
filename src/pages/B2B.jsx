import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calculator, BookOpen } from 'lucide-react';
import LetterEstimator from '../components/LetterEstimator';
import B2BCatalogue from '../components/B2BCatalogue';
import './b2b.css';

const TABS = [
  { id: 'estimator', label: 'Cost Estimator', Icon: Calculator },
  { id: 'catalogue', label: 'Catalogue', Icon: BookOpen }
];

const idFromHash = (hash) => {
  const id = hash.replace('#', '');
  return TABS.some((t) => t.id === id) ? id : TABS[0].id;
};

export default function B2B() {
  const location = useLocation();
  // Tab picked by the visitor, tied to the URL hash it was picked under so that
  // following a link like /b2b#catalogue always wins.
  const [picked, setPicked] = useState(null);
  const activeId = picked && picked.hash === location.hash ? picked.id : idFromHash(location.hash);

  const selectTab = (id) => {
    setPicked({ id, hash: location.hash });
    window.history.replaceState(null, '', `/b2b#${id}`);
  };

  return (
    <div className="b2b-page">
      <div className="bg-grid-overlay" />
      <div className="bg-radial-glow" />

      <section className="container b2b-hero">
        <span className="section-tag">B2B · Trade customers</span>
        <h1>Custom Signage Letters for Trade</h1>
        <p>
          Made for commercial sign shops, architectural branding firms and retail fit-out contractors. Check the cost of
          your letters instantly, then browse our specification catalogue.
        </p>

        <div className="b2b-tabs" role="tablist" aria-label="B2B sections">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={id === activeId}
              className={'b2b-tab' + (id === activeId ? ' active' : '')}
              onClick={() => selectTab(id)}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>
      </section>

      <section id={activeId} key={activeId} className="container b2b-body">
        {activeId === 'estimator' ? (
          <>
            <div className="b2b-sec-head">
              <h2>Cost Estimator</h2>
            </div>
            <LetterEstimator />
          </>
        ) : (
          <>
            <div className="b2b-sec-head">
              <h2>B2B Catalogue</h2>
            </div>
            <B2BCatalogue />
          </>
        )}
      </section>
    </div>
  );
}
