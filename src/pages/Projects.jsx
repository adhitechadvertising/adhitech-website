import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';
import { galleryCategories } from '../data/gallery';
import MediaLightbox from '../components/MediaLightbox';
import PageMeta from '../components/PageMeta';

const countLabel = (items) => {
  const photos = items.filter((i) => i.type === 'image').length;
  const videos = items.length - photos;
  const parts = [];
  if (photos) parts.push(`${photos} photo${photos > 1 ? 's' : ''}`);
  if (videos) parts.push(`${videos} video${videos > 1 ? 's' : ''}`);
  return parts.join(' · ');
};

const idFromHash = (hash) => {
  const id = hash.replace('#', '');
  return galleryCategories.some((c) => c.id === id) ? id : galleryCategories[0].id;
};

export default function Projects() {
  const location = useLocation();
  // Tab picked by the visitor; tied to the URL hash it was picked under so that
  // following a link like /projects#mega-signage always wins.
  const [picked, setPicked] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const activeId =
    picked && picked.hash === location.hash ? picked.id : idFromHash(location.hash);

  // Keep the active tab visible when the tab row scrolls sideways on phones.
  useEffect(() => {
    document
      .querySelector('.pj-tab.active')
      ?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [activeId]);

  const category = galleryCategories.find((c) => c.id === activeId);

  const selectCategory = (id) => {
    setPicked({ id, hash: location.hash });
    setOpenIndex(null);
    // Keep the URL shareable without triggering a page scroll jump.
    window.history.replaceState(null, '', `/projects#${id}`);
  };

  return (
    <>
      <PageMeta title="Signage Manufacturing Projects | Adhitech" description="View Adhitech signage, Liquid Acrylic LED letter, corporate branding, CNC cutting and fabrication project work." path="/projects" />

    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <section className="container" style={{ paddingTop: '9rem', position: 'relative', zIndex: 2 }}>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', margin: '0 0 1.25rem', lineHeight: 1.1 }}>
          Projects
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', lineHeight: 1.7 }}>
          Photos and videos from our signage, mega structures and CNC work.
        </p>

        <div className="pj-tabs" role="tablist" aria-label="Project categories">
          {galleryCategories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={c.id === activeId}
              className={`pj-tab ${c.id === activeId ? 'active' : ''}`}
              onClick={() => selectCategory(c.id)}
            >
              {c.title}
              <span className="pj-tab-count">{c.items.length}</span>
            </button>
          ))}
        </div>
      </section>

      <section
        id={category.id}
        key={category.id}
        className="container pj-section"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div className="pj-head">
          <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>{category.title}</h2>
          <p className="pj-desc">{category.description}</p>
          <span className="pj-meta">{countLabel(category.items)}</span>
        </div>

        <div className="pj-grid">
          {category.items.map((item, idx) => (
            <button
              key={item.src}
              className="pj-tile"
              style={{ animationDelay: `${Math.min(idx, 8) * 60}ms` }}
              onClick={() => setOpenIndex(idx)}
              aria-label={`${item.type === 'video' ? 'Play video' : 'View photo'} ${idx + 1}`}
            >
              <img
                src={item.type === 'video' ? item.poster : item.src}
                width={item.w}
                height={item.h}
                loading="lazy"
                alt={`${category.title} ${item.type === 'video' ? 'video' : 'photo'} ${idx + 1}`}
              />
              {item.type === 'video' && (
                <span className="pj-play">
                  <Play size={22} fill="currentColor" />
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {openIndex !== null && (
        <MediaLightbox
          items={category.items}
          index={openIndex}
          label={category.title}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}

      <style>{`
        .pj-tabs {
          display: flex; gap: 0.75rem; margin-top: 2.5rem;
          overflow-x: auto; scrollbar-width: none; padding-bottom: 4px;
        }
        .pj-tabs::-webkit-scrollbar { display: none; }
        .pj-tab {
          display: inline-flex; align-items: center; gap: 0.6rem; flex-shrink: 0;
          padding: 0.85rem 1.4rem; border-radius: 999px; cursor: pointer;
          font-family: var(--font-title); font-weight: 600; font-size: 0.95rem;
          color: var(--text-secondary); background: transparent;
          border: 1px solid var(--border-color); transition: var(--transition-smooth);
        }
        .pj-tab:hover { color: var(--text-primary); border-color: rgba(212,0,0,0.5); }
        .pj-tab.active { color: #fff; background: var(--accent); border-color: var(--accent); }
        .pj-tab-count {
          font-family: var(--font-mono); font-size: 0.72rem; opacity: 0.75;
          padding: 0.1rem 0.45rem; border-radius: 999px; background: rgba(20,24,28,0.08);
        }
        .pj-tab.active .pj-tab-count { background: rgba(0,0,0,0.25); }

        .pj-section { padding-top: 4rem; padding-bottom: 8rem; }
        .pj-head { display: flex; flex-direction: column; gap: 0.9rem; margin-bottom: 3rem; max-width: 760px; animation: pjIn 0.6s ease both; }
        .pj-desc { color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; }
        .pj-meta { font-size: 0.9rem; color: var(--text-muted); }

        /* Masonry: every photo keeps its natural proportions, with generous spacing. */
        .pj-grid { column-width: 320px; column-gap: 1.75rem; }
        .pj-tile {
          position: relative; display: block; width: 100%;
          margin: 0 0 1.75rem; padding: 0; cursor: pointer;
          break-inside: avoid; overflow: hidden; border-radius: 10px;
          background: var(--bg-surface); border: 1px solid var(--border-color);
          animation: pjIn 0.6s ease both;
          transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
        }
        .pj-tile img { display: block; width: 100%; height: auto; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .pj-tile:hover { border-color: rgba(212,0,0,0.55); }
        .pj-tile:hover img { transform: scale(1.03); }
        .pj-play {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 58px; height: 58px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; padding-left: 3px;
          color: #fff; background: rgba(212,0,0,0.88); box-shadow: 0 6px 24px rgba(0,0,0,0.45);
          transition: transform 0.3s ease;
        }
        .pj-tile:hover .pj-play { transform: translate(-50%, -50%) scale(1.1); }
        @keyframes pjIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          .pj-section { padding-top: 2.5rem; padding-bottom: 5rem; }
          .pj-grid { column-gap: 1.25rem; }
          .pj-tile { margin-bottom: 1.25rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pj-tile, .pj-head { animation: none; }
        }
      `}</style>
    </div>
    </>
  );
}
