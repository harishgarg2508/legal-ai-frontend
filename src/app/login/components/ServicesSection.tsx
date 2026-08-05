'use client';

export default function ServicesSection() {
  const services = [
    {
      icon: '📁',
      title: 'Google Drive Auto-Organizer',
      description: 'Automates case-specific folder creation under a structured Legaro AI root directory. Automatically files legal documents by Client and Case name without manual dragging.',
      badge: 'Google Drive API',
    },
    {
      icon: '📅',
      title: 'Google Calendar Court Sync',
      description: 'AI analyzes uploaded court notices, extracts hearing dates, locations, and judge names, and adds them directly as events in your Google Calendar with automated reminders.',
      badge: 'Google Calendar API',
    },
    {
      icon: '💬',
      title: 'WhatsApp Document Intake',
      description: 'Connect your business WhatsApp number. Clients can send case documents or photos, which Legaro AI auto-matches and files directly into Google Drive.',
      badge: 'WhatsApp Business API',
    },
    {
      icon: '📧',
      title: 'Gmail Intake Automation',
      description: 'Monitors client emails, extracts attached pleadings or court notices, and automatically uploads them to case folders in Google Drive.',
      badge: 'Gmail API',
    },
    {
      icon: '📊',
      title: 'Google Sheets Roster Sync',
      description: 'Import client rosters and case logs from Google Sheets. Keep records synced dynamically between your Legaro AI dashboard and your spreadsheets.',
      badge: 'Google Sheets API',
    },
  ];

  return (
    <section id="services" style={{ width: '100%', margin: '80px auto 40px', textAlign: 'center' }}>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '1.5px',
        color: '#d97706',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: '12px'
      }}>
        INTELLIGENT WORKFLOWS
      </span>

      <h2 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        color: '#2c1e15',
        marginBottom: '16px'
      }}>
        What Legaro AI Does
      </h2>

      <p style={{
        color: '#625043',
        fontSize: '1rem',
        lineHeight: '1.6',
        maxWidth: '740px',
        margin: '0 auto 50px'
      }}>
        Legaro AI is a secure legal operating platform designed for law firms to automate document filing, client communications, and court schedules using direct Google Workspace integrations.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        textAlign: 'left'
      }}>
        {services.map((srv, idx) => (
          <div key={idx} style={{
            background: '#ffffff',
            border: '1px solid #e2dcd0',
            padding: '28px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(98, 62, 35, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}>
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  width: '44px',
                  height: '44px',
                  background: 'rgba(217, 119, 6, 0.08)',
                  border: '1px solid rgba(217, 119, 6, 0.2)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>{srv.icon}</div>

                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: '#d97706',
                  background: 'rgba(217, 119, 6, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}>{srv.badge}</span>
              </div>

              <h3 style={{ color: '#2c1e15', fontSize: '1.15rem', fontWeight: '700', marginBottom: '12px' }}>
                {srv.title}
              </h3>

              <p style={{ color: '#625043', fontSize: '0.88rem', lineHeight: '1.65', margin: 0 }}>
                {srv.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
