const mongoose = require('mongoose');
const { SECRET_TYPES } = require('../config/vaultConstants');

const VaultSecretSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  secretType: {
    type: String,
    enum: Object.values(SECRET_TYPES),
    default: SECRET_TYPES.KV_STATIC
  },
  encryptedPayload: {
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    wrappedDek: { type: String, required: true }
  },
  currentVersion: {
    type: Number,
    default: 1
  },
  maxVersions: {
    type: Number,
    default: 10
  },
  leaseTtlSeconds: {
    type: Number,
    default: 3600
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

VaultSecretSchema.index({ path: 1, isDeleted: 1 });

module.exports = mongoose.model('VaultSecret', VaultSecretSchema);
