import React from 'react';

const EnvelopeEncryptionVisualizer = () => {
  return (
    <div className="card">
      <div className="card-title">
        <span>Envelope Encryption Architecture (Two-Tier Key Hierarchy)</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontFamily: 'JetBrains Mono' }}>
          KEK / DEK Protocol
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#090e1a',
        padding: '18px',
        borderRadius: '6px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {[
          { title: 'Master KEK (Root)', desc: '256-bit HSM Master Key', color: '#f59e0b' },
          { title: 'Wrapped DEK', desc: 'Encrypted via KEK with 96-bit IV', color: '#06b6d4' },
          { title: 'Ciphertext Store', desc: 'AES-256-GCM with Auth Tag', color: '#10b981' }
        ].map((tier, idx) => (
          <React.Fragment key={idx}>
            <div style={{
              background: '#121a2d',
              border: `1px solid ${tier.color}`,
              borderRadius: '6px',
              padding: '12px 18px',
              minWidth: '200px'
            }}>
              <h4 style={{ fontSize: '0.9rem', color: tier.color, marginBottom: '4px' }}>{tier.title}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tier.desc}</p>
            </div>
            {idx < 2 && (
              <span style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}>➔</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EnvelopeEncryptionVisualizer;
