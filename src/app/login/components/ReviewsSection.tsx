'use client';

export default function ReviewsSection() {
  const reviews = [
    {
      quote: "Legaro AI completely eliminated manual document filing for our litigation practice. Court notices sent via WhatsApp are automatically saved in Google Drive and calendar hearing dates are set instantly.",
      author: "Rajesh Malhotra",
      role: "Senior Advocate, High Court Practice",
      stars: 5,
    },
    {
      quote: "The seamless integration with Google Workspace means our entire legal team stays in sync. Document organization happens in the background without changing how we work.",
      author: "Ananya Sharma",
      role: "Managing Partner, Commercial Law Chambers",
      stars: 5,
    },
    {
      quote: "Setting up Google Sign-In and connecting Google Drive took less than two minutes. It saves our clerks hours every single day.",
      author: "Vikram Sengupta",
      role: "Independent Corporate Legal Consultant",
      stars: 5,
    },
  ];

  return (
    <section id="reviews" style={{ width: '100%', margin: '80px auto 40px', textAlign: 'center' }}>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '1.5px',
        color: '#d97706',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: '12px'
      }}>
        TRUSTED BY LEGAL PROFESSIONALS
      </span>

      <h2 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        color: '#2c1e15',
        marginBottom: '16px'
      }}>
        Loved by Advocates & Law Firms
      </h2>

      <p style={{
        color: '#625043',
        fontSize: '1rem',
        lineHeight: '1.6',
        maxWidth: '700px',
        margin: '0 auto 50px'
      }}>
        See how modern practitioners simplify case management and automated Google file organization with Legaro AI.
      </p>

      {/* Testimonials Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        textAlign: 'left'
      }}>
        {reviews.map((rev, idx) => (
          <div key={idx} style={{
            background: '#ffffff',
            border: '1px solid #e2dcd0',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(98, 62, 35, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              {/* Star Rating */}
              <div style={{ color: '#d97706', fontSize: '1.1rem', marginBottom: '16px' }}>
                {'★'.repeat(rev.stars)}
              </div>
              <p style={{
                color: '#4a3b30',
                fontSize: '0.92rem',
                lineHeight: '1.7',
                fontStyle: 'italic',
                marginBottom: '24px'
              }}>
                "{rev.quote}"
              </p>
            </div>

            <div style={{ borderTop: '1px solid #f0eae1', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d97706 0%, #623e23 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem'
              }}>
                {rev.author[0]}
              </div>
              <div>
                <h4 style={{ color: '#2c1e15', fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>
                  {rev.author}
                </h4>
                <p style={{ color: '#8c786a', fontSize: '0.78rem', margin: 0 }}>
                  {rev.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Metrics Bar */}
      <div style={{
        marginTop: '60px',
        background: '#ffffff',
        border: '1px solid #e2dcd0',
        borderRadius: '16px',
        padding: '30px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        boxShadow: '0 10px 30px rgba(98, 62, 35, 0.03)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#d97706', margin: 0 }}>500+</h3>
          <p style={{ color: '#625043', fontSize: '0.82rem', fontWeight: '600', margin: '4px 0 0' }}>Active Law Firms</p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#d97706', margin: 0 }}>25,000+</h3>
          <p style={{ color: '#625043', fontSize: '0.82rem', fontWeight: '600', margin: '4px 0 0' }}>Files Auto-Filed</p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#d97706', margin: 0 }}>99.9%</h3>
          <p style={{ color: '#625043', fontSize: '0.82rem', fontWeight: '600', margin: '4px 0 0' }}>Sync Uptime</p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#d97706', margin: 0 }}>AES-256</h3>
          <p style={{ color: '#625043', fontSize: '0.82rem', fontWeight: '600', margin: '4px 0 0' }}>Bank-Grade Security</p>
        </div>
      </div>
    </section>
  );
}
