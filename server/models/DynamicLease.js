const mongoose = require('mongoose');
const { LEASE_STATUS } = require('../config/vaultConstants');

const DynamicLeaseSchema = new mongoose.Schema({
  leaseId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  secretPath: {
    type: String,
    required: true,
    index: true
  },
  accessorRole: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  renewable: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: Object.values(LEASE_STATUS),
    default: LEASE_STATUS.ACTIVE
  },
  credentialsSummary: {
    username: String,
    host: String,
    permissions: [String]
  }
});

module.exports = mongoose.model('DynamicLease', DynamicLeaseSchema);
