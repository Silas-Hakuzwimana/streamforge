const morgan = require('morgan');

// Custom token for timestamp
morgan.token('date', () => new Date().toISOString());

// Custom format: [timestamp] METHOD URL STATUS - responseTime ms
const logger = morgan('[:date] :method :url :status - :response-time ms');

module.exports = logger;
