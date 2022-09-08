import React from 'react';

const Navbar = ({ onOpenCreateModal }) => {
  return (
    <nav style={{
      background: '#0a0f1d',
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #f59e0b, #b45309)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          color: '#07090e',
          fontSize: '1.1rem'
        }}>
          🛡️
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            SecOps<span style={{ color: 'var(--accent-gold)' }}>.Vault</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Envelope Encryption & Dynamic Credential Platform</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '5px 12px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: '#10b981',
          fontFamily: 'JetBrains Mono'
        }}>
          ● VAULT STATUS: UNSEALED (AES-256)
        </div>
        <button className="btn-primary" onClick={onOpenCreateModal}>
          + Write Secret
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
