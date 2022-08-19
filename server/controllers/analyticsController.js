const VaultSecret = require('../models/VaultSecret');
const DynamicLease = require('../models/DynamicLease');
const PkiCertificate = require('../models/PkiCertificate');
const VaultAuditLog = require('../models/VaultAuditLog');

exports.getVaultSummary = async (req, res, next) => {
  try {
    const [secretsCount, activeLeasesCount, certsCount, auditCount] = await Promise.all([
      VaultSecret.countDocuments({ isDeleted: false }),
      DynamicLease.countDocuments({ status: 'ACTIVE' }),
      PkiCertificate.countDocuments({ status: 'ACTIVE' }),
      VaultAuditLog.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        activeSecretsCount: secretsCount,
        activeDynamicLeases: activeLeasesCount,
        managedCertificates: certsCount,
        tamperEvidentAuditLogs: auditCount,
        encryptionAlgorithm: 'AES-256-GCM (Envelope)',
        vaultStatus: 'SEALED_OPERATIONAL_UNLOCKED'
      }
    });
  } catch (err) {
    next(err);
  }
};
