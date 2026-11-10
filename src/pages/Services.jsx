import { useEffect, useRef } from 'react';
import { Sparkles, Type, Layout, Cpu, Scissors, Layers, Fingerprint, Briefcase, ChevronRight, Award, Mountain } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '../data/services';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const containerRef = useRef(null);

  useEffect(() => {
    const rows = containerRef.current.querySelectorAll('.service-row');
    
    rows.forEach((row, index) => {
      const isEven = index % 2 === 0;
      const img = row.querySelector('.service-image-container');
      const txt = row.querySelector('.service-text-container');
      
      gsap.fromTo(img, 
        { x: isEven ? -60 : 60, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 1.2, 
          scrollTrigger: {
            trigger: row,
            start: 'top 80%'
          }
        }
      );

      gsap.fromTo(txt, 
        { x: isEven ? 60 : -60, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 1.2, 
          scrollTrigger: {
            trigger: row,
            start: 'top 80%'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles size={24} />;
      case 'Type': return <Type size={24} />;
      case 'Layout': return <Layout size={24} />;
      case 'Cpu': return <Cpu size={24} />;
      case 'Scissors': return <Scissors size={24} />;
      case 'Layers': return <Layers size={24} />;
      case 'Fingerprint': return <Fingerprint size={24} />;
      case 'Briefcase': return <Briefcase size={24} />;
      case 'Mountain': return <Mountain size={24} />;
      default: return <Award size={24} />;
    }
  };

  const handleContactScroll = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden', paddingTop: '140px' }}>
      <div className="bg-grid-overlay" />
      <div className="bg-radial-glow" />

      {/* Header */}
      <section className="container" style={{ marginBottom: '6rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '800px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
            Our Capabilities
          </span>
          <h1 
            style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              lineHeight: '1.1', 
              marginTop: '0.5rem', 
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-title)',
              fontWeight: 900
            }}
            className="text-gradient-red"
          >
            Signage Engineering & Custom Fabrication
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            We leverage Germany-grade fabrication machinery, CNC systems, and Rajasthan's leading Liquid Acrylic Casting plant to fabricate premium identity assets for corporate clients.
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
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
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
                      objectFit: 'cover',
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="serv-img"
                  />
                ) : (
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '420px',
                      objectFit: 'cover',
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="serv-img"
                  />
                )}
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    backgroundColor: 'rgba(10,10,10,0.7)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                    letterSpacing: '0.05em'
                  }}
                >
                  {String(index + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                </span>
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, transparent 60%, rgba(10,10,10,0.8) 100%)',
                    pointerEvents: 'none'
                  }}
                />
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
                <div 
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(212, 0, 0, 0.08)',
                    border: '1px solid rgba(212, 0, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)'
                  }}
                >
                  {getIcon(service.icon)}
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>{service.title}</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1rem' }}>
                  {service.description}
                </p>

                {/* Specs List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                    Technical Specifications
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
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
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
        .service-image-container:hover .serv-img {
          transform: scale(1.06);
        }
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
  );
}
