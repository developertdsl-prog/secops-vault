const DynamicLease = require('../models/DynamicLease');
const { LEASE_STATUS } = require('../config/vaultConstants');
const crypto = require('crypto');
const logger = require('../utils/logger');

class DynamicCredentialManager {
  /**
   * Issues a short-lived dynamic credential lease.
   */
  static async issueLease(secretPath, accessorRole, ttlSeconds = 3600) {
    const leaseId = `lease-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    const ephemeralUser = `vault_user_${crypto.randomBytes(4).toString('hex')}`;
    const ephemeralPassword = crypto.randomBytes(16).toString('hex');

    const lease = await DynamicLease.create({
      leaseId,
      secretPath,
      accessorRole,
      issuedAt: new Date(),
      expiresAt,
      renewable: true,
      status: LEASE_STATUS.ACTIVE,
      credentialsSummary: {
        username: ephemeralUser,
        host: 'db-cluster.production.internal',
        permissions: ['SELECT', 'INSERT', 'UPDATE']
      }
    });

    logger.info(`Issued dynamic lease '${leaseId}' for path '${secretPath}' expiring at ${expiresAt.toISOString()}`);
    return {
      leaseId,
      credentials: {
        username: ephemeralUser,
        password: ephemeralPassword
      },
      expiresAt,
      ttlSeconds
    };
  }

  /**
   * Extends the TTL of an active renewable lease.
   */
  static async renewLease(leaseId, extensionSeconds = 3600) {
    const lease = await DynamicLease.findOne({ leaseId, status: LEASE_STATUS.ACTIVE });
    if (!lease) {
      throw new Error(`Active lease '${leaseId}' not found or already revoked`);
    }

    if (!lease.renewable) {
      throw new Error(`Lease '${leaseId}' is non-renewable`);
    }

    const newExpiry = new Date(Date.now() + extensionSeconds * 1000);
    lease.expiresAt = newExpiry;
    await lease.save();

    logger.info(`Renewed dynamic lease '${leaseId}' until ${newExpiry.toISOString()}`);
    return lease;
  }

  /**
   * Revokes a dynamic lease immediately.
   */
  static async revokeLease(leaseId) {
    const lease = await DynamicLease.findOne({ leaseId });
    if (!lease) {
      throw new Error(`Lease '${leaseId}' not found`);
    }

    lease.status = LEASE_STATUS.REVOKED;
    await lease.save();
    logger.warn(`Revoked dynamic credential lease: '${leaseId}'`);
    return lease;
  }
}

module.exports = DynamicCredentialManager;
