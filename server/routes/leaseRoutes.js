const express = require('express');
const router = express.Router();
const leaseCtrl = require('../controllers/leaseController');

router.get('/', leaseCtrl.listLeases);
router.post('/issue', leaseCtrl.issueDynamicLease);
router.post('/:id/renew', leaseCtrl.renewLease);
router.post('/:id/revoke', leaseCtrl.revokeLease);

module.exports = router;
