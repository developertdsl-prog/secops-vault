const DynamicLease = require('../models/DynamicLease');
const DynamicCredentialManager = require('../services/dynamicCredentialManager');

exports.listLeases = async (req, res, next) => {
  try {
    const leases = await DynamicLease.find().sort({ issuedAt: -1 }).limit(50);
    res.json({ success: true, count: leases.length, data: leases });
  } catch (err) {
    next(err);
  }
};

exports.issueDynamicLease = async (req, res, next) => {
  try {
    const { path, ttlSeconds } = req.body;
    const leaseData = await DynamicCredentialManager.issueLease(
      path || 'database/creds/readonly',
      req.userRole || 'SERVICE_ACCOUNT',
      ttlSeconds || 3600
    );
    res.status(201).json({ success: true, data: leaseData });
  } catch (err) {
    next(err);
  }
};

exports.renewLease = async (req, res, next) => {
  try {
    const renewed = await DynamicCredentialManager.renewLease(req.params.id, req.body.increment || 3600);
    res.json({ success: true, message: 'Lease renewed', data: renewed });
  } catch (err) {
    next(err);
  }
};

exports.revokeLease = async (req, res, next) => {
  try {
    const revoked = await DynamicCredentialManager.revokeLease(req.params.id);
    res.json({ success: true, message: 'Lease revoked immediately', data: revoked });
  } catch (err) {
    next(err);
  }
};
