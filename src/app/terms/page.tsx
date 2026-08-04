'use client';

import Link from 'next/link';

export default function TermsPage() {
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
        }}>Terms of Service</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '30px' }}>
          Last updated: August 4, 2026
        </p>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '0.95rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Legaro AI (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              2. Use of Service
            </h2>
            <p>
              You represent that you are a legal professional or authorized representative using the Service for professional purposes. You agree to use the Service in compliance with all applicable local, national, and international laws, including attorney-client privilege regulations and professional codes of conduct.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              3. Account Registration & Security
            </h2>
            <p>
              You must register for an account using Google / Firebase credentials to access dashboard features. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
            </p>
          </section>

          <section style={{
            background: 'rgba(98, 62, 35, 0.03)',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid #623e23'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b281b', marginBottom: '12px' }}>
              4. Integration with Third-Party Platforms
            </h2>
            <p>
              Our service offers integrations with external applications:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li><strong>Google API Services:</strong> By linking Google Drive, Gmail, Calendar, or Sheets, you grant Legaro AI permission to programmatically access your files, emails, events, and sheets. All operations comply strictly with the Google API Services User Data Policy.</li>
              <li><strong>WhatsApp Business API:</strong> By connecting your phone number, you authorize us to receive client documents and messages and parse them via AI.</li>
            </ul>
            <p style={{ marginTop: '10px' }}>
              You understand that disconnects or failures in third-party services are beyond our control. Disconnecting any integration will stop all automated data syncing immediately.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              5. Intellectual Property
            </h2>
            <p>
              All software, algorithms, code, design, logos, trademarks, and services associated with Legaro AI are the exclusive intellectual property of Legaro AI. You are granted a limited, revocable, non-exclusive license to use the Service as intended. You retain full ownership of all client and case files uploaded.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              6. Limitation of Liability & Warranties
            </h2>
            <p style={{ fontStyle: 'italic' }}>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. We do not guarantee that file organization, AI classification, or Google Calendar syncing will always be error-free. Under no circumstances shall Legaro AI be liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, the Service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
              7. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of any material changes by updating the date at the top of this page. Your continued use of the Service constitutes your acceptance of the updated Terms.
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
