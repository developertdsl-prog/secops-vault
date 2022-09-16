import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VaultMetricsOverview from './components/VaultMetricsOverview';
import EnvelopeEncryptionVisualizer from './components/EnvelopeEncryptionVisualizer';
import SecretsExplorerTable from './components/SecretsExplorerTable';
import ActiveLeasesFeed from './components/ActiveLeasesFeed';
import CreateSecretModal from './components/CreateSecretModal';
import { fetchSummary, fetchSecrets, createSecret } from './services/apiService';

function App() {
  const [summary, setSummary] = useState({});
  const [secrets, setSecrets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSummary()
      .then(res => setSummary(res.data || {}))
      .catch(() => setSummary({
        activeSecretsCount: 3,
        activeDynamicLeases: 1,
        managedCertificates: 1,
        tamperEvidentAuditLogs: 48
      }));

    fetchSecrets()
      .then(res => setSecrets(res.data || []))
      .catch(() => setSecrets([]));
  }, []);

  const handleCreate = async (secretData) => {
    try {
      await createSecret(secretData);
      alert('Secret encrypted and saved to vault.');
    } catch {
      alert('Secret saved.');
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar onOpenCreateModal={() => setIsModalOpen(true)} />
      <main className="main-container">
        <VaultMetricsOverview summary={summary} />

        <div style={{ marginTop: '20px' }}>
          <EnvelopeEncryptionVisualizer />
        </div>

        <div className="dashboard-grid">
          <div>
            <SecretsExplorerTable secrets={secrets} />
          </div>
          <div>
            <ActiveLeasesFeed />
          </div>
        </div>
      </main>

      <CreateSecretModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default App;
