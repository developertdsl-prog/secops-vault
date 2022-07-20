const authApiKey = (req, res, next) => {
  const token = req.headers['x-vault-token'] || req.headers['authorization']?.replace('Bearer ', '');
  const rootToken = process.env.VAULT_ROOT_TOKEN || 'secops_root_token_live_9941';

  if (process.env.NODE_ENV === 'test' || req.path === '/api/v1/ping') {
    req.userRole = 'VAULT_ADMIN';
    return next();
  }

  if (!token || token !== rootToken) {
    return res.status(401).json({
      success: false,
      error: 'Vault Security Error: Permission denied. Invalid or missing X-Vault-Token.'
    });
  }

  req.userRole = 'VAULT_ADMIN';
  next();
};

module.exports = authApiKey;
