const express = require('express');
const router = express.Router();
const secretCtrl = require('../controllers/secretController');

router.get('/', secretCtrl.listSecrets);
router.post('/*', secretCtrl.createOrUpdateSecret);
router.get('/*', secretCtrl.getSecret);
router.delete('/*', secretCtrl.deleteSecret);

module.exports = router;
