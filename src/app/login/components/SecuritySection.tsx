'use client';

export default function SecuritySection() {
  return (
    <section id="security" style={{
      width: '100%',
      background: '#ffffff',
      border: '1px solid #e2dcd0',
      padding: '40px 36px',
      borderRadius: '20px',
      margin: '60px 0 40px',
      textAlign: 'left',
      boxShadow: '0 12px 40px rgba(98, 62, 35, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.6rem' }}>🔒</span>
        <h3 style={{ color: '#2c1e15', fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>
          Security, Privacy & Google Data Transparency
        </h3>
      </div>

      <p style={{ color: '#625043', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '28px' }}>
        Legaro AI is engineered from the ground up for legal confidentiality. We prioritize data privacy, zero-trust token storage, and strict adherence to Google Developer policies.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px'
      }}>
        <div style={{ background: '#fcfbf8', border: '1px solid #efe9df', padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ color: '#2c1e15', fontSize: '0.98rem', fontWeight: '700', marginBottom: '8px' }}>
            🔑 AES-256 Encryption
          </h4>
          <p style={{ color: '#625043', fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>
            All OAuth tokens (Google Drive, Gmail, Calendar, Sheets) are stored using military-grade AES-256-GCM encryption at rest. Transmissions use TLS 1.3 encryption.
          </p>
        </div>

        <div style={{ background: '#fcfbf8', border: '1px solid #efe9df', padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ color: '#2c1e15', fontSize: '0.98rem', fontWeight: '700', marginBottom: '8px' }}>
            🛡️ Google API Policy Compliance
          </h4>
          <p style={{ color: '#625043', fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>
            Legaro AI strictly adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" rel="noopener noreferrer" style={{ color: '#d97706', fontWeight: '600' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.
          </p>
        </div>

        <div style={{ background: '#fcfbf8', border: '1px solid #efe9df', padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ color: '#2c1e15', fontSize: '0.98rem', fontWeight: '700', marginBottom: '8px' }}>
            📁 100% Data Ownership
          </h4>
          <p style={{ color: '#625043', fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>
            Law firms retain complete ownership of all files and folders created in Google Drive. You can revoke access or delete stored connections at any time from your settings.
          </p>
        </div>
      </div>
    </section>
  );
}
