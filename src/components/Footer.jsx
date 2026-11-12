import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { companyInfo } from '../data/company';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = companyInfo.contact.phone.split(',')[0].replace(/\D/g, '');
  const quoteWhatsApp = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Adhitech, I would like to discuss a signage quotation. I can share my drawings and project details.')}`;

  return (
    <footer 
      id="contact-section"
      style={{
        backgroundColor: '#0F0F0F',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '6rem',
        paddingBottom: '2.5rem',
        position: 'relative',
        zIndex: 5
      }}
    >
      {/* Background Red Glow */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(212, 0, 0, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)'
        }}
      />

      <div className="container">
        {/* Top Grid */}
        <div 
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr',
            gap: '4rem',
            marginBottom: '4rem'
          }}
        >
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <img
              src="/assets/adhitech_logo_light.png"
              alt="Adhitech Advertising Technology"
              style={{ height: '56px', width: 'auto', maxWidth: '100%', display: 'block', alignSelf: 'flex-start', objectFit: 'contain' }}
            />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', maxWidth: '380px' }}>
              {companyInfo.description}
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
              Sitemap
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.92rem' }}>
              <Link to="/" className="footer-link" style={{ color: 'var(--text-secondary)' }}>Home</Link>
              <Link to="/services" className="footer-link" style={{ color: 'var(--text-secondary)' }}>Services</Link>
              <Link to="/projects" className="footer-link" style={{ color: 'var(--text-secondary)' }}>Projects</Link>
              <Link to="/b2b" className="footer-link" style={{ color: 'var(--text-secondary)' }}>B2B</Link>
            </div>
          </div>

          {/* Business Info / Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
              Contact Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyInfo.contact.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'var(--text-secondary)' }}
              >
                <MapPin size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                <span>{companyInfo.contact.address}</span>
              </a>
              <a
                href={`tel:${companyInfo.contact.phone.split(',')[0].replace(/[^+\d]/g, '')}`}
                className="footer-link"
                style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: 'var(--text-secondary)' }}
              >
                <Phone size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{companyInfo.contact.phone}</span>
              </a>
              <a
                href={`mailto:${companyInfo.contact.email}`}
                className="footer-link"
                style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: 'var(--text-secondary)' }}
              >
                <Mail size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{companyInfo.contact.email}</span>
              </a>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Clock size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{companyInfo.contact.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Newsletter / Project Request */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
              Request A Quote
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Send your drawings, dimensions or project brief directly to our team for a quotation discussion.
            </p>
            <a
              href={quoteWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp-cta"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.85rem 1rem', borderRadius: '4px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', width: 'fit-content' }}
            >
              <MessageCircle size={17} /> Request a quote on WhatsApp
            </a>
            <a href={`mailto:${companyInfo.contact.email}`} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Or email {companyInfo.contact.email}
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
          className="footer-bottom"
        >
          <p>© {currentYear} Adhitech Advertising Technology Pvt. Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/privacy-policy" className="footer-bottom-link">Privacy Policy</Link>
            <Link to="/terms-of-service" className="footer-bottom-link">Terms of Service</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--accent) !important;
          padding-left: 5px;
        }
        .footer-bottom-link:hover {
          color: var(--text-primary);
        }
        
        @media (max-width: 991px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 3rem !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
