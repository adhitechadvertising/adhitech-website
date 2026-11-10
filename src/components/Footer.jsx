import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight, Instagram, Linkedin, Facebook, Youtube, Check, Copy } from 'lucide-react';
import { companyInfo } from '../data/company';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [quoteState, setQuoteState] = useState('idle'); // idle | sent
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const quoteMailtoHref = (email) => {
    const subject = encodeURIComponent('Project Quote Request');
    const body = encodeURIComponent(
      `Hello Adhitech team,\n\nI'd like to request a quote. Here's my contact email: ${email || '[your email]'}\n\nProject details:\n`
    );
    return `mailto:${companyInfo.contact.email}?subject=${subject}&body=${body}`;
  };

  const handleQuoteRequest = (e) => {
    e.preventDefault();
    const email = e.target.elements.quoteEmail.value;
    setSubmittedEmail(email);
    setQuoteState('sent');
    // Attempt to open the visitor's email client. This can fail silently if
    // none is configured, which is why we always show a visible fallback
    // below rather than relying on this alone.
    window.location.href = quoteMailtoHref(email);
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(companyInfo.contact.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram size={18} />;
      case 'linkedin':
        return <Linkedin size={18} />;
      case 'facebook':
        return <Facebook size={18} />;
      case 'youtube':
        return <Youtube size={18} />;
      default:
        return null;
    }
  };

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
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', maxWidth: '320px' }}>
              {companyInfo.description.substring(0, 140).replace(/\s+\S*$/, '')}…
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
              {companyInfo.socials.map((social) => (
                <a 
                  key={social.platform} 
                  href={social.url}
                  className="social-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-secondary)',
                    transition: 'var(--transition-smooth)'
                  }}
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
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
                href={`tel:${companyInfo.contact.phone.replace(/[^+\d]/g, '')}`}
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
            {quoteState === 'idle' ? (
              <>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  Share your email and we'll open a message to our project team to get things moving.
                </p>
                <form onSubmit={handleQuoteRequest} style={{ display: 'flex', position: 'relative' }}>
                  <input 
                    type="email" 
                    name="quoteEmail"
                    placeholder="Enter your email" 
                    required
                    style={{
                      width: '100%',
                      padding: '0.9rem 3.5rem 0.9rem 1.2rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '4px',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'var(--transition-smooth)'
                    }}
                    className="newsletter-input"
                  />
                  <button 
                    type="submit" 
                    style={{
                      position: 'absolute',
                      right: '4px',
                      top: '4px',
                      bottom: '4px',
                      width: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--accent)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                    className="newsletter-btn"
                    aria-label="Request a quote"
                  >
                    <ArrowRight size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  padding: '1rem 1.2rem',
                  backgroundColor: 'rgba(212, 0, 0, 0.05)',
                  border: '1px solid rgba(212, 0, 0, 0.2)',
                  borderRadius: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                  <Check size={16} style={{ color: 'var(--accent)' }} />
                  We've opened your email app
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  If nothing opened (common if you don't have a default email app set up), just email or call us directly:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  <a
                    href={quoteMailtoHref(submittedEmail)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.82rem', color: 'var(--text-primary)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px',
                      padding: '0.5rem 0.8rem'
                    }}
                    className="footer-link"
                  >
                    <Mail size={14} style={{ color: 'var(--accent)' }} /> {companyInfo.contact.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.82rem', color: 'var(--text-secondary)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px',
                      padding: '0.5rem 0.8rem', background: 'transparent', cursor: 'pointer'
                    }}
                  >
                    {copied ? <Check size={14} style={{ color: 'var(--accent)' }} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy email'}
                  </button>
                  <a
                    href={`tel:${companyInfo.contact.phone.replace(/[^+\d]/g, '')}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.82rem', color: 'var(--text-secondary)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px',
                      padding: '0.5rem 0.8rem'
                    }}
                    className="footer-link"
                  >
                    <Phone size={14} style={{ color: 'var(--accent)' }} /> Call us
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setQuoteState('idle')}
                  style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  Send another request
                </button>
              </div>
            )}
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
            <a href="#" className="footer-bottom-link">Privacy Policy</a>
            <a href="#" className="footer-bottom-link">Terms of Service</a>
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
        .social-btn:hover {
          background-color: var(--accent) !important;
          border-color: var(--accent) !important;
          color: #FFFFFF !important;
          box-shadow: 0 0 15px rgba(212, 0, 0, 0.3);
        }
        .newsletter-input:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 15px rgba(212, 0, 0, 0.1);
        }
        .newsletter-btn:hover {
          background-color: #A00000;
          box-shadow: 0 0 10px rgba(212, 0, 0, 0.5);
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
