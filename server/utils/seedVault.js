const mongoose = require('mongoose');
const VaultSecret = require('../models/VaultSecret');
const DynamicLease = require('../models/DynamicLease');
const PkiCertificate = require('../models/PkiCertificate');
const EnvelopeEncryptionEngine = require('../services/envelopeEncryptionEngine');
const logger = require('./logger');

const sampleSecrets = [
  {
    path: 'secret/data/production/database',
    secretType: 'KV_STATIC',
    data: { host: 'pg-prod.internal', port: 5432, username: 'db_admin', password: 'ultra_secure_pg_pass_9921!' },
    metadata: { env: 'production', tier: 'database' }
  },
  {
    path: 'secret/data/production/stripe_api',
    secretType: 'API_KEY',
    data: { apiKey: 'mock_stripe_vault_token_production_9941' },
    metadata: { provider: 'stripe' }
  },
  {
    path: 'secret/data/staging/jwt_secret',
    secretType: 'KV_STATIC',
    data: { secret: 'super_secret_jwt_hmac_signing_key_staging' },
    metadata: { env: 'staging' }
  }
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/secops_vault';
  await mongoose.connect(uri);
  logger.info('Connected to MongoDB for seeding SecOps-Vault secrets...');

  for (const item of sampleSecrets) {
    const encryptedPayload = EnvelopeEncryptionEngine.encrypt(item.data);
    await VaultSecret.findOneAndUpdate(
      { path: item.path },
      {
        path: item.path,
        secretType: item.secretType,
        encryptedPayload,
        metadata: item.metadata,
        isDeleted: false
      },
      { upsert: true, new: true }
    );
    logger.info(`Seeded Secret: ${item.path}`);
  }

  // Seed sample active lease
  await DynamicLease.findOneAndUpdate(
    { leaseId: 'lease-init-sample-01' },
    {
      leaseId: 'lease-init-sample-01',
      secretPath: 'database/creds/readonly',
      accessorRole: 'SERVICE_ACCOUNT',
      expiresAt: new Date(Date.now() + 3600 * 1000),
      renewable: true,
      status: 'ACTIVE',
      credentialsSummary: { username: 'vault_ephemeral_usr', host: 'pg-prod.internal', permissions: ['SELECT'] }
    },
    { upsert: true }
  );

  // Seed sample PKI cert
  await PkiCertificate.findOneAndUpdate(
    { serialNumber: 'SN-INIT-ROOT-001' },
    {
      serialNumber: 'SN-INIT-ROOT-001',
      commonName: 'api.secops-vault.internal',
      subjectAlternativeNames: ['vault.internal', 'localhost'],
      issuerCa: 'SecOps-Internal-Root-CA-2022',
      validFrom: new Date(),
      validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      pemCertificate: '-----BEGIN CERTIFICATE-----\nMIIInitSampleCert\n-----END CERTIFICATE-----',
      status: 'ACTIVE'
    },
    { upsert: true }
  );

  logger.info('SecOps-Vault seeding finished successfully.');
  await mongoose.disconnect();
}

if (require.main === module) {
  seed().catch(err => {
    logger.error(`Seed error: ${err.message}`);
    process.exit(1);
  });
}

module.exports = seed;
