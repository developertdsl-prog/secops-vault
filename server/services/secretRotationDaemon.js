const VaultSecret = require('../models/VaultSecret');
const EnvelopeEncryptionEngine = require('./envelopeEncryptionEngine');
const logger = require('../utils/logger');

class SecretRotationDaemon {
  /**
   * Rotates a secret by re-encrypting with a freshly generated DEK.
   */
  static async rotateSecret(path) {
    const secret = await VaultSecret.findOne({ path, isDeleted: false });
    if (!secret) {
      throw new Error(`Secret at path '${path}' not found`);
    }

    // Decrypt existing payload
    const decrypted = EnvelopeEncryptionEngine.decrypt(secret.encryptedPayload);

    // Re-encrypt under new DEK
    const newEnvelope = EnvelopeEncryptionEngine.encrypt(decrypted);

    secret.encryptedPayload = newEnvelope;
    secret.currentVersion += 1;
    secret.updatedAt = new Date();
    await secret.save();

    logger.info(`Rotated secret '${path}' to version v${secret.currentVersion}`);
    return secret;
  }
}

module.exports = SecretRotationDaemon;
