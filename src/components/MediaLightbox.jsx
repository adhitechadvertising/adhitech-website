import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Full-screen viewer for gallery photos and videos. Media is always shown at its
// natural aspect ratio (never stretched or cropped).
export default function MediaLightbox({ items, index, onClose, onChange, label }) {
  const item = items[index];
  const touchStartX = useRef(null);
  const total = items.length;

  const prev = () => onChange((index - 1 + total) % total);
  const next = () => onChange((index + 1) % total);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 60 && total > 1) (dx < 0 ? next : prev)();
  };

  return (
    <div
      className="lb-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button className="lb-btn lb-close" onClick={onClose} aria-label="Close">
        <X size={22} />
      </button>

      {total > 1 && (
        <button className="lb-btn lb-prev" onClick={prev} aria-label="Previous">
          <ChevronLeft size={26} />
        </button>
      )}

      <div className="lb-stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {item.type === 'video' ? (
          <video
            key={item.src}
            className="lb-media"
            src={item.src}
            poster={item.poster}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <img key={item.src} className="lb-media" src={item.src} alt={`${label} ${index + 1}`} />
        )}
      </div>

      {total > 1 && (
        <button className="lb-btn lb-next" onClick={next} aria-label="Next">
          <ChevronRight size={26} />
        </button>
      )}

      <div className="lb-count">
        {index + 1} / {total}
      </div>

      <style>{`
        .lb-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(6,6,6,0.96);
          display: flex; align-items: center; justify-content: center;
          animation: lbFade 0.25s ease both;
        }
        @keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }
        .lb-stage {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 4.5rem 5rem;
        }
        .lb-media {
          max-width: 100%; max-height: 100%;
          width: auto; height: auto; object-fit: contain;
          border-radius: 6px; box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }
        .lb-btn {
          position: absolute; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          width: 46px; height: 46px; border-radius: 50%;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          color: #fff; cursor: pointer; transition: background 0.25s ease, border-color 0.25s ease;
        }
        .lb-btn:hover { background: var(--accent); border-color: var(--accent); }
        .lb-close { top: 1.25rem; right: 1.25rem; }
        .lb-prev { left: 1.25rem; top: 50%; transform: translateY(-50%); }
        .lb-next { right: 1.25rem; top: 50%; transform: translateY(-50%); }
        .lb-count {
          position: absolute; bottom: 1.25rem; left: 50%; transform: translateX(-50%);
          font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.1em;
          color: var(--text-secondary);
        }
        @media (max-width: 700px) {
          .lb-stage { padding: 4rem 0.75rem 3.5rem; }
          .lb-prev, .lb-next { top: auto; bottom: 0.9rem; transform: none; width: 40px; height: 40px; }
          .lb-prev { left: 1rem; }
          .lb-next { right: 1rem; }
        }
      `}</style>
    </div>
  );
}
