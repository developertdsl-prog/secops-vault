const PkiCertificate = require('../models/PkiCertificate');
const PkiCertificateAuthority = require('../services/pkiCertificateAuthority');

exports.listCertificates = async (req, res, next) => {
  try {
    const certs = await PkiCertificate.find().sort({ issuedAt: -1 });
    res.json({ success: true, count: certs.length, data: certs });
  } catch (err) {
    next(err);
  }
};

exports.issueCertificate = async (req, res, next) => {
  try {
    const { commonName, sans, ttlDays } = req.body;
    if (!commonName) {
      return res.status(400).json({ success: false, error: 'commonName is required' });
    }

    const cert = await PkiCertificateAuthority.issueCertificate(commonName, sans, ttlDays || 90);
    res.status(201).json({ success: true, data: cert });
  } catch (err) {
    next(err);
  }
};
