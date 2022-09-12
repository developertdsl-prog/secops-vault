import React from 'react';

const SecretsExplorerTable = ({ secrets }) => {
  const sampleSecrets = secrets && secrets.length > 0 ? secrets : [
    { path: 'secret/data/production/database', secretType: 'KV_STATIC', currentVersion: 2, updatedAt: '2022-12-20' },
    { path: 'secret/data/production/stripe_api', secretType: 'API_KEY', currentVersion: 1, updatedAt: '2022-12-18' },
    { path: 'secret/data/staging/jwt_secret', secretType: 'KV_STATIC', currentVersion: 1, updatedAt: '2022-12-15' }
  ];

  return (
    <div className="card">
      <div className="card-title">
        <span>Protected Secret Paths</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sampleSecrets.length} Paths</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '8px' }}>Secret Path</th>
              <th style={{ padding: '8px' }}>Type</th>
              <th style={{ padding: '8px' }}>Version</th>
              <th style={{ padding: '8px' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {sampleSecrets.map(s => (
              <tr key={s.path} style={{ borderBottom: '1px solid #141c2e' }}>
                <td style={{ padding: '10px 8px', fontFamily: 'JetBrains Mono', color: 'var(--accent-gold)' }}>{s.path}</td>
                <td style={{ padding: '10px 8px' }}>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    background: '#1e293b',
                    color: 'var(--accent-cyan)'
                  }}>
                    {s.secretType}
                  </span>
                </td>
                <td style={{ padding: '10px 8px', fontFamily: 'JetBrains Mono', color: '#fff' }}>v{s.currentVersion}</td>
                <td style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>{s.updatedAt?.split('T')[0] || s.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecretsExplorerTable;
