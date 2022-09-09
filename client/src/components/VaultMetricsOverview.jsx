import React from 'react';

const VaultMetricsOverview = ({ summary }) => {
  const cards = [
    { label: 'Protected Secret Paths', value: summary.activeSecretsCount || 3, unit: 'paths', color: '#f59e0b' },
    { label: 'Active Dynamic Leases', value: summary.activeDynamicLeases || 1, unit: 'leases', color: '#10b981' },
    { label: 'Managed PKI Certificates', value: summary.managedCertificates || 1, unit: 'certs', color: '#06b6d4' },
    { label: 'Tamper-Evident Audit Logs', value: summary.tamperEvidentAuditLogs || 48, unit: 'signed', color: '#a78bfa' },
    { label: 'Encryption Standard', value: 'AES-256-GCM', unit: 'envelope', color: '#f43f5e' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '14px'
    }}>
      {cards.map((c, i) => (
        <div key={i} className="card" style={{ borderLeft: `3px solid ${c.color}` }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{c.label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', fontFamily: 'JetBrains Mono' }}>
              {c.value}
            </span>
            <span style={{ fontSize: '0.7rem', color: c.color, fontWeight: 600 }}>{c.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VaultMetricsOverview;
