const { SECRET_TYPES } = require('../config/vaultConstants');

describe('SecretRotation Configuration & Lifecycle Test Suite', () => {
  test('Validates secret types enumeration', () => {
    expect(SECRET_TYPES.KV_STATIC).toBe('KV_STATIC');
    expect(SECRET_TYPES.DYNAMIC_DATABASE).toBe('DYNAMIC_DATABASE');
    expect(SECRET_TYPES.PKI_CERT).toBe('PKI_CERT');
  });
});
