const winston = require('winston');

const logFormat = winston.format.printf((info) => {
  return `${info.timestamp} [${info.level}] [${info.namespace || 'default'}]: ${info.message}`;
});

const createLogger = (namespace) => {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.simple(),
      winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'namespace'] }),
      logFormat
    ),
    transports: [
      new winston.transports.Console(),
    ],
  }).child({ namespace });
};

module.exports = {
  createLogger,
};