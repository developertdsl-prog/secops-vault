const crypto = require('crypto');
const { ENCRYPTION_ALGORITHM, IV_LENGTH_BYTES, AUTH_TAG_LENGTH_BYTES } = require('../config/vaultConstants');
const logger = require('../utils/logger');

class EnvelopeEncryptionEngine {
  static getMasterKek() {
    const hex = process.env.MASTER_KEY_HEX || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    return Buffer.from(hex, 'hex');
  }

  /**
   * Generates a 256-bit random Data Encryption Key (DEK).
   */
  static generateDek() {
    return crypto.randomBytes(32);
  }

  /**
   * Encrypts plaintext payload using AES-256-GCM Envelope Encryption.
   */
  static encrypt(plaintextObj) {
    const dek = this.generateDek();
    const iv = crypto.randomBytes(IV_LENGTH_BYTES);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, dek, iv);

    const plaintextStr = typeof plaintextObj === 'string' ? plaintextObj : JSON.stringify(plaintextObj);
    let ciphertext = cipher.update(plaintextStr, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    // Wrap the DEK using the Master Key (KEK)
    const kek = this.getMasterKek();
    const kekIv = crypto.randomBytes(IV_LENGTH_BYTES);
    const kekCipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, kek, kekIv);
    let wrappedDek = kekCipher.update(dek.toString('hex'), 'utf8', 'hex');
    wrappedDek += kekCipher.final('hex');
    const wrappedDekTag = kekCipher.getAuthTag();

    const wrappedDekPayload = `${kekIv.toString('hex')}:${wrappedDekTag.toString('hex')}:${wrappedDek}`;

    return {
      ciphertext,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      wrappedDek: wrappedDekPayload
    };
  }

  /**
   * Decrypts ciphertext envelope and validates authentication tag.
   */
  static decrypt(envelope) {
    const { ciphertext, iv, authTag, wrappedDek } = envelope;

    // 1. Unwrap DEK using Master KEK
    const [kekIvHex, kekTagHex, wrappedDekHex] = wrappedDek.split(':');
    const kek = this.getMasterKek();
    const kekDecipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, kek, Buffer.from(kekIvHex, 'hex'));
    kekDecipher.setAuthTag(Buffer.from(kekTagHex, 'hex'));
    let unwrappedDekHex = kekDecipher.update(wrappedDekHex, 'hex', 'utf8');
    unwrappedDekHex += kekDecipher.final('utf8');

    const dek = Buffer.from(unwrappedDekHex, 'hex');

    // 2. Decrypt Payload using unwrapped DEK
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, dek, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decryptedStr = decipher.update(ciphertext, 'hex', 'utf8');
    decryptedStr += decipher.final('utf8');

    try {
      return JSON.parse(decryptedStr);
    } catch {
      return decryptedStr;
    }
  }
}

module.exports = EnvelopeEncryptionEngine;
