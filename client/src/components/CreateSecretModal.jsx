import React, { useState } from 'react';

const CreateSecretModal = ({ isOpen, onClose, onCreate }) => {
  const [path, setPath] = useState('');
  const [jsonPayload, setJsonPayload] = useState('{"key": "value"}');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonPayload);
      onCreate({ path, data: parsed });
      onClose();
    } catch {
      alert('Invalid JSON payload');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '440px', maxWidth: '90%' }}>
        <div className="card-title">
          <span>Write Encrypted Secret</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Secret Path</label>
            <input
              required
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="e.g. secret/data/prod/apiKey"
              style={{ width: '100%', padding: '8px', background: '#090d16', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Data Payload (JSON)</label>
            <textarea
              rows={4}
              value={jsonPayload}
              onChange={(e) => setJsonPayload(e.target.value)}
              style={{ width: '100%', padding: '8px', background: '#090d16', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff', fontFamily: 'JetBrains Mono' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
            Encrypt and Store in Vault
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSecretModal;
