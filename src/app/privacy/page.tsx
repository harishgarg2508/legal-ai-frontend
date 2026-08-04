'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fdfcf9',
      color: '#1e293b',
      fontFamily: "'Inter', sans-serif",
      padding: '40px 20px',
      lineHeight: '1.7'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
        border: '1px solid #efeae2'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span>
            <span style={{ fontWeight: '800', letterSpacing: '1px', color: '#3b281b' }}>LEGARO AI</span>
          </div>
          <Link href="/login" style={{
            textDecoration: 'none',
            color: '#623e23',
            fontWeight: '600',
            fontSize: '0.9rem',
            border: '1px solid #623e23',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}>
            Back to Sign In
          </Link>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '10px'
        }}>Privacy Policy</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '30px' }}>
          Last updated: August 4, 2026
        </p>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '0.95rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              1. Introduction
            </h2>
            <p>
              Welcome to Legaro AI ("we", "our", or "us"). We are committed to protecting the privacy of legal professionals and their clients. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and integrations.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              2. Information We Collect
            </h2>
            <p>
              We collect information to provide better services to our users. The types of information we collect include:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li><strong>Account Information:</strong> Name, email address, profile picture, and account credentials synced via Firebase Authentication.</li>
              <li><strong>Client and Case Data:</strong> Client contact details, case names, files, documents, and related litigation metadata entered by you.</li>
              <li><strong>Integration Tokens:</strong> Securely encrypted OAuth2 tokens to communicate with third-party APIs (Google Drive, Gmail, Google Calendar, Google Sheets).</li>
            </ul>
          </section>

          <section style={{
            background: 'rgba(98, 62, 35, 0.03)',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid #623e23'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b281b', marginBottom: '12px' }}>
              3. Google API Services Disclosure
            </h2>
            <p>
              Legaro AI's use and transfer of information received from Google APIs to any other app will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" rel="noopener noreferrer" style={{ color: '#623e23', fontWeight: '600' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.
            </p>
            <p style={{ marginTop: '10px' }}>
              Specifically, we request permissions for:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li><strong>Google Drive Scopes:</strong> To automate the creation of case-specific folders and to upload and organize documents client-by-client.</li>
              <li><strong>Google Calendar Scopes:</strong> To schedule hearing dates extracted by our AI from court notices.</li>
              <li><strong>Gmail & Sheets Scopes:</strong> To import relevant correspondence and client directory records.</li>
            </ul>
            <p style={{ marginTop: '10px', fontWeight: '500' }}>
              No Google user data is ever sold, shared with advertising networks, or used for any purpose other than providing the legal practice organization tools you explicitly trigger.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              4. WhatsApp Integration
            </h2>
            <p>
              When clients send documents or messages via WhatsApp to your connected business number, we process that media to automatically match it to the correct case profile, extract key details via AI, and route the file to your Google Drive. We store WhatsApp connection records (phone numbers, verified status) securely.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              5. Data Security
            </h2>
            <p>
              All sensitive credentials (including Google OAuth refresh tokens and client-specific secrets) are stored using industry-standard AES-256-GCM encryption. Data transmissions are encrypted in transit using Transport Layer Security (TLS).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              6. Data Deletion and Control
            </h2>
            <p>
              You maintain complete ownership of your data. You may disconnect integrations or request permanent account deletion at any time from the settings dashboard. Disconnecting Google services immediately deletes all stored OAuth credentials from our database.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              7. Contact Us
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at: <a href="mailto:support@legaro.ai" style={{ color: '#623e23', fontWeight: '600' }}>support@legaro.ai</a>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          &copy; {new Date().getFullYear()} Legaro AI. All rights reserved.
        </div>
      </div>
    </div>
  );
}
