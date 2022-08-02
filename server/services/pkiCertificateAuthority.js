const PkiCertificate = require('../models/PkiCertificate');
const crypto = require('crypto');
const logger = require('../utils/logger');

class PkiCertificateAuthority {
  /**
   * Generates and registers an internal X.509 TLS certificate structure.
   */
  static async issueCertificate(commonName, sans = [], ttlDays = 90) {
    const serialNumber = `SN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const validFrom = new Date();
    const validTo = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

    const mockPem = `-----BEGIN CERTIFICATE-----\nMIIDRzCCAi+gAwIBAgIU${serialNumber}\nSecOps-Internal-Root-CA-X509-Mock-Cert\n-----END CERTIFICATE-----`;

    const cert = await PkiCertificate.create({
      serialNumber,
      commonName,
      subjectAlternativeNames: sans,
      issuerCa: 'SecOps-Internal-Root-CA-2022',
      validFrom,
      validTo,
      pemCertificate: mockPem,
      status: 'ACTIVE'
    });

    logger.info(`Issued X.509 TLS certificate for '${commonName}' [Serial: ${serialNumber}]`);
    return cert;
  }
}

module.exports = PkiCertificateAuthority;
