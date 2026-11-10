import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, Zap, Factory, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { companyInfo } from '../data/company';
import { services } from '../data/services';
import { galleryCategories } from '../data/gallery';
import MagneticButton from '../components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadlineRef = useRef(null);
  const ctaRef = useRef(null);
  const introRef = useRef(null);
  const statsRef = useRef(null);
  const setupRef = useRef(null);
  const liquidRef = useRef(null);

  // Only offer the heavier video backdrop on larger viewports so mobile
  // visitors get a fast, static hero instead of a big autoplaying download.
  const [useHeroVideo, setUseHeroVideo] = useState(false);

  useEffect(() => {
    const mqWide = window.matchMedia('(min-width: 900px)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    setUseHeroVideo(mqWide.matches && mqMotion.matches);
  }, []);

  useEffect(() => {
    // Hero Animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(headlineRef.current, 
      { y: 60, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, delay: 0.3 }
    )
    .fromTo(subheadlineRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 0.8, duration: 1 }, 
      '-=0.8'
    )
    .fromTo(ctaRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1 }, 
      '-=0.8'
    );

    // ScrollTrigger Fade-in reveals for Company Intro
    gsap.fromTo(introRef.current.querySelector('.intro-image'),
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        scrollTrigger: {
          trigger: introRef.current,
          start: 'top 80%'
        }
      }
    );

    gsap.fromTo(introRef.current.querySelector('.intro-text'),
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        scrollTrigger: {
          trigger: introRef.current,
          start: 'top 80%'
        }
      }
    );

    // Stats counter animation
    const statsElements = statsRef.current.querySelectorAll('.stat-number');
    statsElements.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const counter = { val: 0 };
      
      gsap.to(counter, {
        val: target,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%'
        },
        onUpdate: () => {
          el.innerText = Math.floor(counter.val) + (target === 8 ? '' : '+');
        }
      });
    });

    // Liquid Acrylic feature section reveal
    if (liquidRef.current) {
      gsap.fromTo(liquidRef.current.querySelectorAll('.liquid-reveal'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: liquidRef.current,
            start: 'top 75%'
          }
        }
      );
    }

    // Manufacturing setup card staggers
    gsap.fromTo(setupRef.current.querySelectorAll('.setup-card'),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: setupRef.current,
          start: 'top 80%'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleContactScroll = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // The three project categories shown on the Home page
  const featuredCategories = galleryCategories;

  // Flagship product -- pulled straight from the services data, not hardcoded
  const liquidAcrylic = services.find((s) => s.id === 'liquid-acrylic-led');

  // Capability ticker uses the real service titles already defined in data/services.js
  const tickerItems = services.map((s) => s.title);

  // Setup Gallery Images
  const setups = [
    { title: "CNC Fiber Laser", desc: "High-precision metal cutting & heavy steel profiling", img: "/assets/factory_fiber_laser.jpg" },
    { title: "CNC Router 2x (Stone & Wood)", desc: "Dual-spindle heavy-duty routing & 3D engraving", img: "/assets/cnc_router_real.jpg" },
    { title: "CNC Bending Machine", desc: "Computer-numeric controlled press brake profile forming", img: "/assets/factory_cnc_bending.jpg" },
    { title: "3D Printing (800x800mm Bed)", desc: "Precision additive manufacturing for large letter returns & components", img: "/assets/industrial_3d_printing.png" },
    { title: "Liquid Acrylic Signage Setup", desc: "Full in-house production with channel bending & UV casting", img: "/assets/factory_acrylic_fabrication.jpg" },
    { title: "Laser Welding + Fabrication", desc: "High-strength precision seam welding & assembly line", img: "/assets/factory_welding_fabrication.jpg" },
    { title: "CO2 Laser Cutting", desc: "Fast acrylic profiling & MDF detailing", img: "/assets/factory_co2_laser.jpg" },
    { title: "Heavy Structural Signage", desc: "Fabrication of highway unipoles, massive pylons & 50ft+ LED structures", img: "/gallery/mega/mega-04.jpg" }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="bg-grid-overlay" />
      <div className="bg-radial-glow" />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '80px'
        }}
      >
        {/* Backdrop Visual (Faux Video/High End Render) */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            backgroundColor: '#050505'
          }}
        >
          {/* Overlay to dim backdrop */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.95) 100%)',
              zIndex: 1
            }}
          />
          {useHeroVideo ? (
            <video
              src="/assets/router_cutting.mp4"
              poster="/assets/hero_background.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
                filter: 'grayscale(30%)'
              }}
            />
          ) : (
            <img 
              src="/assets/hero_background.jpg" 
              alt="Adhitech Premium LED Signage Background"
              fetchPriority="high"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
                filter: 'grayscale(30%)'
              }}
            />
          )}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '900px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="section-tag">Premium Signage Manufacturing · Jaipur, Rajasthan</span>
            </div>
            <h1 
              ref={headlineRef}
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: '1.1',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 900
              }}
              className="text-gradient-red"
            >
              Premium LED Signage & CNC Manufacturing
            </h1>
            <p 
              ref={subheadlineRef}
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                marginBottom: '3rem',
                maxWidth: '650px'
              }}
            >
              {companyInfo.subTagline}
            </p>
            <div 
              ref={ctaRef}
              style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap'
              }}
            >
              <MagneticButton 
                onClick={() => navigate('/projects')}
                className="solid"
              >
                View Projects
              </MagneticButton>
              <MagneticButton 
                onClick={handleContactScroll}
              >
                Contact Us
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Capability Ticker */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 2,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            backgroundColor: 'rgba(10,10,10,0.5)',
            backdropFilter: 'blur(6px)',
            overflow: 'hidden',
            padding: '0.9rem 0'
          }}
          className="hero-ticker"
        >
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <span className="ticker-item" key={idx}>
                <span className="dot" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          style={{
            position: 'absolute',
            bottom: '4.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            zIndex: 3
          }}
          className="scroll-indicator"
        >
          <span>Scroll to explore</span>
          <div 
            style={{
              width: '1px',
              height: '36px',
              background: 'linear-gradient(to bottom, var(--accent) 50%, transparent 100%)',
              animation: 'pulse-line 2s infinite ease-in-out'
            }}
          />
        </div>
      </section>

      {/* Company Introduction Section */}
      <section 
        ref={introRef}
        style={{
          padding: '8rem 0',
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <div className="container">
          <div 
            className="intro-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '6rem',
              alignItems: 'center'
            }}
          >
            {/* Left: Image */}
            <div 
              className="intro-image"
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(212,0,0,0.08)'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to right, rgba(10,10,10,0.5), transparent)',
                  zIndex: 1
                }}
              />
              <img 
                src="/assets/factory_real.jpg" 
                alt="Adhitech Manufacturing Plant"
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Right: Text */}
            <div 
              className="intro-text"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                Pioneers of LED Signage
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: '1.1' }}>
                We Build Branding That Commands Presence
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                {companyInfo.description}
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                As one of the first manufacturers in Rajasthan using Liquid Acrylic Technology, we construct seamless 3D lettering and corporate monolithic gantries that represent the highest standards of signage precision.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent)' }} />
                  <span>State-of-the-art Fiber Laser & CNC Machining</span>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--accent)' }} />
                  <span>100% weather-resistant high luminance materials</span>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <Zap size={18} style={{ color: 'var(--accent)' }} />
                  <span>Rajasthan's first dedicated Liquid Acrylic Curing plant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liquid Acrylic Technology Feature Section */}
      {liquidAcrylic && (
        <section
          ref={liquidRef}
          style={{
            padding: '8rem 0',
            position: 'relative',
            zIndex: 2,
            backgroundColor: '#0F0F0F',
            borderTop: '1px solid rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            overflow: 'hidden'
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              right: '-10%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(212,0,0,0.1) 0%, transparent 70%)',
              filter: 'blur(90px)',
              pointerEvents: 'none'
            }}
          />
          <div className="container">
            <div
              className="liquid-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.1fr',
                gap: '5rem',
                alignItems: 'center'
              }}
            >
              {/* Text Side */}
              <div className="liquid-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <span className="section-tag">Our Flagship Technology</span>
                <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: '1.1' }}>
                  {liquidAcrylic.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                  {liquidAcrylic.description}
                </p>

                <div
                  className="liquid-specs"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}
                >
                  {liquidAcrylic.specs.map((spec, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.7rem',
                        padding: '0.9rem 1rem',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '6px'
                      }}
                    >
                      <Sparkles size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{spec}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <MagneticButton onClick={() => navigate('/services')} className="solid">
                    Explore The Process
                  </MagneticButton>
                </div>
              </div>

              {/* Media Side */}
              <div
                className="liquid-reveal"
                style={{
                  position: 'relative',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                {liquidAcrylic.video ? (
                  <video
                    src={liquidAcrylic.video}
                    poster={liquidAcrylic.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <img
                    src={liquidAcrylic.image}
                    alt={liquidAcrylic.title}
                    loading="lazy"
                    style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(10,10,10,0.55) 0%, transparent 40%)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      <section 
        ref={statsRef}
        style={{
          padding: '6rem 0',
          backgroundColor: '#0F0F0F',
          borderTop: '1px solid rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.03)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="container">
          <div 
            className="stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2rem',
              textAlign: 'center'
            }}
          >
            {companyInfo.stats.map((stat, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <span 
                  className="stat-number text-gradient-red"
                  data-target={stat.value.replace('+', '')}
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 900
                  }}
                >
                  0
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section 
        style={{
          padding: '8rem 0',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="container">
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '4rem'
            }}
            className="section-header"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                Our Work
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.6rem)' }}>Projects</h2>
            </div>
            <Link 
              to="/projects"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-title)',
                fontSize: '0.95rem',
                fontWeight: 600
              }}
              className="hover-trigger"
            >
              View All <ArrowRight size={16} style={{ transition: 'transform 0.3s' }} className="arrow-icon" />
            </Link>
          </div>

          {/* Featured Project Cards */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2.5rem'
            }}
            className="featured-grid"
          >
            {featuredCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/projects#${cat.id}`}
                className="card-premium"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                <div style={{ height: '300px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={cat.cover} 
                    alt={cat.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="project-image"
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to bottom, transparent 60%, rgba(10,10,10,0.9) 100%)',
                      zIndex: 1
                    }}
                  />
                </div>
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem' }}>{cat.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {cat.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#FFF', fontWeight: 600, marginTop: 'auto' }}>
                    View photos &amp; videos <ChevronRight size={14} style={{ color: 'var(--accent)' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Setup Section */}
      <section 
        ref={setupRef}
        style={{
          padding: '8rem 0',
          backgroundColor: '#0A0A0A',
          borderTop: '1px solid rgba(255,255,255,0.03)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
              Industrial Capacity
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', marginTop: '0.5rem' }}>Our Manufacturing Setup</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
              We invest in high-precision computer numeric control (CNC) and laser machinery to deliver micro-tolerance outputs for commercial signage requirements.
            </p>
          </div>

          <div 
            className="setup-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem'
            }}
          >
            {setups.map((setup, idx) => (
              <div 
                key={idx}
                className="setup-card"
                style={{
                  position: 'relative',
                  height: '350px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                {/* Image */}
                <img 
                  src={setup.img} 
                  alt={setup.title} 
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="setup-image"
                />
                
                {/* Overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.95) 100%)',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '2rem',
                    transition: 'background-color 0.4s'
                  }}
                  className="setup-overlay"
                >
                  <h3 style={{ fontSize: '1.25rem', color: '#FFF' }}>{setup.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>{setup.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section 
        style={{
          padding: '8rem 0',
          backgroundColor: '#0F0F0F',
          borderTop: '1px solid rgba(255,255,255,0.03)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="container">
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '4rem'
            }}
            className="section-header"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                Capabilities
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.6rem)' }}>Fabrication Capabilities</h2>
            </div>
            <Link 
              to="/services"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-title)',
                fontSize: '0.95rem',
                fontWeight: 600
              }}
              className="hover-trigger"
            >
              All Services <ArrowRight size={16} style={{ transition: 'transform 0.3s' }} className="arrow-icon" />
            </Link>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem'
            }}
            className="services-preview-grid"
          >
            {services.slice(0, 3).map((service) => (
              <div 
                key={service.id}
                onClick={() => navigate('/services')}
                className="card-premium"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem'
                }}
              >
                <div 
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(212,0,0,0.08)',
                    border: '1px solid rgba(212,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)'
                  }}
                >
                  <Factory size={22} />
                </div>
                <h3 style={{ fontSize: '1.3rem' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                  {service.shortDescription}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#FFF', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem' }}>
                  Learn More <ChevronRight size={14} style={{ color: 'var(--accent)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section 
        style={{
          padding: '8rem 0',
          position: 'relative',
          zIndex: 2,
          backgroundColor: '#0A0A0A',
          borderTop: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <div className="container">
          <div 
            style={{
              position: 'relative',
              borderRadius: '12px',
              padding: '5rem 4rem',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
            }}
            className="glassmorphic-cta-banner glassmorphism glow-red"
          >
            {/* Ambient Background Light */}
            <div 
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(212,0,0,0.12) 0%, transparent 70%)',
                filter: 'blur(70px)',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />

            <div style={{ maxWidth: '650px', position: 'relative', zIndex: 1 }} className="cta-left">
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', lineHeight: '1.2', marginBottom: '1.2rem' }}>
                Ready to elevate your corporate presence?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Work with Rajasthan's premier signage engineering firm. Connect with our technical experts to finalize drawings and get a custom quote.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }} className="cta-right">
              <MagneticButton 
                onClick={handleContactScroll}
                className="solid"
              >
                Inquire Now
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse-line {
          0% { height: 20px; opacity: 0.2; }
          50% { height: 60px; opacity: 1; }
          100% { height: 20px; opacity: 0.2; }
        }
        
        .card-premium:hover .project-image {
          transform: scale(1.08) !important;
        }
        
        .hover-trigger:hover .arrow-icon {
          transform: translateX(8px);
        }
        
        .setup-card:hover .setup-image {
          transform: scale(1.1) !important;
        }
        
        .setup-card:hover .setup-overlay {
          background: linear-gradient(to bottom, rgba(10,10,10,0) 30%, rgba(212,0,0,0.7) 100%) !important;
        }
        
        @media (max-width: 991px) {
          .intro-grid {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
          .intro-image img {
            height: 380px !important;
          }
          .liquid-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .liquid-grid > div:last-child img,
          .liquid-grid > div:last-child video {
            height: 340px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 3rem !important;
          }
          .featured-grid, .setup-grid, .services-preview-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
          .glassmorphic-cta-banner {
            flex-direction: column;
            gap: 2.5rem;
            text-align: center;
            padding: 4rem 2rem !important;
          }
          .cta-left {
            max-width: 100% !important;
          }
        }
        
        @media (max-width: 600px) {
          .featured-grid, .setup-grid, .services-preview-grid {
            grid-template-columns: 1fr !important;
          }
          .liquid-specs {
            grid-template-columns: 1fr !important;
          }
          .hero-ticker {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
