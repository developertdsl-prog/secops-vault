const VaultAuditLog = require('../models/VaultAuditLog');
const crypto = require('crypto');

class VaultAuditService {
  /**
   * Logs a tamper-evident, HMAC-SHA256 signed audit entry.
   */
  static async logEvent(path, operation, accessorRole, clientIp = '127.0.0.1', status = 'SUCCESS') {
    const hmacSecret = process.env.VAULT_HMAC_SECRET || 'secops_vault_audit_hmac_secret_key_2022';
    const auditId = `AUDIT-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const timestamp = new Date();

    const payload = `${auditId}|${path}|${operation}|${accessorRole}|${clientIp}|${status}|${timestamp.toISOString()}`;
    const signature = crypto.createHmac('sha256', hmacSecret).update(payload).digest('hex');

    return await VaultAuditLog.create({
      auditId,
      path,
      operation,
      accessorRole,
      clientIp,
      hmacSignature: signature,
      status,
      timestamp
    });
  }
}

module.exports = VaultAuditService;
