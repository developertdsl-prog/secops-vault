const express = require('express');
const router = express.Router();
const pkiCtrl = require('../controllers/pkiController');

router.get('/', pkiCtrl.listCertificates);
router.post('/issue', pkiCtrl.issueCertificate);

module.exports = router;
