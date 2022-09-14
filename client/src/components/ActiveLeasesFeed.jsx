import React from 'react';

const ActiveLeasesFeed = () => {
  const leases = [
    { id: 'lease-init-sample-01', path: 'database/creds/readonly', user: 'vault_ephemeral_usr', ttl: '3540s', status: 'ACTIVE' }
  ];

  return (
    <div className="card">
      <div className="card-title">
        <span>Active Dynamic Leases</span>
        <span style={{ fontSize: '0.7rem', color: '#10b981', fontFamily: 'JetBrains Mono' }}>● DAEMON RUNNING</span>
      </div>

      <div style={{
        background: '#090e1a',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '12px',
        fontSize: '0.75rem'
      }}>
        {leases.map(l => (
          <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-emerald)', fontWeight: 600 }}>{l.id}</span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Path: {l.path} | User: {l.user}</p>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-gold)' }}>TTL: {l.ttl}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveLeasesFeed;
