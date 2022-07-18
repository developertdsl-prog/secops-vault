const mongoose = require('mongoose');

const VaultAuditLogSchema = new mongoose.Schema({
  auditId: {
    type: String,
    required: true,
    unique: true
  },
  path: {
    type: String,
    required: true,
    index: true
  },
  operation: {
    type: String,
    enum: ['READ', 'WRITE', 'REVOKE', 'ROTATE', 'PKI_ISSUE'],
    required: true
  },
  accessorRole: {
    type: String,
    required: true
  },
  clientIp: {
    type: String,
    default: '127.0.0.1'
  },
  hmacSignature: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'DENIED', 'ERROR'],
    default: 'SUCCESS'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('VaultAuditLog', VaultAuditLogSchema);
