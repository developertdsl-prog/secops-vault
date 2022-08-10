const VaultSecret = require('../models/VaultSecret');
const EnvelopeEncryptionEngine = require('../services/envelopeEncryptionEngine');
const VaultAuditService = require('../services/vaultAuditService');

exports.createOrUpdateSecret = async (req, res, next) => {
  try {
    const path = req.params[0] || req.body.path;
    const { data, secretType, leaseTtlSeconds, metadata } = req.body;

    if (!path || data === undefined) {
      return res.status(400).json({ success: false, error: 'Path and data payload are required' });
    }

    // Envelope Encrypt Data
    const encryptedPayload = EnvelopeEncryptionEngine.encrypt(data);

    let secret = await VaultSecret.findOne({ path });
    if (secret) {
      secret.encryptedPayload = encryptedPayload;
      secret.currentVersion += 1;
      secret.updatedAt = new Date();
      await secret.save();
    } else {
      secret = await VaultSecret.create({
        path,
        secretType: secretType || 'KV_STATIC',
        encryptedPayload,
        leaseTtlSeconds: leaseTtlSeconds || 3600,
        metadata: metadata || {}
      });
    }

    await VaultAuditService.logEvent(path, 'WRITE', req.userRole || 'VAULT_ADMIN', req.ip);

    res.status(201).json({
      success: true,
      message: 'Secret encrypted and stored in vault',
      path,
      version: secret.currentVersion
    });
  } catch (err) {
    next(err);
  }
};

exports.getSecret = async (req, res, next) => {
  try {
    const path = req.params[0];
    const secret = await VaultSecret.findOne({ path, isDeleted: false });

    if (!secret) {
      return res.status(404).json({ success: false, error: `Secret at path '${path}' not found` });
    }

    // Decrypt Envelope
    const plaintext = EnvelopeEncryptionEngine.decrypt(secret.encryptedPayload);

    await VaultAuditService.logEvent(path, 'READ', req.userRole || 'VAULT_ADMIN', req.ip);

    res.json({
      success: true,
      path: secret.path,
      version: secret.currentVersion,
      data: plaintext,
      metadata: secret.metadata
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteSecret = async (req, res, next) => {
  try {
    const path = req.params[0];
    const secret = await VaultSecret.findOneAndUpdate({ path }, { isDeleted: true }, { new: true });

    if (!secret) {
      return res.status(404).json({ success: false, error: `Secret at path '${path}' not found` });
    }

    await VaultAuditService.logEvent(path, 'REVOKE', req.userRole || 'VAULT_ADMIN', req.ip);
    res.json({ success: true, message: `Secret at path '${path}' soft-deleted` });
  } catch (err) {
    next(err);
  }
};

exports.listSecrets = async (req, res, next) => {
  try {
    const secrets = await VaultSecret.find({ isDeleted: false })
      .select('path secretType currentVersion updatedAt')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: secrets.length, data: secrets });
  } catch (err) {
    next(err);
  }
};
