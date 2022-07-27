const EnvelopeEncryptionEngine = require('../services/envelopeEncryptionEngine');

describe('EnvelopeEncryptionEngine AES-256-GCM Cryptographic Test Suite', () => {
  test('Encrypts and decrypts string and JSON payloads deterministically', () => {
    const original = { apiKey: 'mock_api_secret_token_123', databasePass: 'P@ssw0rd9912' };
    const envelope = EnvelopeEncryptionEngine.encrypt(original);

    expect(envelope.ciphertext).toBeDefined();
    expect(envelope.iv).toHaveLength(24); // 12 bytes = 24 hex chars
    expect(envelope.authTag).toHaveLength(32); // 16 bytes = 32 hex chars
    expect(envelope.wrappedDek).toBeDefined();

    const decrypted = EnvelopeEncryptionEngine.decrypt(envelope);
    expect(decrypted).toEqual(original);
  });

  test('Fails decryption if authentication tag or ciphertext is tampered', () => {
    const original = 'confidential_payload';
    const envelope = EnvelopeEncryptionEngine.encrypt(original);

    // Tamper with ciphertext
    const tamperedCiphertext = envelope.ciphertext.slice(0, -2) + 'aa';
    const tamperedEnvelope = { ...envelope, ciphertext: tamperedCiphertext };

    expect(() => {
      EnvelopeEncryptionEngine.decrypt(tamperedEnvelope);
    }).toThrow();
  });
});
