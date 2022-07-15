const mongoose = require('mongoose');

const PkiCertificateSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  commonName: {
    type: String,
    required: true
  },
  subjectAlternativeNames: [{
    type: String
  }],
  issuerCa: {
    type: String,
    default: 'SecOps-Internal-Root-CA-2022'
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  pemCertificate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'REVOKED', 'EXPIRED'],
    default: 'ACTIVE'
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PkiCertificate', PkiCertificateSchema);
