import { ChevronRight } from 'lucide-react';
import { services } from '../data/services';
import PageMeta from '../components/PageMeta';

export default function Services() {
  const handleContactScroll = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <PageMeta title="Signage & CNC Manufacturing Services | Adhitech" description="Explore Adhitech's Liquid Acrylic LED signage, channel letters, ACP signage, CNC routing, laser cutting, bending and fabrication services in Jaipur." path="/services" />
      <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '140px' }}>
      {/* Header */}
      <section className="container" style={{ marginBottom: '6rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 
            style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              lineHeight: '1.1', 
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-title)',
              fontWeight: 900
            }}
          >
            Signage Engineering & Custom Fabrication
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            We use state-of-the-art fabrication machinery, CNC systems, and Rajasthan's leading Liquid Acrylic Casting plant to fabricate premium identity assets for corporate clients.
          </p>
        </div>
      </section>

      {/* Services Alternating Rows */}
      <section className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8rem', marginBottom: '10rem' }}>
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={service.id}
              className="service-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1fr',
                gap: '5rem',
                alignItems: 'center',
                direction: isEven ? 'ltr' : 'rtl'
              }}
            >
              {/* Image Side */}
              <div 
                className="service-image-container"
                style={{
                  position: 'relative',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  direction: 'ltr' // always layout image normally
                }}
              >
                {service.video ? (
                  <video 
                    src={service.video} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    preload="none"
                    style={{
                      width: '100%',
                      height: '420px',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '420px',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>

              {/* Text Side */}
              <div 
                className="service-text-container"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  direction: 'ltr', // always read left-to-right
                  textAlign: 'left'
                }}
              >
                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>{service.title}</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1rem' }}>
                  {service.description}
                </p>

                {/* Specs List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    Specifications
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }} className="specs-grid">
                    {service.specs.map((spec, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleContactScroll}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: '1.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    padding: '0.5rem 0',
                    transition: 'var(--transition-fast)'
                  }}
                  className="read-more-btn"
                >
                  Request Configuration <ChevronRight size={14} style={{ color: 'var(--accent)', transition: 'transform 0.2s' }} className="chevron" />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <style>{`
        .read-more-btn:hover {
          color: var(--accent) !important;
        }
        .read-more-btn:hover .chevron {
          transform: translateX(4px);
        }
        
        @media (max-width: 991px) {
          .service-row {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .service-image-container img,
          .service-image-container video {
            height: 300px !important;
          }
          .specs-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .service-row {
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
    </>
  );
}
