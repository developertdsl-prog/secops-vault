const request = require('supertest');
const app = require('../server');

describe('E2E SecOps-Vault Platform Integration Test Suite', () => {
  test('GET /api/v1/ping returns optimal health and encryption status', async () => {
    const res = await request(app).get('/api/v1/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OPTIMAL');
    expect(res.body.cryptoEngine).toContain('AES-256-GCM');
  });

  test('GET /health returns basic liveness probe', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });
});
