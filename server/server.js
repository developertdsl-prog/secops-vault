const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const authApiKey = require('./middleware/authApiKey');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// REST API Route Imports
const secretRoutes = require('./routes/secretRoutes');
const leaseRoutes = require('./routes/leaseRoutes');
const pkiRoutes = require('./routes/pkiRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
}

app.use(rateLimiter);

// System Health Checks
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'SecOps-Vault', timestamp: new Date().toISOString() });
});

app.get('/api/v1/ping', (req, res) => {
  res.json({
    status: 'OPTIMAL',
    platform: 'SecOps-Vault Enterprise Secret Management',
    version: '1.0.0',
    cryptoEngine: 'AES-256-GCM Envelope',
    uptime: process.uptime()
  });
});

// Protected Vault Subsystems
app.use('/api/v1/secrets', authApiKey, secretRoutes);
app.use('/api/v1/leases', authApiKey, leaseRoutes);
app.use('/api/v1/pki', authApiKey, pkiRoutes);
app.use('/api/v1/analytics', authApiKey, analyticsRoutes);

app.use(errorHandler);

let server;
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server = app.listen(PORT, () => {
      logger.info(`SecOps-Vault Server operational on port ${PORT} [Env: ${process.env.NODE_ENV || 'development'}]`);
    });
  });
}

module.exports = app;
