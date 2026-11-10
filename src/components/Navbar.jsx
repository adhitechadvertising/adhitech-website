import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { companyInfo } from '../data/company';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll while the mobile drawer is open, and allow Escape to close it
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    const footerElement = document.getElementById('contact-section');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If we are not on the home page, navigate to home and then scroll
      window.location.href = '/#contact-section';
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'glass-nav py-4 shadow-[0_4px_30px_rgba(0,0,0,0.8)]' 
          : 'bg-transparent py-6'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        transition: 'var(--transition-smooth)',
        padding: isScrolled ? '1rem 0' : '1.5rem 0',
        backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(15px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center'
          }}
        >
          <img
            src="/assets/adhitech_logo_light.png"
            alt="Adhitech Advertising Technology"
            className="brand-logo"
            style={{ height: '46px', width: 'auto', display: 'block' }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <div 
          className="desktop-menu"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '3rem'
          }}
        >
          <NavLink 
            to="/" 
            style={({ isActive }) => ({
              fontFamily: 'var(--font-title)',
              fontSize: '0.95rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--accent)' : 'var(--text-primary)',
              position: 'relative',
              padding: '0.5rem 0'
            })}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Home
          </NavLink>
          <NavLink 
            to="/services" 
            style={({ isActive }) => ({
              fontFamily: 'var(--font-title)',
              fontSize: '0.95rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--accent)' : 'var(--text-primary)',
              position: 'relative',
              padding: '0.5rem 0'
            })}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Services
          </NavLink>
          <NavLink 
            to="/projects" 
            style={({ isActive }) => ({
              fontFamily: 'var(--font-title)',
              fontSize: '0.95rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--accent)' : 'var(--text-primary)',
              position: 'relative',
              padding: '0.5rem 0'
            })}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Projects
          </NavLink>
          <NavLink 
            to="/b2b" 
            style={({ isActive }) => ({
              fontFamily: 'var(--font-title)',
              fontSize: '0.95rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--accent)' : 'var(--text-primary)',
              position: 'relative',
              padding: '0.5rem 0'
            })}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            B2B
          </NavLink>
          <a 
            href="#contact-section" 
            onClick={handleContactClick}
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '0.95rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              padding: '0.5rem 0'
            }}
            className="nav-link"
          >
            Contact
          </a>

          {/* Quick CTA */}
          <Link 
            to="/projects"
            style={{
              marginLeft: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-title)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.65rem 1.25rem',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              transition: 'var(--transition-smooth)'
            }}
            className="nav-cta-btn"
          >
            View Work
            <ArrowUpRight size={14} style={{ color: 'var(--accent)' }} />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
          className="mobile-menu-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(10, 10, 10, 0.98)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2.5rem',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          borderLeft: '1px solid rgba(212, 0, 0, 0.1)'
        }}
        className="mobile-drawer"
      >
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          <X size={28} />
        </button>
        
        <NavLink 
          to="/" 
          onClick={() => setIsOpen(false)}
          style={({ isActive }) => ({
            fontFamily: 'var(--font-title)',
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: isActive ? 'var(--accent)' : 'var(--text-primary)'
          })}
        >
          Home
        </NavLink>
        <NavLink 
          to="/services" 
          onClick={() => setIsOpen(false)}
          style={({ isActive }) => ({
            fontFamily: 'var(--font-title)',
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: isActive ? 'var(--accent)' : 'var(--text-primary)'
          })}
        >
          Services
        </NavLink>
        <NavLink 
          to="/projects" 
          onClick={() => setIsOpen(false)}
          style={({ isActive }) => ({
            fontFamily: 'var(--font-title)',
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: isActive ? 'var(--accent)' : 'var(--text-primary)'
          })}
        >
          Projects
        </NavLink>
          <NavLink 
          to="/b2b" 
          onClick={() => setIsOpen(false)}
          style={({ isActive }) => ({
            fontFamily: 'var(--font-title)',
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: isActive ? 'var(--accent)' : 'var(--text-primary)'
          })}
        >
          B2B
        </NavLink>
        <a 
          href="#contact-section" 
          onClick={handleContactClick}
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)'
          }}
        >
          Contact
        </a>
      </div>

      {/* Inject styling specifically for desktop/mobile toggle behavior and nav links hover */}
      <style>{`
        .nav-link::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: var(--accent);
          transform-origin: bottom right;
          transition: transform 0.3s ease-out;
        }
        .nav-link:hover::after, .nav-link.active::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        .nav-cta-btn:hover {
          background-color: var(--accent) !important;
          border-color: var(--accent) !important;
          box-shadow: 0 0 20px rgba(212, 0, 0, 0.4);
        }
        @media (max-width: 991px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
        }
        @media (max-width: 400px) {
          .brand-logo {
            height: 38px !important;
          }
        }
        @media (max-width: 380px) {
          .mobile-drawer {
            gap: 1.75rem !important;
          }
          .mobile-drawer a {
            font-size: 1.4rem !important;
          }
        }
        @media (max-height: 500px) {
          .mobile-drawer {
            gap: 1.25rem !important;
            justify-content: flex-start !important;
            padding-top: 6rem !important;
          }
        }
      `}</style>
    </nav>
  );
}
