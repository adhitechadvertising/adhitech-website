import { useEffect } from 'react';
import { companyInfo } from '../data/company';

const LAST_UPDATED = '11 November 2026';
const COMPANY = 'Adhitech Advertising Technology Pvt. Ltd.';

function LegalLayout({ tag, title, intro, sections, docTitle }) {
  // Give each legal page its own browser tab title, and restore it when leaving.
  useEffect(() => {
    const previous = document.title;
    document.title = `${docTitle} | Adhitech Advertising Technology`;
    return () => {
      document.title = previous;
    };
  }, [docTitle]);

  return (
    <div className="legal-page">
      <div className="bg-grid-overlay" />
      <div className="bg-radial-glow" />

      <section className="container legal-hero">
        <span className="section-tag">{tag}</span>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {LAST_UPDATED}</p>
        <p className="legal-intro">{intro}</p>
      </section>

      <section className="container legal-body">
        <article className="legal-card">
          {sections.map((s, i) => (
            <div className="legal-sec" key={s.title}>
              <h2><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</h2>
              {s.paras?.map((p) => <p key={p}>{p}</p>)}
              {s.list && <ul>{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
              {s.after && <p>{s.after}</p>}
            </div>
          ))}
        </article>
      </section>

      <style>{`
        .legal-page { position: relative; overflow: hidden; min-height: 100vh; }
        .legal-hero { position: relative; z-index: 2; padding-top: 9rem; }
        .legal-hero h1 { font-size: clamp(2.2rem, 5vw, 3.6rem); line-height: 1.1; margin: 1rem 0 0.8rem; }
        .legal-updated { font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.2rem; }
        .legal-intro { color: var(--text-secondary); max-width: 720px; line-height: 1.75; font-size: 1.02rem; }
        .legal-body { position: relative; z-index: 2; padding-top: 3rem; padding-bottom: 8rem; }
        .legal-card { max-width: 860px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 14px; padding: clamp(1.4rem, 4vw, 3rem); display: grid; gap: 2.2rem; }
        .legal-sec { display: grid; gap: 0.8rem; }
        .legal-sec h2 { display: flex; align-items: baseline; gap: 0.8rem; font-size: 1.3rem; line-height: 1.3; }
        .legal-sec h2 span { font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent); letter-spacing: 0.08em; }
        .legal-sec p, .legal-sec li { color: var(--text-secondary); line-height: 1.75; font-size: 0.95rem; }
        .legal-sec ul { list-style: none; display: grid; gap: 0.55rem; }
        .legal-sec li { position: relative; padding-left: 1.1rem; }
        .legal-sec li::before { content: ''; position: absolute; left: 0; top: 0.7em; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
        .legal-sec a { color: #fff; border-bottom: 1px solid var(--accent); }
        @media (max-width: 768px) { .legal-hero { padding-top: 7rem; } .legal-body { padding-bottom: 5rem; } }
      `}</style>
    </div>
  );
}

const { email, address } = companyInfo.contact;
const phone = companyInfo.contact.phone;

export function PrivacyPolicy() {
  return (
    <LegalLayout
      tag="Legal"
      title="Privacy Policy"
      docTitle="Privacy Policy"
      intro={`This policy explains what information ${COMPANY} ("Adhitech", "we", "us") collects through this website, how we use it, and the choices you have.`}
      sections={[
        {
          title: 'Who we are',
          paras: [`${COMPANY}, ${address}. You can reach us at ${email} or ${phone}.`]
        },
        {
          title: 'Information we collect',
          list: [
            'Information you send us. When you contact us by phone, WhatsApp or email, or send us an estimate, we receive the details you choose to share, such as your name, company, contact details, project requirements and any drawings or artwork you send.',
            'B2B Cost Estimator. A DXF file you choose, or words you type, are measured in your own browser to work out the estimate. They are not uploaded to this website. An estimate reaches us only if you choose to send it by WhatsApp or email.',
            'Request a quote box. The email address you type in the footer is used only to prepare a message in your own email app. The website does not store it.',
            'Technical information. Our hosting provider may automatically record basic technical details, such as IP address, browser type and the pages requested, so that the website can be delivered and kept secure.'
          ]
        },
        {
          title: 'Cookies and tracking',
          paras: [
            'At the time of writing, this website does not use advertising cookies or third-party analytics tools. If this changes, we will update this policy.',
            'To display text in our chosen typefaces, your browser loads fonts from Google Fonts, which means your browser connects to Google\u2019s servers when a page loads.'
          ]
        },
        {
          title: 'How we use information',
          list: [
            'To respond to your enquiries and prepare quotations.',
            'To plan, produce, deliver and install orders, and to keep records of them.',
            'To meet legal, accounting and regulatory requirements.',
            'To keep this website secure and working properly.'
          ]
        },
        {
          title: 'Sharing',
          paras: [
            'We do not sell your personal information. We share it only with service providers who help us run the website and handle our communications (for example, hosting, email and messaging services), and where the law requires us to.',
            'If you send us a message through WhatsApp or email, that message is handled by those services under their own terms and privacy policies.'
          ]
        },
        {
          title: 'Links to other services',
          paras: ['This website links to services we do not control, such as WhatsApp and Google Maps. Their privacy practices are their own, so please read their policies.']
        },
        {
          title: 'Keeping information safe, and for how long',
          paras: [
            'We take reasonable steps to protect the information we hold. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.',
            'We keep information only as long as we need it for the purposes above, or as the law requires.'
          ]
        },
        {
          title: 'Your choices',
          paras: [`You may ask us to tell you what personal information we hold about you, to correct it, or to delete it, subject to applicable law. Please write to ${email}. We handle personal information in accordance with applicable Indian law.`]
        },
        {
          title: 'Changes to this policy',
          paras: ['We may update this policy from time to time. The date at the top of this page shows when it was last changed.']
        },
        {
          title: 'Contact us',
          paras: [`Questions about this policy? Email ${email} or call ${phone}.`]
        }
      ]}
    />
  );
}

export function TermsOfService() {
  return (
    <LegalLayout
      tag="Legal"
      title="Terms of Service"
      docTitle="Terms of Service"
      intro={`These terms apply when you use the website of ${COMPANY}. By using the website you agree to them. If you do not agree, please do not use it.`}
      sections={[
        {
          title: 'About this website',
          paras: ['This website describes our signage, fabrication and CNC services and shows examples of our work. We try to keep the information accurate, but descriptions, photographs, specifications and availability are for general information and may change without notice.']
        },
        {
          title: 'Cost estimator and catalogue',
          list: [
            'The B2B Cost Estimator gives an indicative price based on the drawing you provide or the words you type. Estimates from typed words are approximate.',
            'An estimate is not an offer, a quotation or a contract. Prices, taxes, delivery, installation and any other charges are confirmed only in a written quotation from Adhitech.',
            'The catalogue describes our standard systems. Specifications for your order are confirmed in writing before production begins.'
          ]
        },
        {
          title: 'Orders',
          paras: ['An order is accepted only when we confirm it in writing against a quotation you have accepted. Payment, production and delivery terms are those stated in that quotation or confirmation.']
        },
        {
          title: 'Your files and artwork',
          paras: ['If you send us drawings, logos or artwork, you confirm that you have the right to use them and to ask us to produce work from them. We use your files only to prepare quotations and to carry out your order.']
        },
        {
          title: 'Our content',
          paras: ['The text, photographs, videos, logo, catalogue and other material on this website belong to Adhitech or its licensors. You may not copy, reproduce or reuse them without our written permission, except for personal, non-commercial viewing.']
        },
        {
          title: 'Using the website',
          list: [
            'Use it lawfully and only for its intended purpose.',
            'Do not try to damage, overload or gain unauthorised access to the website or its systems.',
            'Do not copy the website automatically or in bulk without our permission.'
          ]
        },
        {
          title: 'Other websites and services',
          paras: ['This website links to third-party services such as WhatsApp and Google Maps. We are not responsible for them or for their content or policies.']
        },
        {
          title: 'No warranty, and limits on liability',
          paras: [
            'The website is provided "as is" and "as available". To the fullest extent the law allows, we are not liable for any loss arising from your use of, or reliance on, the website or an estimate it produces.',
            'Nothing in these terms limits any liability that cannot be limited by law. Our responsibilities for an order are those set out in the written quotation or contract for that order.'
          ]
        },
        {
          title: 'Governing law',
          paras: ['These terms are governed by the laws of India. The courts at Jaipur, Rajasthan have jurisdiction over any dispute arising from them.']
        },
        {
          title: 'Changes to these terms',
          paras: ['We may update these terms from time to time. The date at the top of this page shows when they were last changed. Continued use of the website means you accept the updated terms.']
        },
        {
          title: 'Contact us',
          paras: [`${COMPANY}, ${address}. Email ${email} or call ${phone}.`]
        }
      ]}
    />
  );
}
