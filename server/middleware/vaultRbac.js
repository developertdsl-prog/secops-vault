const { VAULT_ROLES } = require('../config/vaultConstants');

const vaultRbac = (allowedRoles = [VAULT_ROLES.VAULT_ADMIN]) => {
  return (req, res, next) => {
    const role = req.userRole || VAULT_ROLES.DEVELOPER;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: Role '${role}' lacks permission for this vault resource`
      });
    }

    next();
  };
};

module.exports = vaultRbac;
