const mongoose = require('mongoose');

const EncryptionKeySchema = new mongoose.Schema({
  keyId: {
    type: String,
    required: true,
    unique: true
  },
  keyType: {
    type: String,
    enum: ['MASTER_KEK', 'DATA_DEK'],
    default: 'MASTER_KEK'
  },
  algorithm: {
    type: String,
    default: 'aes-256-gcm'
  },
  version: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'ROTATED', 'COMPROMISED'],
    default: 'ACTIVE'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EncryptionKey', EncryptionKeySchema);
