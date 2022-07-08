const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/secops_vault';
  
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 20
  };

  try {
    const conn = await mongoose.connect(uri, options);
    logger.info(`Vault Encrypted Persistence DB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    logger.error(`Database Connection Failure: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('Vault database disconnected. Reconnecting...');
});

mongoose.connection.on('error', (err) => {
  logger.error(`Vault database internal error: ${err.message}`);
});

module.exports = connectDB;
