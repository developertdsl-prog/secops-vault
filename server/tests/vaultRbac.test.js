const vaultRbac = require('../middleware/vaultRbac');
const { VAULT_ROLES } = require('../config/vaultConstants');

describe('VaultRbac Role Policy Test Suite', () => {
  test('Permits authorized VAULT_ADMIN role access', () => {
    const middleware = vaultRbac([VAULT_ROLES.VAULT_ADMIN]);
    const req = { userRole: VAULT_ROLES.VAULT_ADMIN };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Blocks unauthorized role access with 403 Forbidden', () => {
    const middleware = vaultRbac([VAULT_ROLES.VAULT_ADMIN]);
    const req = { userRole: VAULT_ROLES.DEVELOPER };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
